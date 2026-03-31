import { Star } from 'lucide-react';
import Reveal from '@/components/Reveal';

const testimonials = [
    {
        id: 1,
        quote: "The curation process was seamless. The artworks have completely transformed our office atmosphere, bringing energy and creativity to the team.",
        author: "Jessica M.",
        role: "Operations Director, TechFlow",
        rating: 5
    },
    {
        id: 2,
        quote: "Exceptional quality and service. The custom framing options were exactly what we needed to match our brand's interior design guidelines.",
        author: "David L.",
        role: "Interior Architect",
        rating: 5
    },
    {
        id: 3,
        quote: "We commissioned a centerpiece for our lobby, and the result was breathtaking. ARTEUM connected us with the perfect artist for our vision.",
        author: "Elena R.",
        role: "Hotel Manager",
        rating: 5
    }
];

export default function Testimonials() {
    return (
        <section className="section-padding bg-background">
            <div className="container-premium text-center">
                <Reveal width="100%">
                    <p className="text-caption text-copper mb-3">Client Stories</p>
                    <h2 className="text-headline text-charcoal mb-16">What Collectors Say</h2>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <Reveal key={item.id} width="100%" delay={index * 0.1}>
                            <div className="bg-warm-white/50 p-8 rounded-2xl border border-border h-full flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
                                <div className="flex gap-1 text-copper mb-6">
                                    {[...Array(item.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                <p className="text-lg text-charcoal/80 font-serif italic mb-8 leading-relaxed">"{item.quote}"</p>
                                <div className="mt-auto">
                                    <p className="font-medium text-charcoal uppercase tracking-wide text-sm">{item.author}</p>
                                    <p className="text-xs text-charcoal/50 mt-1">{item.role}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
