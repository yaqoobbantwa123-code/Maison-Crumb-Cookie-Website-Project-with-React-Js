import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Check, Heart, ShoppingBag, Tag, Trash2 } from 'lucide-react'
import QuantityStepper from '../components/QuantityStepper'
import ProductGrid from '../components/ProductGrid'
import QuickView from '../components/QuickView'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { featuredProducts } from '../data/products'
import { formatCurrency } from '../utils/formatCurrency'
import breakCookie from '../assets/editorial/break-cookie.jpg'

export default function Cart() {
  const {
    items,
    totals,
    coupon,
    couponError,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart()
  const { addToWishlist } = useWishlist()
  const [code, setCode] = useState('')
  const [quickView, setQuickView] = useState(null)

  const handleCoupon = (event) => {
    event.preventDefault()
    if (applyCoupon(code)) setCode('')
  }

  const saveForLater = (item) => {
    if (item.kind !== 'product') return
    addToWishlist(item.productId)
    removeItem(item.key)
  }

  const progress = Math.min(
    100,
    Math.round((totals.subtotal / totals.freeShippingThreshold) * 100),
  )

  if (items.length === 0) {
    return (
      <>
        <section className="shell py-16 lg:py-24">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.16em] text-faint">
            <Link to="/" className="hover:text-accent">
              Home
            </Link>
            <span>/</span>
            <span className="text-muted">Bag</span>
          </nav>

          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <p data-reveal="fade" className="eyebrow eyebrow-rule">
                Your selection
              </p>
              <h1 data-reveal="heading" className="display-lg mt-5">
                A quiet bag is
                <br />
                <em className="font-light italic text-accent">a shame.</em>
              </h1>
              <p
                data-reveal="fade"
                data-reveal-delay={0.08}
                className="mt-5 max-w-md font-sans text-[13px] leading-relaxed text-muted"
              >
                Nothing here yet. Begin with a bestseller, browse the full collection, or build a box
                of your own — six, nine or twelve cookies, chosen by you.
              </p>
              <div data-reveal="stagger" data-reveal-delay={0.1} className="mt-8 flex flex-wrap gap-3">
                <Link to="/shop" className="btn btn-primary">
                  Shop the collection <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                </Link>
                <Link to="/#build-your-box" className="btn btn-outline">
                  Build a box
                </Link>
              </div>
              <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
                {[
                  ['12', 'Recipes'],
                  ['72h', 'Dough rest'],
                  ['24h', 'Dispatch'],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="font-display text-2xl text-ink">{value}</p>
                    <p className="font-sans text-[8.5px] uppercase tracking-[0.16em] text-faint">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div data-reveal="image" data-reveal-delay={0.08} className="media-frame aspect-[4/3] rounded-card">
              <img
                src={breakCookie}
                alt="A MAISON CRUMB cookie broken to reveal a soft centre"
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
                  A place to begin
                </p>
                <h2 data-reveal="heading" className="display-md mt-3">
                  The bestsellers.
                </h2>
              </div>
              <Link to="/shop" className="hidden font-sans text-[10px] uppercase tracking-[0.16em] text-muted hover:text-accent sm:block">
                View all
              </Link>
            </div>
            <div className="mt-10">
              <ProductGrid products={featuredProducts.slice(0, 4)} onQuickView={setQuickView} />
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
          <span className="text-muted">Bag</span>
        </nav>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p data-reveal="fade" className="eyebrow eyebrow-rule">
              Your selection
            </p>
            <h1 data-reveal="heading" className="display-lg mt-4">
              Your bag <span className="font-sans text-base tracking-[0.1em] text-muted">({totals.itemCount})</span>
            </h1>
          </div>
          <Link to="/shop" className="link-line font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Continue shopping
          </Link>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          <div>
            <div className="border-b border-line pb-3">
              <div className="hidden grid-cols-[1fr_110px_110px_40px] gap-4 font-sans text-[8.5px] font-semibold uppercase tracking-[0.18em] text-faint sm:grid">
                <span>Item</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
                <span />
              </div>
            </div>

            <ul className="divide-y divide-line">
              {items.map((item, index) => (
                <li
                  key={item.key}
                  data-reveal
                  data-reveal-delay={index * 0.04}
                  className="grid gap-4 py-6 sm:grid-cols-[1fr_110px_110px_40px] sm:items-center"
                >
                  <div className="flex gap-4">
                    <Link
                      to={item.kind === 'box' ? '/#build-your-box' : `/product/${item.productId}`}
                      className="media-frame h-[110px] w-[92px] shrink-0 rounded-card"
                    >
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-col justify-center">
                      <p className="font-sans text-[8px] font-semibold uppercase tracking-[0.18em] text-faint">
                        {item.meta}
                      </p>
                      <Link
                        to={item.kind === 'box' ? '/#build-your-box' : `/product/${item.productId}`}
                        className="mt-1 font-display text-xl leading-tight text-ink hover:text-accent"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 font-sans text-[11px] text-muted">{formatCurrency(item.price)} each</p>
                      <div className="mt-2 flex flex-wrap items-center gap-4">
                        {item.kind === 'product' ? (
                          <button
                            type="button"
                            onClick={() => saveForLater(item)}
                            className="inline-flex items-center gap-1.5 font-sans text-[9px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-accent"
                          >
                            <Heart className="h-3 w-3" strokeWidth={1.5} /> Save for later
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          className="inline-flex items-center gap-1.5 font-sans text-[9px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-accent sm:hidden"
                        >
                          <Trash2 className="h-3 w-3" strokeWidth={1.5} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:justify-center">
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(quantity) => updateQuantity(item.key, quantity)}
                      max={20}
                    />
                  </div>

                  <p className="font-sans text-[13px] text-ink sm:text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className="hidden h-8 w-8 items-center justify-center justify-self-end text-muted transition-colors hover:text-accent sm:flex"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.4} />
                  </button>
                </li>
              ))}
            </ul>

            <div data-reveal="fade" className="mt-6 rounded-card border border-line bg-bg-soft/60 p-4">
              <p className="font-sans text-[11px] leading-relaxed text-muted">
                <span className="font-semibold text-ink">A note on freshness.</span> Every box is
                baked to order and dispatched within 24 hours. If your order includes a gift note, we
                will write it by hand.
              </p>
            </div>
          </div>

          {/* Summary */}
          <aside>
            <div data-reveal="fade" data-reveal-delay={0.08} className="surface-card sticky top-28 p-6">
              <h2 className="font-display text-2xl text-ink">Order summary</h2>

              <div className="mt-5">
                <div className="flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.12em]">
                  <span className="text-muted">
                    {totals.remainingForFreeShipping > 0
                      ? `${formatCurrency(totals.remainingForFreeShipping)} from free shipping`
                      : 'Free shipping unlocked'}
                  </span>
                  {totals.remainingForFreeShipping === 0 ? (
                    <Check className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
                  ) : null}
                </div>
                <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-700 ease-luxe"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <form onSubmit={handleCoupon} className="mt-6">
                <label htmlFor="cart-coupon" className="field-label">
                  Coupon
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" strokeWidth={1.4} />
                    <input
                      id="cart-coupon"
                      type="text"
                      value={code}
                      onChange={(event) => setCode(event.target.value.toUpperCase())}
                      placeholder="Enter a code"
                      className="field !py-2.5 !pl-9 !text-[11px] uppercase tracking-[0.1em]"
                      autoComplete="off"
                    />
                  </div>
                  <button type="submit" className="shrink-0 rounded-card border border-line px-4 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-accent hover:text-accent">
                    Apply
                  </button>
                </div>
                {couponError ? (
                  <p className="mt-2 font-sans text-[10px] text-red-700 dark:text-red-400" role="alert">
                    {couponError}
                  </p>
                ) : null}
                {coupon ? (
                  <div className="mt-2 flex items-center justify-between rounded-card bg-accent/10 px-3 py-2">
                    <p className="inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.12em] text-accent">
                      <Check className="h-3 w-3" strokeWidth={2} /> {coupon} applied
                    </p>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="font-sans text-[9px] uppercase tracking-[0.14em] text-muted hover:text-ink"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <p className="mt-2 font-sans text-[9px] tracking-[0.03em] text-faint">
                    Try CRUMB10, SWEET15 or FREESHIP.
                  </p>
                )}
              </form>

              <dl className="mt-6 space-y-2.5 border-t border-line pt-5 font-sans text-[12px]">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="text-ink">{formatCurrency(totals.subtotal)}</dd>
                </div>
                {totals.discount > 0 ? (
                  <div className="flex items-center justify-between text-accent">
                    <dt>Discount</dt>
                    <dd>−{formatCurrency(totals.discount)}</dd>
                  </div>
                ) : null}
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Shipping</dt>
                  <dd className="text-ink">
                    {totals.shipping === 0 ? 'Complimentary' : formatCurrency(totals.shipping)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-4">
                  <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
                    Total
                  </dt>
                  <dd className="font-display text-3xl text-ink">{formatCurrency(totals.total)}</dd>
                </div>
              </dl>

              <Link to="/checkout" className="btn btn-primary mt-5 w-full">
                Proceed to checkout <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
              </Link>

              <p className="mt-3 text-center font-sans text-[9px] uppercase tracking-[0.12em] text-faint">
                Taxes calculated at checkout
              </p>

              <div className="mt-5 flex items-start gap-2 border-t border-line pt-4">
                <ShoppingBag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={1.4} />
                <p className="font-sans text-[9.5px] leading-relaxed text-muted">
                  This is a front-end demo store. No payment is taken and no card details are
                  collected.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-bg-soft">
        <div className="shell py-14">
          <div className="flex items-end justify-between">
            <div data-reveal>
              <p className="eyebrow">One more thing</p>
              <h2 className="display-md mt-3">You may also like.</h2>
            </div>
            <Link to="/shop" className="hidden font-sans text-[10px] uppercase tracking-[0.16em] text-muted hover:text-accent sm:block">
              View all
            </Link>
          </div>
          <div className="mt-9">
            <ProductGrid products={featuredProducts.slice(0, 4)} onQuickView={setQuickView} />
          </div>
        </div>
      </section>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </>
  )
}
