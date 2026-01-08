import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const collections = [
  { id: 1, title: 'The Meridian Collection', subtitle: 'Abstract Sculptures', description: 'A symphony of form and material, crafted for executive spaces.', pieces: 24, image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80', href: '/artifacts' },
  { id: 2, title: 'Horizon Series', subtitle: 'Contemporary Canvas', description: 'Bold strokes and muted palettes for modern corporate environments.', pieces: 36, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80', href: '/canvas-paintings' },
  { id: 3, title: 'Essence Collection', subtitle: 'Marble & Stone', description: 'Timeless elegance carved from the finest materials.', pieces: 18, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=1200&q=80', href: '/artifacts' },
  { id: 4, title: 'Corporate Editions', subtitle: 'Limited Releases', description: 'Exclusive artworks available only for corporate collectors.', pieces: 12, image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1200&q=80', href: '/canvas-paintings' },
];

export default function Collections() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32">
        <section className="container-premium pb-16">
          <p className="text-caption text-copper mb-4 fade-in-up">Curated Selection</p>
          <h1 className="text-display text-foreground mb-6 fade-in-up fade-in-up-delay-1">Collections</h1>
          <p className="text-subheadline max-w-2xl fade-in-up fade-in-up-delay-2">Explore our carefully curated collections, each telling a unique story of artistry and craftsmanship.</p>
        </section>

        <section className="container-premium section-padding">
          <div className="space-y-24">
            {collections.map((collection, index) => (
              <Link key={collection.id} to={collection.href} className={cn('group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center', index % 2 === 1 && 'lg:flex-row-reverse')} onMouseEnter={() => setHoveredId(collection.id)} onMouseLeave={() => setHoveredId(null)}>
                <div className={cn('relative aspect-[4/3] overflow-hidden rounded-sm', index % 2 === 1 && 'lg:order-2')}>
                  <img src={collection.image} alt={collection.title} className={cn('w-full h-full object-cover transition-transform duration-700 ease-premium', hoveredId === collection.id ? 'scale-105' : 'scale-100')} />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                </div>
                <div className={cn(index % 2 === 1 && 'lg:order-1')}>
                  <p className="text-caption text-copper mb-3">{collection.subtitle}</p>
                  <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4 group-hover:text-copper transition-colors duration-300">{collection.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">{collection.description}</p>
                  <div className="flex items-center justify-between max-w-md">
                    <span className="text-muted-foreground text-sm">{collection.pieces} Pieces</span>
                    <span className="flex items-center gap-2 text-copper text-sm tracking-wider uppercase group-hover:gap-4 transition-all duration-300">Explore <ArrowRight className="w-4 h-4" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
