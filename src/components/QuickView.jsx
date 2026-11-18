import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Heart, ShoppingBag, X } from 'lucide-react'
import QuantityStepper from './QuantityStepper'
import RatingStars from './RatingStars'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { useLockBody } from '../hooks/useLockBody'
import { formatCurrency } from '../utils/formatCurrency'

export default function QuickView({ product, onClose }) {
  const [quantity, setQuantity] = useState(1)
  const closeRef = useRef(null)
  const { addProduct } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()

  useLockBody(Boolean(product))

  useEffect(() => {
    setQuantity(1)
  }, [product])

  useEffect(() => {
    if (!product) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    const timer = window.setTimeout(() => closeRef.current?.focus(), 80)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(timer)
    }
  }, [product, onClose])

  if (!product) return null

  const saved = isWishlisted(product.id)

  return (
    <div className="fixed inset-0 z-[93] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`Quick view: ${product.name}`}>
      <div className="absolute inset-0 bg-espresso/55 backdrop-blur-sm" onClick={onClose} />
      <div className="relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-card bg-bg shadow-2xl sm:max-h-[88vh] sm:rounded-card md:grid-cols-2">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-bg/85 text-ink backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
          aria-label="Close quick view"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <div className="relative aspect-square bg-bg-soft md:aspect-auto md:h-full">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          {product.badge ? (
            <span className="absolute left-4 top-4 rounded-full bg-bg/90 px-3 py-1.5 font-sans text-[8.5px] font-semibold uppercase tracking-[0.18em] text-ink backdrop-blur-sm">
              {product.badge}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col p-6 sm:p-8 md:p-10">
          <p className="eyebrow">{product.category}</p>
          <h2 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
            {product.name}
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <RatingStars rating={product.rating} size="md" />
            <span className="font-sans text-[10px] text-muted">
              {product.rating} · {product.reviewCount} reviews
            </span>
          </div>

          <p className="mt-4 font-sans text-[13px] leading-relaxed text-muted">{product.tagline}</p>
          <p className="mt-4 font-sans text-[13px] leading-relaxed text-muted line-clamp-4">
            {product.description}
          </p>

          <ul className="mt-4 flex flex-wrap gap-1.5">
            {product.notes.map((note) => (
              <li
                key={note}
                className="rounded-full border border-line px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.12em] text-muted"
              >
                {note}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-end justify-between border-t border-line pt-5">
            <div>
              <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-faint">Box of 6</p>
              <p className="mt-1 font-display text-3xl text-ink">{formatCurrency(product.price)}</p>
            </div>
            <QuantityStepper value={quantity} onChange={setQuantity} max={20} />
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => {
                addProduct(product, quantity)
                onClose()
              }}
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

          <Link
            to={`/product/${product.id}`}
            onClick={onClose}
            className="mt-4 inline-flex items-center gap-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
          >
            Full details <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  )
}
