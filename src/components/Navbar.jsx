import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import SearchOverlay from './SearchOverlay'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { useLockBody } from '../hooks/useLockBody'
import { getGsap, prefersReducedMotion } from '../animations/gsapConfig'

const NAV_LINKS = [
  { label: 'Shop All', to: '/shop' },
  { label: 'The Collection', to: '/shop?category=Signature%20Collection' },
  { label: 'Our Story', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const { totals, openCart } = useCart()
  const { count: wishlistCount } = useWishlist()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const menuCloseRef = useRef(null)
  const menuPanelRef = useRef(null)

  useLockBody(menuOpen)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    const timer = window.setTimeout(() => menuCloseRef.current?.focus(), 80)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(timer)
    }
  }, [menuOpen])

  // Stagger the mobile menu contents as the panel slides in. The panel itself
  // keeps its CSS transform transition so the drawer stays buttery on mobile.
  useEffect(() => {
    if (!menuOpen || prefersReducedMotion()) return undefined
    const lib = getGsap()
    if (!lib || !menuPanelRef.current) return undefined
    const { gsap } = lib

    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-mobile-link]',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.055, ease: 'power3.out', delay: 0.12 },
      )
      gsap.fromTo(
        '[data-mobile-meta]',
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', delay: 0.06 },
      )
      gsap.fromTo(
        '[data-mobile-footer]',
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.3 },
      )
    }, menuPanelRef.current)

    return () => context.revert()
  }, [menuOpen])

  const isLinkActive = (link) => {
    if (link.to === '/shop') return location.pathname === '/shop' && !location.search
    if (link.to.startsWith('/shop?')) {
      const target = new URLSearchParams(link.to.split('?')[1]).get('category')
      return (
        location.pathname === '/shop' &&
        new URLSearchParams(location.search).get('category') === target
      )
    }
    return location.pathname === link.to
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-500 ${
          scrolled
            ? 'border-line bg-bg/88 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/72'
            : 'border-transparent bg-bg'
        }`}
      >
        <div
          data-navbar-inner
          className="shell relative flex h-[68px] items-center justify-between gap-4 sm:h-[76px]"
        >
          <div data-nav-action className="flex items-center gap-1 lg:gap-0">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:text-accent lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-[19px] w-[19px]" strokeWidth={1.5} />
            </button>
            <Logo className="lg:flex-1" />
          </div>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                data-nav-link
                className="nav-link"
                aria-current={isLinkActive(link) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div data-nav-action className="flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:text-accent"
              aria-label="Search the collection"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>

            <ThemeToggle className="hidden sm:flex" />

            <Link
              to="/wishlist"
              className="relative hidden h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:text-accent sm:flex"
              aria-label={`Wishlist, ${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'}`}
            >
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {wishlistCount > 0 ? <span className="badge-count">{wishlistCount}</span> : null}
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="relative -mr-1 flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:text-accent sm:mr-0"
              aria-label={`Open bag, ${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'}`}
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {totals.itemCount > 0 ? <span className="badge-count">{totals.itemCount}</span> : null}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[90] lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen ? '' : undefined}
      >
        <div
          className={`absolute inset-0 bg-espresso/45 backdrop-blur-sm transition-opacity duration-500 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          ref={menuPanelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={`absolute inset-y-0 left-0 flex w-[86%] max-w-[380px] flex-col bg-bg shadow-2xl transition-transform duration-500 ease-luxe ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <Logo />
            <button
              ref={menuCloseRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-8" aria-label="Mobile">
            <p data-mobile-meta className="eyebrow mb-5">Explore the maison</p>
            <ul className="space-y-1">
              {NAV_LINKS.map((link, index) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    data-mobile-link
                    className="group flex items-baseline gap-3 border-b border-line/60 py-4 font-display text-3xl text-ink transition-colors hover:text-accent"
                  >
                    <span className="font-sans text-[9px] tracking-[0.2em] text-faint">
                      0{index + 1}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-1">
              <Link to="/track-order" data-mobile-link className="flex py-2 font-sans text-[11px] uppercase tracking-[0.18em] text-muted hover:text-accent">
                Track an order
              </Link>
              <Link to="/wishlist" data-mobile-link className="flex py-2 font-sans text-[11px] uppercase tracking-[0.18em] text-muted hover:text-accent">
                Wishlist ({wishlistCount})
              </Link>
              <Link to="/cart" data-mobile-link className="flex py-2 font-sans text-[11px] uppercase tracking-[0.18em] text-muted hover:text-accent">
                Your bag ({totals.itemCount})
              </Link>
            </div>
          </nav>

          <div data-mobile-footer className="flex items-center justify-between border-t border-line px-6 py-5">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted">
              Appearance
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
