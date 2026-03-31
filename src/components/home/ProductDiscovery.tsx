import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
// Imports moved
import { useState, useEffect } from 'react';


import { supabase } from '@/lib/supabase';

// ...

export default function ProductDiscovery() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchDiscovery = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .limit(4)
        .order('price', { ascending: false }); // Example: Top rated = highest price? or just random

      if (data) {
        setFeaturedProducts(data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price ? `₹${item.price.toLocaleString()}` : 'On Request',
          image: item.image_url,
          tag: item.tags?.[0] || 'Featured'
        })));
      }
    };
    fetchDiscovery();
  }, []);

  return (
    <section className="section-padding bg-warm-cream">
      <div className="container-premium">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-caption text-copper mb-4">Discover</p>
            <h2 className="text-headline text-foreground">Featured Artworks</h2>
          </div>
          <Link
            to="/collections"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-copper text-sm tracking-wider uppercase hover:gap-4 transition-all duration-300"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image Container */}
              <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-2xl bg-muted mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className={cn(
                    'w-full h-full object-cover transition-transform duration-700 ease-premium',
                    hoveredId === product.id ? 'scale-105' : 'scale-100'
                  )}
                />

                {/* Tag */}
                <span className="absolute top-4 left-4 text-xs tracking-widest uppercase bg-charcoal/80 text-warm-white px-3 py-1.5 backdrop-blur-sm">
                  {product.tag}
                </span>

                {/* Hover Overlay */}
                <div
                  className={cn(
                    'absolute inset-0 bg-charcoal/60 flex items-center justify-center transition-opacity duration-300',
                    hoveredId === product.id ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  <span className="text-warm-white text-sm tracking-widest uppercase border border-warm-white/50 px-6 py-3">
                    View Details
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div>
                <p className="text-caption text-copper-muted mb-1">{product.category}</p>
                <h3 className="text-foreground font-serif text-lg mb-2 group-hover:text-copper transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
