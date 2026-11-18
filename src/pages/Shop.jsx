import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import ProductGrid from '../components/ProductGrid'
import QuickView from '../components/QuickView'
import { products } from '../data/products'
import { categories } from '../data/categories'

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price · low to high' },
  { value: 'price-desc', label: 'Price · high to low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'newest', label: 'Newest' },
]

const MAX_PRICE = 40

const matchesQuery = (product, term) => {
  if (!term) return true
  return [product.name, product.category, product.tagline, ...product.notes]
    .join(' ')
    .toLowerCase()
    .includes(term.toLowerCase())
}

function Filters({
  category,
  onCategory,
  priceMax,
  onPrice,
  inStockOnly,
  onInStock,
  counts,
}) {
  return (
    <div data-reveal="stagger" className="space-y-8">
      <div>
        <p className="eyebrow mb-4">Flavour</p>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => onCategory('All')}
              className={`flex w-full items-center justify-between py-1.5 font-sans text-[12px] transition-colors ${
                category === 'All' ? 'text-accent' : 'text-muted hover:text-ink'
              }`}
            >
              All cookies
              <span className="font-sans text-[9px] text-faint">{products.length}</span>
            </button>
          </li>
          {categories.map((entry) => (
            <li key={entry.name}>
              <button
                type="button"
                onClick={() => onCategory(entry.name)}
                className={`flex w-full items-center justify-between py-1.5 text-left font-sans text-[12px] transition-colors ${
                  category === entry.name ? 'text-accent' : 'text-muted hover:text-ink'
                }`}
              >
                {entry.name}
                <span className="font-sans text-[9px] text-faint">{counts[entry.name] || 0}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line pt-7">
        <div className="mb-4 flex items-center justify-between">
          <p className="eyebrow">Price</p>
          <span className="font-sans text-[10px] text-muted">
            {priceMax >= MAX_PRICE ? 'Any' : `Up to $${priceMax}`}
          </span>
        </div>
        <input
          type="range"
          min="25"
          max={MAX_PRICE}
          step="1"
          value={priceMax}
          onChange={(event) => onPrice(Number(event.target.value))}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-line accent-accent"
          aria-label="Maximum price"
        />
        <div className="mt-2 flex justify-between font-sans text-[9px] uppercase tracking-[0.12em] text-faint">
          <span>$25</span>
          <span>$40</span>
        </div>
      </div>

      <div className="border-t border-line pt-7">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => onInStock(event.target.checked)}
            className="h-3.5 w-3.5 rounded-sm border-line accent-accent"
          />
          <span className="font-sans text-[12px] text-muted">In stock only</span>
        </label>
      </div>

      <div className="border-t border-line pt-7">
        <p className="eyebrow mb-3">Need a hand?</p>
        <p className="font-sans text-[11.5px] leading-relaxed text-muted">
          Not sure where to begin? Our Signature Box gathers the six recipes we are proudest of.
        </p>
        <Link
          to="/product/maison-signature"
          className="mt-4 inline-flex font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-accent hover:text-ink"
        >
          Try the signature →
        </Link>
      </div>
    </div>
  )
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || 'All'
  const query = searchParams.get('q') || ''
  const sort = searchParams.get('sort') || 'featured'

  const [searchTerm, setSearchTerm] = useState(query)
  const [priceMax, setPriceMax] = useState(MAX_PRICE)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [quickView, setQuickView] = useState(null)

  useEffect(() => {
    setSearchTerm(query)
  }, [query])

  const counts = useMemo(
    () =>
      products.reduce((accumulator, product) => {
        accumulator[product.category] = (accumulator[product.category] || 0) + 1
        return accumulator
      }, {}),
    [],
  )

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'All' || (key === 'sort' && value === 'featured')) next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  const clearAll = () => {
    setSearchParams({}, { replace: true })
    setSearchTerm('')
    setPriceMax(MAX_PRICE)
    setInStockOnly(false)
  }

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      if (category !== 'All' && product.category !== category) return false
      if (product.price > priceMax) return false
      if (inStockOnly && product.availability !== 'In stock') return false
      if (!matchesQuery(product, searchTerm)) return false
      return true
    })

    switch (sort) {
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...result].sort((a, b) => b.price - a.price)
      case 'rating':
        return [...result].sort((a, b) => b.rating - a.rating)
      case 'newest':
        return [...result].sort(
          (a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0),
        )
      default:
        return result
    }
  }, [category, priceMax, inStockOnly, searchTerm, sort])

  const hasFilters =
    category !== 'All' || searchTerm.trim() !== '' || priceMax < MAX_PRICE || inStockOnly

  const filterProps = {
    category,
    onCategory: (value) => updateParam('category', value),
    priceMax,
    onPrice: setPriceMax,
    inStockOnly,
    onInStock: setInStockOnly,
    counts,
  }

  return (
    <>
      <section className="border-b border-line bg-bg-soft">
        <div className="shell py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.16em] text-faint">
            <Link to="/" className="transition-colors hover:text-accent">
              Home
            </Link>
            <span>/</span>
            <span className="text-muted">Shop</span>
          </nav>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p data-reveal="fade" className="eyebrow eyebrow-rule">
                The collection
              </p>
              <h1 data-reveal="heading" className="display-lg mt-5">
                All cookies,
                <br />
                <em className="font-light italic text-accent">no compromise.</em>
              </h1>
            </div>
            <p data-reveal data-reveal-delay={0.08} className="max-w-sm font-sans text-[12.5px] leading-relaxed text-muted lg:pb-2">
              Twelve recipes, baked in small batches and finished by hand. Filter by flavour, price
              or mood — though we would happily choose for you.
            </p>
          </div>
        </div>
      </section>

      <section className="shell py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="mb-6 flex items-center justify-between">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
                  Filters
                </p>
                {hasFilters ? (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="font-sans text-[9px] uppercase tracking-[0.14em] text-muted hover:text-accent"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
              <Filters {...filterProps} />
            </div>
          </aside>

          <div>
            <div data-reveal="stagger" className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFiltersOpen((open) => !open)}
                  aria-expanded={filtersOpen}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-accent hover:text-accent lg:hidden"
                >
                  <SlidersHorizontal className="h-3 w-3" strokeWidth={1.6} />
                  Filters
                </button>
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-muted">
                  {filtered.length} {filtered.length === 1 ? 'cookie' : 'cookies'}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    updateParam('q', searchTerm.trim())
                  }}
                  className="relative"
                >
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
                    strokeWidth={1.5}
                  />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search the collection"
                    className="w-full rounded-full border border-line bg-transparent py-2 pl-9 pr-8 font-sans text-[11px] text-ink outline-none transition-colors placeholder:text-faint focus:border-accent sm:w-[210px]"
                    aria-label="Search products"
                  />
                  {searchTerm ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('')
                        updateParam('q', '')
                      }}
                      className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-muted hover:text-ink"
                      aria-label="Clear search"
                    >
                      <X className="h-3 w-3" strokeWidth={1.6} />
                    </button>
                  ) : null}
                </form>

                <div className="relative">
                  <label htmlFor="sort" className="sr-only">
                    Sort products
                  </label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={(event) => updateParam('sort', event.target.value)}
                    className="w-full appearance-none rounded-full border border-line bg-transparent py-2 pl-4 pr-9 font-sans text-[10px] uppercase tracking-[0.1em] text-ink outline-none transition-colors focus:border-accent sm:w-[180px]"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            {filtersOpen ? (
              <div className="border-b border-line py-6 lg:hidden">
                <Filters {...filterProps} />
              </div>
            ) : null}

            {hasFilters ? (
              <div className="flex flex-wrap items-center gap-2 py-4">
                {category !== 'All' ? (
                  <button
                    type="button"
                    onClick={() => updateParam('category', 'All')}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-sans text-[9px] uppercase tracking-[0.1em] text-muted hover:border-accent hover:text-accent"
                  >
                    {category} <X className="h-2.5 w-2.5" strokeWidth={1.8} />
                  </button>
                ) : null}
                {searchTerm.trim() ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('')
                      updateParam('q', '')
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-sans text-[9px] uppercase tracking-[0.1em] text-muted hover:border-accent hover:text-accent"
                  >
                    “{searchTerm.trim()}” <X className="h-2.5 w-2.5" strokeWidth={1.8} />
                  </button>
                ) : null}
                {priceMax < MAX_PRICE ? (
                  <button
                    type="button"
                    onClick={() => setPriceMax(MAX_PRICE)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-sans text-[9px] uppercase tracking-[0.1em] text-muted hover:border-accent hover:text-accent"
                  >
                    Under ${priceMax} <X className="h-2.5 w-2.5" strokeWidth={1.8} />
                  </button>
                ) : null}
                {inStockOnly ? (
                  <button
                    type="button"
                    onClick={() => setInStockOnly(false)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-sans text-[9px] uppercase tracking-[0.1em] text-muted hover:border-accent hover:text-accent"
                  >
                    In stock <X className="h-2.5 w-2.5" strokeWidth={1.8} />
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={clearAll}
                  className="ml-1 font-sans text-[9px] uppercase tracking-[0.14em] text-accent hover:text-ink"
                >
                  Clear all
                </button>
              </div>
            ) : (
              <div className="h-4" />
            )}

            {filtered.length > 0 ? (
              <div className="mt-4">
                <ProductGrid
                  products={filtered}
                  onQuickView={setQuickView}
                  columns={3}
                  priorityCount={3}
                />
              </div>
            ) : (
              <div data-reveal className="surface-card mt-6 flex flex-col items-center px-6 py-20 text-center">
                <p className="font-display text-4xl text-ink">Nothing in this corner.</p>
                <p className="mt-3 max-w-sm font-sans text-[12.5px] leading-relaxed text-muted">
                  We could not find a cookie that matches every filter. Loosen one, or start again
                  and let us tempt you.
                </p>
                <button type="button" onClick={clearAll} className="btn btn-primary mt-7">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </>
  )
}
