import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, Search, X } from 'lucide-react'
import { products } from '../data/products'
import { categories } from '../data/categories'
import { formatCurrency } from '../utils/formatCurrency'
import { useLockBody } from '../hooks/useLockBody'

const SUGGESTIONS = ['Salted caramel', 'Signature', 'Gift box', 'Pistachio', 'Dark chocolate']

const normalise = (value) => value.toLowerCase().trim()

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useLockBody(open)

  useEffect(() => {
    if (!open) return undefined
    const timer = window.setTimeout(() => inputRef.current?.focus(), 90)
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const results = useMemo(() => {
    const term = normalise(query)
    if (!term) return []
    return products
      .filter((product) =>
        [product.name, product.category, product.tagline, ...product.notes]
          .join(' ')
          .toLowerCase()
          .includes(term),
      )
      .slice(0, 6)
  }, [query])

  const submit = (event) => {
    event.preventDefault()
    const term = query.trim()
    onClose()
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[95]" role="dialog" aria-modal="true" aria-label="Search">
      <div className="absolute inset-0 bg-espresso/55 backdrop-blur-md" onClick={onClose} />
      <div className="relative mx-auto mt-0 flex h-full w-full max-w-3xl flex-col bg-bg shadow-2xl sm:mt-[8vh] sm:h-auto sm:max-h-[84vh] sm:rounded-card">
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-8">
          <p className="eyebrow">Search the maison</p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
            aria-label="Close search"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={submit} className="border-b border-line px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 shrink-0 text-muted" strokeWidth={1.4} />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try “salted caramel”, “signature” or “gift”"
              className="w-full bg-transparent py-2 font-display text-2xl text-ink outline-none placeholder:text-faint sm:text-3xl"
              aria-label="Search products"
              autoComplete="off"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="font-sans text-[9px] uppercase tracking-[0.18em] text-muted hover:text-accent"
              >
                Clear
              </button>
            ) : null}
          </div>
        </form>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          {query.trim() === '' ? (
            <div className="space-y-8">
              <div>
                <p className="eyebrow mb-3">Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setQuery(suggestion)}
                      className="rounded-full border border-line px-3.5 py-2 font-sans text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="eyebrow mb-3">Browse by flavour</p>
                <ul className="grid grid-cols-2 gap-x-6">
                  {categories.slice(0, 6).map((category) => (
                    <li key={category.name}>
                      <Link
                        to={`/shop?category=${encodeURIComponent(category.name)}`}
                        onClick={onClose}
                        className="flex items-center justify-between border-b border-line/60 py-3 font-sans text-[12px] text-ink transition-colors hover:text-accent"
                      >
                        {category.name}
                        <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="eyebrow">{results.length} results</p>
                <button
                  type="button"
                  onClick={submit}
                  className="font-sans text-[9px] uppercase tracking-[0.16em] text-accent hover:text-ink"
                >
                  View all
                </button>
              </div>
              <ul className="divide-y divide-line/70">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="group flex items-center gap-4 py-4"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 rounded-card object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-xl leading-tight text-ink transition-colors group-hover:text-accent">
                          {product.name}
                        </p>
                        <p className="mt-0.5 truncate font-sans text-[10px] uppercase tracking-[0.16em] text-muted">
                          {product.category}
                        </p>
                      </div>
                      <span className="font-sans text-[12px] text-ink">
                        {formatCurrency(product.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="font-display text-3xl text-ink">No crumbs found.</p>
              <p className="mx-auto mt-2 max-w-sm font-sans text-[12.5px] text-muted">
                We could not find anything for “{query}”. Try a flavour, a category or a mood.
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="btn btn-outline mt-6"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
