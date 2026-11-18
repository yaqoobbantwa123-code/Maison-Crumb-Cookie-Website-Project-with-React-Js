let pluginRegistered = false

/**
 * GSAP is loaded from CDN in index.html, not bundled.
 * Every animation must gracefully no-op if the CDN is unavailable.
 */
export const getGsap = () => {
  if (typeof window === 'undefined') return null
  const gsap = window.gsap
  const ScrollTrigger = window.ScrollTrigger
  if (!gsap) return null

  if (ScrollTrigger && !pluginRegistered) {
    gsap.registerPlugin(ScrollTrigger)
    pluginRegistered = true
  }

  return { gsap, ScrollTrigger: ScrollTrigger || null }
}

export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const refreshScrollTrigger = (delay = 120) => {
  const lib = getGsap()
  if (!lib?.ScrollTrigger) return undefined
  const timer = window.setTimeout(() => {
    lib.ScrollTrigger.refresh()
  }, delay)
  return () => window.clearTimeout(timer)
}

let refreshBound = false

/**
 * Layout height keeps growing after first paint (fonts, lazy images, the
 * physics canvas). Stale trigger positions leave late sections invisible, so
 * refresh once more whenever the page settles.
 */
export const bindScrollTriggerRefresh = () => {
  const lib = getGsap()
  if (!lib?.ScrollTrigger || refreshBound || typeof window === 'undefined') {
    return () => {}
  }

  refreshBound = true
  let timer = 0

  const schedule = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => lib.ScrollTrigger.refresh(), 180)
  }

  const onLoad = () => schedule()
  const onResourceLoad = (event) => {
    if (event.target?.tagName === 'IMG') schedule()
  }

  window.addEventListener('load', onLoad)
  document.addEventListener('load', onResourceLoad, true)
  document.fonts?.ready?.then(schedule).catch(() => {})
  schedule()

  return () => {
    refreshBound = false
    window.clearTimeout(timer)
    window.removeEventListener('load', onLoad)
    document.removeEventListener('load', onResourceLoad, true)
  }
}
