import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container-premium max-w-3xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-serif text-charcoal mb-8">Terms of Service</h1>
          <p className="text-charcoal/70 mb-4">Last updated: March 30, 2026</p>
          
          <h2 className="text-2xl font-serif text-charcoal mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-charcoal/80 mb-4">
            By accessing and using Artéum, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-2xl font-serif text-charcoal mt-8 mb-4">2. Artwork Authentication</h2>
          <p className="text-charcoal/80 mb-4">
            We guarantee the authenticity of all artworks sold through our platform. All pieces undergo rigorous verification by our expert curators.
          </p>

          <h2 className="text-2xl font-serif text-charcoal mt-8 mb-4">3. Shipping Policy</h2>
          <p className="text-charcoal/80 mb-4">
            We provide white-glove delivery worldwide. Shipping costs are calculated at checkout based on destination and artwork dimensions. All shipments are fully insured.
          </p>

          <h2 className="text-2xl font-serif text-charcoal mt-8 mb-4">4. Returns & Refunds</h2>
          <p className="text-charcoal/80 mb-4">
            Returns are accepted within 14 days of delivery for pieces in their original condition. Custom commissions and bespoke alterations are strictly non-refundable.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
