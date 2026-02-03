import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useOrders } from '@/context/OrdersContext';
import { useCurrency } from '@/context/CurrencyContext';
import { ArrowLeft, Package, CheckCircle2, Loader2, MapPin, Phone, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Order, OrderItem, OrderTimeline } from '@/context/OrdersContext';

const statusIcons = {
    pending: Package,
    confirmed: CheckCircle2,
    processing: Package,
    shipped: Package,
    out_for_delivery: Package,
    delivered: CheckCircle2,
    cancelled: Package,
};

export default function OrderDetail() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { getOrderById, getOrderItems, getOrderTimeline } = useOrders();
    const { formatPrice } = useCurrency();

    const [order, setOrder] = useState<Order | null>(null);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [timeline, setTimeline] = useState<OrderTimeline[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                navigate('/orders');
                return;
            }

            try {
                const [orderData, orderItems, orderTimeline] = await Promise.all([
                    getOrderById(orderId),
                    getOrderItems(orderId),
                    getOrderTimeline(orderId),
                ]);

                if (orderData) {
                    setOrder(orderData);
                    setItems(orderItems);
                    setTimeline(orderTimeline);
                } else {
                    navigate('/orders');
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                navigate('/orders');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-copper animate-spin" />
            </div>
        );
    }

    if (!order) {
        return null;
    }

    const StatusIcon = statusIcons[order.status] || Package;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container-premium max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <button
                            onClick={() => navigate('/orders')}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Orders
                        </button>
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">Order Details</h1>
                                <p className="text-muted-foreground font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground mb-1">Order Total</p>
                                <p className="text-2xl font-medium text-copper">{formatPrice(order.total_amount)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Timeline Section */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Timeline - Flipkart Style */}
                            <div className="bg-card border border-border rounded-sm p-6">
                                <h2 className="text-xl font-serif text-foreground mb-6">Order Status</h2>

                                <div className="relative">
                                    {/* Timeline Line */}
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>

                                    {/* Timeline Items */}
                                    <div className="space-y-8">
                                        {timeline.map((event, index) => {
                                            const isCompleted = index < timeline.length - 1 || order.status === 'delivered';
                                            const isCurrent = index === timeline.length - 1 && order.status !== 'delivered';

                                            return (
                                                <div key={event.id} className="relative flex gap-6">
                                                    {/* Timeline Dot */}
                                                    <div className={cn(
                                                        "relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                                        isCompleted ? "bg-green-500" : isCurrent ? "bg-copper" : "bg-muted"
                                                    )}>
                                                        {isCompleted ? (
                                                            <CheckCircle2 className="w-5 h-5 text-white" />
                                                        ) : (
                                                            <div className={cn(
                                                                "w-3 h-3 rounded-full",
                                                                isCurrent ? "bg-white" : "bg-muted-foreground"
                                                            )}></div>
                                                        )}
                                                    </div>

                                                    {/* Timeline Content */}
                                                    <div className="flex-1 pb-8">
                                                        <div className="flex items-start justify-between mb-1">
                                                            <h3 className={cn(
                                                                "font-medium",
                                                                isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                                                            )}>
                                                                {event.message}
                                                            </h3>
                                                            <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                                                                {new Date(event.timestamp).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                })}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {new Date(event.timestamp).toLocaleTimeString('en-IN', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: true,
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-card border border-border rounded-sm p-6">
                                <h2 className="text-xl font-serif text-foreground mb-6">Order Items ({items.length})</h2>
                                <div className="space-y-6">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4 pb-6 border-b border-border last:border-0 last:pb-0">
                                            <div className="w-20 h-20 rounded-sm overflow-hidden flex-shrink-0">
                                                <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-foreground font-medium mb-1 truncate">{item.product_name}</h3>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                                    <p className="text-copper font-medium">{formatPrice(item.price)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Delivery Address */}
                            <div className="bg-card border border-border rounded-sm p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-5 h-5 text-copper" />
                                    <h2 className="text-lg font-serif text-foreground">Delivery Address</h2>
                                </div>
                                <div className="text-sm space-y-1">
                                    <p className="font-medium text-foreground">{order.shipping_address.name}</p>
                                    <p className="text-muted-foreground">{order.shipping_address.address}</p>
                                    <p className="text-muted-foreground">
                                        {order.shipping_address.city}, {order.shipping_address.state}
                                    </p>
                                    <p className="text-muted-foreground">{order.shipping_address.pincode}</p>
                                    <div className="flex items-center gap-2 pt-2">
                                        <Phone className="w-4 h-4 text-copper" />
                                        <p className="text-foreground">{order.shipping_address.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-card border border-border rounded-sm p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <CreditCard className="w-5 h-5 text-copper" />
                                    <h2 className="text-lg font-serif text-foreground">Payment</h2>
                                </div>
                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Method</span>
                                        <span className="text-foreground font-medium">{order.payment_method}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status</span>
                                        <span className={cn(
                                            "font-medium",
                                            order.payment_status === 'completed' ? "text-green-600" : "text-yellow-600"
                                        )}>
                                            {order.payment_status === 'completed' ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-card border border-border rounded-sm p-6">
                                <h2 className="text-lg font-serif text-foreground mb-4">Order Summary</h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="text-foreground">{formatPrice(order.total_amount / 1.18)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">GST (18%)</span>
                                        <span className="text-foreground">{formatPrice(order.total_amount - (order.total_amount / 1.18))}</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-border">
                                        <span className="font-medium text-foreground">Total</span>
                                        <span className="font-medium text-copper">{formatPrice(order.total_amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
