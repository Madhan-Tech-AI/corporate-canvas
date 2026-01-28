import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/Reveal';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

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

export default function Categories() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-20">
                {/* Header */}
                <section className="container-premium mb-16 text-center">
                    <Reveal width="100%">
                        <p className="text-caption text-copper mb-4">Curated Styles</p>
                        <h1 className="text-display text-charcoal mb-6">Browse by Category</h1>
                        <p className="text-subheadline max-w-2xl mx-auto">
                            Find the perfect aesthetic for your space, from bold abstracts to serene landscapes.
                        </p>
                    </Reveal>
                </section>

                {/* Grid */}
                <section className="container-premium">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category, index) => (
                            <Reveal key={category.id} width="100%" delay={index * 0.1}>
                                <Link to={`/collections?category=${category.id}`} className="group block bg-white rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
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

                                    <div className="p-8">
                                        <h3 className="text-2xl font-serif text-charcoal mb-3 group-hover:text-copper transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-charcoal/70 mb-6 leading-relaxed text-sm min-h-[40px]">
                                            {category.description}
                                        </p>

                                        <div className="pt-6 border-t border-gray-100">
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
            </main>
            <Footer />
        </div>
    );
}
