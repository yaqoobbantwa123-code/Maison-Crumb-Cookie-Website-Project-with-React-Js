import { getGsap, prefersReducedMotion } from './gsapConfig'

const DEFAULT_REVEAL_DURATION = 1.05

const revealStart = (element) => ({
  trigger: element,
  start: 'top 90%',
  once: true,
})

const revealDelay = (element) => Number(element.dataset.revealDelay || 0)

const finishReveal = (element, props = '') => {
  if (!element) return
  element.style.willChange = 'auto'
  if (props) {
    window.gsap?.set(element, { clearProps: props })
  }
}

/**
 * One reveal system, several deliberately different choreographies.
 *
 * data-reveal            → soft rise (cards, blocks)
 * data-reveal="heading"  → masked typography wipe
 * data-reveal="image"    → clip-path curtain + slow image settle
 * data-reveal="fade"     → opacity only (eyebrows, meta, captions)
 * data-reveal="stagger"  → direct children rise in sequence
 *
 * Every element is only animated once, and every trigger is owned by the
 * returned gsap.context so it can be reverted on route change.
 */
export const initRevealAnimations = (root) => {
  const lib = getGsap()
  if (!lib || !root || prefersReducedMotion()) return () => {}

  const { gsap, ScrollTrigger } = lib
  if (!ScrollTrigger) return () => {}

  const context = gsap.context(() => {
    const elements = gsap.utils.toArray('[data-reveal]', root)

    elements.forEach((element) => {
      const variant = element.dataset.reveal || 'up'
      const distance = Number(element.dataset.revealDistance || 30)
      const delay = revealDelay(element)
      const trigger = revealStart(element)

      if (variant === 'heading') {
        const tween = gsap.fromTo(
          element,
          { y: 26, opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' },
          {
            y: 0,
            opacity: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.1,
            delay,
            ease: 'power3.out',
            scrollTrigger: trigger,
            onComplete: () => finishReveal(element, 'clipPath'),
          },
        )
        return tween
      }

      if (variant === 'image') {
        const image = element.querySelector('img')
        const timeline = gsap.timeline({ delay, scrollTrigger: trigger })
        timeline.fromTo(
          element,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.15,
            ease: 'power3.inOut',
          },
        )
        if (image) {
          timeline.fromTo(
            image,
            { scale: 1.14 },
            {
              scale: 1,
              duration: 1.45,
              ease: 'power3.out',
              onComplete: () => finishReveal(image, 'transform'),
            },
            0,
          )
        }
        timeline.eventCallback('onComplete', () => finishReveal(element, 'clipPath'))
        return timeline
      }

      if (variant === 'fade') {
        return gsap.fromTo(
          element,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay,
            ease: 'power2.out',
            scrollTrigger: trigger,
            onComplete: () => finishReveal(element),
          },
        )
      }

      if (variant === 'stagger') {
        const children = Array.from(element.children)
        if (!children.length) return null
        return gsap.fromTo(
          children,
          { y: Math.min(distance, 26), opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            delay,
            ease: 'power3.out',
            stagger: 0.075,
            scrollTrigger: trigger,
            onComplete: () => {
              children.forEach((child) => {
                child.style.willChange = 'auto'
              })
            },
          },
        )
      }

      return gsap.fromTo(
        element,
        { y: distance, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DEFAULT_REVEAL_DURATION,
          delay,
          ease: 'power3.out',
          scrollTrigger: trigger,
          onComplete: () => finishReveal(element),
        },
      )
    })

    const parallaxItems = gsap.utils.toArray('[data-parallax]', root)
    parallaxItems.forEach((element) => {
      const raw = Number(element.dataset.parallax || 12)
      const speed = Math.max(2, Math.min(20, Math.abs(raw) || 12))
      gsap.fromTo(
        element,
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: element.parentElement || element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      )
    })
  }, root)

  return () => context.revert()
}

/**
 * Refined pointer affordances. Kept desktop-only and transform-only so touch
 * devices never pay for it.
 */
export const initHoverAnimations = (root) => {
  const lib = getGsap()
  if (!lib || !root || prefersReducedMotion()) return () => {}
  if (typeof window === 'undefined') return () => {}
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {}
  if (window.matchMedia('(max-width: 1023px)').matches) return () => {}

  const { gsap } = lib
  const cleanups = []
  const context = gsap.context(() => {
    gsap.utils.toArray('[data-magnetic]', root).forEach((element) => {
      const strength = Number(element.dataset.magnetic || 0.18)
      const moveX = gsap.quickTo(element, 'x', { duration: 0.5, ease: 'power3.out' })
      const moveY = gsap.quickTo(element, 'y', { duration: 0.5, ease: 'power3.out' })

      const onMove = (event) => {
        const rect = element.getBoundingClientRect()
        const relX = event.clientX - (rect.left + rect.width / 2)
        const relY = event.clientY - (rect.top + rect.height / 2)
        moveX(relX * strength)
        moveY(relY * strength)
      }

      const onLeave = () => {
        gsap.to(element, { x: 0, y: 0, duration: 0.75, ease: 'elastic.out(1, 0.45)' })
      }

      element.addEventListener('pointermove', onMove)
      element.addEventListener('pointerleave', onLeave)

      cleanups.push(() => {
        element.removeEventListener('pointermove', onMove)
        element.removeEventListener('pointerleave', onLeave)
      })
    })
  }, root)

  cleanups.forEach((cleanup) => context.add(cleanup))

  return () => context.revert()
}

