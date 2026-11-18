import { useMemo, useState } from 'react'
import { Check, Minus, Plus, Sparkles, ShoppingBag, RotateCcw } from 'lucide-react'
import { products } from '../data/products'
import giftBox from '../assets/editorial/gift-box.jpg'
import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/formatCurrency'

const BOX_SIZES = [
  {
    size: 6,
    name: 'The Petite',
    price: 32,
    note: 'Six cookies, one very good evening.',
  },
  {
    size: 9,
    name: 'The Signature',
    price: 46,
    note: 'Nine cookies, for a table of friends.',
  },
  {
    size: 12,
    name: 'The Grand',
    price: 58,
    note: 'Twelve cookies, for the generous host.',
  },
]

const ELIGIBLE = products.filter((product) => product.boxEligible)

const countSelection = (selection) =>
  Object.values(selection).reduce((sum, count) => sum + count, 0)

export default function CookieBoxBuilder() {
  const [size, setSize] = useState(6)
  const [selection, setSelection] = useState({})
  const [justAdded, setJustAdded] = useState(false)
  const { addCustomBox } = useCart()

  const box = BOX_SIZES.find((entry) => entry.size === size) || BOX_SIZES[0]
  const selectedCount = countSelection(selection)
  const remaining = size - selectedCount
  const complete = remaining === 0

  const selectedProducts = useMemo(
    () =>
      Object.entries(selection)
        .map(([id, count]) => ({ product: products.find((entry) => entry.id === id), count }))
        .filter((entry) => entry.product),
    [selection],
  )

  const chooseSize = (nextSize) => {
    setSize(nextSize)
    setJustAdded(false)
    setSelection((current) => {
      let allowance = nextSize
      const next = {}
      for (const [id, count] of Object.entries(current)) {
        if (allowance <= 0) break
        const take = Math.min(count, allowance)
        next[id] = take
        allowance -= take
      }
      return next
    })
  }

  const addFlavour = (id) => {
    if (selectedCount >= size) return
    setJustAdded(false)
    setSelection((current) => ({ ...current, [id]: (current[id] || 0) + 1 }))
  }

  const removeFlavour = (id) => {
    setJustAdded(false)
    setSelection((current) => {
      const count = (current[id] || 0) - 1
      const next = { ...current }
      if (count <= 0) delete next[id]
      else next[id] = count
      return next
    })
  }

  const fillRemaining = () => {
    setJustAdded(false)
    setSelection((current) => {
      const next = { ...current }
      let allowance = size - countSelection(current)
      let index = 0
      while (allowance > 0) {
        const product = ELIGIBLE[index % ELIGIBLE.length]
        next[product.id] = (next[product.id] || 0) + 1
        allowance -= 1
        index += 1
      }
      return next
    })
  }

  const clearAll = () => {
    setSelection({})
    setJustAdded(false)
  }

  const addBoxToBag = () => {
    if (!complete) return
    const key = `custom-box-${size}-${Object.entries(selection)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, count]) => `${id}x${count}`)
      .join('-')}`
    const meta = selectedProducts
      .map(({ product, count }) => `${count} × ${product.name.replace('The ', '')}`)
      .join(' · ')
    addCustomBox({
      key,
      name: `Build Your Own · ${size} Cookies`,
      price: box.price,
      image: giftBox,
      meta,
    })
    setJustAdded(true)
  }

  const slots = selectedProducts
    .flatMap(({ product, count }) => Array.from({ length: count }, () => product))
    .slice(0, size)

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      {/* Selection */}
      <div>
        <div className="grid grid-cols-3 gap-2">
          {BOX_SIZES.map((option) => {
            const active = option.size === size
            return (
              <button
                key={option.size}
                type="button"
                onClick={() => chooseSize(option.size)}
                aria-pressed={active}
                className={`rounded-card border p-4 text-left transition-all duration-300 ${
                  active
                    ? 'border-accent bg-accent/[0.07]'
                    : 'border-line bg-surface hover:border-accent/60'
                }`}
              >
                <span className="flex items-center justify-between">
                  <span className="font-sans text-[8.5px] font-semibold uppercase tracking-[0.18em] text-muted">
                    {option.size} cookies
                  </span>
                  {active ? <Check className="h-3.5 w-3.5 text-accent" strokeWidth={2} /> : null}
                </span>
                <span className="mt-2 block font-display text-lg leading-none text-ink">
                  {option.name}
                </span>
                <span className="mt-1.5 block font-sans text-[11px] text-muted">
                  {formatCurrency(option.price)}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-7 flex items-center justify-between gap-3">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
            Choose your flavours
          </p>
          <p className="font-sans text-[10px] tabular-nums text-muted">
            <span className={complete ? 'text-accent' : 'text-ink'}>{selectedCount}</span> / {size}
          </p>
        </div>
        <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500 ease-luxe"
            style={{ width: `${(selectedCount / size) * 100}%` }}
          />
        </div>

        <ul className="mt-5 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          {ELIGIBLE.map((product) => {
            const count = selection[product.id] || 0
            const atLimit = selectedCount >= size
            return (
              <li
                key={product.id}
                className="flex items-center gap-3 border-b border-line/70 py-2.5"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-11 w-11 shrink-0 rounded-card object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[16px] leading-tight text-ink">
                    {product.name}
                  </p>
                  <p className="truncate font-sans text-[8.5px] uppercase tracking-[0.14em] text-faint">
                    {product.category}
                  </p>
                </div>
                {count > 0 ? (
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => removeFlavour(product.id)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
                      aria-label={`Remove one ${product.name}`}
                    >
                      <Minus className="h-2.5 w-2.5" strokeWidth={1.8} />
                    </button>
                    <span className="w-5 text-center font-sans text-[11px] tabular-nums text-ink">
                      {count}
                    </span>
                    <button
                      type="button"
                      onClick={() => addFlavour(product.id)}
                      disabled={atLimit}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label={`Add one ${product.name}`}
                    >
                      <Plus className="h-2.5 w-2.5" strokeWidth={1.8} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => addFlavour(product.id)}
                    disabled={atLimit}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={`Add ${product.name} to your box`}
                  >
                    <Plus className="h-3 w-3" strokeWidth={1.6} />
                  </button>
                )}
              </li>
            )
          })}
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={fillRemaining}
            disabled={complete}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Sparkles className="h-3 w-3" strokeWidth={1.5} /> Fill with house favourites
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={selectedCount === 0}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-2 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw className="h-3 w-3" strokeWidth={1.5} /> Start again
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="surface-card overflow-hidden">
          <div className="relative aspect-[16/10] bg-bg-soft">
            <img src={giftBox} alt="A MAISON CRUMB gift box" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/55 via-transparent to-transparent" />
            <div className="absolute inset-x-5 bottom-4 flex items-end justify-between text-ivory">
              <div>
                <p className="font-sans text-[8px] uppercase tracking-[0.22em] text-ivory/70">
                  Made to order
                </p>
                <p className="mt-1 font-display text-2xl leading-none">Your box</p>
              </div>
              <p className="font-sans text-[11px]">{formatCurrency(box.price)}</p>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-6 gap-2">
              {slots.map((product, index) => (
                <div
                  key={`${index}-${product?.id || 'empty'}`}
                  className={`relative aspect-square overflow-hidden rounded-full border ${
                    product ? 'border-transparent' : 'border-dashed border-line bg-bg-soft/60'
                  }`}
                >
                  {product ? (
                    <img
                      src={product.image}
                      alt={`${product.name} in your box`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-sans text-[8px] text-faint">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-1.5">
              {selectedProducts.length > 0 ? (
                selectedProducts.map(({ product, count }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-3 font-sans text-[11px] text-muted"
                  >
                    <span className="truncate">
                      {count} × {product.name}
                    </span>
                    <span className="shrink-0 font-sans text-[9px] uppercase tracking-[0.12em] text-faint">
                      {product.category}
                    </span>
                  </div>
                ))
              ) : (
                <p className="font-sans text-[11px] leading-relaxed text-faint">
                  Your box is waiting. Choose {size} cookies from the collection — mix as you like.
                </p>
              )}
            </div>

            <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
              <div>
                <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-muted">
                  {box.name} · {size} cookies
                </p>
                <p className="mt-1 font-display text-3xl text-ink">{formatCurrency(box.price)}</p>
              </div>
              <p className="text-right font-sans text-[9px] uppercase tracking-[0.12em] text-faint">
                {formatCurrency(box.price / size)}
                <br />
                per cookie
              </p>
            </div>

            <button
              type="button"
              onClick={addBoxToBag}
              disabled={!complete}
              className="btn btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.6} />
              {complete ? 'Add box to bag' : `Choose ${remaining} more`}
            </button>

            {justAdded ? (
              <p className="mt-3 flex items-center justify-center gap-1.5 font-sans text-[10px] text-accent" role="status">
                <Check className="h-3 w-3" strokeWidth={2} /> Your box has been added to the bag.
              </p>
            ) : (
              <p className="mt-3 text-center font-sans text-[9px] leading-relaxed text-faint">
                Wrapped by hand · Complimentary note on request
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
