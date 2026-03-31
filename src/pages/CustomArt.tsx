import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/Reveal';
import { Upload, Palette, Frame, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { saveCustomArtApplication } from '@/lib/adminStorage';

type ServiceType = 'painting' | 'framing';

export default function CustomArt() {
    const [activeService, setActiveService] = useState<ServiceType>('painting');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedStyle, setSelectedStyle] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [email, setEmail] = useState('');
    const [details, setDetails] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Save to localStorage for admin
        saveCustomArtApplication({
            serviceType: activeService,
            style: selectedStyle,
            size: selectedSize,
            customerName,
            email,
            details,
            fileUrl: file ? URL.createObjectURL(file) : undefined,
        });

        toast.success("Request submitted! We'll contact you shortly.");

        // Reset form
        setSelectedSize('');
        setSelectedStyle('');
        setFile(null);
        setCustomerName('');
        setEmail('');
        setDetails('');
    };

    const paintingStyles = ['Realism', 'Abstract', 'Impressionist', 'Pop Art', 'Minimalist', 'Portrait'];
    const frameStyles = ['Natural Wood', 'Matte Black', 'Gold Leaf', 'White Gallery', 'Industrial Metal'];
    const sizes = ['Small (12x16")', 'Medium (24x30")', 'Large (36x48")', 'Oversized (60"+)'];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-32 pb-24">
                {/* Page Header */}
                <section className="container-premium text-center mb-12 md:mb-16">
                    <Reveal>
                        <p className="text-caption text-copper mb-4">Bespoke Services</p>
                        <h1 className="text-3xl sm:text-4xl md:text-display text-charcoal mb-6">
                            Your Vision, <span className="text-copper italic">Masterfully Crafted</span>
                        </h1>
                        <p className="text-lg md:text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed px-4">
                            Whether you need a custom commissioned painting or museum-quality framing, our artisans bring your ideas to life.
                        </p>
                    </Reveal>
                </section>

                {/* Service Toggles */}
                <section className="container-premium mb-16">
                    <div className="flex justify-center">
                        <div className="bg-gray-100 p-1.5 rounded-full inline-flex relative">
                            <div
                                className={cn(
                                    "absolute top-1.5 bottom-1.5 w-1/2 bg-white rounded-full shadow-sm transition-all duration-300 ease-out",
                                    activeService === 'framing' ? 'translate-x-full' : 'translate-x-0'
                                )}
                            />
                            <button
                                onClick={() => setActiveService('painting')}
                                className={cn(
                                    "relative z-10 px-8 py-3 rounded-full text-sm font-medium tracking-wide transition-colors duration-300 flex items-center gap-2",
                                    activeService === 'painting' ? "text-charcoal" : "text-charcoal/50 hover:text-charcoal/70"
                                )}
                            >
                                <Palette className="w-4 h-4" />
                                Custom Painting
                            </button>
                            <button
                                onClick={() => setActiveService('framing')}
                                className={cn(
                                    "relative z-10 px-8 py-3 rounded-full text-sm font-medium tracking-wide transition-colors duration-300 flex items-center gap-2",
                                    activeService === 'framing' ? "text-charcoal" : "text-charcoal/50 hover:text-charcoal/70"
                                )}
                            >
                                <Frame className="w-4 h-4" />
                                Framing Services
                            </button>
                        </div>
                    </div>
                </section>

                <section className="container-premium">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                        {/* Form Side */}
                        <Reveal>
                            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-serif text-charcoal mb-6">
                                    {activeService === 'painting' ? 'Commission a Masterpiece' : 'Museum-Quality Framing'}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-8">

                                    {/* Step 1: Specifics */}
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal mb-3">
                                            {activeService === 'painting' ? 'Preferred Style' : 'Frame Style'}
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {(activeService === 'painting' ? paintingStyles : frameStyles).map(style => (
                                                <button
                                                    key={style}
                                                    type="button"
                                                    onClick={() => setSelectedStyle(style)}
                                                    className={cn(
                                                        "px-4 py-2 text-sm border rounded-sm transition-all duration-200",
                                                        selectedStyle === style
                                                            ? "border-copper bg-copper/5 text-copper font-medium"
                                                            : "border-gray-200 text-charcoal/70 hover:border-copper/30"
                                                    )}
                                                >
                                                    {style}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Step 2: Size */}
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal mb-3">
                                            Approximate Dimensions
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {sizes.map(size => (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    onClick={() => setSelectedSize(size)}
                                                    className={cn(
                                                        "px-4 py-3 text-sm border rounded-sm transition-all duration-200 text-left flex items-center justify-between",
                                                        selectedSize === size
                                                            ? "border-copper bg-copper/5 text-copper font-medium"
                                                            : "border-gray-200 text-charcoal/70 hover:border-copper/30"
                                                    )}
                                                >
                                                    {size}
                                                    {selectedSize === size && <CheckCircle2 className="w-4 h-4" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Step 3: Reference Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal mb-3">
                                            {activeService === 'painting' ? 'Upload Reference Image (Optional)' : 'Upload Art Preview'}
                                        </label>
                                        <div className="border-2 border-dashed border-gray-200 rounded-sm p-8 text-center hover:bg-gray-50 transition-colors">
                                            <input
                                                type="file"
                                                id="file-upload"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                                <div className="bg-copper/10 p-3 rounded-full text-copper mb-2">
                                                    <Upload className="w-6 h-6" />
                                                </div>
                                                <span className="text-sm font-medium text-charcoal">
                                                    {file ? file.name : "Click to upload or drag and drop"}
                                                </span>
                                                <span className="text-xs text-charcoal/40">SVG, PNG, JPG or GIF (MAX. 5MB)</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-charcoal">Your Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-copper transition-colors"
                                                placeholder="John Doe"
                                                required
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-charcoal">Email Address</label>
                                            <input
                                                type="email"
                                                className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-copper transition-colors"
                                                placeholder="john@company.com"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-charcoal">Additional Details</label>
                                        <textarea
                                            className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-copper transition-colors h-32 resize-none"
                                            placeholder="Tell us more about your vision..."
                                            required
                                            value={details}
                                            onChange={(e) => setDetails(e.target.value)}
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="w-full btn-primary bg-charcoal text-white hover:bg-charcoal/90">
                                        Submit Request
                                    </button>

                                </form>
                            </div>
                        </Reveal>

                        {/* Info Side */}
                        <div className="space-y-12">
                            <Reveal delay={0.2}>
                                <div className="bg-warm-white p-8 rounded-2xl">
                                    <h3 className="text-xl font-serif text-charcoal mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-copper" />
                                        Estimated Timeline
                                    </h3>
                                    <p className="text-charcoal/70 mb-6">
                                        {activeService === 'painting'
                                            ? "Custom paintings typically take 3-6 weeks depending on size and complexity. This includes consultation, sketching, and drying time."
                                            : "Custom framing is usually completed within 5-7 business days. Rush services are available upon request."
                                        }
                                    </p>

                                    <div className="border-t border-gray-200 pt-6">
                                        <h4 className="text-sm font-medium text-charcoal mb-4 uppercase tracking-wider">The Process</h4>
                                        <ul className="space-y-4">
                                            {(activeService === 'painting'
                                                ? ['Consultation & Concept', 'Sketch Approval', 'Creation Phase', 'Delivery & Installation']
                                                : ['Style Selection', 'Matting & Glazing', 'Craftsmanship', 'Quality Check']
                                            ).map((step, i) => (
                                                <li key={i} className="flex gap-4">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-gray-200 text-xs flex items-center justify-center text-charcoal/60 font-medium">
                                                        {i + 1}
                                                    </span>
                                                    <span className="text-charcoal/80 text-sm">{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Reveal>

                            <Reveal delay={0.3}>
                                <div className="relative rounded-2xl overflow-hidden aspect-video">
                                    <img
                                        src={activeService === 'painting'
                                            ? "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80"
                                            : "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=1200&q=80"
                                        }
                                        alt="Service preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent flex items-end p-6">
                                        <p className="text-white italic font-serif">
                                            {activeService === 'painting'
                                                ? '"To have a painting commissioned is to imprint your soul onto canvas."'
                                                : '"A great frame is the final brushstroke of a masterpiece."'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
