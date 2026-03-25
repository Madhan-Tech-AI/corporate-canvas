import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/Reveal';
import { Check, ArrowRight, BarChart3, Globe, ShieldCheck, Truck, Upload, Palette, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { saveSellArtApplication } from '@/lib/adminStorage';

export default function SellArt() {
    const [artistName, setArtistName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [portfolio, setPortfolio] = useState('');
    const [biography, setBiography] = useState('');
    const [artworkCount, setArtworkCount] = useState('');

    const handleApplicationSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Save to localStorage
        saveSellArtApplication({
            artistName,
            email,
            phone,
            portfolio,
            biography,
            artworkCount: parseInt(artworkCount) || 0,
        });

        toast.success('Application submitted successfully! We\'ll review it shortly.');

        // Reset form
        setArtistName('');
        setEmail('');
        setPhone('');
        setPortfolio('');
        setBiography('');
        setArtworkCount('');
    };

    const benefits = [
        {
            icon: <Globe className="w-8 h-8 text-copper" />,
            title: "Global Reach",
            description: "Showcase your work to a worldwide network of corporate clients, interior designers, and art collectors seeking unique pieces."
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-copper" />,
            title: "Fair Commissions",
            description: "Keep 80% of your sales price. We believe in empowering artists with transparent, fair revenue sharing models."
        },
        {
            icon: <Truck className="w-8 h-8 text-copper" />,
            title: "Logistics Handled",
            description: "We manage shipping, insurance, and handling. You simply package your artwork safely, and we take care of the rest."
        }
    ];

    const steps = [
        {
            step: "01",
            title: "Apply",
            description: "Submit your portfolio for review. We look for technical skill, original voice, and professional commitment."
        },
        {
            step: "02",
            title: "List",
            description: "Once approved, create your profile and upload high-resolution images of your available artworks."
        },
        {
            step: "03",
            title: "Connect",
            description: "Your work is presented to our corporate clients. We handle inquiries and sales processing."
        },
        {
            step: "04",
            title: "Earn",
            description: "Receive fast, secure payments directly to your bank account upon successful delivery."
        }
    ];

    const requirements = [
        "Original artwork created by you",
        "High-resolution images (min 3000px)",
        "Professional artist biography",
        "Certificate of Authenticity available"
    ];

    return (
        <div className="min-h-screen bg-background text-charcoal">
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:py-40 bg-charcoal text-white overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1460661631639-a6fbdbed11ee?auto=format&fit=crop&w=1920&q=80"
                            alt="Artist studio with natural light"
                            className="w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/90 via-charcoal/70 to-charcoal" />
                    </div>

                    <div className="container-premium relative z-10 text-center">
                        <Reveal width="100%">
                            <span className="text-copper text-xs sm:text-sm font-medium tracking-widest uppercase mb-6 block">
                                For Independent Artists
                            </span>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-display text-white mb-8 max-w-4xl mx-auto leading-tight">
                                Share Your Vision with the <span className="text-copper italic">Corporate World</span>
                            </h1>
                            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed px-4">
                                Join a curated community of exceptional artists. We connect your masterpieces with prestigious offices and collectors globally, providing a platform where your art commands respect.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5 justify-center px-6">
                                <Link to="/signup" className="btn-primary border-copper bg-copper hover:bg-copper-dark text-white hover:text-white shadow-lg shadow-copper/20 px-8 py-4 w-full sm:w-auto">
                                    Start Your Application
                                </Link>
                                <a href="#how-it-works" className="btn-secondary border-white/20 text-white hover:bg-white hover:text-charcoal bg-white/5 backdrop-blur-sm px-8 py-4 w-full sm:w-auto">
                                    How It Works
                                </a>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="section-padding bg-warm-white">
                    <div className="container-premium">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl font-serif text-charcoal mb-4">Why Partner with ARTEUM?</h2>
                            <p className="text-charcoal/60 max-w-2xl mx-auto text-lg">
                                We bridge the gap between creative expression and professional spaces, offering you a partner, not just a marketplace.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {benefits.map((benefit, index) => (
                                <Reveal key={index} delay={index * 0.1}>
                                    <div className="bg-white p-10 rounded-sm shadow-md border border-gray-100/50 hover:shadow-2xl hover:-translate-y-3 transition-transform duration-300 ease-out h-full flex flex-col items-start group cursor-pointer">
                                        <div className="bg-copper/5 p-4 rounded-full group-hover:bg-copper/10 group-hover:scale-110 transition-all duration-300 mb-6">
                                            {benefit.icon}
                                        </div>
                                        <h3 className="text-2xl font-serif text-charcoal mb-4 group-hover:text-copper transition-colors">{benefit.title}</h3>
                                        <p className="text-charcoal/70 leading-relaxed">{benefit.description}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Dashboard & Requirements Section */}
                <section className="section-padding bg-white overflow-hidden">
                    <div className="container-premium">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                            {/* Dashboard Preview */}
                            <Reveal>
                                <div className="relative perspective-1000">
                                    {/* Decorative background elements */}
                                    <div className="absolute top-10 -left-10 w-72 h-72 bg-copper/5 rounded-full blur-3xl" />
                                    <div className="absolute bottom-10 -right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />

                                    <div className="relative bg-charcoal rounded-xl overflow-hidden shadow-2xl border border-white/5 transform transition-transform hover:scale-[1.01] duration-500">
                                        {/* Browser/App Header */}
                                        <div className="bg-charcoal-light px-4 py-3 border-b border-white/10 flex items-center justify-between">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                            </div>
                                            <span className="text-white/30 text-xs font-mono tracking-wide">artist.arteum.com</span>
                                            <div className="w-4" />
                                        </div>

                                        <div className="flex h-[400px]">
                                            {/* Sidebar */}
                                            <div className="w-16 md:w-20 bg-charcoal-light border-r border-white/5 flex flex-col items-center py-6 gap-6">
                                                <div className="w-8 h-8 rounded-full bg-copper mb-4" />
                                                <div className="p-2 bg-white/10 rounded-md"><BarChart3 className="w-5 h-5 text-white" /></div>
                                                <div className="p-2 text-white/40 hover:text-white transition-colors"><Palette className="w-5 h-5" /></div>
                                                <div className="p-2 text-white/40 hover:text-white transition-colors"><Upload className="w-5 h-5" /></div>
                                                <div className="p-2 text-white/40 hover:text-white transition-colors"><DollarSign className="w-5 h-5" /></div>
                                            </div>

                                            {/* Main Content */}
                                            <div className="flex-1 p-8 bg-charcoal">
                                                <div className="flex justify-between items-end mb-8">
                                                    <div>
                                                        <h4 className="text-white text-lg font-medium mb-1">Overview</h4>
                                                        <p className="text-white/40 text-sm">Welcome back, Alex</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-copper text-sm font-medium">Verified Artist</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-8">
                                                    <div className="bg-gradient-to-br from-white/10 to-white/5 p-5 rounded-lg border border-white/5">
                                                        <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">Total Sales</p>
                                                        <p className="text-2xl text-white font-medium">$12,450</p>
                                                        <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                                                            <ArrowRight className="w-3 h-3 rotate-[-45deg]" /> +12% this month
                                                        </p>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-white/10 to-white/5 p-5 rounded-lg border border-white/5">
                                                        <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">Artworks Active</p>
                                                        <p className="text-2xl text-copper font-medium">18</p>
                                                        <p className="text-white/40 text-xs mt-1">4 Pending Review</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-white/60 text-sm mb-4">Performance</p>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                                <div className="h-full bg-copper w-[70%] rounded-full" />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                                <div className="h-full bg-white/20 w-[45%] rounded-full" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>

                            {/* Requirements Text */}
                            <Reveal delay={0.2}>
                                <div className="pl-0 lg:pl-10">
                                    <span className="text-copper text-sm font-medium tracking-widest uppercase mb-4 block">
                                        Curation Standards
                                    </span>
                                    <h2 className="text-4xl font-serif text-charcoal mb-6 leading-tight">
                                        We seek the <span className="italic">exceptional</span>.
                                    </h2>
                                    <p className="text-charcoal/70 mb-8 text-lg leading-relaxed">
                                        Our reputation is built on quality. We curate exceptional art that elevates professional environments. Our standards ensure trust for our buyers and prestige for our artists.
                                    </p>

                                    <ul className="space-y-5 mb-10">
                                        {requirements.map((req, i) => (
                                            <li key={i} className="flex items-center gap-4 group">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                                    <Check className="w-3.5 h-3.5 text-green-700" />
                                                </div>
                                                <span className="text-charcoal/80 font-medium">{req}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link to="/signup" className="inline-flex items-center gap-2 text-charcoal font-medium hover:text-copper transition-colors border-b border-charcoal/20 pb-1 hover:border-copper">
                                        Read Full Submission Guidelines <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* Process Steps */}
                <section id="how-it-works" className="section-padding bg-charcoal text-white">
                    <div className="container-premium">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl font-serif mb-4">How It Works</h2>
                            <p className="text-white/60 max-w-xl mx-auto">A transparent, streamlined process designed to let you focus on what you do best: creating.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-[1px] bg-white/10 z-0" />

                            {steps.map((item, index) => (
                                <Reveal key={index} delay={index * 0.1}>
                                    <div className="relative z-10 bg-charcoal p-6 md:pt-8 rounded-2xl border border-white/5 hover:border-copper/20 hover:bg-charcoal-light/50 transition-all duration-300 flex flex-col items-center group cursor-pointer hover:-translate-y-4 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] active:scale-95">
                                        
                                        <div className="w-24 h-24 mb-8 relative flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out">
                                            {/* Outer glowing aura that appears on hover */}
                                            <div className="absolute inset-0 bg-copper/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            
                                            {/* The luxury numbered circle */}
                                            <div className="relative w-full h-full bg-gradient-to-br from-charcoal-light to-charcoal border border-copper/30 group-hover:border-copper rounded-full flex items-center justify-center shadow-inner shadow-black/80 overflow-hidden transition-colors duration-500">
                                                {/* Subtle glossy shine effect at top */}
                                                <div className="absolute top-0 left-0 w-full h-[45%] bg-gradient-to-b from-white/10 to-transparent rounded-t-full"></div>
                                                
                                                <span className="text-3xl font-serif text-copper drop-shadow-lg group-hover:text-white transition-colors duration-300">
                                                    {item.step}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="text-center">
                                            <h3 className="text-xl font-medium text-white mb-3 group-hover:text-copper transition-colors duration-300">{item.title}</h3>
                                            <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Application Form Section */}
                <section className="section-padding bg-white">
                    <div className="container-premium max-w-3xl">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-serif text-charcoal mb-4">Ready to Apply?</h2>
                            <p className="text-charcoal/70 text-lg">Fill out the application form below and we'll review your submission within 3-5 business days.</p>
                        </div>

                        <form onSubmit={handleApplicationSubmit} className="bg-warm-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-100">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-charcoal">Artist Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={artistName}
                                            onChange={(e) => setArtistName(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-copper transition-colors"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-charcoal">Email Address *</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-copper transition-colors"
                                            placeholder="artist@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-charcoal">Phone Number *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-copper transition-colors"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-charcoal">Number of Artworks *</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={artworkCount}
                                            onChange={(e) => setArtworkCount(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-copper transition-colors"
                                            placeholder="10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-charcoal">Portfolio Link *</label>
                                    <input
                                        type="url"
                                        required
                                        value={portfolio}
                                        onChange={(e) => setPortfolio(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-copper transition-colors"
                                        placeholder="https://yourportfolio.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-charcoal">Artist Biography *</label>
                                    <textarea
                                        required
                                        value={biography}
                                        onChange={(e) => setBiography(e.target.value)}
                                        rows={6}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-copper transition-colors resize-none"
                                        placeholder="Tell us about your artistic journey, style, and what makes your work unique..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full btn-primary bg-copper text-white hover:bg-copper-dark py-3 text-lg"
                                >
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 bg-copper/5">
                    <div className="container-premium text-center">
                        <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-6">
                            Ready to showcase your art?
                        </h2>
                        <p className="text-charcoal/70 max-w-xl mx-auto mb-10 text-lg">
                            Start your journey with ARTEUM today. Apply to become a verified artist and reach new audiences.
                        </p>
                        <Link to="/signup" className="btn-primary bg-charcoal text-white hover:bg-charcoal/90 px-10 py-4 text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                            Submit Your Application
                        </Link>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
