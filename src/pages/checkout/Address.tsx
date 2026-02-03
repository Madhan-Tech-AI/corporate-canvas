import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface AddressForm {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
}

export default function Address() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<AddressForm>({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });

    const [errors, setErrors] = useState<Partial<AddressForm>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<AddressForm> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter valid 10-digit phone number';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter valid 6-digit pincode';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof AddressForm]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            // Store address in sessionStorage for next step
            sessionStorage.setItem('shipping_address', JSON.stringify(formData));
            toast.success('Address saved');
            navigate('/checkout/payment');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container-premium max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <button
                            onClick={() => navigate('/checkout/review')}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Review
                        </button>
                        <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">Shipping Address</h1>
                        <p className="text-muted-foreground">Enter your delivery address</p>
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
                                <div className="w-8 h-8 rounded-full bg-copper text-white flex items-center justify-center text-sm font-medium">2</div>
                                <span className="text-sm text-foreground hidden sm:inline">Address</span>
                            </div>
                            <div className="w-12 h-0.5 bg-border"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">3</div>
                                <span className="text-sm text-muted-foreground hidden sm:inline">Payment</span>
                            </div>
                        </div>
                    </div>

                    {/* Address Form */}
                    <div className="bg-card border border-border rounded-sm p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-border'} rounded-sm focus:outline-none focus:ring-2 focus:ring-copper/20 focus:border-copper transition-colors`}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-border'} rounded-sm focus:outline-none focus:ring-2 focus:ring-copper/20 focus:border-copper transition-colors`}
                                    placeholder="10-digit mobile number"
                                    maxLength={10}
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                            </div>

                            {/* Address */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                                    Address *
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows={3}
                                    className={`w-full px-4 py-3 border ${errors.address ? 'border-red-500' : 'border-border'} rounded-sm focus:outline-none focus:ring-2 focus:ring-copper/20 focus:border-copper transition-colors resize-none`}
                                    placeholder="House No., Building Name, Street, Area"
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                            </div>

                            {/* City and State */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${errors.city ? 'border-red-500' : 'border-border'} rounded-sm focus:outline-none focus:ring-2 focus:ring-copper/20 focus:border-copper transition-colors`}
                                        placeholder="City"
                                    />
                                    {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                                </div>

                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-foreground mb-2">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${errors.state ? 'border-red-500' : 'border-border'} rounded-sm focus:outline-none focus:ring-2 focus:ring-copper/20 focus:border-copper transition-colors`}
                                        placeholder="State"
                                    />
                                    {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                                </div>
                            </div>

                            {/* Pincode */}
                            <div>
                                <label htmlFor="pincode" className="block text-sm font-medium text-foreground mb-2">
                                    Pincode *
                                </label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border ${errors.pincode ? 'border-red-500' : 'border-border'} rounded-sm focus:outline-none focus:ring-2 focus:ring-copper/20 focus:border-copper transition-colors`}
                                    placeholder="6-digit pincode"
                                    maxLength={6}
                                />
                                {errors.pincode && <p className="mt-1 text-sm text-red-500">{errors.pincode}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full btn-primary flex items-center justify-center gap-2"
                                >
                                    Continue to Payment
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
