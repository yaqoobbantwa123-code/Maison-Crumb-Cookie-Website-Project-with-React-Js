import { Link } from 'react-router'
import { ArrowRight, Cookie } from 'lucide-react'
import { CookieMark } from '../components/Logo'

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.06] blur-3xl"
      />
      <div className="shell relative py-20 text-center">
        <div className="flex justify-center">
          <CookieMark className="h-12 w-12 text-accent" />
        </div>
        <p className="mt-6 font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
          Error 404
        </p>
        <h1 className="display-xl mt-4">
          This page has
          <br />
          <em className="font-light italic text-accent">crumbled.</em>
        </h1>
        <p className="mx-auto mt-5 max-w-md font-sans text-[13px] leading-relaxed text-muted">
          The link you followed may be broken, or the page may have been moved. The cookies, at
          least, are exactly where they should be.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn btn-primary">
            Back to the maison <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
          </Link>
          <Link to="/shop" className="btn btn-outline">
            Shop the collection
          </Link>
        </div>

        <div className="mx-auto mt-14 max-w-lg border-t border-line pt-6">
          <p className="eyebrow">A few good places to start</p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { label: 'Bestsellers', to: '/shop' },
              { label: 'Build a box', to: '/#build-your-box' },
              { label: 'Our story', to: '/about' },
              { label: 'Track an order', to: '/track-order' },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="inline-flex items-center gap-1.5 font-sans text-[11px] text-muted transition-colors hover:text-accent"
              >
                <Cookie className="h-3 w-3" strokeWidth={1.4} />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
