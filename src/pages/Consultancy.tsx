import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { Palette, Globe, Search } from 'lucide-react';

export default function Consultancy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32">
        <section className="container-premium pb-24 text-center max-w-4xl mx-auto">
          <p className="text-caption text-copper mb-4 uppercase tracking-widest">Advisory Services</p>
          <h1 className="text-4xl md:text-5xl lg:text-display font-serif text-charcoal mb-6">
            Private Art Consultancy
          </h1>
          <p className="text-lg text-charcoal/70 mb-10 leading-relaxed">
            Personalized guidance for discerning collectors. Our expert advisors navigate the global art market to help you build a collection of lasting cultural and financial significance.
          </p>
        </section>

        <section className="bg-charcoal text-white section-padding">
          <div className="container-premium">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <Search className="w-12 h-12 text-copper mb-6" />
                <h3 className="text-xl font-serif mb-4">Sourcing & Acquisition</h3>
                <p className="text-white/70">Access to rare, off-market pieces globally through our exclusive network of galleries and private estates.</p>
              </div>
              <div className="flex flex-col items-center">
                <Palette className="w-12 h-12 text-copper mb-6" />
                <h3 className="text-xl font-serif mb-4">Collection Curation</h3>
                <p className="text-white/70">Strategic development of your portfolio, reflecting your aesthetic vision while ensuring cohesive growth.</p>
              </div>
              <div className="flex flex-col items-center">
                <Globe className="w-12 h-12 text-copper mb-6" />
                <h3 className="text-xl font-serif mb-4">Market Intelligence</h3>
                <p className="text-white/70">Deep market analysis, provenance tracking, and investment forecasting to guide confident acquisitions.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding text-center">
          <div className="container-premium max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif text-charcoal mb-6">Begin Your Journey</h2>
            <p className="text-charcoal/70 mb-10">Connect with an Artéum advisor to discuss your collecting ambitions.</p>
            <Link to="/contact" className="btn-primary inline-flex">
              Request Advisory
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
