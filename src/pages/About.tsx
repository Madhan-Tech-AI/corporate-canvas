import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/Reveal';
import { MapPin, Mail, Phone, Clock, ArrowRight } from 'lucide-react';

const philosophy = [
  {
    title: "Authenticity",
    text: "We believe in the power of original creation. Every brushstroke tells a story, and every canvas holds a piece of the artist's soul."
  },
  {
    title: "Transparency",
    text: "From the sourcing of sustainable materials to the final installation, our process is open, ethical, and rooted in integrity."
  },
  {
    title: "Connection",
    text: "Art is the bridge between human emotion and professional spaces. We curate pieces that spark conversation and inspire community."
  }
];

const team = [
  { name: 'Elena Vance', role: 'Founder & Lead Curator', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80' },
  { name: 'Marcus Chen', role: 'Head of Restoration', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sarah Jenkins', role: 'Art Advisor', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80' },
];

const studioImages = [
  "https://images.unsplash.com/photo-1456086272160-b28b3a456643?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1460661631189-a05e6b7e1909?auto=format&fit=crop&w=800&q=80"
];

export default function About() {
  return (
    <div className="min-h-screen bg-background text-charcoal">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="container-premium relative z-10">
            <Reveal>
              <span className="text-copper text-sm font-medium tracking-widest uppercase mb-4 block">
                Established 2015
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-display text-charcoal mb-8 max-w-4xl leading-tight">
                Artistry Rooted in <span className="text-copper italic">Passion</span> & Precision
              </h1>
              <p className="text-lg md:text-xl text-charcoal/70 max-w-2xl leading-relaxed px-4 md:px-0">
                Welcome to ARTEUM. We are more than a gallery; we are a collective of dreamers, creators, and curators dedicated to transforming spaces through the language of art.
              </p>
            </Reveal>
          </div>

          {/* Abstract Background Elements */}
          <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-5 pointer-events-none">
            <div className="absolute top-20 right-20 w-96 h-96 bg-copper rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-40 w-64 h-64 bg-charcoal rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* Studio Grid */}
        <section className="container-premium mb-24">
          <Reveal delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {studioImages.map((img, i) => (
                <div key={i} className={`relative overflow-hidden rounded-sm group ${i === 1 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                  <img
                    src={img}
                    alt="Studio glimpse"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 saturate-0 group-hover:saturate-100"
                  />
                  <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>
              ))}
            </div>
            <p className="text-right text-xs text-charcoal/40 mt-2 font-mono uppercase tracking-wider">
              Glimpses from our London Studio
            </p>
          </Reveal>
        </section>

        {/* Philosophy Section */}
        <section className="bg-charcoal text-white section-padding">
          <div className="container-premium">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <Reveal>
                  <h2 className="text-4xl font-serif mb-6">Our Philosophy</h2>
                  <p className="text-white/60 leading-relaxed mb-8">
                    In a world of mass production, we stand for the unique, the handmade, and the meaningful. We believe that art shouldn't just decorate a wall; it should define a space.
                  </p>
                  <div className="w-16 h-1 bg-copper"></div>
                </Reveal>
              </div>
              <div className="lg:col-span-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                  {philosophy.map((item, index) => (
                    <Reveal key={index} delay={index * 0.1}>
                      <div>
                        <span className="text-copper font-serif text-2xl mb-3 block">{item.title}</span>
                        <p className="text-white/70 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section-padding bg-warm-white">
          <div className="container-premium">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif text-charcoal mb-4">Meet the Makers</h2>
              <p className="text-charcoal/60">The hands and minds behind our curation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Reveal key={index} delay={index * 0.1}>
                  <div className="group text-center">
                    <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    <h3 className="text-xl font-serif text-charcoal mb-1">{member.name}</h3>
                    <p className="text-copper text-sm uppercase tracking-widest">{member.role}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Location & Contact */}
        <section className="py-24 border-t border-gray-100">
          <div className="container-premium">
            <Reveal>
              <div className="bg-charcoal text-white rounded-sm p-8 md:p-16 relative overflow-hidden">
                {/* Map Background Placeholder */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-0.1278,51.5074,12,0/1200x600')] bg-cover bg-center mix-blend-overlay"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-serif mb-6">Visit Our Studio</h2>
                    <p className="text-white/70 mb-8 max-w-md">
                      Experience our collection in person. We welcome visitors by appointment to ensure a personalized viewing experience.
                    </p>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-4">
                        <MapPin className="text-copper w-6 h-6 mt-1" />
                        <div>
                          <p className="text-white font-medium">ARTEUM Studio</p>
                          <p className="text-white/60">123 Creative Avenue, Design District</p>
                          <p className="text-white/60">London, UK EC1V 9AB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Clock className="text-copper w-6 h-6" />
                        <p className="text-white/60">Mon - Fri, 10:00 AM - 6:00 PM</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Phone className="text-copper w-6 h-6" />
                        <p className="text-white/60">+44 20 7123 4567</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Mail className="text-copper w-6 h-6" />
                        <p className="text-white/60">studio@arteum.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center lg:justify-end">
                    <button className="bg-white text-charcoal px-8 py-4 uppercase tracking-widest font-medium hover:bg-copper hover:text-white transition-colors flex items-center gap-3">
                      Book an Appointment
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
