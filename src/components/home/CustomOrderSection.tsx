import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Submit Requirements',
    description: 'Share your vision, dimensions, and corporate branding guidelines.',
  },
  {
    number: '02',
    title: 'Collaborate',
    description: 'Work with our curators and artists to refine the concept.',
  },
  {
    number: '03',
    title: 'Approve',
    description: 'Review detailed mockups and material samples before production.',
  },
  {
    number: '04',
    title: 'Deliver',
    description: 'Professional installation and white-glove delivery to your location.',
  },
];

export default function CustomOrderSection() {
  return (
    <section className="section-padding bg-obsidian relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] border border-champagne rounded-full" />
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] border border-champagne rounded-full" />
      </div>

      <div className="container-premium relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <p className="text-caption text-champagne mb-4">Bespoke Commissions</p>
            <h2 className="text-headline text-cream mb-6">
              Custom Corporate Art,{' '}
              <span className="italic text-champagne">Tailored to You</span>
            </h2>
            <p className="text-subheadline mb-10">
              From concept to installation, we create bespoke artworks that embody your corporate identity, values, and vision.
            </p>
            <Link
              to="/custom-art"
              className="inline-flex items-center gap-3 btn-primary"
            >
              Start a Custom Request
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right - Process Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="flex items-start gap-6 group"
              >
                <span className="text-3xl font-serif text-champagne/30 group-hover:text-champagne transition-colors duration-300">
                  {step.number}
                </span>
                <div className="flex-1 border-b border-border pb-6">
                  <h4 className="text-cream font-medium text-lg mb-2 group-hover:text-champagne transition-colors duration-300">
                    {step.title}
                  </h4>
                  <p className="text-cream-muted text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
