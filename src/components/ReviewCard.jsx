import RatingStars from './RatingStars'

export default function ReviewCard({ review, className = '' }) {
  return (
    <figure
      className={`surface-card flex h-full flex-col p-6 sm:p-8 ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <RatingStars rating={review.rating} size="md" />
        <span className="font-display text-4xl leading-none text-accent/25">”</span>
      </div>
      <blockquote className="mt-5 flex-1">
        <p className="font-display text-[22px] leading-snug text-ink sm:text-2xl">
          “{review.title}”
        </p>
        <p className="mt-3 font-sans text-[12.5px] leading-relaxed text-muted">{review.body}</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-bg-soft font-sans text-[10px] font-semibold tracking-[0.06em] text-ink">
          {review.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-sans text-[11.5px] font-semibold text-ink">{review.name}</p>
          <p className="truncate font-sans text-[9.5px] uppercase tracking-[0.14em] text-faint">
            {review.location}
            {review.verified ? ' · Verified' : ''}
          </p>
        </div>
        <p className="ml-auto hidden shrink-0 font-sans text-[9px] uppercase tracking-[0.12em] text-muted sm:block">
          {review.product}
        </p>
      </figcaption>
    </figure>
  )
}
