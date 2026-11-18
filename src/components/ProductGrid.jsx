import { Link } from 'react-router'
import ProductCard from './ProductCard'

export default function ProductGrid({
  products = [],
  onQuickView,
  columns = 4,
  emptyTitle = 'No cookies here yet.',
  emptyMessage = 'Try another flavour or browse the full collection.',
  emptyAction = { label: 'Shop all cookies', to: '/shop' },
  priorityCount = 0,
}) {
  const columnClass =
    columns === 3
      ? 'sm:grid-cols-2 lg:grid-cols-3'
      : columns === 2
        ? 'sm:grid-cols-2'
        : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

  if (products.length === 0) {
    return (
      <div className="surface-card flex flex-col items-center px-6 py-16 text-center">
        <p className="font-display text-3xl text-ink">{emptyTitle}</p>
        <p className="mt-2 max-w-sm font-sans text-[12.5px] leading-relaxed text-muted">
          {emptyMessage}
        </p>
        {emptyAction ? (
          <Link to={emptyAction.to} className="btn btn-outline mt-6">
            {emptyAction.label}
          </Link>
        ) : null}
      </div>
    )
  }

  return (
    <div data-reveal="stagger" className={`grid gap-x-5 gap-y-10 ${columnClass}`}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
          priority={index < priorityCount}
        />
      ))}
    </div>
  )
}
