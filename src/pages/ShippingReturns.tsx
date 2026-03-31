import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ShippingReturns() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container-premium max-w-3xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-serif text-charcoal mb-8">Shipping & Returns</h1>
          
          <h2 className="text-2xl font-serif text-charcoal mt-8 mb-4">Shipping Policy</h2>
          <p className="text-charcoal/80 mb-4">
            We offer complimentary white-glove shipping on all bespoke and premium-tier artwork collections worldwide. All shipments are securely crated in museum-grade packaging and fully insured up to their full retail value against loss or transit damage.
          </p>
          <ul className="text-charcoal/80 mb-4 list-disc pl-6 space-y-2">
            <li>Domestic shipping generally takes 5-7 business days.</li>
            <li>International shipping takes 10-14 business days, depending on customs clearance.</li>
            <li>Custom commissions require an additional 2-3 weeks of preparation prior to dispatch.</li>
          </ul>

          <h2 className="text-2xl font-serif text-charcoal mt-8 mb-4">Return Policy</h2>
          <p className="text-charcoal/80 mb-4">
            If you are not entirely satisfied with your acquisition, Artéum offers a 14-day return window from the date of final delivery.
          </p>
          <ul className="text-charcoal/80 mb-4 list-disc pl-6 space-y-2">
            <li>Items must be returned in their original condition and authentic museum packaging.</li>
            <li>Custom framing requests, uniquely commissioned pieces, and limited edition drops sold out at the time of purchase are strictly non-refundable.</li>
            <li>A 10% restocking fee applies to all international returns to cover customs handling.</li>
          </ul>

          <h2 className="text-2xl font-serif text-charcoal mt-8 mb-4">Damaged Goods</h2>
          <p className="text-charcoal/80 mb-4">
            In the highly unlikely event that your artwork arrives damaged, please document the packaging condition immediately and contact our concierge service within 48 hours for an expedited response.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
