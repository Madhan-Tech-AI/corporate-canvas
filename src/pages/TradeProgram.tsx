import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';

export default function TradeProgram() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(res => setTimeout(res, 1000));
    toast.success('Your application has been received. Our team will contact you shortly.');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container-premium">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-caption text-copper mb-4 uppercase tracking-widest">B2B Partnership</p>
              <h1 className="text-4xl md:text-5xl font-serif text-charcoal mb-6">
                Artéum Trade Program
              </h1>
              <p className="text-lg text-charcoal/70 mb-8 max-w-lg">
                Created specifically for interior designers, architects, and art consultants. Join our trade program to access exclusive benefits and sourcing capabilities for your clients.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-copper mt-2 shrink-0" />
                  <div>
                    <strong className="block text-charcoal mb-1">Trade Pricing</strong>
                    <span className="text-charcoal/70">Enjoy tiered trade discounts across our entire catalog.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-copper mt-2 shrink-0" />
                  <div>
                    <strong className="block text-charcoal mb-1">Dedicated Specialist</strong>
                    <span className="text-charcoal/70">Work one-on-one with a trade specialist for sourcing and logistics.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-copper mt-2 shrink-0" />
                  <div>
                    <strong className="block text-charcoal mb-1">Tax-Exempt Purchasing</strong>
                    <span className="text-charcoal/70">Streamlined checkout process for resale certificates.</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-charcoal p-8 md:p-12 text-white rounded-2xl relative overflow-hidden">
              <h3 className="text-2xl font-serif mb-6">Apply for Membership</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2 text-white/80">First Name</label>
                    <input required className="w-full bg-white/10 border border-white/20 rounded-none px-4 py-3 placeholder-white/30 text-white focus:outline-none focus:border-copper transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-white/80">Last Name</label>
                    <input required className="w-full bg-white/10 border border-white/20 rounded-none px-4 py-3 placeholder-white/30 text-white focus:outline-none focus:border-copper transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-white/80">Business Email</label>
                  <input type="email" required className="w-full bg-white/10 border border-white/20 rounded-none px-4 py-3 placeholder-white/30 text-white focus:outline-none focus:border-copper transition-colors" />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-white/80">Company Name</label>
                  <input required className="w-full bg-white/10 border border-white/20 rounded-none px-4 py-3 placeholder-white/30 text-white focus:outline-none focus:border-copper transition-colors" />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-white/80">Profession</label>
                  <select className="w-full bg-charcoal border border-white/20 rounded-none px-4 py-3 text-white focus:outline-none focus:border-copper transition-colors">
                    <option>Interior Designer</option>
                    <option>Architect</option>
                    <option>Art Consultant</option>
                    <option>Developer</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <button type="submit" disabled={isSubmitting} className="w-full bg-copper hover:bg-copper-dark text-white uppercase tracking-widest font-medium py-4 transition-colors">
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
