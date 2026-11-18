import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Lock,
  Mail,
  MapPin,
  Package,
  ShoppingBag,
  Tag,
  Truck,
  Zap,
} from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { calculateCart } from '../utils/calculateCart'
import { formatCurrency } from '../utils/formatCurrency'
import {
  addDays,
  createOrderNumber,
  formatOrderDate,
  saveOrder,
} from '../utils/orders'
import { getGsap, prefersReducedMotion } from '../animations/gsapConfig'

const COUNTRIES = [
  'France',
  'United Kingdom',
  'United States',
  'Canada',
  'Germany',
  'Italy',
  'Spain',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Sweden',
  'Denmark',
  'Norway',
  'Ireland',
  'Portugal',
  'Australia',
  'Japan',
  'Singapore',
]

const checkoutSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address.')
    .email('Enter a valid email address.'),
  firstName: z.string().trim().min(2, 'Enter your first name.'),
  lastName: z.string().trim().min(2, 'Enter your last name.'),
  phone: z
    .string()
    .trim()
    .min(7, 'Enter a phone number we can reach you on.')
    .regex(/^[+()\d\s-]+$/, 'Use digits, spaces, +, - or brackets.'),
  address: z.string().trim().min(4, 'Enter your street address.'),
  apartment: z.string().trim().max(40, 'Please keep this under 40 characters.'),
  city: z.string().trim().min(2, 'Enter your city.'),
  postalCode: z
    .string()
    .trim()
    .min(3, 'Enter your postal code.')
    .max(12, 'That postal code looks too long.'),
  country: z.string().min(2, 'Choose a country.'),
  shippingMethod: z.enum(['standard', 'express']),
  giftNote: z.string().trim().max(200, 'Please keep the note under 200 characters.'),
  terms: z
    .boolean()
    .refine((value) => value === true, 'Please confirm you understand this is a demo.'),
})

const defaultValues = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  apartment: '',
  city: '',
  postalCode: '',
  country: 'France',
  shippingMethod: 'standard',
  giftNote: '',
  terms: false,
}

function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-1.5 font-sans text-[10px] text-red-700 dark:text-red-400">
      {message}
    </p>
  )
}

function SectionTitle({ number, title, copy }) {
  return (
    <div className="mb-5 flex items-start gap-4">
      <span className="mt-1 font-sans text-[9px] font-semibold tracking-[0.2em] text-accent">
        {number}
      </span>
      <div>
        <h2 className="font-display text-2xl text-ink">{title}</h2>
        {copy ? <p className="mt-1 font-sans text-[11px] text-muted">{copy}</p> : null}
      </div>
    </div>
  )
}

