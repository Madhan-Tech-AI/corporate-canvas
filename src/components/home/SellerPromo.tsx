import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';

export default function SellerPromo() {
    return (
        <section className="section-padding bg-charcoal text-white relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1460661631189-a05e6b7e1909?auto=format&fit=crop&w=2000&q=80"
                    alt="Artist studio"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/40" />
            </div>

            <div className="container-premium relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <Reveal width="100%">
                        <div>
                            <span className="inline-block py-1 px-3 border border-copper text-copper text-xs tracking-widest uppercase mb-6 rounded-full">
                                Join Our Community
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
                                Sell Your Art to the <span className="text-copper italic">Corporate World</span>
                            </h2>
                            <p className="text-lg text-white/70 mb-8 max-w-lg">
                                Connect with prestigious corporate clients and grow your career. We handle the logistics, marketing, and sales while you focus on creating.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/contact" className="btn-primary border-copper bg-copper hover:bg-copper-dark text-white">
                                    Apply to Join
                                </Link>
                                <Link to="/about" className="btn-secondary border-white/20 text-white hover:bg-white hover:text-charcoal">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </Reveal>

                    {/* Stats or Visual Element */}
                    <Reveal width="100%" delay={0.2}>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-sm border border-white/10">
                                <p className="text-3xl font-serif text-copper mb-2">80%</p>
                                <p className="text-sm text-white/60">Revenue Share</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-sm border border-white/10">
                                <p className="text-3xl font-serif text-copper mb-2">Global</p>
                                <p className="text-sm text-white/60">Client Network</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-sm border border-white/10">
                                <p className="text-3xl font-serif text-copper mb-2">0</p>
                                <p className="text-sm text-white/60">Listing Fees</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-sm border border-white/10">
                                <p className="text-3xl font-serif text-copper mb-2">24/7</p>
                                <p className="text-sm text-white/60">Artist Support</p>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
