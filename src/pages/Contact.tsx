import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32">
        {/* Header */}
        <section className="container-premium pb-16">
          <p className="text-caption text-champagne mb-4 fade-in-up">Get in Touch</p>
          <h1 className="text-display text-cream mb-6 fade-in-up fade-in-up-delay-1">Contact Us</h1>
          <p className="text-subheadline max-w-2xl fade-in-up fade-in-up-delay-2">
            Have a question about our collections or interested in a corporate consultation? We'd love to hear from you.
          </p>
        </section>

        {/* Contact Content */}
        <section className="container-premium section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-serif text-cream mb-8">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-cream mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-charcoal border border-border rounded-sm px-4 py-3 text-cream placeholder:text-muted-foreground focus:outline-none focus:border-champagne/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cream mb-2">Work Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-charcoal border border-border rounded-sm px-4 py-3 text-cream placeholder:text-muted-foreground focus:outline-none focus:border-champagne/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-cream mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-charcoal border border-border rounded-sm px-4 py-3 text-cream placeholder:text-muted-foreground focus:outline-none focus:border-champagne/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cream mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-charcoal border border-border rounded-sm px-4 py-3 text-cream placeholder:text-muted-foreground focus:outline-none focus:border-champagne/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-cream mb-2">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-charcoal border border-border rounded-sm px-4 py-3 text-cream focus:outline-none focus:border-champagne/50 transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="corporate-inquiry">Corporate Inquiry</option>
                    <option value="custom-commission">Custom Commission</option>
                    <option value="bulk-order">Bulk Order</option>
                    <option value="art-consulting">Art Consulting</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-cream mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-charcoal border border-border rounded-sm px-4 py-3 text-cream placeholder:text-muted-foreground focus:outline-none focus:border-champagne/50 transition-colors resize-none"
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-serif text-cream mb-8">Contact Information</h2>
              
              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-champagne mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-cream font-medium mb-1">Address</h3>
                    <p className="text-cream-muted leading-relaxed">
                      Artéum Gallery<br />
                      42 Art District, Bandra West<br />
                      Mumbai, Maharashtra 400050
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-champagne mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-cream font-medium mb-1">Phone</h3>
                    <p className="text-cream-muted">+91 22 2600 4200</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-champagne mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-cream font-medium mb-1">Email</h3>
                    <p className="text-cream-muted">corporate@arteum.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-champagne mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-cream font-medium mb-1">Hours</h3>
                    <p className="text-cream-muted">
                      Monday – Friday: 10:00 AM – 7:00 PM<br />
                      Saturday: 11:00 AM – 5:00 PM<br />
                      Sunday: By appointment only
                    </p>
                  </div>
                </div>
              </div>

              {/* Corporate Services CTA */}
              <div className="p-8 bg-charcoal rounded-sm border border-border">
                <h3 className="text-xl font-serif text-cream mb-3">Corporate Consultations</h3>
                <p className="text-cream-muted text-sm leading-relaxed mb-6">
                  Schedule a private viewing or consultation with our corporate art specialists.
                </p>
                <a href="mailto:corporate@arteum.com" className="btn-secondary inline-block text-sm">
                  Schedule Consultation
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
