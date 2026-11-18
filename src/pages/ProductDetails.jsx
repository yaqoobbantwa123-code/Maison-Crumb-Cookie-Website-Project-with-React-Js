import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react'
import QuantityStepper from '../components/QuantityStepper'
import RatingStars from '../components/RatingStars'
import ProductGrid from '../components/ProductGrid'
import QuickView from '../components/QuickView'
import ReviewCard from '../components/ReviewCard'
import { getProductById, getRelatedProducts, products } from '../data/products'
import { getProductReviews, getRatingBreakdown } from '../data/reviews'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
import { formatCurrency } from '../utils/formatCurrency'
import ingredientsImage from '../assets/editorial/ingredients.jpg'
import breakCookie from '../assets/editorial/break-cookie.jpg'

const TRUST = [
  { icon: Truck, title: 'Complimentary shipping over $60', copy: 'Baked to order, sent within 24 hours.' },
  { icon: Package, title: 'Wrapped by hand', copy: 'Every box is packed with a note from the kitchen.' },
  { icon: ShieldCheck, title: 'Freshness promised', copy: 'Best within ten days. Warm for twenty seconds.' },
]

export default function ProductDetails() {
  const { id } = useParams()
  const product = getProductById(id)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [quickView, setQuickView] = useState(null)
  const { addProduct } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const recentlyViewed = useRecentlyViewed(product?.id)

  const gallery = useMemo(() => {
    if (!product) return []
    return [
      { src: product.image, alt: `${product.name}, boxed`, label: 'The box' },
      { src: breakCookie, alt: 'A cookie broken in half to show the centre', label: 'The crumb' },
      { src: ingredientsImage, alt: 'Ingredients used in the MAISON CRUMB kitchen', label: 'The ingredients' },
    ]
  }, [product])

  const related = useMemo(
    () => (product ? getRelatedProducts(product, 4) : []),
    [product],
  )

  const alsoViewed = useMemo(
    () =>
      recentlyViewed
        .filter((viewedId) => viewedId !== product?.id)
        .map((viewedId) => products.find((entry) => entry.id === viewedId))
        .filter(Boolean)
        .slice(0, 4),
    [recentlyViewed, product?.id],
  )

  if (!product) {
    return (
      <section className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="eyebrow">404 · Not in the pantry</p>
        <h1 className="display-md mt-4">We could not find that cookie.</h1>
        <p className="mt-3 max-w-sm font-sans text-[13px] text-muted">
          It may have sold out, or the link may be a crumb of an older page. The full collection is
          only a click away.
        </p>
        <Link to="/shop" className="btn btn-primary mt-7">
          Shop all cookies
        </Link>
      </section>
    )
  }

  const saved = isWishlisted(product.id)
  const reviews = getProductReviews(product.id)
  const breakdown = getRatingBreakdown(product.rating, product.reviewCount)

  return (
    <>
      <section className="shell pb-16 pt-8 lg:pb-24">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-sans text-[9px] uppercase tracking-[0.16em] text-faint">
          <Link to="/" className="transition-colors hover:text-accent">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="transition-colors hover:text-accent">
            Shop
          </Link>
          <span>/</span>
          <span className="text-muted">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Gallery */}
          <div>
            <div data-reveal="image" className="media-frame aspect-[4/5]">
              <img
                src={gallery[activeImage]?.src}
                alt={gallery[activeImage]?.alt}
                className="h-full w-full object-cover"
                loading="eager"
              />
              {product.badge ? (
                <span className="absolute left-4 top-4 rounded-full bg-bg/90 px-3 py-1.5 font-sans text-[8.5px] font-semibold uppercase tracking-[0.18em] text-ink backdrop-blur-sm">
                  {product.badge}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={saved}
                aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-colors ${
                  saved
                    ? 'border-accent bg-accent text-white'
                    : 'border-white/50 bg-bg/80 text-ink hover:border-accent hover:text-accent'
                }`}
              >
                <Heart className="h-4 w-4" strokeWidth={1.5} fill={saved ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div data-reveal="stagger" className="mt-3 grid grid-cols-3 gap-3">
              {gallery.map((image, index) => (
                <button
                  key={image.label}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-pressed={activeImage === index}
                  aria-label={`View ${image.label}`}
                  className={`group relative aspect-[4/3] overflow-hidden rounded-card border-2 bg-bg-soft transition-colors ${
                    activeImage === index ? 'border-accent' : 'border-transparent hover:border-line'
                  }`}
                >
                  <img
                    src={image.src}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/60 to-transparent px-2 pb-1.5 pt-4 text-left font-sans text-[7.5px] uppercase tracking-[0.14em] text-ivory">
                    {image.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p data-reveal="fade" className="eyebrow">
              {product.category}
            </p>
            <h1
              data-reveal="heading"
              className="mt-2 font-display text-[clamp(2.5rem,4.5vw,3.6rem)] leading-[1.02] text-ink"
            >
              {product.name}
            </h1>
            <div
              data-reveal="fade"
              data-reveal-delay={0.08}
              className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2"
            >
              <RatingStars rating={product.rating} size="md" />
              <span className="font-sans text-[11px] text-ink">{product.rating}</span>
              <a href="#reviews" className="font-sans text-[10px] text-muted underline-offset-4 hover:text-accent hover:underline">
                {product.reviewCount} reviews
              </a>
              <span className="h-3 w-px bg-line" />
              <span
                className={`font-sans text-[9px] uppercase tracking-[0.14em] ${
                  product.availability === 'Low stock' ? 'text-accent' : 'text-muted'
                }`}
              >
                {product.availability}
              </span>
            </div>

            <p data-reveal="fade" data-reveal-delay={0.1} className="mt-5 font-display text-xl italic text-muted">
              {product.tagline}
            </p>
            <p
              data-reveal="fade"
              data-reveal-delay={0.14}
              className="mt-4 font-sans text-[13px] leading-relaxed text-muted"
            >
              {product.description}
            </p>

            <ul className="mt-5 flex flex-wrap gap-1.5">
              {product.notes.map((note) => (
                <li
                  key={note}
                  className="rounded-full border border-line px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.12em] text-muted"
                >
                  {note}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex items-end justify-between border-t border-line pt-6">
              <div>
                <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-faint">
                  {product.weight}
                </p>
                <p className="mt-1 font-display text-4xl leading-none text-ink">
                  {formatCurrency(product.price)}
                </p>
              </div>
              <QuantityStepper value={quantity} onChange={setQuantity} max={20} />
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => addProduct(product, quantity)}
                className="btn btn-primary flex-1"
              >
                <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.6} />
                Add to bag · {formatCurrency(product.price * quantity)}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                aria-pressed={saved}
                className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border transition-colors ${
                  saved
                    ? 'border-accent bg-accent text-white'
                    : 'border-line text-ink hover:border-accent hover:text-accent'
                }`}
              >
                <Heart className="h-4 w-4" strokeWidth={1.5} fill={saved ? 'currentColor' : 'none'} />
              </button>
            </div>

            <p className="mt-3 flex items-center gap-1.5 font-sans text-[9.5px] uppercase tracking-[0.12em] text-faint">
              <Sparkles className="h-3 w-3 text-accent" strokeWidth={1.5} />
              Complimentary shipping over $60 · Ships within 24 hours
            </p>

            <div className="mt-8">
              <details className="group border-t border-line py-4" open>
                <summary className="flex cursor-pointer list-none items-center justify-between font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
                  Ingredients
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-open:rotate-180" strokeWidth={1.5} />
                </summary>
                <p className="mt-3 font-sans text-[11.5px] leading-relaxed text-muted">
                  {product.ingredients.join(' · ')}.
                </p>
              </details>

              <details className="group border-t border-line py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
                  Allergens
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-open:rotate-180" strokeWidth={1.5} />
                </summary>
                <p className="mt-3 font-sans text-[11.5px] leading-relaxed text-muted">
                  {product.allergens}
                </p>
              </details>

              <details className="group border-y border-line py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
                  Storage & delivery
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-open:rotate-180" strokeWidth={1.5} />
                </summary>
                <div className="mt-3 space-y-2 font-sans text-[11.5px] leading-relaxed text-muted">
                  <p>{product.shelfLife}. Keep the box sealed at room temperature, away from direct sun.</p>
                  <p>
                    Baked to order on Tuesdays and Thursdays. Standard delivery is $6.95, or
                    complimentary over $60. Express delivery is available at checkout.
                  </p>
                  <p>Pairs beautifully with {product.pairing.toLowerCase()}.</p>
                </div>
              </details>
            </div>

            <ul className="mt-6 space-y-3">
              {TRUST.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.4} />
                  <div>
                    <p className="font-sans text-[10.5px] font-semibold text-ink">{item.title}</p>
                    <p className="font-sans text-[10px] text-muted">{item.copy}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="scroll-mt-24 border-y border-line bg-bg-soft">
        <div className="shell py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
            <div>
              <p data-reveal="fade" className="eyebrow eyebrow-rule">
                Guestbook
              </p>
              <h2 data-reveal="heading" className="display-md mt-4">
                What people say.
              </h2>
              <div data-reveal="fade" data-reveal-delay={0.08} className="mt-7 flex items-end gap-4">
                <p className="font-display text-6xl leading-none text-ink">{product.rating}</p>
                <div className="pb-1">
                  <RatingStars rating={product.rating} size="md" />
                  <p className="mt-1.5 font-sans text-[9px] uppercase tracking-[0.14em] text-muted">
                    {product.reviewCount} verified reviews
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {breakdown.map((row) => (
                  <div key={row.star} className="flex items-center gap-2.5">
                    <span className="w-7 font-sans text-[9px] tabular-nums text-muted">{row.star}★</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                    <span className="w-6 text-right font-sans text-[9px] tabular-nums text-faint">
                      {row.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div data-reveal="stagger" data-reveal-delay={0.08}>
              {reviews.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="surface-card flex h-full flex-col items-center justify-center p-10 text-center">
                  <RatingStars rating={product.rating} size="lg" />
                  <p className="mt-4 font-display text-2xl text-ink">No written notes for this recipe yet.</p>
                  <p className="mt-2 max-w-sm font-sans text-[12px] leading-relaxed text-muted">
                    The rating comes from verified orders. If you have tried this one, we would love
                    to hear what you thought.
                  </p>
                  <Link to="/contact" className="btn btn-outline mt-6">
                    Write to the maison
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="section-pad">
        <div className="shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p data-reveal="fade" className="eyebrow eyebrow-rule">
                Keep going
              </p>
              <h2 data-reveal="heading" className="display-md mt-4">
                You may also like.
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:text-accent"
            >
              Shop all <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          </div>
          <div className="mt-10">
            <ProductGrid products={related} onQuickView={setQuickView} columns={4} />
          </div>

          {alsoViewed.length > 0 ? (
            <div data-reveal className="mt-16 border-t border-line pt-10">
              <p className="eyebrow">Recently viewed</p>
              <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
                {alsoViewed.map((entry) => (
                  <Link key={entry.id} to={`/product/${entry.id}`} className="group flex items-center gap-3">
                    <img
                      src={entry.image}
                      alt={entry.name}
                      className="h-16 w-16 shrink-0 rounded-card object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-display text-lg leading-tight text-ink group-hover:text-accent">
                        {entry.name}
                      </p>
                      <p className="mt-0.5 font-sans text-[10px] text-muted">
                        {formatCurrency(entry.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </>
  )
}
