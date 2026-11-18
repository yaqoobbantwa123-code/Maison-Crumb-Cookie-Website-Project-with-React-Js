import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import {
  ArrowRight,
  Check,
  ChefHat,
  Home,
  MapPin,
  Package,
  Search,
  Truck,
} from 'lucide-react'
import { formatCurrency } from '../utils/formatCurrency'
import { calculateCart } from '../utils/calculateCart'
import {
  addDays,
  findOrder,
  formatOrderDate,
} from '../utils/orders'
import { featuredProducts } from '../data/products'
import { getGsap, prefersReducedMotion } from '../animations/gsapConfig'

const STEPS = [
  {
    title: 'Order confirmed',
    copy: 'We have your order and the bakers have been told.',
    icon: Check,
  },
  {
    title: 'In the oven',
    copy: 'Your cookies are being baked in small batches.',
    icon: ChefHat,
  },
  {
    title: 'Packed by hand',
    copy: 'Cooled, wrapped and tucked into the box with a note.',
    icon: Package,
  },
  {
    title: 'On its way',
    copy: 'Handed to our courier with tracking.',
    icon: Truck,
  },
  {
    title: 'Delivered',
    copy: 'Left at your door, or with a neighbour.',
    icon: Home,
  },
]

const ORDER_PATTERN = /^MC-\d{6}-\d{4}$/

const buildSampleOrder = (number) => {
  const createdAt = addDays(new Date(), -2)
  const items = featuredProducts.slice(0, 2).map((product, index) => ({
    key: product.id,
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    meta: product.category,
    kind: 'product',
    quantity: index === 0 ? 1 : 1,
  }))
  const totals = calculateCart(items, null, { shippingMethod: 'standard' })
  return {
    id: number,
    demo: true,
    sample: true,
    createdAt: createdAt.toISOString(),
    estimatedDelivery: addDays(new Date(), 2).toISOString(),
    status: 'shipped',
    progress: 3,
    items,
    totals: {
      itemCount: totals.itemCount,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
      coupon: null,
    },
    customer: {
      firstName: 'Camille',
      lastName: 'Laurent',
      email: 'camille@example.com',
      phone: '+33 6 12 34 56 78',
      address: '14 Rue des Petits Pains',
      apartment: '',
      city: 'Paris',
      postalCode: '75011',
      country: 'France',
    },
    shippingMethod: 'standard',
    giftNote: '',
  }
}

const getProgress = (order) => {
  if (Number.isInteger(order.progress)) {
    return Math.min(4, Math.max(0, order.progress))
  }
  const created = new Date(order.createdAt).getTime()
  const hours = Math.max(0, Math.floor((Date.now() - created) / (1000 * 60 * 60)))
  return Math.min(4, Math.floor(hours / 12))
}

