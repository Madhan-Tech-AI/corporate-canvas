import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/Reveal';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const categories = [
    {
        id: 'abstract',
        name: 'Abstract',
        description: 'Non-objective imagery focusing on color, form, and emotion.',
        use: 'Modern Offices & Creative Lounges',
        image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'contemporary',
        name: 'Contemporary',
        description: 'Art of today, produced in the second half of the 20th century or the 21st century.',
        use: 'Tech Startups & Innovation Hubs',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Stripped down to its essential quality, achieving simplicity.',
        use: 'Executive Suites & Boardrooms',
        image: 'https://images.unsplash.com/photo-1507643179173-617d67456adb?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'landscape',
        name: 'Landscape',
        description: 'Depiction of natural scenery such as mountains, valleys, trees, rivers, and forests.',
        use: 'Wellness Areas & Waiting Rooms',
        image: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'portrait',
        name: 'Portrait',
        description: 'Artistic representation of a person, capturing their likeness and mood.',
        use: 'Reception Areas & Hallways',
        image: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'cultural',
        name: 'Cultural / Traditional',
        description: 'Artworks that reflect the heritage, values, and traditions of a specific culture.',
        use: 'Cultural Centers & Global Offices',
        image: 'https://images.unsplash.com/photo-1582560865233-030a582fae2e?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'modern-indian',
        name: 'Modern Indian',
        description: 'A fusion of Indian artistic traditions with modern techniques and styles.',
        use: 'Corporate Headquarters in India',
        image: 'https://images.unsplash.com/photo-1563804806085-f5c7174db62c?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'calligraphy',
        name: 'Calligraphy',
        description: 'Visual art related to writing, designing and executing lettering.',
        use: 'Quiet Zones & Libraries',
        image: 'https://images.unsplash.com/photo-1512399996020-c24c25f4a64d?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'conceptual',
        name: 'Conceptual',
        description: 'Art in which the idea or concept presented is more important than the finished art object.',
        use: 'Brainstorming Rooms & Design Studios',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80'
    }
];



const collections = [
    { id: 1, title: 'The Meridian Collection', subtitle: 'Abstract Sculptures', description: 'A symphony of form and material, crafted for executive spaces.', pieces: 24, image: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=1200&q=80', href: '/collections' },
    { id: 2, title: 'Horizon Series', subtitle: 'Contemporary Canvas', description: 'Bold strokes and muted palettes for modern corporate environments.', pieces: 36, image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80', href: '/collections' },
    { id: 3, title: 'Essence Collection', subtitle: 'Marble & Stone', description: 'Timeless elegance carved from the finest materials.', pieces: 18, image: 'https://images.unsplash.com/photo-1491245338813-c6832976196e?auto=format&fit=crop&w=1200&q=80', href: '/collections' },
    { id: 4, title: 'Corporate Editions', subtitle: 'Limited Releases', description: 'Exclusive artworks available only for corporate collectors.', pieces: 12, image: 'https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?auto=format&fit=crop&w=1200&q=80', href: '/collections' },
];

export default function ArtDiscovery() {
    const [hoveredCollectionId, setHoveredCollectionId] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-20">
                {/* Header */}
                <section className="container-premium mb-20 text-center">
                    <Reveal width="100%">
                        <p className="text-caption text-copper mb-4">Curated Excellence</p>
                        <h1 className="text-display text-charcoal mb-6">Art Discovery</h1>
                        <p className="text-subheadline max-w-2xl mx-auto">
                            Explore our collection through curated themes, diverse artistic mediums, and exclusive series.
                        </p>
                    </Reveal>
                </section>

                {/* Categories Section */}
                <section className="container-premium mb-32">
                    <Reveal width="100%" className="mb-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-6">
                            <div>
                                <h2 className="text-4xl font-serif text-charcoal mb-4">Art Categories</h2>
                                <p className="text-charcoal/70 max-w-lg">
                                    Browse artworks classified by subject matter, theme, and evocative potential.
                                </p>
                            </div>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category, index) => (
                            <Reveal key={category.id} width="100%" delay={index * 0.1}>
                                <Link to={`/collections?category=${category.id}`} className="group block bg-white rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                                    <div className="relative aspect-[16/9] overflow-hidden">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                            <ArrowUpRight className="w-5 h-5 text-charcoal" />
                                        </div>
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-serif text-charcoal mb-3 group-hover:text-copper transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-charcoal/70 mb-6 leading-relaxed text-sm flex-1">
                                            {category.description}
                                        </p>

                                        <div className="pt-6 border-t border-gray-100 mt-auto">
                                            <p className="text-xs uppercase tracking-wider text-copper font-medium mb-1">
                                                Best For
                                            </p>
                                            <p className="text-sm text-charcoal/80">
                                                {category.use}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </section>



                {/* Curated Collections Section */}
                <section className="container-premium">
                    <Reveal width="100%" className="mb-16">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-6">
                            <div>
                                <h2 className="text-4xl font-serif text-charcoal mb-4">Curated Collections</h2>
                                <p className="text-charcoal/70 max-w-lg">
                                    Carefully curated selections, each telling a unique story of artistry and craftsmanship.
                                </p>
                            </div>
                        </div>
                    </Reveal>

                    <div className="space-y-24">
                        {collections.map((collection, index) => (
                            <Reveal key={collection.id} width="100%" delay={index * 0.1}>
                                <Link
                                    to={collection.href}
                                    className={cn('group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center', index % 2 === 1 && 'lg:flex-row-reverse')}
                                    onMouseEnter={() => setHoveredCollectionId(collection.id)}
                                    onMouseLeave={() => setHoveredCollectionId(null)}
                                >
                                    <div className={cn('relative aspect-[4/3] overflow-hidden rounded-sm', index % 2 === 1 && 'lg:order-2')}>
                                        <img
                                            src={collection.image}
                                            alt={collection.title}
                                            className={cn('w-full h-full object-cover transition-transform duration-700 ease-premium', hoveredCollectionId === collection.id ? 'scale-105' : 'scale-100')}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                                    </div>
                                    <div className={cn(index % 2 === 1 && 'lg:order-1')}>
                                        <p className="text-caption text-copper mb-3">{collection.subtitle}</p>
                                        <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-4 group-hover:text-copper transition-colors duration-300">{collection.title}</h2>
                                        <p className="text-charcoal/70 leading-relaxed mb-6 max-w-md">{collection.description}</p>
                                        <div className="flex items-center justify-between max-w-md">
                                            <span className="text-charcoal/60 text-sm">{collection.pieces} Pieces</span>
                                            <span className="flex items-center gap-2 text-copper text-sm tracking-wider uppercase group-hover:gap-4 transition-all duration-300">Explore <ArrowRight className="w-4 h-4" /></span>
                                        </div>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
