import { Star } from 'lucide-react'

export default function RatingStars({ rating = 0, size = 'sm', className = '' }) {
  const dimension = size === 'lg' ? 'h-4 w-4' : size === 'md' ? 'h-3.5 w-3.5' : 'h-3 w-3'
  const percentage = Math.max(0, Math.min(100, (Number(rating) / 5) * 100))

  return (
    <span
      className={`relative inline-flex align-middle ${className}`}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      <span className="flex gap-0.5 text-line">
        {[0, 1, 2, 3, 4].map((index) => (
          <Star key={index} className={dimension} fill="currentColor" strokeWidth={0} />
        ))}
      </span>
      <span
        className="absolute inset-y-0 left-0 flex gap-0.5 overflow-hidden text-accent"
        style={{ width: `${percentage}%` }}
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <Star key={index} className={`${dimension} shrink-0`} fill="currentColor" strokeWidth={0} />
        ))}
      </span>
    </span>
  )
}
