import { Link } from 'react-router'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import Logo from './Logo'
import Newsletter from './Newsletter'

const SHOP_LINKS = [
  { label: 'All cookies', to: '/shop' },
  { label: 'The Signature Collection', to: '/shop?category=Signature%20Collection' },
  { label: 'The Chocolate Edit', to: '/shop?category=Double%20Chocolate' },
  { label: 'Build your own box', to: '/#build-your-box' },
]

const MAISON_LINKS = [
  { label: 'Our story', to: '/about' },
  { label: 'Craftsmanship', to: '/about#craft' },
  { label: 'Contact', to: '/contact' },
  { label: 'Track an order', to: '/track-order' },
]

const CARE_LINKS = [
  { label: 'Shipping & delivery', to: '/contact#faq' },
  { label: 'Allergens & ingredients', to: '/contact#faq' },
  { label: 'Gift orders', to: '/contact' },
  { label: 'Wishlist', to: '/wishlist' },
]

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'Pinterest', href: 'https://www.pinterest.com/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/' },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg-soft">
      <div className="shell">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10 lg:py-20">
          <div data-footer-reveal className="max-w-sm">
            <Logo showTagline />
            <p className="mt-6 font-sans text-[12.5px] leading-relaxed text-muted">
              Small-batch cookies, made slowly in Paris. French butter, single-origin chocolate and
              a little patience — nothing more, nothing less.
            </p>
            <div className="mt-6 space-y-2.5 font-sans text-[11.5px] text-muted">
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={1.4} />
                14 Rue des Petits Pains, 75011 Paris
              </p>
              <a
                href="mailto:bonjour@maisoncrumb.com"
                className="flex items-center gap-2.5 transition-colors hover:text-accent"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={1.4} />
                bonjour@maisoncrumb.com
              </a>
              <a
                href="tel:+33145678910"
                className="flex items-center gap-2.5 transition-colors hover:text-accent"
              >
                <Phone className="h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={1.4} />
                +33 1 45 67 89 10
              </a>
            </div>
          </div>

          <nav data-footer-reveal aria-label="Shop">
            <p className="eyebrow">Shop</p>
            <ul className="mt-5 space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-sans text-[12px] text-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav data-footer-reveal aria-label="Maison">
            <p className="eyebrow">Maison</p>
            <ul className="mt-5 space-y-3">
              {MAISON_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-sans text-[12px] text-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav data-footer-reveal aria-label="Care">
            <p className="eyebrow">Care</p>
            <ul className="mt-5 space-y-3">
              {CARE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-sans text-[12px] text-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <p className="eyebrow mb-3">Follow</p>
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 font-sans text-[11px] text-muted transition-colors hover:text-accent"
                    >
                      {social.label}
                      <ArrowUpRight className="h-3 w-3" strokeWidth={1.4} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div data-footer-reveal className="border-t border-line py-10">
          <Newsletter compact className="max-w-md" />
        </div>

        <div data-footer-bar className="flex flex-col gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[9.5px] uppercase tracking-[0.18em] text-faint">
            © {new Date().getFullYear()} Maison Crumb · The Art of Perfect Cookies
          </p>
          <div className="flex flex-wrap items-center gap-4 font-sans text-[9px] uppercase tracking-[0.16em] text-faint">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
            <span>Apple Pay</span>
            <span className="hidden sm:inline">·</span>
            <span>Made in Paris</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
