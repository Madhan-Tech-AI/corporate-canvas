import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Heart, Share2, ShieldCheck } from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';

const productData = {
  id: 1,
  name: 'Bronze Meridian Sculpture',
  category: 'Artifacts',
  price: '₹2,45,000',
  tag: 'Boardroom Fit',
  description: 'A masterpiece of contemporary sculptural art, the Bronze Meridian embodies the intersection of geometric precision and organic flow. Handcrafted by master artisans using traditional lost-wax casting techniques.',
  details: {
    material: 'Bronze with patina finish',
    dimensions: '45 x 30 x 25 cm',
    weight: '8.5 kg',
    care: 'Dust with soft cloth. Avoid direct sunlight.',
  },
  images: [
    'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1200&q=80',
  ],
};

const relatedProducts = [
  { id: 2, name: 'Obsidian Wave', category: 'Artifacts', price: '₹3,20,000', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Brass Constellation', category: 'Artifacts', price: '₹1,75,000', image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80' },
  { id: 4, name: 'Marble Essence', category: 'Artifacts', price: '₹2,10,000', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=600&q=80' },
];

export default function ProductDetail() {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAddToBag = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      // Add to bag logic
      console.log('Added to bag');
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      // Buy now logic
      console.log('Proceed to checkout');
    }
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % productData.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + productData.images.length) % productData.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32">
        <div className="container-premium">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link to="/collections" className="text-muted-foreground hover:text-cream transition-colors">
                  Collections
                </Link>
              </li>
              <li className="text-muted-foreground">/</li>
              <li>
                <Link to="/artifacts" className="text-muted-foreground hover:text-cream transition-colors">
                  {productData.category}
                </Link>
              </li>
              <li className="text-muted-foreground">/</li>
              <li className="text-cream">{productData.name}</li>
            </ol>
          </nav>

          {/* Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-sm bg-charcoal">
                <img
                  src={productData.images[currentImage]}
                  alt={productData.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-obsidian/80 backdrop-blur-sm flex items-center justify-center text-cream hover:bg-obsidian transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-obsidian/80 backdrop-blur-sm flex items-center justify-center text-cream hover:bg-obsidian transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Tag */}
                <span className="absolute top-4 left-4 text-xs tracking-widest uppercase bg-obsidian/80 text-cream px-3 py-1.5 backdrop-blur-sm">
                  {productData.tag}
                </span>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4">
                {productData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={cn(
                      'w-20 h-20 overflow-hidden rounded-sm transition-all duration-300',
                      currentImage === index ? 'ring-2 ring-champagne' : 'opacity-60 hover:opacity-100'
                    )}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="text-caption text-champagne mb-3">{productData.category}</p>
              <h1 className="text-3xl md:text-4xl font-serif text-cream mb-4">{productData.name}</h1>
              <p className="text-2xl text-champagne mb-8">{productData.price}</p>

              <p className="text-cream-muted leading-relaxed mb-8">{productData.description}</p>

              {/* Details */}
              <div className="space-y-4 mb-10 pb-10 border-b border-border">
                {Object.entries(productData.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">{key}</span>
                    <span className="text-cream">{value}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="space-y-4 mb-8">
                <button onClick={handleAddToBag} className="w-full btn-primary">
                  Add to Bag
                </button>
                <button onClick={handleBuyNow} className="w-full btn-secondary">
                  Buy Now
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-cream/60 hover:text-cream transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">Save</span>
                </button>
                <button className="flex items-center gap-2 text-cream/60 hover:text-cream transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">Share</span>
                </button>
              </div>

              {/* Trust Badge */}
              <div className="mt-10 pt-8 border-t border-border flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-champagne" />
                <span className="text-sm text-cream-muted">Certificate of authenticity included</span>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <section className="section-padding">
            <h2 className="text-headline text-cream mb-10">Related Artworks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} className="group">
                  <div className="aspect-[4/5] overflow-hidden rounded-sm bg-charcoal-light mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-premium"
                    />
                  </div>
                  <p className="text-caption text-champagne-muted mb-1">{product.category}</p>
                  <h3 className="text-cream font-serif text-lg mb-2 group-hover:text-champagne transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-cream-muted text-sm">{product.price}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