export default function OrderTracking() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const resultRef = useRef(null)

  useEffect(() => {
    if (!order) return undefined
    const lib = getGsap()
    if (!lib || prefersReducedMotion()) return undefined
    const { gsap } = lib

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline
        .from('[data-track-header]', { y: 16, opacity: 0, duration: 0.65 })
        .from(
          '[data-track-step]',
          { x: -14, opacity: 0, duration: 0.6, stagger: 0.08 },
          '-=0.3',
        )
        .from(
          '[data-track-meta]',
          { y: 14, opacity: 0, duration: 0.6, stagger: 0.07 },
          '-=0.5',
        )
    }, resultRef)

    return () => context.revert()
  }, [order])

  useEffect(() => {
    const param = searchParams.get('order')
    if (!param) return
    setOrderNumber(param)
    const found = findOrder(param, '')
    if (found) {
      setOrder(found)
      setSearched(true)
    } else if (ORDER_PATTERN.test(param.trim().toUpperCase())) {
      setOrder(buildSampleOrder(param.trim().toUpperCase()))
      setSearched(true)
    }
  }, [searchParams])

  const activeIndex = order ? getProgress(order) : 0
  const isDelivered = order ? activeIndex >= 4 : false

  const stepDates = useMemo(() => {
    if (!order) return []
    const created = new Date(order.createdAt)
    const plusHours = (hours) => new Date(created.getTime() + hours * 60 * 60 * 1000)
    return [
      created,
      plusHours(12),
      plusHours(24),
      plusHours(36),
      new Date(order.estimatedDelivery),
    ]
  }, [order])

  const submit = (event) => {
    event.preventDefault()
    const number = orderNumber.trim().toUpperCase()
    setSearched(true)

    if (!number) {
      setError('Enter your order number to continue.')
      setOrder(null)
      return
    }
    if (!ORDER_PATTERN.test(number)) {
      setError('Order numbers look like MC-261234-5678. Check the format and try again.')
      setOrder(null)
      return
    }

    const found = findOrder(number, email)
    if (found) {
      setOrder(found)
      setError('')
      setSearchParams({ order: number }, { replace: true })
      return
    }

    if (email.trim()) {
      setError('We could not match that order number and email in this browser.')
      setOrder(null)
      return
    }

    setError('')
    setOrder(buildSampleOrder(number))
    setSearchParams({ order: number }, { replace: true })
  }

  const reset = () => {
    setOrder(null)
    setSearched(false)
    setError('')
    setOrderNumber('')
    setEmail('')
    setSearchParams({}, { replace: true })
  }

  return (
    <>
      <section className="border-b border-line bg-bg-soft">
        <div className="shell py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.16em] text-faint">
            <Link to="/" className="hover:text-accent">
              Home
            </Link>
            <span>/</span>
            <span className="text-muted">Track order</span>
          </nav>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p data-reveal="fade" className="eyebrow eyebrow-rule">
                Where is my box?
              </p>
              <h1 data-reveal="heading" className="display-lg mt-5">
                Track your
                <br />
                <em className="font-light italic text-accent">order.</em>
              </h1>
            </div>
            <p data-reveal="fade" data-reveal-delay={0.08} className="max-w-sm font-sans text-[12.5px] leading-relaxed text-muted lg:pb-2">
              Enter the order number from your confirmation. Everything here is a front-end
              demonstration — tracking data is stored in this browser only.
            </p>
          </div>
        </div>
      </section>

      <section className="shell py-12 lg:py-16">
        <div className="mx-auto max-w-2xl">
          <div data-reveal="fade" className="surface-card p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
                <Search className="h-4 w-4" strokeWidth={1.5} />
              </span>
              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
                  Demo tracking
                </p>
                <p className="mt-1 font-sans text-[11px] leading-relaxed text-muted">
                  Use an order number from this browser, or try the sample below. No real courier
                  data is used.
                </p>
              </div>
            </div>

            <form onSubmit={submit} className="mt-6" noValidate>
              <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
                <div>
                  <label htmlFor="order-number" className="field-label">
                    Order number
                  </label>
                  <input
                    id="order-number"
                    type="text"
                    value={orderNumber}
                    onChange={(event) => setOrderNumber(event.target.value.toUpperCase())}
                    placeholder="MC-261234-5678"
                    className="field"
                    autoComplete="off"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'tracking-error' : undefined}
                  />
                </div>
                <div>
                  <label htmlFor="order-email" className="field-label">
                    Email <span className="normal-case tracking-normal text-faint">(optional)</span>
                  </label>
                  <input
                    id="order-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="field"
                    autoComplete="email"
                  />
                </div>
              </div>
              {error ? (
                <p id="tracking-error" role="alert" className="mt-3 font-sans text-[11px] text-red-700 dark:text-red-400">
                  {error}
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button type="submit" className="btn btn-primary">
                  Track order <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrderNumber('MC-240001-0042')
                    setEmail('')
                    setError('')
                    setOrder(buildSampleOrder('MC-240001-0042'))
                    setSearched(true)
                    setSearchParams({ order: 'MC-240001-0042' }, { replace: true })
                  }}
                  className="font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-accent hover:text-ink"
                >
                  Try a sample order
                </button>
                {order ? (
                  <button
                    type="button"
                    onClick={reset}
                    className="ml-auto font-sans text-[9px] uppercase tracking-[0.14em] text-muted hover:text-accent"
                  >
                    Track another
                  </button>
                ) : null}
              </div>
            </form>
          </div>

          {order ? (
            <div ref={resultRef} className="mt-8">
              <div className="surface-card overflow-hidden">
                <div
                  data-track-header
                  className="flex flex-col gap-4 border-b border-line bg-bg-soft/60 p-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-sans text-[8.5px] font-semibold uppercase tracking-[0.2em] text-faint">
                      Order
                    </p>
                    <p className="mt-1 font-sans text-[14px] tracking-[0.14em] text-ink">{order.id}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-sans text-[8.5px] font-semibold uppercase tracking-[0.2em] text-faint">
                      {isDelivered ? 'Delivered' : 'Estimated delivery'}
                    </p>
                    <p className="mt-1 font-display text-xl text-ink">
                      {formatOrderDate(order.estimatedDelivery)}
                    </p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 font-sans text-[8px] font-semibold uppercase tracking-[0.14em] text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {isDelivered ? 'Delivered' : STEPS[activeIndex].title}
                  </span>
                </div>

                {order.sample ? (
                  <div className="border-b border-line bg-accent/[0.05] px-6 py-3">
                    <p className="font-sans text-[10px] leading-relaxed text-muted">
                      This is a sample tracking view for a demo order number. Place a demo order at
                      checkout to see your own details here.
                    </p>
                  </div>
                ) : null}

                <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <p className="eyebrow mb-5">The journey</p>
                    <ol className="relative space-y-0">
                      {STEPS.map((step, index) => {
                        const done = index < activeIndex || isDelivered
                        const active = index === activeIndex && !isDelivered
                        const Icon = step.icon
                        return (
                          <li
                            key={step.title}
                            data-track-step
                            className="relative flex gap-4 pb-7 last:pb-0"
                          >
                            {index < STEPS.length - 1 ? (
                              <span
                                aria-hidden="true"
                                className={`absolute left-[15px] top-8 h-[calc(100%-20px)] w-px ${
                                  index < activeIndex ? 'bg-accent' : 'bg-line'
                                }`}
                              />
                            ) : null}
                            <span
                              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                                done
                                  ? 'border-accent bg-accent text-white'
                                  : active
                                    ? 'border-accent bg-bg text-accent'
                                    : 'border-line bg-bg text-faint'
                              }`}
                            >
                              {done ? (
                                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                              ) : (
                                <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                              )}
                            </span>
                            <div className="pt-0.5">
                              <div className="flex flex-wrap items-baseline gap-x-3">
                                <p
                                  className={`font-sans text-[11px] font-semibold uppercase tracking-[0.12em] ${
                                    done || active ? 'text-ink' : 'text-faint'
                                  }`}
                                >
                                  {step.title}
                                </p>
                                <p className="font-sans text-[9px] text-faint">
                                  {formatOrderDate(stepDates[index])}
                                </p>
                              </div>
                              <p className="mt-1 font-sans text-[10.5px] leading-relaxed text-muted">
                                {step.copy}
                              </p>
                            </div>
                          </li>
                        )
                      })}
                    </ol>
                  </div>

                  <div data-track-meta className="space-y-5">
                    <div>
                      <p className="eyebrow mb-2 text-[8px]">Delivering to</p>
                      <p className="flex items-start gap-2 font-sans text-[11px] leading-relaxed text-muted">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={1.4} />
                        <span>
                          {order.customer.firstName} {order.customer.lastName}
                          <br />
                          {order.customer.address}
                          {order.customer.apartment ? `, ${order.customer.apartment}` : ''}
                          <br />
                          {order.customer.city}, {order.customer.postalCode}
                          <br />
                          {order.customer.country}
                        </span>
                      </p>
                    </div>

                    <div className="border-t border-line pt-4">
                      <p className="eyebrow mb-2 text-[8px]">In this box</p>
                      <ul className="space-y-2">
                        {order.items.map((item) => (
                          <li key={item.key} className="flex items-center gap-2.5">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-9 w-9 rounded-card object-cover"
                            />
                            <span className="min-w-0 flex-1 truncate font-sans text-[10.5px] text-ink">
                              {item.name}
                            </span>
                            <span className="font-sans text-[9px] text-faint">×{item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-line pt-4">
                      <div className="flex items-baseline justify-between">
                        <span className="font-sans text-[9px] uppercase tracking-[0.14em] text-muted">
                          Total
                        </span>
                        <span className="font-display text-2xl text-ink">
                          {formatCurrency(order.totals.total)}
                        </span>
                      </div>
                      <p className="mt-1 font-sans text-[9px] text-faint">
                        {order.totals.itemCount} {order.totals.itemCount === 1 ? 'item' : 'items'} ·{' '}
                        {order.shippingMethod === 'express' ? 'Express delivery' : 'Standard delivery'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-card border border-line p-5 sm:flex-row sm:items-center">
                <p className="font-sans text-[11px] leading-relaxed text-muted">
                  Something not quite right? Write to the maison and we will look after it.
                </p>
                <Link to="/contact" className="btn btn-outline shrink-0">
                  Contact us
                </Link>
              </div>
            </div>
          ) : searched && !error ? (
            <p className="mt-6 text-center font-sans text-[11px] text-muted">
              Enter an order number above to see its journey.
            </p>
          ) : null}

          <div data-reveal="fade" className="mt-10 border-t border-line pt-8">
            <p className="eyebrow">A note on this page</p>
            <p className="mt-3 font-sans text-[11px] leading-relaxed text-muted">
              MAISON CRUMB is a portfolio demonstration. Orders placed here are stored only in your
              browser&apos;s local storage, are not sent anywhere, and do not trigger a real shipment.
              The tracking timeline is generated for demonstration purposes.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
