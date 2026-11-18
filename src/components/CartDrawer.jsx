import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Check, ShoppingBag, Tag, Trash2, X } from 'lucide-react'
import QuantityStepper from './QuantityStepper'
import { useCart } from '../hooks/useCart'
import { useLockBody } from '../hooks/useLockBody'
import { formatCurrency } from '../utils/formatCurrency'
import { getGsap, prefersReducedMotion } from '../animations/gsapConfig'

export default function CartDrawer() {
  const {
    items,
    totals,
    coupon,
    couponError,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart()
  const [code, setCode] = useState('')
  const closeRef = useRef(null)
  const drawerRef = useRef(null)

  useLockBody(isCartOpen)

  useEffect(() => {
    if (!isCartOpen) return undefined
    const lib = getGsap()
    if (!lib || prefersReducedMotion() || !drawerRef.current) return undefined
    const { gsap } = lib

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ delay: 0.14, defaults: { ease: 'power3.out' } })
      timeline.from('[data-drawer-head]', { y: 12, opacity: 0, duration: 0.55 })
      const rows = drawerRef.current.querySelectorAll('[data-drawer-item]')
      if (rows.length) {
        timeline.from(
          rows,
          { y: 16, opacity: 0, duration: 0.55, stagger: 0.06 },
          '-=0.3',
        )
      }
      const foot = drawerRef.current.querySelector('[data-drawer-foot]')
      if (foot) {
        timeline.from(foot, { y: 12, opacity: 0, duration: 0.55 }, '-=0.35')
      }
    }, drawerRef)

    return () => context.revert()
  }, [isCartOpen])

  useEffect(() => {
    if (!isCartOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKeyDown)
    const timer = window.setTimeout(() => closeRef.current?.focus(), 90)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(timer)
    }
  }, [isCartOpen, closeCart])

  const handleCoupon = (event) => {
    event.preventDefault()
    if (applyCoupon(code)) setCode('')
  }

  const progress = Math.min(
    100,
    Math.round((totals.subtotal / totals.freeShippingThreshold) * 100),
  )

  return (
    <div
      className={`fixed inset-0 z-[92] ${isCartOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!isCartOpen}
      inert={!isCartOpen ? '' : undefined}
    >
      <div
        className={`absolute inset-0 bg-espresso/45 backdrop-blur-sm transition-opacity duration-500 ${
          isCartOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCart}
      />
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-bg shadow-2xl transition-transform duration-500 ease-luxe ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div data-drawer-head className="flex items-center justify-between border-b border-line px-5 py-5 sm:px-7">
          <div>
            <p className="eyebrow">Your selection</p>
            <h2 className="mt-1 font-display text-2xl text-ink">
              The Bag{' '}
              <span className="font-sans text-[11px] tracking-[0.12em] text-muted">
                ({totals.itemCount})
              </span>
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
            aria-label="Close bag"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {items.length > 0 ? (
          <div className="border-b border-line px-5 py-4 sm:px-7">
            <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-muted">
              {totals.remainingForFreeShipping > 0 ? (
                <>
                  You are {formatCurrency(totals.remainingForFreeShipping)} from complimentary
                  shipping
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-accent">
                  <Check className="h-3 w-3" strokeWidth={2} /> Complimentary shipping unlocked
                </span>
              )}
            </p>
            <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-accent transition-all duration-700 ease-luxe"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-5 sm:px-7" data-lenis-prevent>
          {items.length === 0 ? (
            <div data-drawer-item className="flex h-full flex-col items-center justify-center py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-line text-accent">
                <ShoppingBag className="h-6 w-6" strokeWidth={1.2} />
              </span>
              <p className="mt-6 font-display text-3xl text-ink">Your bag is empty.</p>
              <p className="mt-2 max-w-[240px] font-sans text-[12.5px] leading-relaxed text-muted">
                A quiet bag is a shame. Begin with our bestsellers, or build a box of your own.
              </p>
              <Link to="/shop" onClick={closeCart} className="btn btn-primary mt-7">
                Shop the collection
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line/70">
              {items.map((item) => (
                <li key={item.key} data-drawer-item className="flex gap-4 py-5">
                  <Link
                    to={item.kind === 'box' ? '/#build-your-box' : `/product/${item.productId}`}
                    onClick={closeCart}
                    className="shrink-0 overflow-hidden rounded-card bg-bg-soft"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-[86px] w-[72px] object-cover"
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={item.kind === 'box' ? '/#build-your-box' : `/product/${item.productId}`}
                          onClick={closeCart}
                          className="block truncate font-display text-[17px] leading-tight text-ink hover:text-accent"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 truncate font-sans text-[9px] uppercase tracking-[0.16em] text-muted">
                          {item.meta}
                        </p>
                      </div>
                      <span className="shrink-0 font-sans text-[12px] text-ink">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QuantityStepper
                        size="sm"
                        value={item.quantity}
                        onChange={(quantity) => updateQuantity(item.key, quantity)}
                        max={20}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="flex h-7 w-7 items-center justify-center text-muted transition-colors hover:text-accent"
                        aria-label={`Remove ${item.name} from bag`}
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.4} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <div data-drawer-foot className="border-t border-line bg-bg-soft/60 px-5 py-5 sm:px-7">
            <form onSubmit={handleCoupon} className="flex gap-2">
              <label htmlFor="drawer-coupon" className="sr-only">
                Coupon code
              </label>
              <div className="relative flex-1">
                <Tag
                  className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
                  strokeWidth={1.4}
                />
                <input
                  id="drawer-coupon"
                  type="text"
                  value={code}
                  onChange={(event) => setCode(event.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="field !py-2.5 !pl-9 !text-[11px] uppercase tracking-[0.1em]"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 rounded-card border border-line px-4 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Apply
              </button>
            </form>
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
              <p className="mt-2 font-sans text-[9px] tracking-[0.04em] text-faint">
                Try CRUMB10 for 10% off your first order.
              </p>
            )}

            <dl className="mt-4 space-y-1.5 font-sans text-[11.5px]">
              <div className="flex items-center justify-between text-muted">
                <dt>Subtotal</dt>
                <dd className="text-ink">{formatCurrency(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 ? (
                <div className="flex items-center justify-between text-accent">
                  <dt>Discount</dt>
                  <dd>−{formatCurrency(totals.discount)}</dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between text-muted">
                <dt>Shipping</dt>
                <dd className="text-ink">
                  {totals.shipping === 0 ? 'Complimentary' : formatCurrency(totals.shipping)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-2.5">
                <dt className="font-sans text-[10px] uppercase tracking-[0.18em] text-ink">Total</dt>
                <dd className="font-display text-2xl text-ink">{formatCurrency(totals.total)}</dd>
              </div>
            </dl>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link to="/cart" onClick={closeCart} className="btn btn-outline !px-4 !py-3">
                View bag
              </Link>
              <Link to="/checkout" onClick={closeCart} className="btn btn-primary !px-4 !py-3">
                Checkout <ArrowRight className="h-3 w-3" strokeWidth={1.6} />
              </Link>
            </div>
            <p className="mt-3 text-center font-sans text-[9px] uppercase tracking-[0.14em] text-faint">
              Taxes calculated at checkout · Demo store
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  )
}
