import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import { ArrowRight } from 'lucide-react';

export default function StudioPromo() {
    return (
        <section className="section-padding bg-warm-white">
            <div className="container-premium">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <Reveal>
                        <div className="relative">
                            <div className="aspect-[4/5] md:aspect-square overflow-hidden rounded-sm">
                                <img
                                    src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80"
                                    alt="Artist in studio"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white p-4 hidden md:block shadow-xl rounded-sm">
                                <img
                                    src="https://images.unsplash.com/photo-1460661631189-a05e6b7e1909?auto=format&fit=crop&w=400&q=80"
                                    alt="Paint brushes"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <p className="text-caption text-copper mb-4">Our Studio</p>
                        <h2 className="text-headline text-charcoal mb-6">
                            Artistry Rooted in <span className="italic text-copper">Passion</span>
                        </h2>
                        <p className="text-charcoal/70 text-lg leading-relaxed mb-8">
                            Every piece in our collection tells a story. From our London studio, our team of curators and artisans work tirelessly to bridge the gap between creative expression and professional environments.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/about" className="btn-primary bg-charcoal text-white hover:bg-charcoal/90">
                                Discover Our Story
                            </Link>
                            <Link to="/contact" className="group flex items-center gap-2 px-6 py-3 font-medium text-charcoal hover:text-copper transition-colors">
                                Visit Us <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
