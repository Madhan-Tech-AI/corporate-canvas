import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { Filter, Grid, LayoutGrid, X } from 'lucide-react';

const categories = {
  artifacts: {
    title: 'Artifacts',
    subtitle: 'Sculptural Masterpieces',
    description: 'Hand-crafted sculptures and installations for executive spaces.',
  },
  'canvas-paintings': {
    title: 'Canvas Paintings',
    subtitle: 'Contemporary Vision',
    description: 'Original paintings by acclaimed artists for corporate collections.',
  },
  'custom-art': {
    title: 'Custom Corporate Art',
    subtitle: 'Bespoke Creations',
    description: 'Commissioned artworks tailored to your brand identity.',
  },
};

const products = [
  { id: 1, name: 'Bronze Meridian Sculpture', category: 'Artifacts', price: '₹2,45,000', image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=600&q=80', tag: 'Boardroom Fit' },
  { id: 2, name: 'Abstract Horizon No. 7', category: 'Canvas Paintings', price: '₹1,85,000', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80', tag: 'Corporate Collection' },
  { id: 3, name: 'Marble Essence Installation', category: 'Custom Art', price: 'On Request', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=600&q=80', tag: 'Luxury Gifting' },
  { id: 4, name: 'Geometric Flow Series', category: 'Canvas Paintings', price: '₹1,25,000', image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=600&q=80', tag: 'Office Interiors' },
  { id: 5, name: 'Obsidian Wave', category: 'Artifacts', price: '₹3,20,000', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80', tag: 'Executive Suite' },
  { id: 6, name: 'Chromatic Depth III', category: 'Canvas Paintings', price: '₹95,000', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=600&q=80', tag: 'Corporate Collection' },
  { id: 7, name: 'Brass Constellation', category: 'Artifacts', price: '₹1,75,000', image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80', tag: 'Reception Area' },
  { id: 8, name: 'Minimalist Gradient', category: 'Canvas Paintings', price: '₹85,000', image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&w=600&q=80', tag: 'Office Interiors' },
];

const filters = {
  price: ['Under ₹1,00,000', '₹1,00,000 - ₹2,00,000', '₹2,00,000 - ₹5,00,000', 'Above ₹5,00,000'],
  material: ['Bronze', 'Marble', 'Canvas', 'Mixed Media', 'Stone'],
  size: ['Small (< 60cm)', 'Medium (60-120cm)', 'Large (> 120cm)'],
  theme: ['Abstract', 'Geometric', 'Organic', 'Minimalist', 'Contemporary'],
};

export default function ProductListing() {
  const { category } = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridView, setGridView] = useState<'large' | 'small'>('large');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const categoryInfo = category ? categories[category as keyof typeof categories] : null;
  const pageTitle = categoryInfo?.title || 'All Products';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32">
        {/* Page Header */}
        <section className="container-premium pb-12">
          <p className="text-caption text-champagne mb-4 fade-in-up">
            {categoryInfo?.subtitle || 'Browse'}
          </p>
          <h1 className="text-display text-cream mb-6 fade-in-up fade-in-up-delay-1">
            {pageTitle}
          </h1>
          {categoryInfo && (
            <p className="text-subheadline max-w-2xl fade-in-up fade-in-up-delay-2">
              {categoryInfo.description}
            </p>
          )}
        </section>

        {/* Toolbar */}
        <section className="container-premium py-6 border-y border-border">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-cream/80 hover:text-cream transition-colors duration-300"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm tracking-wider uppercase">Filters</span>
            </button>

            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm">{products.length} Products</span>
              <div className="flex items-center gap-2 border-l border-border pl-4">
                <button
                  onClick={() => setGridView('large')}
                  className={cn(
                    'p-2 transition-colors duration-300',
                    gridView === 'large' ? 'text-champagne' : 'text-cream/40 hover:text-cream/80'
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridView('small')}
                  className={cn(
                    'p-2 transition-colors duration-300',
                    gridView === 'small' ? 'text-champagne' : 'text-cream/40 hover:text-cream/80'
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Panel */}
        <div
          className={cn(
            'container-premium overflow-hidden transition-all duration-500 ease-premium',
            isFilterOpen ? 'max-h-96 py-8' : 'max-h-0 py-0'
          )}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(filters).map(([key, values]) => (
              <div key={key}>
                <h4 className="text-caption text-cream mb-4 capitalize">{key}</h4>
                <div className="space-y-2">
                  {values.map((value) => (
                    <label key={value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded-sm border-border bg-transparent checked:bg-champagne checked:border-champagne"
                      />
                      <span className="text-cream-muted text-sm group-hover:text-cream transition-colors duration-300">
                        {value}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <section className="container-premium section-padding">
          <div
            className={cn(
              'grid gap-6',
              gridView === 'large' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
            )}
          >
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-charcoal-light mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={cn(
                      'w-full h-full object-cover transition-transform duration-700 ease-premium',
                      hoveredId === product.id ? 'scale-105' : 'scale-100'
                    )}
                  />
                  <span className="absolute top-4 left-4 text-xs tracking-widest uppercase bg-obsidian/80 text-cream px-3 py-1.5 backdrop-blur-sm">
                    {product.tag}
                  </span>
                  <div
                    className={cn(
                      'absolute inset-0 bg-obsidian/60 flex items-center justify-center transition-opacity duration-300',
                      hoveredId === product.id ? 'opacity-100' : 'opacity-0'
                    )}
                  >
                    <span className="text-cream text-sm tracking-widest uppercase border border-cream/50 px-6 py-3">
                      View Details
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-caption text-champagne-muted mb-1">{product.category}</p>
                  <h3 className="text-cream font-serif text-lg mb-2 group-hover:text-champagne transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-cream-muted text-sm">{product.price}</p>
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
