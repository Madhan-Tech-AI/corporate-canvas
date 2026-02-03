import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { User, Mail, Building2, LogOut, Package, Heart, ShoppingBag, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useBag } from '@/context/BagContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface UserProfile {
    first_name: string;
    last_name: string;
    email: string;
    company_name?: string;
    created_at?: string;
}

export default function Profile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user, signOut } = useAuth();
    const { wishlist, wishlistCount } = useWishlist();
    const { bag, bagCount } = useBag();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('first_name, last_name, email, company_name, created_at')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                setProfile(data);
            } catch (error: any) {
                console.error('Error fetching profile:', error);
                toast.error('Failed to load profile');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user, navigate]);

    const handleSignOut = async () => {
        await signOut();
        toast.success('Signed out successfully');
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="pt-32 pb-24">
                    <div className="container-premium max-w-4xl mx-auto">
                        <div className="text-center">
                            <p className="text-muted-foreground">Loading...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const memberSince = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recently';

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container-premium max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-3">My Profile</h1>
                        <p className="text-muted-foreground">Manage your account and view your collection</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Account Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Profile Information Card */}
                            <div className="bg-card border border-border rounded-sm p-8">
                                <h2 className="text-xl font-serif text-foreground mb-6">Account Information</h2>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <User className="w-5 h-5 text-copper mt-1" />
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                                            <p className="text-foreground text-lg">
                                                {profile?.first_name} {profile?.last_name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Mail className="w-5 h-5 text-copper mt-1" />
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                                            <p className="text-foreground">{profile?.email}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span className="text-xs text-green-600">Verified</span>
                                            </div>
                                        </div>
                                    </div>

                                    {profile?.company_name && (
                                        <div className="flex items-start gap-4">
                                            <Building2 className="w-5 h-5 text-copper mt-1" />
                                            <div className="flex-1">
                                                <p className="text-sm text-muted-foreground mb-1">Company</p>
                                                <p className="text-foreground">{profile.company_name}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-4">
                                        <Calendar className="w-5 h-5 text-copper mt-1" />
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                                            <p className="text-foreground">{memberSince}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Wishlist Items */}
                            {wishlist.length > 0 && (
                                <div className="bg-card border border-border rounded-sm p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-serif text-foreground">Recent Wishlist Items</h2>
                                        <button
                                            onClick={() => navigate('/wishlist')}
                                            className="text-sm text-copper hover:underline"
                                        >
                                            View All ({wishlistCount})
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        {wishlist.slice(0, 3).map((item) => (
                                            <div key={item.id} className="group cursor-pointer" onClick={() => navigate(`/products/${item.id}`)}>
                                                <div className="aspect-square rounded-sm overflow-hidden mb-2">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                                <p className="text-sm text-foreground truncate">{item.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recent Bag Items */}
                            {bag.length > 0 && (
                                <div className="bg-card border border-border rounded-sm p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-serif text-foreground">Shopping Bag</h2>
                                        <button
                                            onClick={() => navigate('/bag')}
                                            className="text-sm text-copper hover:underline"
                                        >
                                            View All ({bagCount} items)
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        {bag.slice(0, 3).map((item) => (
                                            <div key={item.id} className="group cursor-pointer" onClick={() => navigate(`/products/${item.id}`)}>
                                                <div className="aspect-square rounded-sm overflow-hidden mb-2">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                                <p className="text-sm text-foreground truncate">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Stats & Actions */}
                        <div className="space-y-6">
                            {/* Statistics Card */}
                            <div className="bg-card border border-border rounded-sm p-6">
                                <h2 className="text-lg font-serif text-foreground mb-4">Your Collection</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-background rounded-sm">
                                        <div className="flex items-center gap-3">
                                            <Heart className="w-5 h-5 text-copper" />
                                            <span className="text-foreground">Wishlist</span>
                                        </div>
                                        <span className="text-copper font-medium">{wishlistCount}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-background rounded-sm">
                                        <div className="flex items-center gap-3">
                                            <ShoppingBag className="w-5 h-5 text-copper" />
                                            <span className="text-foreground">In Bag</span>
                                        </div>
                                        <span className="text-copper font-medium">{bagCount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions Card */}
                            <div className="bg-card border border-border rounded-sm p-6">
                                <h2 className="text-lg font-serif text-foreground mb-4">Quick Actions</h2>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => navigate('/wishlist')}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-foreground hover:bg-background border border-border rounded-sm transition-colors"
                                    >
                                        <Heart className="w-5 h-5 text-copper" />
                                        <span>View Wishlist</span>
                                    </button>

                                    <button
                                        onClick={() => navigate('/bag')}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-foreground hover:bg-background border border-border rounded-sm transition-colors"
                                    >
                                        <ShoppingBag className="w-5 h-5 text-copper" />
                                        <span>View Shopping Bag</span>
                                    </button>

                                    <button
                                        onClick={() => navigate('/collections')}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-foreground hover:bg-background border border-border rounded-sm transition-colors"
                                    >
                                        <Package className="w-5 h-5 text-copper" />
                                        <span>Browse Collections</span>
                                    </button>
                                </div>
                            </div>

                            {/* Sign Out Button */}
                            <div className="bg-card border border-border rounded-sm p-6">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-sm transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
