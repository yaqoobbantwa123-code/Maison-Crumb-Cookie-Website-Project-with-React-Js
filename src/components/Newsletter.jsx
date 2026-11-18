import { useEffect, useId, useRef, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { getGsap, prefersReducedMotion } from '../animations/gsapConfig'

export default function Newsletter({ compact = false, className = '' }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const inputId = useId()
  const successRef = useRef(null)

  useEffect(() => {
    if (status !== 'done') return undefined
    const lib = getGsap()
    if (!lib || prefersReducedMotion() || !successRef.current) return undefined
    const { gsap } = lib

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline.from(successRef.current, { y: 12, opacity: 0, duration: 0.6 })
      const lines = successRef.current.querySelectorAll('[data-newsletter-line]')
      if (lines.length) {
        timeline.from(
          lines,
          { y: 8, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
          '-=0.35',
        )
      }
    }, successRef)

    return () => context.revert()
  }, [status])

  const handleSubmit = (event) => {
    event.preventDefault()
    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setStatus('done')
    setEmail('')
  }

  if (compact) {
    return (
      <div className={className}>
        {status === 'done' ? (
          <p
            ref={successRef}
            className="flex items-center gap-2 font-sans text-[11px] text-accent"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2} />
            <span data-newsletter-line>
              Welcome to the list. A little sweetness is on its way.
            </span>
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex items-center border-b border-line pb-2">
              <label htmlFor={inputId} className="sr-only">
                Email address
              </label>
              <input
                id={inputId}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email address"
                className="w-full bg-transparent font-sans text-[12px] text-ink outline-none placeholder:text-faint"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${inputId}-error` : undefined}
              />
              <button
                type="submit"
                className="flex h-7 w-7 shrink-0 items-center justify-center text-ink transition-colors hover:text-accent"
                aria-label="Subscribe to the newsletter"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            {error ? (
              <p id={`${inputId}-error`} className="mt-2 font-sans text-[10px] text-red-700 dark:text-red-400" role="alert">
                {error}
              </p>
            ) : null}
          </form>
        )}
      </div>
    )
  }

  return (
    <div className={`grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20 ${className}`}>
      <div>
        <p className="eyebrow eyebrow-rule">The Sunday Crumb</p>
        <h2 className="display-md mt-5 text-balance">
          A quiet letter about <em className="font-light italic text-accent">good things</em>.
        </h2>
        <p className="mt-5 max-w-md font-sans text-[13px] leading-relaxed text-muted">
          New recipes, small-batch releases and the occasional note from the kitchen. Sent no more
          than twice a month. No noise, no crumbs in your inbox.
        </p>
      </div>

      <div className="flex flex-col justify-center">
        {status === 'done' ? (
          <div ref={successRef} className="surface-card flex items-start gap-3 p-6">
            <span
              data-newsletter-line
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent"
            >
              <Check className="h-4 w-4" strokeWidth={2} />
            </span>
            <div>
              <p data-newsletter-line className="font-display text-xl text-ink">
                You are on the list.
              </p>
              <p data-newsletter-line className="mt-1 font-sans text-[12px] text-muted">
                A little sweetness is on its way. You can unsubscribe at any time.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor={inputId} className="field-label">
              Email address
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id={inputId}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="field flex-1"
                autoComplete="email"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${inputId}-error` : undefined}
              />
              <button type="submit" className="btn btn-primary shrink-0">
                Subscribe <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
              </button>
            </div>
            {error ? (
              <p id={`${inputId}-error`} className="mt-2 font-sans text-[11px] text-red-700 dark:text-red-400" role="alert">
                {error}
              </p>
            ) : null}
            <p className="mt-3 font-sans text-[10px] leading-relaxed text-faint">
              By subscribing you agree to receive occasional emails from MAISON CRUMB. This demo
              does not send or store your address on a server.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
