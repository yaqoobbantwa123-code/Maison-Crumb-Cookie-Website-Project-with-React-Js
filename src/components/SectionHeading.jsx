import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'

export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className = '',
  children,
}) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start'

  return (
    <div
      className={`flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between ${className}`}
    >
      <div className={`flex max-w-2xl flex-col ${alignment}`}>
        {eyebrow ? (
          <p data-reveal="fade" className="eyebrow eyebrow-rule">
            {eyebrow}
          </p>
        ) : null}
        <h2 data-reveal="heading" className="display-md mt-4 text-balance">
          {title}
        </h2>
        {description ? (
          <p
            data-reveal="fade"
            data-reveal-delay={0.08}
            className="mt-4 max-w-xl font-sans text-[13px] leading-relaxed text-muted"
          >
            {description}
          </p>
        ) : null}
        {children}
      </div>
      {action ? (
        action.to.startsWith('http') ? (
          <a
            href={action.to}
            target="_blank"
            rel="noreferrer noopener"
            data-reveal="fade"
            className="group inline-flex shrink-0 items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:text-accent"
          >
            {action.label}
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </a>
        ) : (
          <Link
            to={action.to}
            data-reveal="fade"
            className="group inline-flex shrink-0 items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:text-accent"
          >
            {action.label}
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        )
      ) : null}
    </div>
  )
}
