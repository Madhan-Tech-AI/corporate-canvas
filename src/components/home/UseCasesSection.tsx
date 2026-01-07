import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const useCases = [
  {
    id: 1,
    title: 'Office Interiors',
    description: 'Transform corporate spaces with curated art that inspires and impresses.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Corporate Gifting',
    description: 'Distinctive gifts for clients and partners that leave lasting impressions.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Brand-Aligned Décor',
    description: 'Custom artworks that embody your corporate identity and values.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  },
];

export default function UseCasesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = parseInt(entry.target.getAttribute('data-id') || '0');
            setVisibleCards((prev) => [...prev, id]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = sectionRef.current?.querySelectorAll('[data-id]');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-charcoal">
      <div className="container-premium">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-caption text-champagne mb-4">Use Cases</p>
          <h2 className="text-headline text-cream">Designed for Corporate Excellence</h2>
          <p className="text-subheadline mt-4 max-w-2xl mx-auto">
            From executive offices to reception areas, our collections elevate every corporate environment.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={useCase.id}
              data-id={useCase.id}
              className={cn(
                'group relative overflow-hidden rounded-sm transition-all duration-700 ease-premium',
                visibleCards.includes(useCase.id)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-12 opacity-0'
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image Container */}
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={useCase.image}
                  alt={useCase.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-premium"
                />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-serif text-cream mb-2">{useCase.title}</h3>
                <p className="text-cream-muted text-sm leading-relaxed">{useCase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
