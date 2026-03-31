// Imports moved down
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { Heart, X, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';
import styled from 'styled-components';

// UI Components
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const StyledCard = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 4px 6px -1px, rgba(0, 0, 0, 0.02) 0px 2px 4px -1px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
  }
`;

// --- Enhanced Mock Data ---
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

// --- Enhanced Data Type ---
interface Product {
  id: any; // Using any for compatibility with mixed ID types for now, ideally UUID
  name: string;
  category: string;
  price: number | null;
  image: string;
  tag?: string;
  medium: string;
  size: string;
  orientation: string;
  availability: string;
}

// ... existing imports ...


// Products state will be managed inside the component

// --- Filter Options ---
const filterOptions = {
  collections: ['Artifacts', 'Canvas Paintings', 'Custom Art', 'Top Rated', 'New Collection'],
  medium: ['Acrylic', 'Oil', 'Bronze', 'Marble', 'Brass', 'Stone', 'Mixed Media'],
  size: ['Small', 'Medium', 'Large'],
  orientation: ['Landscape', 'Portrait', 'Square'],
  availability: ['In Stock', 'Made to Order'],
};

export default function ProductListing() {
  // State
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]); // New state for products
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [expandedSections, setExpandedSections] = useState<string[]>(['collections', 'medium']);
  const [currentPage, setCurrentPage] = useState(1);

  // Handle Search Params
  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) throw error;

        if (data) {
          const formattedProducts: Product[] = data.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category || 'Collection',
            price: item.price,
            image: item.image_url || '',
            tag: item.tags && item.tags.length > 0 ? item.tags[0] : undefined, // taking first tag as main tag
            medium: item.medium || 'Mixed Media',
            size: item.size || 'Medium',
            orientation: item.orientation || 'Landscape',
            availability: item.availability || 'In Stock'
          }));
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    // Realtime Subscription
    const channel = supabase
      .channel('products-listing-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'products' },
        (payload) => {
          const newItem = payload.new as any;
          const formattedItem: Product = {
            id: newItem.id,
            name: newItem.name,
            category: newItem.category || 'Collection',
            price: newItem.price,
            image: newItem.image_url || '',
            tag: newItem.tags && newItem.tags.length > 0 ? newItem.tags[0] : undefined,
            medium: newItem.medium || 'Mixed Media',
            size: newItem.size || 'Medium',
            orientation: newItem.orientation || 'Landscape',
            availability: newItem.availability || 'In Stock'
          };
          setProducts(prev => [formattedItem, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products' },
        (payload) => {
          const updatedItem = payload.new as any;
          const formattedItem: Product = {
            id: updatedItem.id,
            name: updatedItem.name,
            category: updatedItem.category || 'Collection',
            price: updatedItem.price,
            image: updatedItem.image_url || '',
            tag: updatedItem.tags && updatedItem.tags.length > 0 ? updatedItem.tags[0] : undefined,
            medium: updatedItem.medium || 'Mixed Media',
            size: updatedItem.size || 'Medium',
            orientation: updatedItem.orientation || 'Landscape',
            availability: updatedItem.availability || 'In Stock'
          };
          setProducts(prev => prev.map(p => p.id === formattedItem.id ? formattedItem : p));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'products' },
        (payload) => {
          const deletedId = (payload.old as any).id;
          setProducts(prev => prev.filter(p => p.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const itemsPerPage = 8; // Adjust based on grid layout (4 cols x 2 rows or similar)

  // Multi-select filters
  const [selectedFilters, setSelectedFilters] = useState({
    collections: [] as string[],
    medium: [] as string[],
    size: [] as string[],
    orientation: [] as string[],
    availability: [] as string[],
  });

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { formatPrice } = useCurrency();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Handlers
  const handleFilterChange = (category: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const removeFilter = (category: keyof typeof selectedFilters, value: string) => {
    handleFilterChange(category, value);
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      collections: [],
      medium: [],
      size: [],
      orientation: [],
      availability: [],
    });
    setPriceRange([0, 5000000]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const activeFilterCount = Object.values(selectedFilters).flat().length;

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = products;

    // Collections (Category)
    if (selectedFilters.collections.length > 0) {
      result = result.filter(p => selectedFilters.collections.includes(p.category) || (p.tag && selectedFilters.collections.includes(p.tag)));
    }

    // Medium
    if (selectedFilters.medium.length > 0) {
      result = result.filter(p => selectedFilters.medium.includes(p.medium));
    }

    // Size
    if (selectedFilters.size.length > 0) {
      result = result.filter(p => selectedFilters.size.includes(p.size));
    }

    // Orientation
    if (selectedFilters.orientation.length > 0) {
      result = result.filter(p => selectedFilters.orientation.includes(p.orientation));
    }

    // Availability
    if (selectedFilters.availability.length > 0) {
      result = result.filter(p => selectedFilters.availability.includes(p.availability));
    }

    // Price
    result = result.filter(product => {
      if (product.price === null) return true;
      return product.price >= priceRange[0] && product.price <= priceRange[1];
    });

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.tag && product.tag.toLowerCase().includes(query))
      );
    }

    // Sorting
    if (sortOption === 'price-low-high') {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === 'price-high-low') {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return result;
  }, [products, selectedFilters, priceRange, searchQuery, sortOption]);


  // Shared Filter Content Component
  const FilterContent = () => (
    <div className="space-y-6">
      <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections} className="w-full">

        {/* Collections */}
        <AccordionItem value="collections" className="border-b-charcoal/10">
          <AccordionTrigger className="hover:no-underline text-charcoal font-medium">Collections</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {filterOptions.collections.map(option => (
                <div key={option} className="flex items-center space-x-3">
                  <Checkbox
                    id={`col-${option}`}
                    checked={selectedFilters.collections.includes(option)}
                    onCheckedChange={() => handleFilterChange('collections', option)}
                    className="border-charcoal/30 data-[state=checked]:bg-charcoal data-[state=checked]:border-charcoal rounded-[4px]"
                  />
                  <label htmlFor={`col-${option}`} className="text-sm text-charcoal/80 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Medium */}
        <AccordionItem value="medium" className="border-b-charcoal/10">
          <AccordionTrigger className="hover:no-underline text-charcoal font-medium">Medium</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {filterOptions.medium.map(option => (
                <div key={option} className="flex items-center space-x-3">
                  <Checkbox
                    id={`med-${option}`}
                    checked={selectedFilters.medium.includes(option)}
                    onCheckedChange={() => handleFilterChange('medium', option)}
                    className="border-charcoal/30 data-[state=checked]:bg-charcoal data-[state=checked]:border-charcoal rounded-[4px]"
                  />
                  <label htmlFor={`med-${option}`} className="text-sm text-charcoal/80 leading-none cursor-pointer select-none">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size */}
        <AccordionItem value="size" className="border-b-charcoal/10">
          <AccordionTrigger className="hover:no-underline text-charcoal font-medium">Size</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {filterOptions.size.map(option => (
                <div key={option} className="flex items-center space-x-3">
                  <Checkbox
                    id={`size-${option}`}
                    checked={selectedFilters.size.includes(option)}
                    onCheckedChange={() => handleFilterChange('size', option)}
                    className="border-charcoal/30 data-[state=checked]:bg-charcoal data-[state=checked]:border-charcoal rounded-[4px]"
                  />
                  <label htmlFor={`size-${option}`} className="text-sm text-charcoal/80 leading-none cursor-pointer select-none">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Orientation */}
        <AccordionItem value="orientation" className="border-b-charcoal/10">
          <AccordionTrigger className="hover:no-underline text-charcoal font-medium">Orientation</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {filterOptions.orientation.map(option => (
                <div key={option} className="flex items-center space-x-3">
                  <Checkbox
                    id={`orient-${option}`}
                    checked={selectedFilters.orientation.includes(option)}
                    onCheckedChange={() => handleFilterChange('orientation', option)}
                    className="border-charcoal/30 data-[state=checked]:bg-charcoal data-[state=checked]:border-charcoal rounded-[4px]"
                  />
                  <label htmlFor={`orient-${option}`} className="text-sm text-charcoal/80 leading-none cursor-pointer select-none">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Availability */}
        <AccordionItem value="availability" className="border-b-0">
          <AccordionTrigger className="hover:no-underline text-charcoal font-medium">Availability</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 pt-2">
              {filterOptions.availability.map(option => (
                <button
                  key={option}
                  onClick={() => handleFilterChange('availability', option)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                    selectedFilters.availability.includes(option)
                      ? "bg-charcoal text-white border-charcoal"
                      : "bg-transparent text-charcoal/70 border-gray-200 hover:border-charcoal/50"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />

      {/* Top Bar Spacer */}
      <div className="h-20" />

      <main className="container mx-auto px-6 py-8">

        {/* Header Section: Title & Controls */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-serif text-charcoal mb-2">Gallery Collection</h1>
              <p className="text-charcoal/50 text-sm md:text-base">Curated artifacts and fine art for corporate spaces</p>
            </div>

            {/* Top Controls: Search & Price & Sort */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">

              {/* Search */}
              <div
                className={cn(
                  "relative transition-all duration-500 ease-out",
                  isSearchFocused ? "w-full md:w-64" : "w-full md:w-48"
                )}
              >
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 ring-1 ring-gray-200/50 rounded-full shadow-sm focus:shadow-md focus:ring-charcoal/20 transition-all outline-none text-charcoal placeholder:text-charcoal/30 text-sm"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
              </div>

              {/* Price Range Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className={cn(
                    "hidden lg:flex items-center gap-3 px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 group",
                    priceRange[0] > 0 || priceRange[1] < 500000
                      ? "bg-charcoal text-white border-charcoal shadow-lg shadow-charcoal/10"
                      : "bg-white border-gray-200 text-charcoal/80 hover:border-gray-300 hover:shadow-md"
                  )}>
                    <span className={cn(
                      "text-xs uppercase tracking-wider font-semibold",
                      priceRange[0] > 0 || priceRange[1] < 500000 ? "text-white/70" : "text-charcoal/50"
                    )}>Price</span>
                    <span className="h-4 w-[1px] bg-current opacity-20" />
                    <span>
                      {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    </span>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-300 group-data-[state=open]:rotate-180",
                      priceRange[0] > 0 || priceRange[1] < 500000 ? "text-white/70" : "text-charcoal/40"
                    )} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[360px] p-0 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden" align="end" sideOffset={8}>
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h4 className="font-serif text-lg text-charcoal">Price Range</h4>
                    <button
                      onClick={() => setPriceRange([0, 500000])}
                      className="text-xs font-medium text-charcoal/50 hover:text-red-500 transition-colors uppercase tracking-wide"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="p-6 space-y-8">
                    {/* Histogram & Slider */}
                    <div className="space-y-4">
                      {/* Histogram */}
                      <div className="h-16 flex items-end gap-1 px-1">
                        {[10, 25, 40, 30, 60, 85, 45, 60, 35, 20, 15, 5].map((h, i) => (
                          <div
                            key={i}
                            className={cn(
                              "flex-1 rounded-t-sm transition-colors duration-300",
                              // Highlight bars within range approximately
                              (i / 11) * 5000000 >= priceRange[0] && (i / 11) * 5000000 <= priceRange[1]
                                ? "bg-charcoal/80"
                                : "bg-charcoal/10"
                            )}
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>

                      <Slider
                        defaultValue={[0, 5000000]}
                        max={5000000}
                        step={10000}
                        value={priceRange}
                        onValueChange={(val) => setPriceRange(val as [number, number])}
                        className="py-2"
                      />
                    </div>

                    {/* Manual Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase text-charcoal/40 tracking-wider font-bold">Min Price</label>
                        <div className="relative group">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40 text-sm font-serif">₹</span>
                          <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => {
                              const val = Math.min(Number(e.target.value), priceRange[1]);
                              setPriceRange([val, priceRange[1]]);
                            }}
                            className="w-full pl-7 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-charcoal/10 focus:border-charcoal/50 transition-all hover:bg-gray-50/80"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase text-charcoal/40 tracking-wider font-bold">Max Price</label>
                        <div className="relative group">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40 text-sm font-serif">₹</span>
                          <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => {
                              const val = Math.max(Number(e.target.value), priceRange[0]);
                              setPriceRange([priceRange[0], val]);
                            }}
                            className="w-full pl-7 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-charcoal/10 focus:border-charcoal/50 transition-all hover:bg-gray-50/80"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>


              {/* Mobile Filter Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <button className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-charcoal hover:bg-gray-50 transition-colors">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="bg-charcoal text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] overflow-y-auto">
                  <SheetHeader className="mb-6 text-left">
                    <SheetTitle className="text-xl font-serif">Filters</SheetTitle>
                    <SheetDescription>Refine your search</SheetDescription>
                  </SheetHeader>

                  {/* Mobile Price Range */}
                  <div className="mb-6 px-1">
                    <h3 className="text-sm font-medium mb-4">Price Range</h3>
                    <Slider
                      defaultValue={[0, 5000000]}
                      max={5000000}
                      step={5000}
                      value={priceRange}
                      onValueChange={(val) => setPriceRange(val as [number, number])}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-xs text-charcoal/70 font-mono">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 my-4" />

                  <FilterContent />

                  <div className="mt-8 pt-4 border-t border-gray-100">
                    <button onClick={clearAllFilters} className="w-full py-2 text-sm text-charcoal/60 hover:text-charcoal mb-3">Clear All</button>
                    <SheetTrigger asChild>
                      <button className="w-full py-3 bg-charcoal text-white rounded-lg text-sm font-medium hover:bg-charcoal/90">Show Results</button>
                    </SheetTrigger>
                  </div>
                </SheetContent>
              </Sheet>


              {/* Sort */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-gray-100/50 rounded-lg text-sm font-medium text-charcoal transition-colors">
                  <span className="text-charcoal/50">Sort:</span>
                  {sortOption === 'featured' && 'Featured'}
                  {sortOption === 'price-low-high' && 'Price: Low -> High'}
                  {sortOption === 'price-high-low' && 'Price: High -> Low'}
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </button>

                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 overflow-hidden">
                  <button onClick={() => setSortOption('featured')} className="w-full text-left px-4 py-3 text-sm text-charcoal/80 hover:bg-gray-50 transition-colors">Featured</button>
                  <button onClick={() => setSortOption('price-low-high')} className="w-full text-left px-4 py-3 text-sm text-charcoal/80 hover:bg-gray-50 transition-colors">Price: Low to High</button>
                  <button onClick={() => setSortOption('price-high-low')} className="w-full text-left px-4 py-3 text-sm text-charcoal/80 hover:bg-gray-50 transition-colors">Price: High to Low</button>
                </div>
              </div>

            </div>
          </div>

          {/* Active Filters Bar */}
          {(activeFilterCount > 0 || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100/50">
              <span className="text-xs text-charcoal/40 mr-2 uppercase tracking-wider">Active Filters:</span>

              {/* Search Chip */}
              {searchQuery && (
                <Badge variant="secondary" className="bg-charcoal/5 hover:bg-charcoal/10 text-charcoal gap-1 pr-1 font-normal">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="p-0.5 hover:bg-charcoal/10 rounded-full"><X className="w-3 h-3" /></button>
                </Badge>
              )}

              {/* Dynamic Chips */}
              {Object.entries(selectedFilters).map(([category, values]) => (
                values.map(val => (
                  <Badge key={`${category}-${val}`} variant="secondary" className="bg-charcoal/5 hover:bg-charcoal/10 text-charcoal gap-1 pr-1 font-normal capitalize">
                    {val}
                    <button onClick={() => removeFilter(category as keyof typeof selectedFilters, val)} className="p-0.5 hover:bg-charcoal/10 rounded-full">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))
              ))}

              <button onClick={clearAllFilters} className="text-xs text-red-500 hover:text-red-600 underline ml-2">Clear All</button>
            </div>
          )}
        </div>


        <div className="flex flex-col lg:flex-row gap-10">

          {/* Desktop Sidebar (Sticky) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm">
              <FilterContent />
            </div>
          </aside>


          {/* Main Content */}
          <div className="flex-1">
            {/* Grid */}
            <div className={cn(
              'grid gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            )}>

              {filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} target="_blank" rel="noopener noreferrer" className="group block h-full">
                  <StyledCard>
                    <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-gray-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

                      {/* Hover Actions: Add to Bag & Buy Now */}
                      <div className="absolute inset-x-4 bottom-4 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col gap-2 md:opacity-0 md:group-hover:opacity-100 opacity-100 translate-y-0 pb-2 z-10">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/products/${product.id}`);
                          }}
                          className="w-full py-3 bg-white text-charcoal font-medium text-xs uppercase tracking-wider text-center hover:bg-white/90 shadow-lg rounded-sm transition-colors"
                        >
                          Add to Bag
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/products/${product.id}`);
                          }}
                          className="w-full py-3 bg-charcoal text-white font-medium text-xs uppercase tracking-wider text-center hover:bg-charcoal/90 shadow-lg rounded-sm transition-colors"
                        >
                          Buy Now
                        </button>
                      </div>

                      {/* Badges/Tags */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.availability === 'Made to Order' && (
                          <span className="bg-white/90 backdrop-blur text-charcoal text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm shadow-sm">
                            Made to Order
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (isInWishlist(product.id)) {
                              removeFromWishlist(product.id);
                            } else {
                              addToWishlist({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image,
                                category: product.category,
                                artist: 'Unknown'
                              });
                            }
                          }}
                          className="bg-white/90 backdrop-blur-sm text-charcoal p-2 rounded-full shadow-lg hover:bg-copper hover:text-white transition-all duration-300"
                        >
                          <Heart className={cn("w-4 h-4", isInWishlist(product.id) && "fill-current text-red-500 hover:text-white")} />
                        </button>
                      </div>

                      {product.tag && (
                        <div className="absolute bottom-3 left-3 group-hover:opacity-0 transition-opacity duration-300">
                          <span className="bg-white/80 backdrop-blur-md text-charcoal text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm shadow-sm">
                            {product.tag}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3 bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-medium text-charcoal/50 uppercase tracking-wider mb-1.5">{product.category} • {product.medium}</p>
                          <h3 className="text-lg font-serif text-charcoal leading-tight line-clamp-2 min-h-[3rem]">
                            {product.name}
                          </h3>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-medium text-charcoal">
                          {product.price ? formatPrice(product.price) : 'On Request'}
                        </span>
                        <span className="text-[10px] text-charcoal/50 uppercase tracking-wide bg-gray-50 px-2 py-1 rounded-full">
                          {product.size}
                        </span>
                      </div>
                    </div>
                  </StyledCard>
                </Link>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <SlidersHorizontal className="w-8 h-8 text-charcoal/30" />
                </div>
                <h3 className="text-lg font-medium text-charcoal mb-2">No artworks found</h3>
                <p className="text-charcoal/50 max-w-sm mb-6">Try adjusting your filters or search query to find what you're looking for.</p>
                <button onClick={clearAllFilters} className="text-sm font-medium text-copper hover:text-copper/80 underline">
                  Clear all filters
                </button>
              </div>
            )}


            {/* Pagination Controls */}
            {filteredProducts.length > itemsPerPage && (
              <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Left: Page Count */}
                <span className="text-charcoal/60 text-sm font-medium">
                  Page {currentPage} of {Math.ceil(filteredProducts.length / itemsPerPage)}
                </span>

                {/* Center: Page Numbers */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                        currentPage === page
                          ? "bg-copper text-white shadow-md shadow-orange-100"
                          : "text-charcoal/70 hover:bg-gray-100"
                      )}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Right: Next Button */}
                <button
                  onClick={() => {
                    setCurrentPage(p => Math.min(Math.ceil(filteredProducts.length / itemsPerPage), p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
                  className="text-copper text-sm font-semibold uppercase tracking-wider hover:underline disabled:opacity-30 disabled:cursor-not-allowed disabled:no-underline transition-all"
                >
                  Next
                </button>
              </div>
            )}



          </div>
        </div>
      </main>

      {/* Custom Art Banner - Full Width */}
      <section className="container mx-auto px-6 mb-16">
        <div className="bg-[#F4F1EA] rounded-lg p-8 md:p-12 text-center border border-[#EBE5D9]">
          <h2 className="text-2xl md:text-3xl font-serif text-charcoal mb-4">
            Custom Art & Framing, Tailored to You
          </h2>
          <p className="text-charcoal/70 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            From concept to installation, we create bespoke artworks that embody your corporate identity, values, and vision.
          </p>
          <Link to="/custom-art">
            <button className="px-8 py-3 bg-charcoal text-white text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors shadow-lg rounded-sm">
              Start a Custom Request
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
