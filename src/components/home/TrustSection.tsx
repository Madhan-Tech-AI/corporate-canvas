import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Years of Excellence', value: 10, suffix: '+' },
  { label: 'Corporate Clients', value: 500, suffix: '+' },
  { label: 'Artworks Delivered', value: 2500, suffix: '+' },
  { label: 'Countries Served', value: 25, suffix: '' },
];

const testimonials = [
  {
    quote: "Artéum transformed our headquarters into a gallery of inspiration. Their understanding of corporate aesthetics is unparalleled.",
    author: 'Sarah Chen',
    title: 'Chief Design Officer',
    company: 'Meridian Capital',
  },
  {
    quote: "The custom commission process was seamless. They delivered artwork that perfectly embodies our brand identity.",
    author: 'Michael Torres',
    title: 'Managing Partner',
    company: 'Torres Architecture',
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = value / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function TrustSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-premium">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="text-4xl md:text-5xl font-serif text-copper mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-caption">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className={cn(
                'p-8 md:p-10 bg-warm-cream rounded-sm border border-border'
              )}
            >
              <blockquote className="text-foreground text-lg md:text-xl font-serif italic leading-relaxed mb-8">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <p className="text-foreground font-medium">{testimonial.author}</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {testimonial.title}, {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Client Logos */}
        <div className="mt-24">
          <p className="text-caption text-center mb-10">Trusted By Leading Corporations</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            {['Fortune 500', 'Design Studios', 'Architecture Firms', 'Tech Giants', 'Financial Services'].map(
              (client) => (
                <span key={client} className="text-foreground/60 text-sm tracking-widest uppercase">
                  {client}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
