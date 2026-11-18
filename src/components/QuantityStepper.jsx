import { useEffect, useRef } from 'react'
import { Minus, Plus } from 'lucide-react'
import { getGsap, prefersReducedMotion } from '../animations/gsapConfig'

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  size = 'md',
  className = '',
}) {
  const buttonSize = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'
  const valueSize = size === 'sm' ? 'w-7 text-[11px]' : 'w-9 text-xs'
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'
  const valueRef = useRef(null)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    const lib = getGsap()
    if (!lib || prefersReducedMotion() || !valueRef.current) return
    lib.gsap.fromTo(
      valueRef.current,
      { scale: 0.68, opacity: 0.35 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.36,
        ease: 'back.out(2.6)',
        clearProps: 'transform,opacity',
      },
    )
  }, [value])

  return (
    <div
      className={`inline-flex items-center rounded-full border border-line ${className}`}
      role="group"
      aria-label="Quantity selector"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`${buttonSize} flex items-center justify-center rounded-full text-ink transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-30`}
      >
        <Minus className={iconSize} strokeWidth={1.6} />
      </button>
      <span
        ref={valueRef}
        className={`${valueSize} text-center font-sans font-medium tabular-nums text-ink`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`${buttonSize} flex items-center justify-center rounded-full text-ink transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-30`}
      >
        <Plus className={iconSize} strokeWidth={1.6} />
      </button>
    </div>
  )
}
