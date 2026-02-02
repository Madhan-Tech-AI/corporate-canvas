import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, X, Menu, Heart } from 'lucide-react';
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
import { toast } from 'sonner';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isDarkPage = false;
  const textColorClass = 'text-charcoal';
  const iconColorClass = 'text-charcoal/80';

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7] border-b border-gray-100 py-4"
      >
        <div className="w-full px-6 flex items-center justify-between">
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
          <div className="flex items-center gap-6">
            <div className="hidden md:block">
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
              to="/wishlist"
              className={cn(iconColorClass, "hover:text-copper transition-colors duration-300 relative")}
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              to="/bag"
              className={cn(iconColorClass, "hover:text-copper transition-colors duration-300 relative")}
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>

            {user ? (
              <button
                onClick={handleSignOut}
                className={cn(iconColorClass, "hover:text-copper transition-colors duration-300")}
                aria-label="Sign Out"
                title="Sign Out"
              >
                <User className="w-5 h-5 text-copper" />
              </button>
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
            'lg:hidden absolute top-full left-0 right-0 bg-warm-white/98 backdrop-blur-xl border-b border-border overflow-hidden transition-all duration-500 ease-premium',
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="container-premium py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'text-charcoal/80 text-lg font-light tracking-wide hover:text-copper transition-colors duration-300',
                  location.pathname === link.href && 'text-copper'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
