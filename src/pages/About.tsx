import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';

const values = [
  {
    title: 'Curatorial Excellence',
    description: 'Every piece is carefully selected by our team of art specialists and curators.',
  },
  {
    title: 'Artisan Craftsmanship',
    description: 'We partner with master artisans who bring decades of expertise to each creation.',
  },
  {
    title: 'Corporate Understanding',
    description: 'We understand the unique requirements of executive and corporate environments.',
  },
  {
    title: 'White-Glove Service',
    description: 'From consultation to installation, we provide comprehensive support at every step.',
  },
];

const team = [
  { name: 'Priya Sharma', role: 'Founder & Creative Director', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { name: 'Arjun Mehta', role: 'Head of Corporate Relations', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { name: 'Meera Iyer', role: 'Chief Curator', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32">
        {/* Hero */}
        <section className="container-premium pb-24">
          <p className="text-caption text-champagne mb-4 fade-in-up">Our Story</p>
          <h1 className="text-display text-cream mb-8 fade-in-up fade-in-up-delay-1">
            Redefining Corporate Art
          </h1>
          <p className="text-subheadline max-w-3xl fade-in-up fade-in-up-delay-2">
            Since 2015, Artéum has been the trusted partner for discerning corporations, architects, and collectors seeking exceptional artworks that transform spaces and inspire excellence.
          </p>
        </section>

        {/* Vision */}
        <section className="bg-charcoal section-padding">
          <div className="container-premium">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-caption text-champagne mb-4">Our Vision</p>
                <h2 className="text-headline text-cream mb-6">
                  Art That Elevates Business
                </h2>
                <p className="text-cream-muted leading-relaxed mb-6">
                  We believe that exceptional art has the power to transform corporate environments, inspire teams, and communicate values. Our mission is to bridge the world of fine art with the demands of modern business.
                </p>
                <p className="text-cream-muted leading-relaxed">
                  Every artwork we curate is selected not just for its aesthetic excellence, but for its ability to resonate within professional settings—boardrooms, lobbies, executive offices, and beyond.
                </p>
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-sm">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                  alt="Modern corporate interior with art"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding">
          <div className="container-premium">
            <div className="text-center mb-16">
              <p className="text-caption text-champagne mb-4">Our Values</p>
              <h2 className="text-headline text-cream">What Sets Us Apart</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={value.title} className="text-center md:text-left">
                  <span className="text-5xl font-serif text-champagne/20 mb-4 block">
                    0{index + 1}
                  </span>
                  <h3 className="text-cream font-medium text-lg mb-3">{value.title}</h3>
                  <p className="text-cream-muted text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="bg-charcoal section-padding">
          <div className="container-premium">
            <div className="text-center mb-16">
              <p className="text-caption text-champagne mb-4">Leadership</p>
              <h2 className="text-headline text-cream">Our Team</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-cream font-serif text-lg mb-1">{member.name}</h3>
                  <p className="text-champagne-muted text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <h2 className="text-headline text-cream mb-6">Ready to Transform Your Space?</h2>
            <p className="text-subheadline max-w-xl mx-auto mb-10">
              Let our team of specialists help you find the perfect artworks for your corporate environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary">
                Schedule Consultation
              </Link>
              <Link to="/collections" className="btn-secondary">
                Explore Collections
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
