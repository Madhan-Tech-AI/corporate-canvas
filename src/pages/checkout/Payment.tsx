import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useBag } from '@/context/BagContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useOrders } from '@/context/OrdersContext';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, CreditCard, Wallet, Building2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type PaymentMethod = 'card' | 'upi' | 'cod';

export default function Payment() {
    const navigate = useNavigate();
    const { bag, getTotalAmount, clearBag } = useBag();
    const { formatPrice } = useCurrency();
    const { createOrder } = useOrders();
    const { user } = useAuth();
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cod');
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = getTotalAmount();
    const gst = subtotal * 0.18;
    const shipping = subtotal > 50000 ? 0 : 500;
    const total = subtotal + gst + shipping;

    const handlePlaceOrder = async () => {
        if (!user) {
            toast.error('Please login to place order');
            navigate('/login');
            return;
        }

        // Get shipping address from sessionStorage
        const addressData = sessionStorage.getItem('shipping_address');
        if (!addressData) {
            toast.error('Shipping address not found');
            navigate('/checkout/address');
            return;
        }

        const shippingAddress = JSON.parse(addressData);

        setIsProcessing(true);

        try {
            // Create order
            const order = await createOrder(
                {
                    total_amount: total,
                    status: 'pending',
                    shipping_address: shippingAddress,
                    payment_method: selectedMethod === 'cod' ? 'Cash on Delivery' : selectedMethod === 'upi' ? 'UPI' : 'Credit Card',
                    payment_status: selectedMethod === 'cod' ? 'pending' : 'completed',
                },
                bag.map(item => ({
                    product_id: item.id.toString(),
                    product_name: item.name,
                    product_image: item.image,
                    price: item.price,
                    quantity: item.quantity,
                }))
            );

            if (order) {
                // Clear bag
                clearBag();
                // Clear address from session
                sessionStorage.removeItem('shipping_address');
                // Navigate to confirmation
                navigate(`/checkout/confirmation/${order.id}`);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Failed to place order');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container-premium max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <button
                            onClick={() => navigate('/checkout/address')}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Address
                        </button>
                        <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">Payment Method</h1>
                        <p className="text-muted-foreground">Choose your preferred payment method</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mb-12">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-copper text-white flex items-center justify-center text-sm font-medium">✓</div>
                                <span className="text-sm text-foreground hidden sm:inline">Review</span>
                            </div>
                            <div className="w-12 h-0.5 bg-copper"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-copper text-white flex items-center justify-center text-sm font-medium">✓</div>
                                <span className="text-sm text-foreground hidden sm:inline">Address</span>
                            </div>
                            <div className="w-12 h-0.5 bg-copper"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-copper text-white flex items-center justify-center text-sm font-medium">3</div>
                                <span className="text-sm text-foreground hidden sm:inline">Payment</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Payment Methods */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Cash on Delivery */}
                            <button
                                onClick={() => setSelectedMethod('cod')}
                                className={`w-full p-6 border-2 rounded-sm text-left transition-all ${selectedMethod === 'cod'
                                        ? 'border-copper bg-copper/5'
                                        : 'border-border hover:border-copper/50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedMethod === 'cod' ? 'bg-copper text-white' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        <Wallet className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-foreground mb-1">Cash on Delivery</h3>
                                        <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'cod' ? 'border-copper' : 'border-border'
                                        }`}>
                                        {selectedMethod === 'cod' && (
                                            <div className="w-3 h-3 rounded-full bg-copper"></div>
                                        )}
                                    </div>
                                </div>
                            </button>

                            {/* UPI */}
                            <button
                                onClick={() => setSelectedMethod('upi')}
                                className={`w-full p-6 border-2 rounded-sm text-left transition-all ${selectedMethod === 'upi'
                                        ? 'border-copper bg-copper/5'
                                        : 'border-border hover:border-copper/50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedMethod === 'upi' ? 'bg-copper text-white' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-foreground mb-1">UPI Payment</h3>
                                        <p className="text-sm text-muted-foreground">Pay using UPI apps (Demo)</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'upi' ? 'border-copper' : 'border-border'
                                        }`}>
                                        {selectedMethod === 'upi' && (
                                            <div className="w-3 h-3 rounded-full bg-copper"></div>
                                        )}
                                    </div>
                                </div>
                            </button>

                            {/* Credit/Debit Card */}
                            <button
                                onClick={() => setSelectedMethod('card')}
                                className={`w-full p-6 border-2 rounded-sm text-left transition-all ${selectedMethod === 'card'
                                        ? 'border-copper bg-copper/5'
                                        : 'border-border hover:border-copper/50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedMethod === 'card' ? 'bg-copper text-white' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-foreground mb-1">Credit/Debit Card</h3>
                                        <p className="text-sm text-muted-foreground">Pay using your card (Demo)</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'card' ? 'border-copper' : 'border-border'
                                        }`}>
                                        {selectedMethod === 'card' && (
                                            <div className="w-3 h-3 rounded-full bg-copper"></div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-card border border-border rounded-sm p-6 sticky top-32">
                                <h2 className="text-lg font-serif text-foreground mb-4">Order Summary</h2>

                                <div className="space-y-3 mb-4 pb-4 border-b border-border text-sm">
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
                                </div>

                                <div className="flex justify-between mb-6">
                                    <span className="text-foreground font-medium">Total</span>
                                    <span className="text-copper text-lg font-medium">{formatPrice(total)}</span>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Place Order'
                                    )}
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