export default function Checkout() {
  const {
    items,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart()
  const [placedOrder, setPlacedOrder] = useState(null)
  const [couponInput, setCouponInput] = useState('')
  const [orderError, setOrderError] = useState('')
  const confirmationRef = useRef(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched',
    defaultValues,
  })

  const shippingMethod = watch('shippingMethod')

  useEffect(() => {
    if (!placedOrder) return undefined
    const lib = getGsap()
    if (!lib || prefersReducedMotion()) return undefined
    const { gsap } = lib

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline
        .from('[data-confirm-badge]', {
          scale: 0.55,
          opacity: 0,
          duration: 0.7,
          ease: 'back.out(1.7)',
        })
        .from(
          '[data-confirm-item]',
          { y: 22, opacity: 0, duration: 0.85, stagger: 0.075 },
          '-=0.35',
        )
        .from(
          '[data-confirm-card]',
          { y: 20, opacity: 0, duration: 0.75, stagger: 0.07 },
          '-=0.45',
        )
        .from('[data-confirm-actions] > *', { y: 14, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.3')
    }, confirmationRef)

    return () => context.revert()
  }, [placedOrder])

  const standardTotals = useMemo(
    () => calculateCart(items, coupon, { shippingMethod: 'standard' }),
    [items, coupon],
  )
  const expressTotals = useMemo(
    () => calculateCart(items, coupon, { shippingMethod: 'express' }),
    [items, coupon],
  )
  const totals = shippingMethod === 'express' ? expressTotals : standardTotals

  useEffect(() => {
    if (placedOrder) window.scrollTo({ top: 0, behavior: 'auto' })
  }, [placedOrder])

  const onSubmit = (values) => {
    if (items.length === 0) {
      setOrderError('Your bag is empty. Add a cookie or two before checking out.')
      return
    }
    setOrderError('')
    const createdAt = new Date()
    const order = {
      id: createOrderNumber(),
      createdAt: createdAt.toISOString(),
      estimatedDelivery: addDays(
        createdAt,
        values.shippingMethod === 'express' ? 2 : 5,
      ).toISOString(),
      status: 'confirmed',
      demo: true,
      items: items.map((item) => ({
        key: item.key,
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        meta: item.meta,
        kind: item.kind,
        quantity: item.quantity,
      })),
      totals: {
        itemCount: totals.itemCount,
        subtotal: totals.subtotal,
        discount: totals.discount,
        shipping: totals.shipping,
        total: totals.total,
        coupon: totals.coupon?.code || null,
      },
      customer: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        apartment: values.apartment,
        city: values.city,
        postalCode: values.postalCode,
        country: values.country,
      },
      shippingMethod: values.shippingMethod,
      giftNote: values.giftNote,
    }

    saveOrder(order)
    setPlacedOrder(order)
    clearCart()
  }

  const onInvalid = (formErrors) => {
    const first = Object.keys(formErrors)[0]
    if (first && typeof document !== 'undefined') {
      const field = document.querySelector(`[name="${first}"]`)
      field?.focus()
      field?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const lib = getGsap()
      if (lib && !prefersReducedMotion() && field) {
        lib.gsap.fromTo(
          field,
          { x: 0 },
          {
            keyframes: [{ x: -6 }, { x: 6 }, { x: -4 }, { x: 4 }, { x: 0 }],
            duration: 0.42,
            ease: 'power2.out',
            overwrite: true,
            onComplete: () => lib.gsap.set(field, { clearProps: 'transform' }),
          },
        )
      }
    }
  }

  const handleCoupon = () => {
    if (applyCoupon(couponInput)) setCouponInput('')
  }

  /* Confirmation */
  if (placedOrder) {
    const orderTotals = placedOrder.totals
    return (
      <section className="shell py-12 lg:py-20">
        <div ref={confirmationRef} className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center text-center">
            <span
              data-confirm-badge
              className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/12 text-accent"
            >
              <Check className="h-7 w-7" strokeWidth={1.5} />
            </span>
            <p data-confirm-item className="eyebrow mt-6">
              Order confirmed
            </p>
            <h1 data-confirm-item className="display-md mt-3">
              Thank you, <em className="font-light italic text-accent">{placedOrder.customer.firstName}</em>.
            </h1>
            <p data-confirm-item className="mt-3 max-w-lg font-sans text-[13px] leading-relaxed text-muted">
              Your demo order is in the oven. A confirmation would normally be sent to{' '}
              <span className="text-ink">{placedOrder.customer.email}</span> — this demo does not
              send email.
            </p>
            <p
              data-confirm-item
              className="mt-5 rounded-full border border-line bg-bg-soft px-5 py-2.5 font-sans text-[11px] tracking-[0.16em] text-ink"
            >
              Order {placedOrder.id}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div data-confirm-card className="surface-card p-5">
              <p className="eyebrow text-[8px]">Estimated delivery</p>
              <p className="mt-2 font-display text-xl text-ink">
                {formatOrderDate(placedOrder.estimatedDelivery)}
              </p>
              <p className="mt-1 font-sans text-[10px] text-muted">
                {placedOrder.shippingMethod === 'express' ? 'Express · 1–2 working days' : 'Standard · 3–5 working days'}
              </p>
            </div>
            <div data-confirm-card className="surface-card p-5">
              <p className="eyebrow text-[8px]">Delivering to</p>
              <p className="mt-2 font-sans text-[12px] leading-relaxed text-ink">
                {placedOrder.customer.firstName} {placedOrder.customer.lastName}
                <br />
                {placedOrder.customer.address}
                {placedOrder.customer.apartment ? `, ${placedOrder.customer.apartment}` : ''}
                <br />
                {placedOrder.customer.city}, {placedOrder.customer.postalCode}
                <br />
                {placedOrder.customer.country}
              </p>
            </div>
            <div data-confirm-card className="surface-card p-5">
              <p className="eyebrow text-[8px]">Total</p>
              <p className="mt-2 font-display text-3xl text-ink">
                {formatCurrency(orderTotals.total)}
              </p>
              <p className="mt-1 font-sans text-[10px] text-muted">
                {orderTotals.itemCount} {orderTotals.itemCount === 1 ? 'item' : 'items'} · No payment
                taken
              </p>
            </div>
          </div>

          <div data-confirm-card className="surface-card mt-6 p-6">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
                Your order
              </p>
              <p className="font-sans text-[9px] uppercase tracking-[0.14em] text-faint">
                Demo order
              </p>
            </div>
            <ul className="divide-y divide-line/70">
              {placedOrder.items.map((item) => (
                <li key={item.key} className="flex items-center gap-4 py-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-card object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg text-ink">{item.name}</p>
                    <p className="mt-0.5 truncate font-sans text-[9px] uppercase tracking-[0.14em] text-muted">
                      {item.meta} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-sans text-[11px] text-ink">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-line pt-4 font-sans text-[11.5px]">
              <div className="flex justify-between text-muted">
                <dt>Subtotal</dt>
                <dd className="text-ink">{formatCurrency(orderTotals.subtotal)}</dd>
              </div>
              {orderTotals.discount > 0 ? (
                <div className="flex justify-between text-accent">
                  <dt>Discount</dt>
                  <dd>−{formatCurrency(orderTotals.discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between text-muted">
                <dt>Shipping</dt>
                <dd className="text-ink">
                  {orderTotals.shipping === 0 ? 'Complimentary' : formatCurrency(orderTotals.shipping)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
                  Total
                </dt>
                <dd className="font-display text-2xl text-ink">{formatCurrency(orderTotals.total)}</dd>
              </div>
            </dl>
            {placedOrder.giftNote ? (
              <p className="mt-4 rounded-card bg-bg-soft p-3 font-sans text-[10.5px] leading-relaxed text-muted">
                <span className="font-semibold text-ink">Gift note:</span> {placedOrder.giftNote}
              </p>
            ) : null}
          </div>

          <div data-confirm-actions className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to={`/track-order?order=${placedOrder.id}`} className="btn btn-primary">
              Track this order <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
            </Link>
            <Link to="/shop" className="btn btn-outline">
              Continue shopping
            </Link>
          </div>

          <p data-confirm-item className="mt-8 text-center font-sans text-[10px] leading-relaxed text-faint">
            This is a front-end demonstration. No payment was taken, no card details were collected,
            and no real shipment will be dispatched. The order is saved only in this browser so you
            can try the tracking page.
          </p>
        </div>
      </section>
    )
  }

  /* Empty bag */
  if (items.length === 0) {
    return (
      <section data-reveal="fade" className="shell flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-line text-accent">
          <ShoppingBag className="h-6 w-6" strokeWidth={1.2} />
        </span>
        <p className="eyebrow mt-6">Checkout</p>
        <h1 className="display-md mt-3">There is nothing to check out.</h1>
        <p className="mt-3 max-w-sm font-sans text-[13px] leading-relaxed text-muted">
          Add a box of cookies to your bag first. We will keep your details here when you return.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn btn-primary">
            Shop the collection
          </Link>
          <Link to="/#build-your-box" className="btn btn-outline">
            Build a box
          </Link>
        </div>
      </section>
    )
  }

  const progress = Math.min(
    100,
    Math.round((totals.subtotal / totals.freeShippingThreshold) * 100),
  )

  return (
    <section className="shell py-10 lg:py-16">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.16em] text-faint">
        <Link to="/" className="hover:text-accent">
          Home
        </Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-accent">
          Bag
        </Link>
        <span>/</span>
        <span className="text-muted">Checkout</span>
      </nav>

      <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p data-reveal="fade" className="eyebrow eyebrow-rule">
            Almost there
          </p>
          <h1 data-reveal="heading" className="display-lg mt-4">
            Checkout.
          </h1>
          <p
            data-reveal="fade"
            data-reveal-delay={0.08}
            className="mt-3 max-w-lg font-sans text-[12.5px] leading-relaxed text-muted"
          >
            A few details, then we will get the oven on. This is a demonstration checkout — no
            payment details are requested or stored.
          </p>
        </div>
        <ol data-reveal="fade" className="flex items-center gap-3 font-sans text-[8.5px] uppercase tracking-[0.16em]">
          <li className="flex items-center gap-1.5 text-muted">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-accent text-accent">
              <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
            </span>
            Bag
          </li>
          <span className="h-px w-6 bg-line" />
          <li className="flex items-center gap-1.5 text-ink">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-bg">2</span>
            Details
          </li>
          <span className="h-px w-6 bg-line" />
          <li className="flex items-center gap-1.5 text-faint">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-line">3</span>
            Confirmation
          </li>
        </ol>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="mt-10 grid gap-10 lg:grid-cols-[1fr_390px] lg:gap-14"
        noValidate
      >
        <div className="space-y-10">
          {/* Contact */}
          <div data-reveal="stagger" className="border-t border-line pt-8">
            <SectionTitle
              number="01"
              title="Contact"
              copy="For the order confirmation and any delivery updates."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="email" className="field-label">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" strokeWidth={1.4} />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="field !pl-10"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    {...register('email')}
                  />
                </div>
                <FieldError id="email-error" message={errors.email?.message} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="phone" className="field-label">
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+33 6 12 34 56 78"
                  className="field"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  {...register('phone')}
                />
                <FieldError id="phone-error" message={errors.phone?.message} />
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div data-reveal="stagger" className="border-t border-line pt-8">
            <SectionTitle
              number="02"
              title="Delivery address"
              copy="Where should the box be sent? We deliver across Europe, North America and beyond."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="field-label">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  className="field"
                  aria-invalid={Boolean(errors.firstName)}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  {...register('firstName')}
                />
                <FieldError id="firstName-error" message={errors.firstName?.message} />
              </div>
              <div>
                <label htmlFor="lastName" className="field-label">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  className="field"
                  aria-invalid={Boolean(errors.lastName)}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  {...register('lastName')}
                />
                <FieldError id="lastName-error" message={errors.lastName?.message} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="field-label">
                  Street address
                </label>
                <input
                  id="address"
                  type="text"
                  autoComplete="address-line1"
                  placeholder="14 Rue des Petits Pains"
                  className="field"
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? 'address-error' : undefined}
                  {...register('address')}
                />
                <FieldError id="address-error" message={errors.address?.message} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="apartment" className="field-label">
                  Apartment, floor, etc. <span className="normal-case tracking-normal text-faint">(optional)</span>
                </label>
                <input
                  id="apartment"
                  type="text"
                  autoComplete="address-line2"
                  className="field"
                  aria-invalid={Boolean(errors.apartment)}
                  aria-describedby={errors.apartment ? 'apartment-error' : undefined}
                  {...register('apartment')}
                />
                <FieldError id="apartment-error" message={errors.apartment?.message} />
              </div>
              <div>
                <label htmlFor="city" className="field-label">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  autoComplete="address-level2"
                  className="field"
                  aria-invalid={Boolean(errors.city)}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                  {...register('city')}
                />
                <FieldError id="city-error" message={errors.city?.message} />
              </div>
              <div>
                <label htmlFor="postalCode" className="field-label">
                  Postal code
                </label>
                <input
                  id="postalCode"
                  type="text"
                  autoComplete="postal-code"
                  className="field"
                  aria-invalid={Boolean(errors.postalCode)}
                  aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
                  {...register('postalCode')}
                />
                <FieldError id="postalCode-error" message={errors.postalCode?.message} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="country" className="field-label">
                  Country
                </label>
                <div className="relative">
                  <select
                    id="country"
                    autoComplete="country-name"
                    className="field appearance-none pr-10"
                    aria-invalid={Boolean(errors.country)}
                    aria-describedby={errors.country ? 'country-error' : undefined}
                    {...register('country')}
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" strokeWidth={1.5} />
                </div>
                <FieldError id="country-error" message={errors.country?.message} />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div data-reveal="stagger" className="border-t border-line pt-8">
            <SectionTitle
              number="03"
              title="Shipping"
              copy="All boxes are baked to order and dispatched within 24 hours."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-card border p-4 transition-colors ${
                  shippingMethod === 'standard' ? 'border-accent bg-accent/[0.06]' : 'border-line hover:border-accent/50'
                }`}
              >
                <input
                  type="radio"
                  value="standard"
                  className="mt-1 h-3.5 w-3.5 accent-accent"
                  {...register('shippingMethod')}
                />
                <span className="flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink">
                      Standard
                    </span>
                    <span className="font-sans text-[11px] text-ink">
                      {standardTotals.shipping === 0 ? 'Complimentary' : formatCurrency(standardTotals.shipping)}
                    </span>
                  </span>
                  <span className="mt-1 block font-sans text-[10px] text-muted">
                    3–5 working days · Tracked
                  </span>
                </span>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-card border p-4 transition-colors ${
                  shippingMethod === 'express' ? 'border-accent bg-accent/[0.06]' : 'border-line hover:border-accent/50'
                }`}
              >
                <input
                  type="radio"
                  value="express"
                  className="mt-1 h-3.5 w-3.5 accent-accent"
                  {...register('shippingMethod')}
                />
                <span className="flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink">
                      <Zap className="h-3 w-3 text-accent" strokeWidth={1.6} /> Express
                    </span>
                    <span className="font-sans text-[11px] text-ink">
                      {formatCurrency(expressTotals.shipping)}
                    </span>
                  </span>
                  <span className="mt-1 block font-sans text-[10px] text-muted">
                    1–2 working days · Priority bake
                  </span>
                </span>
              </label>
            </div>
          </div>

          {/* Gift note */}
          <div data-reveal="stagger" className="border-t border-line pt-8">
            <SectionTitle
              number="04"
              title="A note, if you like"
              copy="We will write it by hand and tuck it inside the box."
            />
            <label htmlFor="giftNote" className="field-label">
              Gift note <span className="normal-case tracking-normal text-faint">(optional)</span>
            </label>
            <textarea
              id="giftNote"
              rows={3}
              placeholder="Happy birthday, Mum. The salted caramel is yours — hide it."
              className="field resize-none"
              aria-invalid={Boolean(errors.giftNote)}
              aria-describedby={errors.giftNote ? 'giftNote-error' : undefined}
              {...register('giftNote')}
            />
            <FieldError id="giftNote-error" message={errors.giftNote?.message} />
          </div>

          {/* Demo notice */}
          <div data-reveal="stagger" className="border-t border-line pt-8">
            <SectionTitle number="05" title="Payment" />
            <div className="rounded-card border border-line bg-bg-soft/70 p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
                  <Lock className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-sans text-[11px] font-semibold text-ink">
                    No payment details required
                  </p>
                  <p className="mt-1 font-sans text-[11px] leading-relaxed text-muted">
                    This is a front-end demonstration. There is no payment gateway, no card form and
                    no card data is collected or stored. Placing the order simply saves a demo record
                    in this browser so you can try the tracking page.
                  </p>
                </div>
              </div>
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-0.5 h-3.5 w-3.5 rounded-sm accent-accent"
                aria-invalid={Boolean(errors.terms)}
                aria-describedby={errors.terms ? 'terms-error' : undefined}
                {...register('terms')}
              />
              <span className="font-sans text-[11px] leading-relaxed text-muted">
                I understand this is a demo checkout and no real order, payment or shipment will be
                made.
              </span>
            </label>
            <FieldError id="terms-error" message={errors.terms?.message} />
            {orderError ? (
              <p role="alert" className="mt-3 font-sans text-[11px] text-red-700 dark:text-red-400">
                {orderError}
              </p>
            ) : null}
          </div>
        </div>

        {/* Summary */}
        <aside>
          <div data-reveal="fade" data-reveal-delay={0.08} className="surface-card sticky top-28 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-ink">Your order</h2>
              <Link to="/cart" className="font-sans text-[9px] uppercase tracking-[0.14em] text-muted hover:text-accent">
                Edit bag
              </Link>
            </div>

            <ul className="mt-5 max-h-[290px] space-y-3 overflow-y-auto pr-1" data-lenis-prevent>
              {items.map((item) => (
                <li key={item.key} className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img src={item.image} alt={item.name} className="h-14 w-14 rounded-card object-cover" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 font-sans text-[8px] font-semibold text-bg">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-sans text-[11.5px] font-medium text-ink">{item.name}</p>
                    <p className="truncate font-sans text-[9px] uppercase tracking-[0.12em] text-faint">{item.meta}</p>
                  </div>
                  <p className="font-sans text-[10.5px] text-ink">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-line pt-4">
              <div className="flex items-center justify-between font-sans text-[9px] uppercase tracking-[0.1em]">
                <span className="text-muted">
                  {totals.remainingForFreeShipping > 0
                    ? `${formatCurrency(totals.remainingForFreeShipping)} from free shipping`
                    : 'Free shipping unlocked'}
                </span>
                {totals.remainingForFreeShipping === 0 ? (
                  <Check className="h-3 w-3 text-accent" strokeWidth={2} />
                ) : null}
              </div>
              <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-700 ease-luxe"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="checkout-coupon" className="sr-only">
                Coupon code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" strokeWidth={1.4} />
                  <input
                    id="checkout-coupon"
                    type="text"
                    value={couponInput}
                    onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="field !py-2.5 !pl-9 !text-[11px] uppercase tracking-[0.1em]"
                    autoComplete="off"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCoupon}
                  className="shrink-0 rounded-card border border-line px-4 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-accent hover:text-accent"
                >
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
              ) : null}
            </div>

            <dl className="mt-5 space-y-2.5 border-t border-line pt-4 font-sans text-[11.5px]">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="text-ink">{formatCurrency(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 ? (
                <div className="flex justify-between text-accent">
                  <dt>Discount</dt>
                  <dd>−{formatCurrency(totals.discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="text-ink">
                  {totals.shipping === 0 ? 'Complimentary' : formatCurrency(totals.shipping)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
                  Total
                </dt>
                <dd className="font-display text-3xl text-ink">{formatCurrency(totals.total)}</dd>
              </div>
            </dl>

            <button type="submit" className="btn btn-primary mt-5 w-full">
              <Lock className="h-3.5 w-3.5" strokeWidth={1.6} />
              Place demo order
            </button>
            <p className="mt-3 text-center font-sans text-[9px] leading-relaxed text-faint">
              No card details · No payment · Demo record only
            </p>

            <ul className="mt-5 space-y-2.5 border-t border-line pt-4">
              {[
                { icon: Truck, text: 'Baked to order · dispatched within 24h' },
                { icon: Package, text: 'Wrapped by hand in Paris' },
                { icon: MapPin, text: 'Tracked delivery to your door' },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2.5">
                  <item.icon className="h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={1.4} />
                  <span className="font-sans text-[9.5px] text-muted">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </form>
    </section>
  )
}
