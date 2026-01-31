import { Link } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';
import { ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { cn } from '@/lib/utils';

const featuredWorks = [
    {
        id: 1,
        title: 'The Silent Void',
        artist: 'Eleanor Vance',
        price: 245000,
        image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80',
        category: 'Oil on Canvas'
    },
    {
        id: 2,
        title: 'Echoes of Dawn',
        artist: 'Julian Thorne',
        price: 185000,
        image: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=800&q=80',
        category: 'Mixed Media'
    },
    {
        id: 3,
        title: 'Urban Serenity',
        artist: 'Amara Singh',
        price: 165000,
        image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=800&q=80',
        category: 'Fine Art Photography'
    },
    {
        id: 4,
        title: 'Nature\'s Whisper',
        artist: 'David Kim',
        price: 320000,
        image: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?auto=format&fit=crop&w=800&q=80',
        category: 'Acrylic'
    }
];

export default function FeaturedArtworks() {
    const { formatPrice } = useCurrency();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    return (
        <section className="bg-warm-white py-20">
            <div className="container-premium">
                <Reveal width="100%">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <p className="text-caption text-copper mb-4">Curated Masterpieces</p>
                            <h2 className="text-display text-charcoal">Featured Artworks</h2>
                        </div>
                        <Link to="/collections" className="link-premium hidden md:block">
                            View All Collection
                        </Link>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredWorks.map((work, index) => (
                        <Reveal key={work.id} width="100%" delay={index * 0.1}>
                            <Link to={`/products/${work.id}`} className="group block h-full">
                                <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-charcoal-light rounded-sm">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                                    <img
                                        src={work.image}
                                        alt={work.title}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                                    />
                                    <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        <span className="bg-white/90 backdrop-blur text-charcoal px-4 py-2 text-sm tracking-wide uppercase">
                                            Add to Bag
                                        </span>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (isInWishlist(work.id)) {
                                                removeFromWishlist(work.id);
                                            } else {
                                                addToWishlist({
                                                    id: work.id,
                                                    name: work.title,
                                                    price: work.price,
                                                    image: work.image,
                                                    category: work.category,
                                                    artist: work.artist
                                                });
                                            }
                                        }}
                                        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-white transition-colors duration-300 group/heart"
                                    >
                                        <Heart
                                            className={cn(
                                                "w-5 h-5 transition-colors duration-300",
                                                isInWishlist(work.id) ? "fill-red-500 text-red-500" : "text-white group-hover/heart:text-red-500"
                                            )}
                                        />
                                    </button>
                                </div>
                                <div>
                                    <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1">{work.category}</p>
                                    <h3 className="text-xl font-serif text-charcoal mb-1 group-hover:text-copper transition-colors duration-300">
                                        {work.title}
                                    </h3>
                                    <div className="flex justify-between items-baseline">
                                        <p className="text-charcoal/60 text-sm">{work.artist}</p>
                                        <p className="text-charcoal font-medium">
                                            {typeof work.price === 'number' ? formatPrice(work.price) : work.price}
                                        </p>
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
