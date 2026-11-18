import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { scrollToTop } from '../utils/smoothScroll'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 720)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => scrollToTop({ immediate: false, duration: 1.4 })}
      aria-label="Back to top"
      className={`fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg/90 text-ink shadow-[0_8px_30px_rgba(26,18,12,0.12)] backdrop-blur-md transition-all duration-500 ease-luxe hover:border-accent hover:text-accent sm:bottom-7 sm:right-7 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
    </button>
  )
}
