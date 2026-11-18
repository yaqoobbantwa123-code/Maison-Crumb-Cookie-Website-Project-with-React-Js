import { useEffect } from 'react'
import Lenis from 'lenis'
import { setLenis } from '../utils/smoothScroll'
import { useReducedMotion } from '../hooks/useMediaQuery'

/**
 * Lenis smooth scrolling. Disabled entirely for reduced-motion users.
 * GSAP ScrollTrigger is kept in sync so reveal animations follow the scroll.
 */
export default function SmoothScroll() {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      setLenis(null)
      return undefined
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    })

    setLenis(lenis)

    let frame = 0
    const raf = (time) => {
      lenis.raf(time)
      frame = window.requestAnimationFrame(raf)
    }
    frame = window.requestAnimationFrame(raf)

    const gsap = window.gsap
    const ScrollTrigger = window.ScrollTrigger
    const onScroll = () => ScrollTrigger?.update()
    lenis.on('scroll', onScroll)
    if (gsap && ScrollTrigger) {
      gsap.ticker.lagSmoothing(0)
      ScrollTrigger.refresh()
    }

    return () => {
      window.cancelAnimationFrame(frame)
      lenis.off('scroll', onScroll)
      lenis.destroy()
      setLenis(null)
    }
  }, [reducedMotion])

  return null
}
