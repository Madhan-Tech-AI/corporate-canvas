import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container-premium max-w-3xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-serif text-charcoal mb-8">Privacy Policy</h1>
          <p className="text-charcoal/70 mb-4">Last updated: March 30, 2026</p>
          
          <h2 className="text-2xl font-serif text-charcoal mt-8 mb-4">Information Collection</h2>
          <p className="text-charcoal/80 mb-4">
            We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This includes your name, email address, postal address, and payment information.
          </p>

          <h2 className="text-2xl font-serif text-charcoal mt-8 mb-4">Use of Information</h2>
          <p className="text-charcoal/80 mb-4">
            We use the information we collect to process your transactions, personalize your art discovery experience, and provide customer support.
          </p>

          <h2 className="text-2xl font-serif text-charcoal mt-8 mb-4">Information Sharing</h2>
          <p className="text-charcoal/80 mb-4">
            We do not sell your personal information. We may share information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you.
          </p>
          
          <h2 className="text-2xl font-serif text-charcoal mt-8 mb-4">Data Security</h2>
          <p className="text-charcoal/80 mb-4">
            We implement industry-standard security measures to maintain the safety of your personal information. All payment transactions are processed through a secure gateway provider.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
