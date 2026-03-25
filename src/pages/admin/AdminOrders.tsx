import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Package, Search, Filter, Download, RefreshCw, ChevronRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getOrders as getLocalOrders } from '@/lib/adminStorage';

interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    status: string;
    payment_method: string;
    payment_status: string;
    shipping_address: {
        name: string;
        phone: string;
        city: string;
        state: string;
    };
    risk_score: number;
    sla_breach: boolean;
    priority: string;
    created_at: string;
    customer_email?: string;
    customer_name?: string;
}

interface OrderStats {
    total_orders: number;
    total_revenue: number;
    pending_orders: number;
    confirmed_orders: number;
    shipped_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
}

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    processing: 'bg-purple-100 text-purple-800 border-purple-200',
    packed: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    shipped: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    out_for_delivery: 'bg-orange-100 text-orange-800 border-orange-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    returned: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    packed: 'Packed',
    shipped: 'Shipped',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    returned: 'Returned',
};

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [paymentFilter, setPaymentFilter] = useState<string>('all');

    // Fetch orders
    const fetchOrders = async () => {
        let supabaseOrders: any[] = [];
        
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    profiles:user_id (
                        email,
                        first_name,
                        last_name
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('Supabase orders fetch error (expected if not admin):', error);
            } else if (data) {
                supabaseOrders = data.map((order: any) => ({
                    ...order,
                    customer_email: order.profiles?.email,
                    customer_name: order.profiles?.first_name
                        ? `${order.profiles.first_name} ${order.profiles.last_name || ''}`.trim()
                        : order.shipping_address?.name,
                }));
            }
        } catch (err) {
            console.error('Unexpected error fetching Supabase orders:', err);
        }

        // Always fetch orders from local storage for demo sync, regardless of Supabase status
        const localOrders = getLocalOrders().map(order => ({
            ...order,
            customer_name: order.shipping_address?.name,
        }));

        // Merge and remove duplicates by ID
        const allOrdersMap = new Map();
        
        // Add Supabase orders first
        supabaseOrders.forEach(o => allOrdersMap.set(o.id, o));
        // Add/Overwrite with local orders (ensure they take precedence in demo)
        localOrders.forEach(o => allOrdersMap.set(o.id, o));

        const mergedOrders = Array.from(allOrdersMap.values())
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setOrders(mergedOrders);
        setIsLoading(false);
    };

    // Fetch statistics
    const fetchStats = async () => {
        let supabaseStats: OrderStats = {
            total_orders: 0,
            total_revenue: 0,
            pending_orders: 0,
            confirmed_orders: 0,
            shipped_orders: 0,
            delivered_orders: 0,
            cancelled_orders: 0,
        };

        try {
            const { data, error } = await supabase.rpc('get_order_statistics');

            if (error) {
                console.warn('Supabase stats RPC error:', error);
            } else if (data?.success) {
                supabaseStats = data.data;
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }

        // Merge with local storage stats
        const localOrders = getLocalOrders();
        const mergedStats: OrderStats = {
            total_orders: supabaseStats.total_orders + localOrders.length,
            total_revenue: supabaseStats.total_revenue + localOrders.reduce((sum, o) => sum + o.total_amount, 0),
            pending_orders: supabaseStats.pending_orders + localOrders.filter(o => o.status === 'pending').length,
            confirmed_orders: supabaseStats.confirmed_orders + localOrders.filter(o => o.status === 'confirmed').length,
            shipped_orders: supabaseStats.shipped_orders + localOrders.filter(o => o.status === 'shipped').length,
            delivered_orders: supabaseStats.delivered_orders + localOrders.filter(o => o.status === 'delivered').length,
            cancelled_orders: supabaseStats.cancelled_orders + localOrders.filter(o => o.status === 'cancelled').length,
        };

        setStats(mergedStats);
    };

    useEffect(() => {
        fetchOrders();
        fetchStats();

        // Real-time subscription
        const channel = supabase
            .channel('admin-orders-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                () => {
                    fetchOrders();
                    fetchStats();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [statusFilter, paymentFilter]);

    // Filter orders by search
    const filteredOrders = orders.filter(order => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            order.id.toLowerCase().includes(query) ||
            order.customer_name?.toLowerCase().includes(query) ||
            order.customer_email?.toLowerCase().includes(query) ||
            order.shipping_address?.phone?.includes(query)
        );
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Package className="w-8 h-8 text-copper" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                                <p className="text-sm text-gray-500">Manage and track all customer orders</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    fetchOrders();
                                    fetchStats();
                                }}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Statistics Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_orders}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.total_revenue)}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">₹</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending_orders}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Delivered</p>
                                    <p className="text-2xl font-bold text-green-600 mt-1">{stats.delivered_orders}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Order ID, Customer, Email, Phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper/20 focus:border-copper"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper/20 focus:border-copper"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="packed">Packed</option>
                            <option value="shipped">Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        {/* Payment Filter */}
                        <select
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper/20 focus:border-copper"
                        >
                            <option value="all">All Payments</option>
                            <option value="cod">Cash on Delivery</option>
                            <option value="prepaid">Prepaid</option>
                        </select>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <RefreshCw className="w-8 h-8 text-copper animate-spin" />
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-20 px-4">
                            <div className="max-w-md mx-auto">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Package className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
                                <p className="text-gray-500 mb-8">
                                    {searchQuery || statusFilter !== 'all' || paymentFilter !== 'all' 
                                        ? "No orders match your current filters. Try adjusting them to see more orders."
                                        : "You haven't received any orders yet. When a customer places an order, it will appear here instantly."}
                                </p>
                                {!(searchQuery || statusFilter !== 'all' || paymentFilter !== 'all') && (
                                    <div className="bg-copper/5 border border-copper/10 rounded-lg p-4 text-sm text-copper text-left">
                                        <p className="font-semibold mb-1 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Testing Instruction:
                                        </p>
                                        <p>Go to the storefront, add an item to your bag, and complete the checkout to see a live order appear here!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-sm text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                    {order.risk_score > 70 && (
                                                        <span className="hidden sm:inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">High Risk</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="text-sm">
                                                    <p className="font-medium text-gray-900">{order.customer_name}</p>
                                                    <p className="hidden sm:block text-gray-500">{order.customer_email}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">{formatCurrency(order.total_amount)}</span>
                                            </td>
                                            <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">
                                                    <p className="text-gray-900">{order.payment_method}</p>
                                                    <span className={cn(
                                                        'inline-block px-2 py-0.5 text-xs rounded-full',
                                                        order.payment_status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    )}>
                                                        {order.payment_status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                <span className={cn(
                                                    'inline-block px-2 md:px-3 py-1 text-[10px] md:text-xs font-medium rounded-full border',
                                                    statusColors[order.status as keyof typeof statusColors]
                                                )}>
                                                    {statusLabels[order.status as keyof typeof statusLabels]}
                                                </span>
                                            </td>
                                            <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                })}
                                            </td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <Link
                                                    to={`/admin/orders/${order.id}`}
                                                    className="inline-flex items-center gap-1 text-copper hover:text-copper-dark font-medium"
                                                >
                                                    <span className="hidden sm:inline">Details</span>
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
