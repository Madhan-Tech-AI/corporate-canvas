import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const collections = [
  {
    id: 1,
    title: 'Artifacts',
    subtitle: 'Sculptural Masterpieces',
    description: 'Hand-crafted sculptures and installations for executive spaces',
    href: '/artifacts',
    image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Canvas Paintings',
    subtitle: 'Contemporary Vision',
    description: 'Original paintings by acclaimed artists for corporate collections',
    href: '/canvas-paintings',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Custom Corporate Art',
    subtitle: 'Bespoke Creations',
    description: 'Commissioned artworks tailored to your brand identity',
    href: '/custom-art',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=800&q=80',
  },
];

export default function FeaturedCollections() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="section-padding bg-obsidian">
      <div className="container-premium">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-caption text-champagne mb-4">Explore</p>
          <h2 className="text-headline text-cream">Featured Collections</h2>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={collection.href}
              className="group relative aspect-[4/5] overflow-hidden rounded-sm"
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
                  'bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent',
                  hoveredId === collection.id ? 'opacity-90' : 'opacity-70'
                )}
              />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <p
                  className={cn(
                    'text-caption text-champagne mb-2 transition-all duration-500 ease-premium',
                    hoveredId === collection.id ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                  )}
                >
                  {collection.subtitle}
                </p>
                <h3 className="text-2xl md:text-3xl font-serif text-cream mb-3">
                  {collection.title}
                </h3>
                <p
                  className={cn(
                    'text-cream-muted text-sm leading-relaxed mb-4 max-w-xs transition-all duration-500 ease-premium',
                    hoveredId === collection.id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  )}
                >
                  {collection.description}
                </p>
                <div
                  className={cn(
                    'flex items-center gap-2 text-champagne text-sm tracking-wider uppercase transition-all duration-500 ease-premium',
                    hoveredId === collection.id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  )}
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
