import { Link } from 'react-router'

export function CookieMark({ className = '' }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <circle cx="16" cy="16" r="12.4" stroke="currentColor" strokeWidth="1.15" opacity="0.85" />
      <circle cx="16" cy="16" r="12.4" stroke="currentColor" strokeWidth="1.15" opacity="0.25" />
      <g fill="currentColor">
        <circle cx="11.6" cy="12.4" r="1.65" />
        <circle cx="19.4" cy="10.9" r="1.35" />
        <circle cx="22" cy="17.8" r="1.7" />
        <circle cx="15.6" cy="21.2" r="1.5" />
        <circle cx="10.2" cy="19.2" r="1.05" />
        <circle cx="17.2" cy="15.6" r="0.95" />
      </g>
      <path
        d="M10.2 16.2c1.6-3.1 4.2-5.2 7.1-5.6"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
}

export default function Logo({ to = '/', showTagline = false, size = 'md', className = '' }) {
  const isLarge = size === 'lg'
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2.5 text-ink ${className}`}
      aria-label="MAISON CRUMB — home"
    >
      <CookieMark
        className={`${isLarge ? 'h-10 w-10' : 'h-[26px] w-[26px]'} shrink-0 transition-transform duration-700 ease-luxe group-hover:rotate-[18deg]`}
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-medium tracking-[0.155em] ${
            isLarge ? 'text-3xl sm:text-4xl' : 'text-[19px] sm:text-[21px]'
          }`}
        >
          MAISON CRUMB
        </span>
        {showTagline ? (
          <span
            className={`mt-1.5 font-sans uppercase text-muted ${
              isLarge ? 'text-[8px] tracking-[0.4em]' : 'text-[6px] tracking-[0.34em]'
            }`}
          >
            The Art of Perfect Cookies
          </span>
        ) : null}
      </span>
    </Link>
  )
}