/**
 * Announcement bar, navigation and footer live outside <main>, so they are
 * animated once when the layout mounts rather than by the per-page reveal pass.
 */
export const animateSiteChrome = () => {
  const lib = getGsap()
  if (!lib || prefersReducedMotion()) return () => {}

  const { gsap, ScrollTrigger } = lib

  const context = gsap.context(() => {
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })

    const announcements = gsap.utils.toArray('[data-announcement]')
    if (announcements.length) {
      intro.from(announcements, { y: -12, opacity: 0, duration: 0.75, stagger: 0.06 })
    }

    intro.from('[data-navbar-inner]', { y: -16, opacity: 0, duration: 0.85 }, '-=0.45')

    const navLinks = gsap.utils.toArray('[data-nav-link]')
    if (navLinks.length) {
      intro.from(
        navLinks,
        { y: 12, opacity: 0, duration: 0.65, stagger: 0.07, ease: 'power2.out' },
        '-=0.55',
      )
    }

    const navActions = gsap.utils.toArray('[data-nav-action]')
    if (navActions.length) {
      intro.from(navActions, { opacity: 0, y: 10, duration: 0.65, stagger: 0.06 }, '-=0.55')
    }

    if (!ScrollTrigger) return

    gsap.utils.toArray('[data-footer-reveal]').forEach((element, index) => {
      gsap.fromTo(
        element,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          delay: (index % 4) * 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 94%',
            once: true,
          },
        },
      )
    })

    const footerBar = document.querySelector('[data-footer-bar]')
    if (footerBar) {
      gsap.fromTo(
        footerBar,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerBar,
            start: 'top 98%',
            once: true,
          },
        },
      )
    }
  })

  return () => context.revert()
}

export const animatePageIn = (element) => {
  const lib = getGsap()
  if (!lib || !element) return () => {}
  const { gsap } = lib

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, y: 0 })
    return () => {}
  }

  const tween = gsap.fromTo(
    element,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', clearProps: 'opacity,transform' },
  )

  return () => tween.kill()
}

export const animateHero = (root) => {
  const lib = getGsap()
  if (!lib || !root || prefersReducedMotion()) return () => {}
  const { gsap } = lib

  const context = gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

    timeline
      .from('[data-hero-eyebrow]', { y: 18, opacity: 0, duration: 0.8 })
      .from(
        '[data-hero-line]',
        { yPercent: 110, opacity: 0, duration: 1.15, stagger: 0.12 },
        '-=0.45',
      )
      .from('[data-hero-copy]', { y: 22, opacity: 0, duration: 0.9 }, '-=0.7')
      .from('[data-hero-cta]', { y: 18, opacity: 0, duration: 0.8, stagger: 0.09 }, '-=0.6')
      .from('[data-hero-trust]', { y: 14, opacity: 0, duration: 0.7 }, '-=0.55')
      .from('[data-hero-stage]', { y: 48, opacity: 0, duration: 1.3 }, '-=1.15')
      .from('[data-hero-caption]', { y: 18, opacity: 0, duration: 0.8 }, '-=0.65')
      .from('[data-hero-meta]', { opacity: 0, duration: 0.8 }, '-=0.55')
      .from('[data-float]', { opacity: 0, duration: 1.1, stagger: 0.16 }, '-=0.6')

    const circle = root.querySelector('[data-hero-orbit]')
    if (circle) {
      gsap.to(circle, {
        rotate: 360,
        duration: 80,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      })
    }

    // Barely-there floating accents. These are decorative, so they are kept
    // away from the interactive canvas and from the main hero transforms.
    gsap.utils.toArray('[data-float]', root).forEach((element, index) => {
      gsap.to(element, {
        y: index % 2 === 0 ? -10 : 9,
        rotate: index % 2 === 0 ? 1.5 : -1.5,
        duration: 4.2 + index * 0.7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.8 + index * 0.25,
      })
    })
  }, root)

  return () => context.revert()
}

/**
 * Physics section entrance.
 *
 * Deliberately small and finite: the copy rises, the bag fades in once, and
 * then GSAP lets go. There is no pin, no scrub, no progress bar and no
 * scroll-driven release. Matter.js alone owns every cookie from here on.
 */
export const initPhysicsStory = ({ root, stage, copy } = {}) => {
  const noop = { cleanup: () => {}, sync: () => {} }
  const lib = getGsap()
  if (!lib || !root) return noop

  const { gsap, ScrollTrigger } = lib
  if (!ScrollTrigger || prefersReducedMotion()) return noop

  const context = gsap.context(() => {
    const items = copy ? Array.from(copy.children) : []
    const timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: root,
        start: 'top 76%',
        once: true,
      },
    })

    if (items.length) {
      timeline.from(items, {
        y: 26,
        opacity: 0,
        duration: 0.9,
        stagger: 0.075,
      })
    }

    if (stage) {
      timeline.from(
        stage,
        { y: 30, opacity: 0, duration: 1.05 },
        items.length ? '-=0.72' : 0,
      )
    }

    const glow = root.querySelector('[data-story-glow]')
    if (glow) {
      timeline.from(glow, { opacity: 0, duration: 1.2 }, 0.1)
    }
  }, root)

  return { cleanup: () => context.revert(), sync: () => {} }
}
