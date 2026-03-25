import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { adminLogin, adminLogout, isAdminAuthenticated, saveOrder } from '@/lib/adminStorage';
import { toast } from 'sonner';

export interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
    shipping_address: {
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
    };
    payment_method: string;
    payment_status: 'pending' | 'completed' | 'failed';
    tracking_number?: string;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    product_image: string;
    price: number;
    quantity: number;
}

export interface OrderTimeline {
    id: string;
    order_id: string;
    status: string;
    message: string;
    timestamp: string;
}

interface OrdersContextType {
    orders: Order[];
    ordersCount: number;
    isLoading: boolean;
    createOrder: (orderData: Omit<Order, 'id' | 'user_id' | 'created_at' | 'updated_at'>, items: Omit<OrderItem, 'id' | 'order_id'>[]) => Promise<Order | null>;
    getOrderById: (orderId: string) => Promise<Order | null>;
    getOrderItems: (orderId: string) => Promise<OrderItem[]>;
    getOrderTimeline: (orderId: string) => Promise<OrderTimeline[]>;
    refreshOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType>({
    orders: [],
    ordersCount: 0,
    isLoading: true,
    createOrder: async () => null,
    getOrderById: async () => null,
    getOrderItems: async () => [],
    getOrderTimeline: async () => [],
    refreshOrders: async () => { },
});

export const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    const fetchOrders = async () => {
        if (!user) {
            setOrders([]);
            setIsLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error: any) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        if (!user) return;

        // Subscribe to real-time order updates
        const channel = supabase
            .channel('orders-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setOrders((prev) => [payload.new as Order, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setOrders((prev) =>
                            prev.map((order) =>
                                order.id === payload.new.id ? (payload.new as Order) : order
                            )
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setOrders((prev) => prev.filter((order) => order.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const createOrder = async (
        orderData: Omit<Order, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
        items: Omit<OrderItem, 'id' | 'order_id'>[]
    ): Promise<Order | null> => {
        if (!user) {
            toast.error('Please login to place an order');
            return null;
        }

        try {
            // Create order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    ...orderData,
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // Create order items
            const orderItems = items.map((item) => ({
                order_id: order.id,
                ...item,
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;
            
            // Sync to local admin storage for the dashboard preview
            saveOrder({
                ...order,
                items: orderItems as any
            });

            toast.success('Order placed successfully!');
            return order;
        } catch (error: any) {
            console.error('Error creating order:', error);
            toast.error('Failed to place order');
            return null;
        }
    };

    const getOrderById = async (orderId: string): Promise<Order | null> => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (error) throw error;
            return data;
        } catch (error: any) {
            console.error('Error fetching order:', error);
            return null;
        }
    };

    const getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
        try {
            const { data, error } = await supabase
                .from('order_items')
                .select('*')
                .eq('order_id', orderId);

            if (error) throw error;
            return data || [];
        } catch (error: any) {
            console.error('Error fetching order items:', error);
            return [];
        }
    };

    const getOrderTimeline = async (orderId: string): Promise<OrderTimeline[]> => {
        try {
            const { data, error } = await supabase
                .from('order_timeline')
                .select('*')
                .eq('order_id', orderId)
                .order('timestamp', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error: any) {
            console.error('Error fetching order timeline:', error);
            return [];
        }
    };

    const refreshOrders = async () => {
        await fetchOrders();
    };

    return (
        <OrdersContext.Provider
            value={{
                orders,
                ordersCount: orders.length,
                isLoading,
                createOrder,
                getOrderById,
                getOrderItems,
                getOrderTimeline,
                refreshOrders,
            }}
        >
            {children}
        </OrdersContext.Provider>
    );
};

export const useOrders = () => useContext(OrdersContext);
