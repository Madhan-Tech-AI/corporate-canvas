import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/Reveal';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const artists = [
    {
        id: 1,
        name: 'Eleanor Vance',
        style: 'Abstract Expressionism',
        count: 14,
        bio: 'Eleanor’s work explores the intersection of chaos and order, using bold strokes to evoke raw emotion. Her pieces are featured in modern corporate HQs across Europe.',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 2,
        name: 'Julian Thorne',
        style: 'Contemporary Sculpture',
        count: 9,
        bio: 'With a background in kinetic architecture, Julian creates sculptures that appear to defy gravity. His work focuses on balance, tension, and the fluidity of form.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 3,
        name: 'Amara Singh',
        style: 'Digital & Mixed Media',
        count: 21,
        bio: 'Amara blends traditional Indian motifs with futuristic digital landscapes. Her art challenges the viewer to find harmony between heritage and technology.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 4,
        name: 'Marcus Reed',
        style: 'Fine Art Photography',
        count: 32,
        bio: 'Specializing in high-contrast urban landscapes, Marcus captures the silence within the city. His monochrome prints bring a sense of calm sophistication to any room.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 5,
        name: 'Sarah Jenkins',
        style: 'Minimalist Acrylic',
        count: 18,
        bio: 'Sarah’s philosophy of "quiet presence" is evident in her minimalist compositions. Using subtle gradients and soft forms, she creates art that breathes.',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 6,
        name: 'David Kim',
        style: 'Oil on Canvas',
        count: 11,
        bio: 'A master of light and shadow, David’s oil paintings are deeply atmospheric. He draws inspiration from turn-of-the-century impressionism, updated for the modern eye.',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
    }
];

export default function Artists() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-20">
                {/* Header */}
                <section className="container-premium mb-20 text-center">
                    <Reveal width="100%">
                        <p className="text-caption text-copper mb-4">The Visionaries</p>
                        <h1 className="text-display text-charcoal mb-6">Masters of Craft</h1>
                        <p className="text-subheadline max-w-2xl mx-auto">
                            Meet the distinguished artists whose vision and skill define the ARTEUM collection.
                        </p>
                    </Reveal>
                </section>

                {/* Artists Grid */}
                <section className="container-premium">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {artists.map((artist, index) => (
                            <Reveal key={artist.id} width="100%" delay={index * 0.1}>
                                <div className="group flex flex-col h-full bg-white border border-gray-100 p-6 rounded-sm hover:shadow-xl transition-all duration-300">
                                    {/* Image */}
                                    <div className="relative w-24 h-24 rounded-full overflow-hidden mb-6 border-2 border-transparent group-hover:border-copper/20 transition-colors">
                                        <img
                                            src={artist.image}
                                            alt={artist.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-serif text-charcoal mb-1 group-hover:text-copper transition-colors">
                                            {artist.name}
                                        </h3>
                                        <p className="text-xs uppercase tracking-wider text-copper mb-4">
                                            {artist.style}
                                        </p>
                                        <p className="text-charcoal/70 text-sm leading-relaxed mb-6 line-clamp-3">
                                            {artist.bio}
                                        </p>
                                    </div>

                                    {/* Footer/CTA */}
                                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xs text-charcoal/40 font-medium">
                                            {artist.count} Artworks
                                        </span>
                                        <Link
                                            to="/artifacts"
                                            className="text-sm font-medium text-charcoal flex items-center gap-2 group-hover:text-copper transition-colors"
                                        >
                                            View Artworks
                                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
