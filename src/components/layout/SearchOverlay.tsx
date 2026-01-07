import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockResults = [
  { id: 1, name: 'Bronze Meridian Sculpture', category: 'Artifacts', image: '/placeholder.svg', href: '/products/1' },
  { id: 2, name: 'Abstract Horizon Canvas', category: 'Canvas Paintings', image: '/placeholder.svg', href: '/products/2' },
  { id: 3, name: 'Geometric Flow Installation', category: 'Custom Art', image: '/placeholder.svg', href: '/products/3' },
  { id: 4, name: 'Marble Essence Series', category: 'Artifacts', image: '/placeholder.svg', href: '/products/4' },
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof mockResults>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = mockResults.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] transition-all duration-500 ease-premium',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian/95 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32">
        {/* Search Input */}
        <div
          className={cn(
            'relative transition-all duration-500 ease-premium',
            isOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          )}
          style={{ transitionDelay: isOpen ? '150ms' : '0ms' }}
        >
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-cream/40" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artifacts, paintings, collections..."
            className="w-full bg-transparent border-b border-cream/20 py-4 pl-10 pr-10 text-2xl md:text-3xl font-light text-cream placeholder:text-cream/30 focus:outline-none focus:border-champagne/50 transition-colors duration-300"
          />
          <button
            onClick={onClose}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream transition-colors duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results */}
        <div
          className={cn(
            'mt-12 transition-all duration-500 ease-premium',
            isOpen && results.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          )}
          style={{ transitionDelay: isOpen ? '250ms' : '0ms' }}
        >
          <p className="text-caption mb-6">{results.length} Results</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((result, index) => (
              <Link
                key={result.id}
                to={result.href}
                onClick={onClose}
                className="group flex items-center gap-6 p-4 bg-charcoal/50 rounded hover:bg-charcoal transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-20 h-20 bg-charcoal-light rounded overflow-hidden flex-shrink-0">
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <p className="text-cream font-medium group-hover:text-champagne transition-colors duration-300">
                    {result.name}
                  </p>
                  <p className="text-cream-muted text-sm mt-1">{result.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* No Results */}
        {query.length > 1 && results.length === 0 && (
          <div
            className={cn(
              'mt-16 text-center transition-all duration-500 ease-premium',
              isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            )}
          >
            <p className="text-cream-muted text-lg">No results found for "{query}"</p>
            <p className="text-muted-foreground mt-2">Try searching for artifacts, paintings, or collections</p>
          </div>
        )}
      </div>
    </div>
  );
}
