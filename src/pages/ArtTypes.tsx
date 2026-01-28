import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/Reveal';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const artTypes = [
    {
        id: 'oil',
        name: 'Oil Painting',
        description: 'Renowned for its versatility and depth, oil painting utilizes pigments mixed with a drying oil. This medium allows for rich color blending, varied textures, and a luminous quality that has defined masterpieces for centuries. Perfect for making a bold, timeless statement.',
        image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'acrylic',
        name: 'Acrylic Painting',
        description: 'A modern favorite, acrylics are fast-drying paints containing pigment suspended in an acrylic polymer emulsion. Known for their vibrant colors and ability to mimic both oil and watercolor textures, they offer a contemporary and energetic aesthetic.',
        image: 'https://images.unsplash.com/photo-1545989253-02cc26577f88?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'watercolor',
        name: 'Watercolor',
        description: 'Celebrated for its transparency and fluidity, watercolor is a painting method using pigments suspended in a water-based solution. The result is often delicate, ethereal, and expressive, ideal for creating a calm and serene atmosphere.',
        image: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'charcoal',
        name: 'Charcoal',
        description: 'One of the oldest art mediums, charcoal creates dramatic, high-contrast imagery with deep blacks and subtle grays. It captures the raw essence of a subject through expressive lines and shading, adding a sophisticated, monochromatic touch.',
        image: 'https://images.unsplash.com/photo-1512399996020-c24c25f4a64d?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'digital',
        name: 'Digital Art',
        description: 'Created using digital technology, this medium offers infinite possibilities, from painting and drawing to collage and 3D modeling. Digital art pushes the boundaries of creativity, offering crisp, modern, and often surreal visuals for forward-thinking spaces.',
        image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'mixed-media',
        name: 'Mixed Media',
        description: 'By combining distinct visual art media—such as cloth, paper, wood, and found objects—into one artwork, mixed media creates complex, layered pieces. This style invites closer inspection and adds unique texture and narrative depth to any room.',
        image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'ink',
        name: 'Ink Art',
        description: 'Using pens or brushes, ink art emphasizes precision, flow, and contrast. Whether traditional calligraphy or modern illustration, ink works are characterized by their boldness and permanence, offering a striking and elegant graphic quality.',
        image: 'https://images.unsplash.com/photo-1582560865233-030a582fae2e?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'texture',
        name: 'Texture Art',
        description: 'Focusing on the tactile quality of the surface, texture art uses heavy impasto or added materials to create physical depth. These 3D-like works play with light and shadow, providing a rich sensory experience that changes throughout the day.',
        image: 'https://images.unsplash.com/photo-1507643179173-617d67456adb?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'sketches',
        name: 'Sketches',
        description: 'Often the foundation of larger works, sketches capture the immediate idea and raw emotion of the artist. Whether detailed or gestural, they offer an intimate glimpse into the creative process, perfect for minimalist and intellectual settings.',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80'
    }
];

export default function ArtTypes() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-20">
                {/* Header */}
                <section className="container-premium mb-16 text-center">
                    <Reveal width="100%">
                        <p className="text-caption text-copper mb-4">The Medium is the Message</p>
                        <h1 className="text-display text-charcoal mb-6">Explore Art Types</h1>
                        <p className="text-subheadline max-w-2xl mx-auto">
                            Discover the unique characteristics and emotional resonance of each artistic medium.
                        </p>
                    </Reveal>
                </section>

                {/* Content */}
                <section className="container-premium">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                        {artTypes.map((type, index) => (
                            <Reveal key={type.id} width="100%" delay={index * 0.1}>
                                <div className="group flex flex-col h-full">
                                    <Link to={`/collections?type=${type.id}`} className="block relative aspect-[16/10] overflow-hidden rounded-sm mb-6">
                                        <img
                                            src={type.image}
                                            alt={type.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                    </Link>

                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-baseline mb-3">
                                            <h3 className="text-2xl font-serif text-charcoal group-hover:text-copper transition-colors">
                                                <Link to={`/collections?type=${type.id}`}>{type.name}</Link>
                                            </h3>
                                            <Link to={`/collections?type=${type.id}`} className="text-copper opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                                                <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </div>
                                        <p className="text-charcoal/70 leading-relaxed text-sm lg:text-base flex-1">
                                            {type.description}
                                        </p>
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
