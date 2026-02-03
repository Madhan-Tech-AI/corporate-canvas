import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useBag } from '@/context/BagContext';
import { useCurrency } from '@/context/CurrencyContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Review() {
    const navigate = useNavigate();
    const { bag, getTotalAmount } = useBag();
    const { formatPrice } = useCurrency();

    const subtotal = getTotalAmount();
    const gst = subtotal * 0.18;
    const shipping = subtotal > 50000 ? 0 : 500;
    const total = subtotal + gst + shipping;

    const handleProceed = () => {
        if (bag.length === 0) {
            toast.error('Your bag is empty');
            return;
        }
        navigate('/checkout/address');
    };

    if (bag.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="pt-32 pb-24">
                    <div className="container-premium max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl font-serif text-foreground mb-4">Your Bag is Empty</h1>
                        <p className="text-muted-foreground mb-8">Add items to your bag to proceed with checkout</p>
                        <button
                            onClick={() => navigate('/collections')}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </button>
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
                <div className="container-premium max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">Review Your Order</h1>
                        <p className="text-muted-foreground">Please review your items before proceeding to shipping</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-card border border-border rounded-sm p-6">
                                <h2 className="text-xl font-serif text-foreground mb-6">Order Items ({bag.length})</h2>
                                <div className="space-y-6">
                                    {bag.map((item) => (
                                        <div key={item.id} className="flex gap-4 pb-6 border-b border-border last:border-0 last:pb-0">
                                            <div className="w-24 h-24 rounded-sm overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-copper-muted mb-1">{item.category}</p>
                                                <h3 className="text-foreground font-medium mb-1 truncate">{item.name}</h3>
                                                {item.artist && <p className="text-sm text-muted-foreground mb-2">{item.artist}</p>}
                                                <div className="flex items-center justify-between">
                                                    <p className="text-copper font-medium">{formatPrice(item.price)}</p>
                                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-card border border-border rounded-sm p-6 sticky top-32">
                                <h2 className="text-xl font-serif text-foreground mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="text-foreground">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">GST (18%)</span>
                                        <span className="text-foreground">{formatPrice(gst)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span className="text-foreground">
                                            {shipping === 0 ? 'Free' : formatPrice(shipping)}
                                        </span>
                                    </div>
                                    {shipping === 0 && (
                                        <p className="text-xs text-green-600">Free shipping on orders above ₹50,000</p>
                                    )}
                                </div>

                                <div className="flex justify-between mb-8">
                                    <span className="text-foreground font-medium text-lg">Total</span>
                                    <span className="text-copper text-xl font-medium">{formatPrice(total)}</span>
                                </div>

                                <button
                                    onClick={handleProceed}
                                    className="w-full btn-primary flex items-center justify-center gap-2"
                                >
                                    Proceed to Shipping
                                    <ArrowRight className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => navigate('/collections')}
                                    className="w-full mt-3 px-6 py-3 border border-border text-foreground hover:bg-muted transition-colors text-center"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
