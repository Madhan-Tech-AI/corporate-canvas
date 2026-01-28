import Reveal from '@/components/Reveal';
import { ArrowRight } from 'lucide-react';

export default function Newsletter() {
    return (
        <section className="py-20 bg-warm-cream border-t border-copper/10">
            <div className="container-premium">
                <Reveal width="100%">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-serif text-charcoal mb-4">Stay Inspired</h2>
                        <p className="text-charcoal/60 mb-8">
                            Join our newsletter for daily art inspiration, market trends, and exclusive access to new collections.
                        </p>

                        <form className="flex flex-col sm:flex-row gap-3 relative">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 px-4 py-3 bg-white border border-gray-200 focus:border-copper outline-none transition-colors rounded-sm"
                            />
                            <button type="submit" className="btn-primary flex items-center justify-center gap-2">
                                Subscribe
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                        <p className="text-xs text-charcoal/40 mt-4">
                            By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
                        </p>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
