import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface BagItem {
    id: number;
    name: string;
    price: number;
    image: string;
    category?: string;
    artist?: string;
    quantity: number;
}

interface BagContextType {
    bag: BagItem[];
    addToBag: (item: Omit<BagItem, 'quantity'>) => void;
    removeFromBag: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    isInBag: (id: number) => boolean;
    bagCount: number;
    clearBag: () => void;
    getTotalAmount: () => number;
}

const BagContext = createContext<BagContextType | undefined>(undefined);

export function BagProvider({ children }: { children: ReactNode }) {
    const [bag, setBag] = useState<BagItem[]>(() => {
        const saved = localStorage.getItem('arteum-bag');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('arteum-bag', JSON.stringify(bag));
    }, [bag]);

    const addToBag = (item: Omit<BagItem, 'quantity'>) => {
        setBag(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                toast.message('Item already in bag');
                return prev.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            toast.success('Added to bag');
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromBag = (id: number) => {
        setBag(prev => prev.filter(item => item.id !== id));
        toast.message('Removed from bag');
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) {
            removeFromBag(id);
            return;
        }
        setBag(prev => prev.map(item =>
            item.id === id ? { ...item, quantity } : item
        ));
    };

    const isInBag = (id: number) => {
        return bag.some(item => item.id === id);
    };

    const clearBag = () => {
        setBag([]);
        toast.message('Bag cleared');
    };

    const getTotalAmount = () => {
        return bag.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <BagContext.Provider value={{
            bag,
            addToBag,
            removeFromBag,
            updateQuantity,
            isInBag,
            bagCount: bag.reduce((sum, item) => sum + item.quantity, 0),
            clearBag,
            getTotalAmount,
        }}>
            {children}
        </BagContext.Provider>
    );
}

export function useBag() {
    const context = useContext(BagContext);
    if (context === undefined) {
        throw new Error('useBag must be used within a BagProvider');
    }
    return context;
}
