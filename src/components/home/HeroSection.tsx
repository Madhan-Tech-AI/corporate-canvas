import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian">
      {/* Parallax Background Layers */}
      <div ref={parallaxRef} className="absolute inset-0 z-0">
        {/* Abstract texture layer */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-champagne/10 to-transparent blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-champagne/5 to-transparent blur-3xl" />
        </div>

        {/* Geometric accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cream/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cream/3 rounded-full" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/50 via-obsidian/70 to-obsidian z-10" />

      {/* Content */}
      <div className="relative z-20 container-premium text-center">
        {/* Eyebrow */}
        <p className="text-caption text-champagne fade-in-up mb-6">
          Curated Excellence Since 2015
        </p>

        {/* Main Headline */}
        <h1 className="text-display text-cream fade-in-up fade-in-up-delay-1 max-w-5xl mx-auto">
          Curated Artifacts & Canvas Art for{' '}
          <span className="italic text-champagne">Corporate Excellence</span>
        </h1>

        {/* Subheadline */}
        <p className="text-subheadline fade-in-up fade-in-up-delay-2 max-w-2xl mx-auto mt-8">
          Premium artifacts and bespoke artworks crafted for boardrooms, offices, and corporate gifting.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 fade-in-up fade-in-up-delay-3">
          <Link to="/contact" className="btn-primary">
            Request Corporate Quote
          </Link>
          <Link to="/collections" className="btn-secondary">
            Explore Collections
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-8 mt-20 fade-in-up fade-in-up-delay-4">
          <div className="text-center">
            <p className="text-3xl font-serif text-champagne">500+</p>
            <p className="text-caption mt-1">Corporate Clients</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <p className="text-3xl font-serif text-champagne">10+</p>
            <p className="text-caption mt-1">Years Experience</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <p className="text-3xl font-serif text-champagne">2500+</p>
            <p className="text-caption mt-1">Artworks Delivered</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 scroll-indicator">
        <ChevronDown className="w-6 h-6 text-cream/40" />
      </div>
    </section>
  );
}
