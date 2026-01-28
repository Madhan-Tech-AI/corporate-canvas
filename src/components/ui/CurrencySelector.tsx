import { useCurrency } from '@/context/CurrencyContext';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function CurrencySelector() {
    const { currency, setCurrency } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currencies = ['INR', 'USD', 'EUR', 'GBP'] as const;

    // Close sorting dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-current hover:text-copper transition-colors duration-300 text-sm uppercase tracking-wide"
            >
                <Globe className="w-4 h-4" />
                <span>{currency}</span>
            </button>

            <div
                className={cn(
                    "absolute top-full right-0 mt-2 w-24 bg-white border border-gray-100 rounded-sm overflow-hidden shadow-xl transition-all duration-300 origin-top z-50",
                    isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                )}
            >
                {currencies.map((c) => (
                    <button
                        key={c}
                        onClick={() => {
                            setCurrency(c);
                            setIsOpen(false);
                        }}
                        className={cn(
                            "w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50",
                            currency === c ? "text-copper font-medium" : "text-charcoal/70 hover:text-charcoal"
                        )}
                    >
                        {c}
                    </button>
                ))}
            </div>
        </div>
    );
}
