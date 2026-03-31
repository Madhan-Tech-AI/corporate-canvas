import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import Reveal from '@/components/Reveal';

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
    <section className="relative min-h-[100dvh] pt-20 md:pt-24 flex items-center justify-center overflow-hidden bg-warm-cream">
      {/* Parallax Background Layers */}
      <div ref={parallaxRef} className="absolute inset-0 z-0">
        {/* Background Image */}


        {/* Abstract texture layer */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-copper/20 to-transparent blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-copper-light/15 to-transparent blur-3xl" />
        </div>

        {/* Geometric accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] h-[95vw] md:w-[800px] md:h-[800px] border border-copper/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[75vw] md:w-[600px] md:h-[600px] border border-copper/5 rounded-full" />
      </div>

      {/* Gradient Overlay - Darker for more drama */}
      <div className="absolute inset-0 bg-gradient-to-b from-warm-cream/80 via-warm-cream/90 to-warm-cream z-10" />

      {/* Content */}
      <div className="relative z-20 container-premium text-center">
        {/* Eyebrow */}
        <Reveal width="100%" delay={0.1}>
          <p className="text-[9px] md:text-xs uppercase tracking-[0.3em] text-copper mb-3 md:mb-8">
            The Art of Atmosphere
          </p>
        </Reveal>

        {/* Main Headline */}
        <Reveal width="100%" delay={0.3}>
          <h1 className="text-2xl sm:text-5xl md:text-7xl lg:text-8xl text-charcoal max-w-[80vw] md:max-w-4xl mx-auto font-serif tracking-tight leading-[1.2] md:leading-tight px-4 sm:px-0">
            Where Space <span className="italic text-copper">Meets Soul.</span>
          </h1>
        </Reveal>

        {/* Subheadline */}
        <Reveal width="100%" delay={0.5}>
          <p className="text-xs sm:text-base md:text-xl max-w-[80vw] md:max-w-xl mx-auto mt-3 md:mt-8 font-light text-charcoal/80 px-2 md:px-4">
            Transforming environments with curated artistry.
          </p>
        </Reveal>

        {/* CTAs */}
        <Reveal width="100%" delay={0.7}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 mt-6 md:mt-12 w-[80vw] sm:w-full mx-auto px-2 sm:px-0">
            <Link to="/collections" className="btn-primary text-xs md:text-sm py-2.5 md:py-3 w-full sm:w-auto min-w-[150px] md:min-w-[180px]">
              Explore Collection
            </Link>
            <Link to="/contact" className="w-full sm:w-auto text-center px-6 py-2.5 md:py-3 text-charcoal text-xs md:text-sm uppercase tracking-widest hover:text-copper transition-colors border-b border-transparent hover:border-copper">
              Advisory
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 z-20 scroll-indicator">
        <ChevronDown className="w-6 h-6 text-charcoal/40" />
      </div>
    </section>
  );
}
