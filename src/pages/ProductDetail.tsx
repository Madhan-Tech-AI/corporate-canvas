import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Heart, Share2, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';
import ProductReviews from '@/components/product/ProductReviews';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Reveal from '@/components/Reveal';
import { useBag } from '@/context/BagContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToBag } = useBag();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);

        // Fetch related products (e.g., same type or random)
        if (data) {
          const { data: related } = await supabase
            .from('products')
            .select('*')
            .neq('id', id)
            .limit(3); // Just get 3 random-ish others

          if (related) {
            setRelatedProducts(related);
          }
        }

      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    // Scroll to top when ID changes
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToBag = () => {
    if (!product) return;
    addToBag({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.image_url || '',
      category: product.type,
      artist: product.artist_name,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    // Add to bag first
    addToBag({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.image_url || '',
      category: product.type,
      artist: product.artist_name,
    });
    // Navigate to review page
    navigate('/checkout/review');
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || '',
        category: product.type,
        artist: product.artist_name,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-copper animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif text-charcoal mb-4">Product Not Found</h2>
        <Link to="/products" className="text-copper hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Collection
        </Link>
      </div>
    );
  }

  // Handle images array properly. If db only has single image_url string, wrap in array.
  // Assuming 'image_url' is the main image.
  // If we had a gallery, we'd fetch it. For now, use single image.
  const images = product.image_url ? [product.image_url] : [];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container-premium">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link to="/products" className="text-charcoal/50 hover:text-charcoal transition-colors">
                  Collection
                </Link>
              </li>
              <li className="text-charcoal/30">/</li>
              <li>
                <Link to={`/products?search=${product.type}`} className="text-charcoal/50 hover:text-charcoal transition-colors">
                  {product.type}
                </Link>
              </li>
              <li className="text-charcoal/30">/</li>
              <li className="text-charcoal font-medium truncate max-w-[200px]">{product.name}</li>
            </ol>
          </nav>

          {/* Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24">

            {/* Image Section */}
            <div className="space-y-6">
              <Reveal width="100%">
                <div className="relative mx-auto max-w-[260px] sm:max-w-[340px] md:max-w-none aspect-square md:aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 shadow-sm border border-gray-100/50">
                  {images.length > 0 ? (
                    <img
                      src={images[currentImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-charcoal/30">No Image</div>
                  )}

                  {product.availability === 'Sold Out' && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-charcoal text-xl font-serif tracking-widest uppercase border border-charcoal px-6 py-3">Sold Out</span>
                    </div>
                  )}
                </div>
              </Reveal>
            </div>

            {/* Product Info */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <Reveal width="100%" delay={0.2}>
                <p className="text-xs uppercase tracking-[0.2em] text-copper mb-4 font-semibold">{product.artist_name}</p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-charcoal mb-6 leading-tight">{product.name}</h1>
                <p className="text-2xl sm:text-3xl text-charcoal font-light mb-8">
                  {product.price ? `₹${product.price.toLocaleString()}` : 'Price on Request'}
                </p>

                <div className="prose prose-sm text-charcoal/70 mb-8 leading-relaxed">
                  <p>{product.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-10 pb-10 border-b border-gray-100">
                  {product.medium && (
                    <div>
                      <span className="block text-xs uppercase text-charcoal/40 mb-1">Medium</span>
                      <span className="text-charcoal text-sm">{product.medium}</span>
                    </div>
                  )}
                  {product.size && (
                    <div>
                      <span className="block text-xs uppercase text-charcoal/40 mb-1">Dimensions</span>
                      <span className="text-charcoal text-sm">{product.size}</span>
                    </div>
                  )}
                  {product.orientation && (
                    <div>
                      <span className="block text-xs uppercase text-charcoal/40 mb-1">Orientation</span>
                      <span className="text-charcoal text-sm">{product.orientation}</span>
                    </div>
                  )}
                  <div>
                    <span className="block text-xs uppercase text-charcoal/40 mb-1">Authenticity</span>
                    <span className="text-charcoal text-sm">Verified</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4 mb-8">
                  <button
                    onClick={handleAddToBag}
                    disabled={product.availability === 'Sold Out'}
                    className="w-full py-4 bg-charcoal text-white uppercase tracking-widest text-xs font-bold hover:bg-charcoal/90 transition-all shadow-xl shadow-charcoal/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {product.availability === 'Sold Out' ? 'Unavailable' : 'Add to Bag'}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.availability === 'Sold Out'}
                    className="w-full py-4 border border-charcoal text-charcoal uppercase tracking-widest text-xs font-bold hover:bg-charcoal hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Secondary Actions */}
                <div className="flex items-center gap-8 justify-center lg:justify-start">
                  <button
                    onClick={handleToggleWishlist}
                    className="flex items-center gap-2 text-charcoal/60 hover:text-copper transition-colors group"
                  >
                    <Heart className={cn(
                      "w-5 h-5 group-hover:scale-110 transition-transform",
                      isInWishlist(product?.id) && "fill-current text-red-500"
                    )} />
                    <span className="text-xs uppercase tracking-wider">
                      {isInWishlist(product?.id) ? 'Saved' : 'Save'}
                    </span>
                  </button>
                  <button className="flex items-center gap-2 text-charcoal/60 hover:text-copper transition-colors group">
                    <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs uppercase tracking-wider">Share</span>
                  </button>
                </div>

                {/* Trust Badge */}
                <div className="mt-10 pt-8 border-t border-gray-100 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-copper" />
                  <span className="text-sm text-charcoal/60">Includes official certificate of authenticity and provenance.</span>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Reviews Section - Kept as is or enhanced */}
          {/* <ProductReviews /> can be enabled if needed */}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-32 border-t border-gray-100 pt-20">
              <Reveal width="100%">
                <h2 className="text-3xl font-serif text-charcoal mb-12 text-center">You May Also Admire</h2>
              </Reveal>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {relatedProducts.map((p, idx) => (
                  <Reveal key={p.id} delay={idx * 0.1}>
                    <Link to={`/products/${p.id}`} className="group block">
                      <div className="aspect-square md:aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 mb-6 relative">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-copper uppercase tracking-widest mb-2">{p.artist_name}</p>
                        <h3 className="text-xl font-serif text-charcoal mb-2 group-hover:text-copper transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-charcoal/60 text-sm font-medium">
                          {p.price ? `₹${p.price.toLocaleString()}` : 'On Request'}
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
