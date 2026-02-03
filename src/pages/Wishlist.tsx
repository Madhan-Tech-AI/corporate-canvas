import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useWishlist } from '@/context/WishlistContext';
import { useBag } from '@/context/BagContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Trash2, ShoppingBag, Heart } from 'lucide-react';
import Reveal from '@/components/Reveal';

export default function Wishlist() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToBag } = useBag();
    const { formatPrice } = useCurrency();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 pb-20">
                <div className="container-premium">
                    <div className="mb-12 text-center md:text-left">
                        <p className="text-caption text-copper mb-4">Your Curated Collection</p>
                        <h1 className="text-display text-charcoal">Wishlist</h1>
                    </div>

                    {wishlist.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-charcoal/5 p-6 rounded-full mb-6">
                                <Heart className="w-10 h-10 text-charcoal/40" />
                            </div>
                            <h2 className="text-2xl font-serif text-charcoal mb-4">
                                Your collection awaits its first masterpiece.
                            </h2>
                            <p className="text-charcoal/60 max-w-md mb-8">
                                Start curating your personal gallery by saving artworks that speak to you.
                            </p>
                            <Link
                                to="/collections"
                                className="btn-primary"
                            >
                                Discover Art
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {wishlist.map((item, index) => (
                                <Reveal key={item.id} width="100%" delay={index * 0.1}>
                                    <div className="group relative">
                                        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-charcoal-light mb-4">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                                            />

                                            <button
                                                onClick={() => removeFromWishlist(item.id)}
                                                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-charcoal/60 hover:text-red-500 transition-colors z-20"
                                                title="Remove from Wishlist"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center pb-6">
                                                <button
                                                    onClick={() => addToBag({
                                                        id: item.id,
                                                        name: item.name,
                                                        price: typeof item.price === 'number' ? item.price : 0,
                                                        image: item.image,
                                                        category: item.category,
                                                        artist: item.artist,
                                                    })}
                                                    className="bg-white text-charcoal px-6 py-2 text-sm uppercase tracking-wider font-medium hover:bg-copper hover:text-white transition-colors flex items-center gap-2"
                                                >
                                                    <ShoppingBag className="w-4 h-4" />
                                                    Add to Bag
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            {item.category && (
                                                <p className="text-xs font-medium text-copper mb-1">{item.category}</p>
                                            )}
                                            <Link to={`/products/${item.id}`}>
                                                <h3 className="text-charcoal font-serif text-lg mb-1 hover:text-copper transition-colors">
                                                    {item.name}
                                                </h3>
                                            </Link>
                                            <div className="flex justify-between items-baseline">
                                                {item.artist && (
                                                    <p className="text-charcoal/60 text-sm">{item.artist}</p>
                                                )}
                                                <p className="text-charcoal font-medium">
                                                    {typeof item.price === 'number' ? formatPrice(item.price) : item.price || 'On Request'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
