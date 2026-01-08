import { Link } from 'react-router-dom';

const footerLinks = {
  collections: [
    { name: 'Artifacts', href: '/artifacts' },
    { name: 'Canvas Paintings', href: '/canvas-paintings' },
    { name: 'Custom Art', href: '/custom-art' },
    { name: 'Limited Editions', href: '/collections' },
  ],
  corporate: [
    { name: 'Corporate Services', href: '/corporate-services' },
    { name: 'Bulk Orders', href: '/corporate-services' },
    { name: 'Custom Commissions', href: '/custom-art' },
    { name: 'Art Consulting', href: '/corporate-services' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/about' },
    { name: 'Press', href: '/about' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Shipping Policy', href: '/terms' },
    { name: 'Returns', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-charcoal-light">
      <div className="container-premium section-padding">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-warm-white font-serif text-2xl tracking-wide">
              ARTÉUM
            </Link>
            <p className="text-warm-white/60 text-sm mt-4 leading-relaxed max-w-xs">
              Curating exceptional artifacts and canvas art for discerning corporate spaces since 2015.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-caption text-warm-white mb-6">Collections</h4>
            <ul className="space-y-3">
              {footerLinks.collections.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-warm-white/60 text-sm hover:text-copper-light transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-caption text-warm-white mb-6">Corporate</h4>
            <ul className="space-y-3">
              {footerLinks.corporate.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-warm-white/60 text-sm hover:text-copper-light transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-caption text-warm-white mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-warm-white/60 text-sm hover:text-copper-light transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-caption text-warm-white mb-6">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-warm-white/60 text-sm hover:text-copper-light transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-warm-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-warm-white/50 text-sm">
            © {new Date().getFullYear()} Artéum. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-warm-white/50 hover:text-copper-light text-sm transition-colors duration-300"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-warm-white/50 hover:text-copper-light text-sm transition-colors duration-300"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-warm-white/50 hover:text-copper-light text-sm transition-colors duration-300"
            >
              Pinterest
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
