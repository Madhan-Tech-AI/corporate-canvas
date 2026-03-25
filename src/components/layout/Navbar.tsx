import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, X, Menu, Heart, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import SearchOverlay from './SearchOverlay';
import CurrencySelector from '../ui/CurrencySelector';

const navLinks = [
  { name: 'Art Discovery', href: '/art-discovery' },
  { name: 'Product', href: '/products' },
  { name: 'Customize', href: '/custom-art' },
  { name: 'Sell Arts', href: '/sell-art' },
  { name: 'Corporate', href: '/corporate-services' },
  { name: 'Studio', href: '/about' },
];

import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useBag } from '@/context/BagContext';
import { useOrders } from '@/context/OrdersContext';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();
  const { bagCount } = useBag();
  const { ordersCount } = useOrders();
  const location = useLocation();
  const isDarkPage = false;
  const textColorClass = 'text-charcoal';
  const iconColorClass = 'text-charcoal/80';



  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-gray-100 py-3 md:py-4 transition-all duration-300"
      >
        <div className="container-premium flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className={cn(
              "font-serif text-xl md:text-2xl tracking-wide hover:text-copper transition-colors duration-300",
              textColorClass
            )}
          >
            ARTÉUM
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'link-premium',
                  location.pathname === link.href && 'text-copper'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden lg:block">
              <CurrencySelector />
            </div>

            <button
              onClick={() => setIsSearchOpen(true)}
              className={cn(iconColorClass, "hover:text-copper transition-colors duration-300")}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              to="/orders"
              className={cn(iconColorClass, "hover:text-copper transition-colors duration-300 relative")}
              aria-label="Orders"
            >
              <Package className="w-5 h-5" />
              {ordersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-copper text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {ordersCount}
                </span>
              )}
            </Link>

            <Link
              to="/wishlist"
              className={cn(iconColorClass, "hidden xs:flex hover:text-copper transition-colors duration-300 relative")}
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-copper text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/bag"
              className={cn(iconColorClass, "hover:text-copper transition-colors duration-300 relative")}
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {bagCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-copper text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                  {bagCount}
                </span>
              )}
            </Link>

            {user ? (
              <Link
                to="/profile"
                className={cn(iconColorClass, "hover:text-copper transition-colors duration-300")}
                aria-label="Profile"
                title="My Profile"
              >
                <User className="w-5 h-5 text-copper" />
              </Link>
            ) : (
              <Link
                to="/login"
                className={cn(iconColorClass, "hover:text-copper transition-colors duration-300")}
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(iconColorClass, "lg:hidden hover:text-copper transition-colors duration-300")}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'lg:hidden absolute top-full left-0 right-0 bg-warm-white border-b border-border overflow-hidden transition-all duration-500 ease-premium shadow-2xl',
            isMobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="container-premium py-10 flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              {navLinks.map((link, idx) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    'text-charcoal/80 text-xl font-medium tracking-wide hover:text-copper transition-all duration-300 flex items-center justify-between group',
                    location.pathname === link.href && 'text-copper'
                  )}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  {link.name}
                  <span className="w-2 h-2 rounded-full bg-copper opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>

            <div className="pt-8 border-t border-charcoal/5 flex flex-col gap-6">
              <CurrencySelector />
              <div className="flex items-center gap-6">
                <Link to="/profile" className="text-charcoal/60 hover:text-copper flex items-center gap-2 text-sm uppercase tracking-widest font-medium">
                  <User className="w-5 h-5" /> Profile
                </Link>
                <Link to="/wishlist" className="sm:hidden text-charcoal/60 hover:text-copper flex items-center gap-2 text-sm uppercase tracking-widest font-medium">
                  <Heart className="w-5 h-5" /> Wishlist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
