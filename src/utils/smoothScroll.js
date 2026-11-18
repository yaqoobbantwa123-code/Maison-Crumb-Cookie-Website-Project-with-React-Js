let lenisInstance = null

export const setLenis = (lenis) => {
  lenisInstance = lenis
}

export const getLenis = () => lenisInstance

export const scrollToTop = (options = {}) => {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, ...options })
    return
  }
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }
}

export const scrollToElement = (target, options = {}) => {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(target, { offset: -90, duration: 1.2, ...options })
    return
  }
  if (typeof document !== 'undefined') {
    const element = typeof target === 'string' ? document.querySelector(target) : target
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
