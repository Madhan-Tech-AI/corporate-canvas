import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useOrders } from '@/context/OrdersContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Package, Loader2, ShoppingBag, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    out_for_delivery: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

export default function Orders() {
    const { orders, isLoading } = useOrders();
    const { formatPrice } = useCurrency();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="pt-32 pb-24">
                    <div className="container-premium flex items-center justify-center min-h-[400px]">
                        <Loader2 className="w-10 h-10 text-copper animate-spin" />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container-premium max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">My Orders</h1>
                        <p className="text-muted-foreground">View and track all your orders</p>
                    </div>

                    {/* Orders List */}
                    {orders.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h2 className="text-2xl font-serif text-foreground mb-3">No Orders Yet</h2>
                            <p className="text-muted-foreground mb-8">You haven't placed any orders yet</p>
                            <Link to="/collections" className="btn-primary inline-block">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <Link
                                    key={order.id}
                                    to={`/orders/${order.id}`}
                                    className="block bg-card border border-border rounded-sm p-6 hover:border-copper transition-colors group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <Package className="w-5 h-5 text-copper" />
                                                <span className="font-mono text-sm text-muted-foreground">
                                                    #{order.id.slice(0, 8).toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={cn(
                                                    'inline-block px-3 py-1 rounded-full text-xs font-medium mb-2',
                                                    statusColors[order.status]
                                                )}
                                            >
                                                {statusLabels[order.status]}
                                            </span>
                                            <p className="text-lg font-medium text-copper">{formatPrice(order.total_amount)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>Deliver to:</span>
                                            <span className="text-foreground font-medium">{order.shipping_address.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-copper group-hover:gap-3 transition-all">
                                            <span className="text-sm font-medium">View Details</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
