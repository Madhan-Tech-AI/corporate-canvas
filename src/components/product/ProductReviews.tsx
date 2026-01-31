import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Dummy data for reviews
const initialReviews = [
    {
        id: 1,
        author: "Arjun Mehta",
        rating: 5,
        date: "12 Oct 2023",
        content: "Absolutely stunning piece! The bronze finish looks even better in person. It serves as a perfect centerpiece for our conference room.",
        helpful: 24,
        verified: true,
        images: [
            "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=200&q=80",
            "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=200&q=80"
        ]
    },
    {
        id: 2,
        author: "Sarah Jenkins",
        rating: 4,
        date: "05 Nov 2023",
        content: "Beautiful craftsmanship. The delivery was slightly delayed, but the packaging was excellent and the sculpture arrived in perfect condition.",
        helpful: 12,
        verified: true,
        images: []
    },
    {
        id: 3,
        author: "Vikram Singh",
        rating: 5,
        date: "28 Nov 2023",
        content: "Exceeded my expectations. The way it catches the light is mesmerizing. Worth every penny.",
        helpful: 8,
        verified: true,
        images: []
    }
];

const ratingStats = {
    average: 4.8,
    total: 124,
    distribution: {
        5: 85,
        4: 25,
        3: 10,
        2: 2,
        1: 2
    }
};

export default function ProductReviews() {
    const [reviews, setReviews] = useState(initialReviews);

    return (
        <div className="border-t border-border py-12">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Rating Summary - Left Side */}
                <div className="lg:w-1/3 space-y-8">
                    <h2 className="text-2xl font-serif text-charcoal dark:text-cream">Ratings & Reviews</h2>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center bg-white dark:bg-charcoal p-6 rounded-sm shadow-sm border border-gray-100 dark:border-white/10 w-32 h-32">
                            <span className="text-4xl font-bold text-charcoal dark:text-cream mb-1">{ratingStats.average}</span>
                            <div className="flex items-center gap-0.5 mb-1">
                                <Star className="w-4 h-4 fill-copper text-copper" />
                            </div>
                            <span className="text-xs text-muted-foreground">{ratingStats.total} Ratings</span>
                        </div>

                        <div className="flex-1 space-y-2">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <div key={star} className="flex items-center gap-3 text-sm">
                                    <span className="w-3 font-medium text-charcoal dark:text-cream">{star}</span>
                                    <Star className="w-3 h-3 text-charcoal/40 dark:text-cream/40" />
                                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-copper rounded-full"
                                            style={{
                                                width: `${(ratingStats.distribution[star as keyof typeof ratingStats.distribution] / ratingStats.total) * 100}%`
                                            }}
                                        />
                                    </div>
                                    <span className="w-8 text-xs text-muted-foreground text-right">
                                        {ratingStats.distribution[star as keyof typeof ratingStats.distribution]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium text-charcoal dark:text-cream">Review this product</h3>
                        <p className="text-sm text-muted-foreground">Share your thoughts with other customers</p>
                        <Button variant="outline" className="w-full border-copper text-copper hover:bg-copper hover:text-white transition-colors">
                            Write a Review
                        </Button>
                    </div>
                </div>

                {/* Reviews List - Right Side */}
                <div className="lg:w-2/3 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-charcoal dark:text-cream">Customer Reviews ({reviews.length})</h3>
                        <div className="flex gap-2">
                            <select className="bg-transparent border border-gray-200 dark:border-white/10 rounded-sm text-sm p-2 text-charcoal dark:text-cream focus:outline-none focus:border-copper">
                                <option>Most Helpful</option>
                                <option>Most Recent</option>
                                <option>Highest to Lowest</option>
                                <option>Lowest to Highest</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-100 dark:border-white/5 pb-6 last:border-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`px-2 py-0.5 rounded text-xs font-bold text-white flex items-center gap-1 ${review.rating >= 4 ? 'bg-green-600' : review.rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}>
                                        {review.rating} <Star className="w-3 h-3 fill-white" />
                                    </div>
                                    <span className="font-medium text-charcoal dark:text-cream text-sm">{review.content.slice(0, 40)}...</span>
                                </div>

                                <p className="text-charcoal/80 dark:text-cream/80 text-sm leading-relaxed mb-4">
                                    {review.content}
                                </p>

                                {review.images && review.images.length > 0 && (
                                    <div className="flex gap-2 mb-4">
                                        {review.images.map((img, idx) => (
                                            <div key={idx} className="w-16 h-16 rounded-sm overflow-hidden border border-gray-100 dark:border-white/10 cursor-pointer hover:opacity-80 transition-opacity">
                                                <img src={img} alt={`Review ${idx}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium text-charcoal/60 dark:text-cream/60">{review.author}</span>
                                        {review.verified && (
                                            <span className="flex items-center gap-1 text-charcoal/40 dark:text-cream/40">
                                                <CheckCircle2 className="w-3 h-3" /> Certified Buyer
                                            </span>
                                        )}
                                        <span>{review.date}</span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-1 hover:text-charcoal dark:hover:text-cream transition-colors">
                                            <ThumbsUp className="w-3 h-3" /> <span>{review.helpful}</span>
                                        </button>
                                        <button className="flex items-center gap-1 hover:text-charcoal dark:hover:text-cream transition-colors">
                                            <ThumbsDown className="w-3 h-3" /> <span>0</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button variant="ghost" className="text-copper hover:text-copper/80 p-0 h-auto font-medium">
                        View All Reviews
                    </Button>
                </div>
            </div>
        </div>
    );
}
