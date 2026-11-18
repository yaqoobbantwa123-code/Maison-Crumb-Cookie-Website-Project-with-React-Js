import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import ProductGrid from '../components/ProductGrid'
import QuickView from '../components/QuickView'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { products } from '../data/products'
import giftBox from '../assets/editorial/gift-box.jpg'

export default function Wishlist() {
  const { products: savedProducts, count, clearWishlist } = useWishlist()
  const { addProduct, openCart } = useCart()
  const [quickView, setQuickView] = useState(null)

  const addAll = () => {
    savedProducts.forEach((product) => addProduct(product, 1, { open: false }))
    if (savedProducts.length > 0) openCart()
  }

  const suggestions = products.filter((product) => product.featured).slice(0, 4)

  if (count === 0) {
    return (
      <>
        <section className="shell py-16 lg:py-24">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.16em] text-faint">
            <Link to="/" className="hover:text-accent">
              Home
            </Link>
            <span>/</span>
            <span className="text-muted">Wishlist</span>
          </nav>

          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <p data-reveal="fade" className="eyebrow eyebrow-rule">
                Saved for later
              </p>
              <h1 data-reveal="heading" className="display-lg mt-5">
                A list of
                <br />
                <em className="font-light italic text-accent">good intentions.</em>
              </h1>
              <p
                data-reveal="fade"
                data-reveal-delay={0.08}
                className="mt-5 max-w-md font-sans text-[13px] leading-relaxed text-muted"
              >
                Your wishlist is empty. Tap the heart on any cookie to keep it here — it will still be
                waiting when you come back, even after you close the tab.
              </p>
              <div data-reveal="stagger" data-reveal-delay={0.1} className="mt-8 flex flex-wrap gap-3">
                <Link to="/shop" className="btn btn-primary">
                  Browse the collection <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                </Link>
                <Link to="/#build-your-box" className="btn btn-outline">
                  Build a box
                </Link>
              </div>
            </div>
            <div data-reveal="image" data-reveal-delay={0.08} className="media-frame aspect-[4/3] rounded-card">
              <img
                src={giftBox}
                alt="A ribboned MAISON CRUMB gift box"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-bg-soft">
          <div className="shell py-16">
            <div className="flex items-end justify-between">
              <div>
                <p data-reveal="fade" className="eyebrow">
                  Most saved
                </p>
                <h2 data-reveal="heading" className="display-md mt-3">
                  A good place to start.
                </h2>
              </div>
              <Link to="/shop" className="hidden font-sans text-[10px] uppercase tracking-[0.16em] text-muted hover:text-accent sm:block">
                View all
              </Link>
            </div>
            <div className="mt-10">
              <ProductGrid products={suggestions} onQuickView={setQuickView} />
            </div>
          </div>
        </section>

        <QuickView product={quickView} onClose={() => setQuickView(null)} />
      </>
    )
  }

  return (
    <>
      <section className="shell py-10 lg:py-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.16em] text-faint">
          <Link to="/" className="hover:text-accent">
            Home
          </Link>
          <span>/</span>
          <span className="text-muted">Wishlist</span>
        </nav>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p data-reveal="fade" className="eyebrow eyebrow-rule">
              Saved for later
            </p>
            <h1 data-reveal="heading" className="display-lg mt-4">
              Your wishlist{' '}
              <span className="font-sans text-base tracking-[0.1em] text-muted">({count})</span>
            </h1>
            <p
              data-reveal="fade"
              data-reveal-delay={0.08}
              className="mt-3 max-w-lg font-sans text-[12.5px] leading-relaxed text-muted"
            >
              Kept on this device. Tap the heart again to remove a cookie, or add the whole list to
              your bag at once.
            </p>
          </div>
          <div data-reveal="stagger" className="flex flex-wrap gap-2">
            <button type="button" onClick={addAll} className="btn btn-primary">
              <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.6} /> Add all to bag
            </button>
            <button type="button" onClick={clearWishlist} className="btn btn-outline">
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /> Clear
            </button>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-10">
          <ProductGrid products={savedProducts} onQuickView={setQuickView} columns={4} />
        </div>

        <div data-reveal className="mt-16 flex flex-col items-start justify-between gap-5 rounded-card border border-line bg-bg-soft/60 p-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Heart className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <div>
              <p className="font-display text-xl text-ink">A little indecision is allowed.</p>
              <p className="mt-1 max-w-lg font-sans text-[11.5px] leading-relaxed text-muted">
                If you cannot choose, our Signature Box gathers six of the recipes we are proudest of
                — a very good place to begin.
              </p>
            </div>
          </div>
          <Link to="/product/maison-signature" className="btn btn-outline shrink-0">
            The Signature Box
          </Link>
        </div>
      </section>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </>
  )
}
