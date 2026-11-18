import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import AnnouncementBar from '../components/AnnouncementBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import ScrollToTop from '../components/ScrollToTop'
import { scrollToElement, scrollToTop } from '../utils/smoothScroll'
import {
  animatePageIn,
  animateSiteChrome,
  initHoverAnimations,
  initRevealAnimations,
} from '../animations/scrollAnimations'
import { bindScrollTriggerRefresh, refreshScrollTrigger } from '../animations/gsapConfig'

export default function MainLayout() {
  const location = useLocation()
  const mainRef = useRef(null)
  const firstRender = useRef(true)

  useEffect(() => {
    const chrome = animateSiteChrome()
    const unbindRefresh = bindScrollTriggerRefresh()
    return () => {
      chrome()
      unbindRefresh()
    }
  }, [])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
    } else {
      scrollToTop({ immediate: true })
    }

    const main = mainRef.current
    if (!main) return undefined

    const pageAnimation = animatePageIn(main)
    const reveals = initRevealAnimations(main)
    const hovers = initHoverAnimations(main)
    const refresh = refreshScrollTrigger(420)

    let hashTimer
    if (location.hash) {
      hashTimer = window.setTimeout(() => {
        scrollToElement(location.hash, { offset: -96 })
      }, 260)
    }

    return () => {
      pageAnimation()
      reveals()
      hovers()
      refresh?.()
      window.clearTimeout(hashTimer)
    }
  }, [location.pathname, location.hash])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-sans focus:text-[10px] focus:uppercase focus:tracking-[0.16em] focus:text-bg"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Navbar />
      <main id="main-content" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ScrollToTop />
      <div className="grain" aria-hidden="true" />
    </div>
  )
}
