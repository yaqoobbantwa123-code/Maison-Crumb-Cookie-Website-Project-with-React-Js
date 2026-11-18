import { useRef } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { getGsap, prefersReducedMotion } from '../animations/gsapConfig'

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()
  const buttonRef = useRef(null)

  const handleToggle = () => {
    toggleTheme()
    const lib = getGsap()
    if (!lib || prefersReducedMotion() || !buttonRef.current) return
    lib.gsap.fromTo(
      buttonRef.current,
      { scale: 0.84 },
      {
        scale: 1,
        duration: 0.55,
        ease: 'back.out(2.4)',
        clearProps: 'transform',
      },
    )
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      title={isDark ? 'Light theme' : 'Dark theme'}
      className={`relative flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-accent hover:text-accent ${className}`}
    >
      <Sun
        className={`absolute h-[15px] w-[15px] transition-all duration-500 ${
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
        strokeWidth={1.5}
      />
      <Moon
        className={`absolute h-[15px] w-[15px] transition-all duration-500 ${
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        }`}
        strokeWidth={1.5}
      />
    </button>
  )
}
