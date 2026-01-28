import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { Filter, Grid, LayoutGrid, X, Heart } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';

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
  { id: 1, name: 'Bronze Meridian Sculpture', category: 'Artifacts', price: 245000, image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=600&q=80', tag: 'Boardroom Fit' },
  { id: 2, name: 'Abstract Horizon No. 7', category: 'Canvas Paintings', price: 185000, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80', tag: 'Corporate Collection' },
  { id: 3, name: 'Marble Essence Installation', category: 'Custom Art', price: null, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=600&q=80', tag: 'Luxury Gifting' },
  { id: 4, name: 'Geometric Flow Series', category: 'Canvas Paintings', price: 125000, image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=600&q=80', tag: 'Office Interiors' },
  { id: 5, name: 'Obsidian Wave', category: 'Artifacts', price: 320000, image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80', tag: 'Executive Suite' },
  { id: 6, name: 'Chromatic Depth III', category: 'Canvas Paintings', price: 95000, image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=600&q=80', tag: 'Corporate Collection' },
  { id: 7, name: 'Brass Constellation', category: 'Artifacts', price: 175000, image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80', tag: 'Reception Area' },
  { id: 8, name: 'Minimalist Gradient', category: 'Canvas Paintings', price: 85000, image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&w=600&q=80', tag: 'Office Interiors' },
];

const filters = {
  category: ['Abstract', 'Landscape', 'Portrait', 'Minimal', 'Contemporary', 'Cultural'],
  artType: ['Oil on Canvas', 'Acrylic', 'Watercolor', 'Mixed Media', 'Sculpture', 'Photography'],
  price: ['Under ₹50,000', '₹50,000 - ₹2,00,000', '₹2,00,000 - ₹5,00,000', 'Above ₹5,00,000'],
  size: ['Small (< 24")', 'Medium (24" - 48")', 'Large (48" - 72")', 'Oversized (> 72")'],
  orientation: ['Landscape', 'Portrait', 'Square'],
  artist: ['Eleanor Vance', 'Julian Thorne', 'Amara Singh', 'Marcus Reed', 'Sarah Jenkins', 'David Kim'],
  availability: ['Ready to Ship', 'Made to Order'],
  colors: [
    { name: 'Warm', color: 'bg-orange-500' },
    { name: 'Cool', color: 'bg-blue-500' },
    { name: 'Neutral', color: 'bg-stone-500' },
    { name: 'Monochrome', color: 'bg-black' },
    { name: 'Vibrant', color: 'bg-pink-500' },
  ]
};

export default function ProductListing() {
  const { category } = useParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridView, setGridView] = useState<'large' | 'small'>('large');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const { formatPrice } = useCurrency();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Filter states
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const toggleFilter = (section: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[section] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [section]: updated };
    });
  };

  const categoryInfo = category ? categories[category as keyof typeof categories] : null;
  const pageTitle = categoryInfo?.title || 'Collect Artifacts';

  const FilterContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between lg:hidden pb-4 border-b border-gray-100 mb-4">
        <span className="text-lg font-serif text-charcoal">Filters</span>
        <button onClick={() => setIsMobileFilterOpen(false)} className="p-2">
          <X className="w-5 h-5 text-charcoal" />
        </button>
      </div>

      {['category', 'artType', 'price', 'size', 'artist', 'availability', 'orientation'].map((section) => (
        <div key={section} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
          <h4 className="text-sm font-serif text-charcoal mb-4 capitalize">
            {section.replace(/([A-Z])/g, ' $1').trim()}
          </h4>
          <div className="space-y-2.5">
            {filters[section as keyof typeof filters].map((value: string | any) => (
              <label key={value} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFilters[section]?.includes(value)}
                    onChange={() => toggleFilter(section, value)}
                    className="peer w-4 h-4 rounded-sm border-gray-300 text-copper focus:ring-copper/50"
                  />
                </div>
                <span className={cn(
                  "text-sm transition-colors duration-300",
                  selectedFilters[section]?.includes(value) ? "text-charcoal font-medium" : "text-charcoal/70 group-hover:text-charcoal"
                )}>
                  {value}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Color Filter */}
      <div>
        <h4 className="text-sm font-serif text-charcoal mb-4">Color Tone</h4>
        <div className="flex flex-wrap gap-3">
          {filters.colors.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleFilter('colors', color.name)}
              className={cn(
                "w-8 h-8 rounded-full border border-gray-200 shadow-sm flex items-center justify-center transition-all duration-300 hover:scale-110",
                selectedFilters['colors']?.includes(color.name) ? "ring-2 ring-offset-2 ring-copper" : ""
              )}
              title={color.name}
            >
              <span className={cn("w-full h-full rounded-full", color.color)}></span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6">
        <button
          onClick={() => setSelectedFilters({})}
          className="text-sm text-charcoal/60 hover:text-charcoal underline underline-offset-4 transition-colors w-full text-left"
          disabled={Object.keys(selectedFilters).length === 0}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24">
        <section className="container-premium">
          <div className="flex flex-col lg:flex-row gap-12">

            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-hide">
              <FilterContent />
            </aside>

            {/* Mobile Filter Drawer */}
            <div className={cn(
              "fixed inset-0 z-50 bg-black/50 lg:hidden transition-opacity duration-300",
              isMobileFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
              <div className={cn(
                "absolute inset-y-0 right-0 w-[300px] bg-white p-6 overflow-y-auto transform transition-transform duration-300",
                isMobileFilterOpen ? "translate-x-0" : "translate-x-full"
              )}>
                <FilterContent />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Header & Toolbar */}
              <div className="mb-8">
                <p className="text-caption text-copper mb-2">
                  {categoryInfo?.subtitle || 'Curated Selection'}
                </p>
                <h1 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
                  {pageTitle}
                </h1>
                <p className="text-charcoal/70 max-w-2xl mb-8 leading-relaxed">
                  {categoryInfo ? categoryInfo.description : 'Discover our exclusive collection of hand-picked artworks designed to elevate your space.'}
                </p>

                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 text-sm font-medium tracking-wide uppercase text-charcoal"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>
                  <p className="hidden lg:block text-charcoal/60 text-sm">{products.length} Results</p>

                  <div className="flex items-center gap-4">

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setGridView('large')}
                        className={cn(
                          'p-2 transition-colors duration-300',
                          gridView === 'large' ? 'text-charcoal' : 'text-charcoal/40 hover:text-charcoal'
                        )}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setGridView('small')}
                        className={cn(
                          'p-2 transition-colors duration-300',
                          gridView === 'small' ? 'text-charcoal' : 'text-charcoal/40 hover:text-charcoal'
                        )}
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className={cn(
                'grid gap-x-6 gap-y-10',
                gridView === 'large' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'
              )}>
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
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (isInWishlist(product.id)) {
                            removeFromWishlist(product.id);
                          } else {
                            addToWishlist({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                              category: product.category,
                              artist: 'Unknown' // Mock data missing artist, defaulted
                            });
                          }
                        }}
                        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white transition-colors duration-300 group/heart"
                      >
                        <Heart
                          className={cn(
                            "w-5 h-5 transition-colors duration-300",
                            isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-white group-hover/heart:text-red-500"
                          )}
                        />
                      </button>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-copper mb-1">{product.category}</p>
                      <h3 className="text-charcoal font-serif text-lg mb-2 group-hover:text-copper transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-charcoal/70 text-sm">
                        {product.price ? formatPrice(product.price) : 'On Request'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
