import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatPrice: (priceInInr: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const RATES: Record<Currency, number> = {
    INR: 1,
    USD: 0.012, // 1 INR = 0.012 USD (Approx 1 USD = 83.3 INR)
    EUR: 0.011, // 1 INR = 0.011 EUR
    GBP: 0.0095, // 1 INR = 0.0095 GBP
};

const SYMBOLS: Record<Currency, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('INR');

    const formatPrice = (priceInInr: number) => {
        const rate = RATES[currency];
        const value = priceInInr * rate;

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
