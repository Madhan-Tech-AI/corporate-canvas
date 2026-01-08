import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const featuredProducts = [
  {
    id: 1,
    name: 'Bronze Meridian Sculpture',
    category: 'Artifacts',
    price: '₹2,45,000',
    image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=600&q=80',
    tag: 'Boardroom Fit',
  },
  {
    id: 2,
    name: 'Abstract Horizon No. 7',
    category: 'Canvas Paintings',
    price: '₹1,85,000',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80',
    tag: 'Corporate Collection',
  },
  {
    id: 3,
    name: 'Marble Essence Installation',
    category: 'Custom Art',
    price: 'On Request',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=600&q=80',
    tag: 'Luxury Gifting',
  },
  {
    id: 4,
    name: 'Geometric Flow Series',
    category: 'Canvas Paintings',
    price: '₹1,25,000',
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=600&q=80',
    tag: 'Office Interiors',
  },
];

export default function ProductDiscovery() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted mb-4">
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
