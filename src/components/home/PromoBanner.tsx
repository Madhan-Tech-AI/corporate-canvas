import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';

export default function PromoBanner() {
    return (
        <section className="py-8 bg-background">
            <div className="container-premium">
                <Reveal width="100%">
                    <div className="relative rounded-lg overflow-hidden bg-copper text-white shadow-2xl">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                        />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl md:text-3xl font-serif mb-2">Summer Office Refresh Sale</h3>
                                <p className="text-white/80">Get <span className="font-bold text-white">20% OFF</span> all large format canvas prints for your workspace.</p>
                            </div>

                            <div className="shrink-0">
                                <Link to="/collections" className="inline-block px-8 py-3 bg-white text-copper font-medium text-sm tracking-uppercase hover:bg-gray-100 transition-colors rounded-sm uppercase tracking-wider">
                                    Shop The Sale
                                </Link>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
