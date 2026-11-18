import { Link } from 'react-router'
import { Eye, Heart, Plus } from 'lucide-react'
import RatingStars from './RatingStars'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { formatCurrency } from '../utils/formatCurrency'

export default function ProductCard({ product, onQuickView, priority = false }) {
  const { addProduct } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const saved = isWishlisted(product.id)
  const badge = product.badge || (product.availability === 'Low stock' ? 'Low stock' : null)

  return (
    <article className="group relative flex flex-col">
      <div className="media-frame aspect-[4/5]">
        <Link
          to={`/product/${product.id}`}
          className="block h-full w-full"
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.055]"
            loading={priority ? 'eager' : 'lazy'}
          />
        </Link>

        {badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-bg/90 px-3 py-1.5 font-sans text-[8.5px] font-semibold uppercase tracking-[0.18em] text-ink backdrop-blur-sm">
            {badge}
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-300 ${
            saved
              ? 'border-accent bg-accent text-white'
              : 'border-white/50 bg-bg/75 text-ink hover:border-accent hover:text-accent'
          }`}
        >
          <Heart className="h-3.5 w-3.5" strokeWidth={1.6} fill={saved ? 'currentColor' : 'none'} />
        </button>

        <div className="absolute inset-x-3 bottom-3 flex translate-y-2 gap-2 opacity-0 transition-all duration-500 ease-luxe group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          {onQuickView ? (
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-bg/92 px-3 py-2.5 font-sans text-[8.5px] font-semibold uppercase tracking-[0.16em] text-ink backdrop-blur-md transition-colors hover:bg-ink hover:text-bg"
            >
              <Eye className="h-3 w-3" strokeWidth={1.5} /> Quick view
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => addProduct(product, 1)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-3 py-2.5 font-sans text-[8.5px] font-semibold uppercase tracking-[0.16em] text-bg backdrop-blur-md transition-colors hover:bg-accent hover:text-white"
          >
            <Plus className="h-3 w-3" strokeWidth={1.8} /> Add to bag
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-1 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-sans text-[8.5px] font-semibold uppercase tracking-[0.2em] text-muted">
            {product.category}
          </p>
          <h3 className="mt-1.5 truncate font-display text-[21px] leading-tight text-ink">
            <Link to={`/product/${product.id}`} className="transition-colors hover:text-accent">
              {product.name}
            </Link>
          </h3>
          <div className="mt-1.5 flex items-center gap-2">
            <RatingStars rating={product.rating} />
            <span className="font-sans text-[9.5px] text-faint">({product.reviewCount})</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-sans text-[12.5px] text-ink">{formatCurrency(product.price)}</p>
          <p className="mt-0.5 font-sans text-[9px] uppercase tracking-[0.12em] text-faint">Box of 6</p>
        </div>
      </div>
    </article>
  )
}
