import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { Building2, Gift, Palette, Users, Truck, Shield } from 'lucide-react';

const services = [
  {
    icon: Building2,
    title: 'Office Art Curation',
    description: 'Complete art solutions for corporate offices, from reception to boardrooms. We handle everything from selection to installation.',
  },
  {
    icon: Gift,
    title: 'Corporate Gifting',
    description: 'Distinctive art pieces for executive gifts, client appreciation, and milestone celebrations.',
  },
  {
    icon: Palette,
    title: 'Custom Commissions',
    description: 'Work with renowned artists to create bespoke pieces that embody your brand identity and values.',
  },
  {
    icon: Users,
    title: 'Art Consulting',
    description: 'Expert guidance on building and managing your corporate art collection for long-term value.',
  },
  {
    icon: Truck,
    title: 'White-Glove Delivery',
    description: 'Professional packing, shipping, and installation services with full insurance coverage.',
  },
  {
    icon: Shield,
    title: 'Art Investment Advisory',
    description: 'Strategic advice on art as an alternative investment asset for corporate portfolios.',
  },
];

const process = [
  { step: '01', title: 'Consultation', description: 'We begin with a detailed understanding of your space, brand, and requirements.' },
  { step: '02', title: 'Curation', description: 'Our specialists curate a selection of artworks tailored to your vision.' },
  { step: '03', title: 'Presentation', description: 'We present options with mockups showing how pieces will look in your space.' },
  { step: '04', title: 'Installation', description: 'Professional installation with attention to lighting, placement, and presentation.' },
];

export default function CorporateServices() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32">
        {/* Hero */}
        <section className="container-premium pb-24">
          <p className="text-caption text-champagne mb-4 fade-in-up">For Enterprise</p>
          <h1 className="text-display text-cream mb-6 fade-in-up fade-in-up-delay-1">
            Corporate Services
          </h1>
          <p className="text-subheadline max-w-2xl fade-in-up fade-in-up-delay-2">
            Comprehensive art solutions designed for corporations, architects, and interior designers.
          </p>
        </section>

        {/* Services Grid */}
        <section className="bg-charcoal section-padding">
          <div className="container-premium">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="p-8 bg-background border border-border rounded-sm hover:border-champagne/30 transition-colors duration-300"
                >
                  <service.icon className="w-10 h-10 text-champagne mb-6" />
                  <h3 className="text-cream font-serif text-xl mb-4">{service.title}</h3>
                  <p className="text-cream-muted text-sm leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding">
          <div className="container-premium">
            <div className="text-center mb-16">
              <p className="text-caption text-champagne mb-4">How We Work</p>
              <h2 className="text-headline text-cream">Our Process</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((item, index) => (
                <div key={item.step} className="relative">
                  <span className="text-6xl font-serif text-champagne/10 absolute -top-4 -left-2">
                    {item.step}
                  </span>
                  <div className="relative z-10 pt-8">
                    <h3 className="text-cream font-medium text-lg mb-3">{item.title}</h3>
                    <p className="text-cream-muted text-sm leading-relaxed">{item.description}</p>
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 w-full h-px bg-gradient-to-r from-border to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-charcoal section-padding">
          <div className="container-premium text-center">
            <h2 className="text-headline text-cream mb-6">Ready to Elevate Your Corporate Space?</h2>
            <p className="text-subheadline max-w-xl mx-auto mb-10">
              Schedule a consultation with our corporate art specialists today.
            </p>
            <Link to="/contact" className="btn-primary">
              Request Consultation
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
