import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const initialBagItems = [
  {
    id: 1,
    name: 'Bronze Meridian Sculpture',
    category: 'Artifacts',
    price: 245000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    name: 'Abstract Horizon No. 7',
    category: 'Canvas Paintings',
    price: 185000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=300&q=80',
  },
];

export default function Bag() {
  const [items, setItems] = useState(initialBagItems);

  const updateQuantity = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-24">
          <div className="container-premium text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-serif text-cream mb-4">Your Bag is Empty</h1>
            <p className="text-cream-muted mb-8">Explore our collections to find exceptional artworks.</p>
            <Link to="/collections" className="btn-primary inline-block">
              Explore Collections
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container-premium">
          <h1 className="text-3xl md:text-4xl font-serif text-cream mb-10">Shopping Bag</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 p-6 bg-charcoal rounded-sm border border-border"
                >
                  {/* Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-sm overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-caption text-champagne-muted mb-1">{item.category}</p>
                    <h3 className="text-cream font-serif text-lg mb-2 truncate">{item.name}</h3>
                    <p className="text-champagne font-medium">{formatPrice(item.price)}</p>

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 border border-border flex items-center justify-center text-cream hover:border-champagne transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-cream w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 border border-border flex items-center justify-center text-cream hover:border-champagne transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-charcoal rounded-sm border border-border p-6 sticky top-32">
                <h2 className="text-xl font-serif text-cream mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-cream-muted">Subtotal</span>
                    <span className="text-cream">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream-muted">GST (18%)</span>
                    <span className="text-cream">{formatPrice(gst)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream-muted">Shipping</span>
                    <span className="text-cream">Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between mb-8">
                  <span className="text-cream font-medium">Total</span>
                  <span className="text-champagne text-xl font-medium">{formatPrice(total)}</span>
                </div>

                <Link to="/checkout" className="block w-full btn-primary text-center">
                  Proceed to Checkout
                </Link>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Taxes and shipping calculated at checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
