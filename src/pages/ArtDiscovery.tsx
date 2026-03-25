import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/Reveal';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ArtDiscovery() {
    const [hoveredCollectionId, setHoveredCollectionId] = useState<number | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [collections, setCollections] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Categories (Using distinct categories from products or just mock if we don't have a table)
            // For now, let's just fetch all products and manually derive categories to show "dynamic" nature
            const { data: products } = await supabase.from('products').select('*');

            if (products && products.length > 0) {
                // Derive categories
                const uniqueCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
                const cats = uniqueCategories.map((cat, index) => ({
                    id: cat,
                    name: cat,
                    description: `Explore our exclusive collection of ${cat} artworks.`,
                    use: 'Corporate & Home',
                    image: products.find(p => p.category === cat)?.image_url || ''
                }));
                setCategories(cats);

                // Derive collections (e.g. grouped by Type or just random subsets)
                // Let's just make 2-3 collections based on Type if available, or just chunks
                const uniqueTypes = Array.from(new Set(products.map(p => p.type))).filter(Boolean);
                const cols = uniqueTypes.map((type, index) => ({
                    id: index,
                    title: `${type} Collection`,
                    subtitle: 'Curated Series',
                    description: `A selection of fine ${type} works.`,
                    pieces: products.filter(p => p.type === type).length,
                    image: products.find(p => p.type === type)?.image_url || '',
                    href: `/products?search=${type}`
                }));
                setCollections(cols);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-20">
                {/* Header */}
                <section className="container-premium mb-16 md:mb-20 text-center">
                    <Reveal width="100%">
                        <p className="text-caption text-copper mb-4">Curated Excellence</p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-display text-charcoal mb-6">Art Discovery</h1>
                        <p className="text-subheadline max-w-2xl mx-auto px-4">
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
                                <Link to={`/products?search=${category.name}`} className="group block bg-white rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                                    <div className="relative aspect-[16/9] overflow-hidden">
                                        {category.image ? (
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-charcoal/30">No Image</div>
                                        )}
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
                                        {collection.image ? (
                                            <img
                                                src={collection.image}
                                                alt={collection.title}
                                                className={cn('w-full h-full object-cover transition-transform duration-700 ease-premium', hoveredCollectionId === collection.id ? 'scale-105' : 'scale-100')}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-charcoal/30">No Image</div>
                                        )}
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
