import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useOrders } from '@/context/OrdersContext';
import { useCurrency } from '@/context/CurrencyContext';
import { CheckCircle2, Package, ArrowRight, Loader2 } from 'lucide-react';
import type { Order, OrderItem } from '@/context/OrdersContext';

export default function OrderConfirmation() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { getOrderById, getOrderItems } = useOrders();
    const { formatPrice } = useCurrency();
    const [order, setOrder] = useState<Order | null>(null);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                navigate('/');
                return;
            }

            try {
                const [orderData, orderItems] = await Promise.all([
                    getOrderById(orderId),
                    getOrderItems(orderId),
                ]);

                if (orderData) {
                    setOrder(orderData);
                    setItems(orderItems);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching order:', error);
                navigate('/');
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

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container-premium max-w-3xl mx-auto">
                    {/* Success Icon */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-3">Order Placed Successfully!</h1>
                        <p className="text-muted-foreground mb-2">Thank you for your order</p>
                        <p className="text-sm text-muted-foreground">
                            Order ID: <span className="font-mono text-copper">{order.id.slice(0, 8).toUpperCase()}</span>
                        </p>
                    </div>

                    {/* Order Details Card */}
                    <div className="bg-card border border-border rounded-sm p-8 mb-6">
                        <div className="flex items-start justify-between mb-6 pb-6 border-b border-border">
                            <div>
                                <h2 className="text-lg font-serif text-foreground mb-2">Delivery Address</h2>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p className="font-medium text-foreground">{order.shipping_address.name}</p>
                                    <p>{order.shipping_address.address}</p>
                                    <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}</p>
                                    <p>Phone: {order.shipping_address.phone}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                                <p className="font-medium text-foreground">{order.payment_method}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="mb-6">
                            <h3 className="text-lg font-serif text-foreground mb-4">Order Items ({items.length})</h3>
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 rounded-sm overflow-hidden flex-shrink-0">
                                            <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-foreground font-medium truncate">{item.product_name}</h4>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                <p className="text-copper font-medium">{formatPrice(item.price)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Total */}
                        <div className="pt-6 border-t border-border">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-medium text-foreground">Total Amount</span>
                                <span className="text-2xl font-medium text-copper">{formatPrice(order.total_amount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to={`/orders/${order.id}`}
                            className="flex-1 btn-primary flex items-center justify-center gap-2"
                        >
                            <Package className="w-4 h-4" />
                            Track Order
                        </Link>
                        <Link
                            to="/collections"
                            className="flex-1 px-6 py-3 border border-border text-foreground hover:bg-muted transition-colors text-center flex items-center justify-center gap-2"
                        >
                            Continue Shopping
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Info Box */}
                    <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-sm">
                        <h3 className="font-medium text-foreground mb-2">What's Next?</h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-copper mt-0.5">•</span>
                                <span>You will receive an order confirmation email shortly</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-copper mt-0.5">•</span>
                                <span>Track your order status in the Orders section</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-copper mt-0.5">•</span>
                                <span>Estimated delivery: 5-7 business days</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
