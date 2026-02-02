import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Reveal from '@/components/Reveal';

export default function FeaturedCollections() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const { data: products } = await supabase.from('products').select('*');
      if (products && products.length > 0) {
        // Group by Category to create "Collections"
        const uniqueCategories = Array.from(new Set(products.map(p => p.category))).slice(0, 3);

        const cols = uniqueCategories.map((cat, index) => ({
          id: index,
          title: `${cat}`,
          subtitle: 'Curated Collection',
          description: `Explore our exclusive selection of ${cat} artworks suited for premium spaces.`,
          image: products.find(p => p.category === cat)?.image_url || '',
          href: `/products?search=${cat}`
        }));

        setCollections(cols);
      }
    };
    fetchCollections();
  }, []);

  return (
    <section className="section-padding bg-background">
      <div className="container-premium">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Reveal width="100%">
            <p className="text-caption text-copper mb-4">Explore</p>
          </Reveal>
          <Reveal width="100%" delay={0.4}>
            <h2 className="text-headline text-foreground">Featured Collections</h2>
          </Reveal>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <Reveal key={collection.id} delay={0.2 * (index + 1)}>
              <Link
                to={collection.href}
                className="group relative aspect-[4/5] overflow-hidden rounded-sm block"
                onMouseEnter={() => setHoveredId(collection.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Image */}
                <img
                  src={collection.image}
                  alt={collection.title}
                  className={cn(
                    'absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-premium',
                    hoveredId === collection.id ? 'scale-105' : 'scale-100'
                  )}
                />

                {/* Overlay */}
                <div
                  className={cn(
                    'absolute inset-0 transition-all duration-500 ease-premium',
                    'bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent',
                    hoveredId === collection.id ? 'opacity-90' : 'opacity-70'
                  )}
                />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <p
                    className={cn(
                      'text-caption text-copper-light mb-2 transition-all duration-500 ease-premium',
                      hoveredId === collection.id ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                    )}
                  >
                    {collection.subtitle}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-serif text-warm-white mb-3">
                    {collection.title}
                  </h3>
                  <p
                    className={cn(
                      'text-warm-white/70 text-sm leading-relaxed mb-4 max-w-xs transition-all duration-500 ease-premium',
                      hoveredId === collection.id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    )}
                  >
                    {collection.description}
                  </p>
                  <div
                    className={cn(
                      'flex items-center gap-2 text-copper-light text-sm tracking-wider uppercase transition-all duration-500 ease-premium',
                      hoveredId === collection.id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    )}
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
