import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, X, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import SearchOverlay from './SearchOverlay';

const navLinks = [
  { name: 'Collections', href: '/collections' },
  { name: 'Artifacts', href: '/artifacts' },
  { name: 'Canvas Paintings', href: '/canvas-paintings' },
  { name: 'Custom Corporate Art', href: '/custom-art' },
  { name: 'Corporate Services', href: '/corporate-services' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-premium',
          isScrolled ? 'navbar-solid py-4' : 'navbar-transparent py-6'
        )}
      >
        <div className="container-premium flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-charcoal font-serif text-xl md:text-2xl tracking-wide hover:text-copper transition-colors duration-300"
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
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-charcoal/80 hover:text-copper transition-colors duration-300"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <Link
              to="/bag"
              className="text-charcoal/80 hover:text-copper transition-colors duration-300 relative"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>
            
            <Link
              to="/login"
              className="text-charcoal/80 hover:text-copper transition-colors duration-300"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-charcoal/80 hover:text-copper transition-colors duration-300"
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
