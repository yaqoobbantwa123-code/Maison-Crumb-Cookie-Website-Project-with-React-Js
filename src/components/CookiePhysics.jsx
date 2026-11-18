import { useEffect, useRef, useState } from 'react'
import { Hand } from 'lucide-react'
import { BagBack, BagFront } from './BagArtwork'
import { createCookieScene } from '../physics/cookiePhysics'
import { useReducedMotion } from '../hooks/useMediaQuery'

const FALLBACK_COOKIES = [
  { left: '34%', bottom: '17%', size: 58, rotate: -14, tone: '#c88a4e', chip: '#3a2114' },
  { left: '48%', bottom: '16%', size: 62, rotate: 22, tone: '#b97a3f', chip: '#3a2114' },
  { left: '61%', bottom: '18%', size: 56, rotate: 8, tone: '#6d4631', chip: '#2a150d' },
  { left: '40%', bottom: '27%', size: 54, rotate: 34, tone: '#a05048', chip: '#f3e4cf' },
  { left: '55%', bottom: '28%', size: 58, rotate: -28, tone: '#d9bb8f', chip: '#38271c' },
  { left: '47%', bottom: '37%', size: 52, rotate: 12, tone: '#b4b17c', chip: '#485735' },
]

export default function CookiePhysics({
  className = '',
  cookieCount = 12,
  compact = false,
  showOrbit = true,
  showHint = true,
  onSceneReady,
  onActivity,
}) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const visibleRef = useRef(false)
  const onSceneReadyRef = useRef(onSceneReady)
  const onActivityRef = useRef(onActivity)
  const reducedMotion = useReducedMotion()
  const [hasGrabbed, setHasGrabbed] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    onSceneReadyRef.current = onSceneReady
  }, [onSceneReady])

  useEffect(() => {
    onActivityRef.current = onActivity
  }, [onActivity])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return undefined

    let cancelled = false
    let scene = null

    const timer = window.setTimeout(() => {
      if (cancelled) return
      scene = createCookieScene({
        canvas,
        container,
        cookieCount,
        reducedMotion,
        onGrabChange: setIsDragging,
        onFirstGrab: () => setHasGrabbed(true),
        onActivity: (activity) => onActivityRef.current?.(activity),
      })

      if (!scene) {
        setFailed(true)
        return
      }

      setFailed(false)
      sceneRef.current = scene
      onSceneReadyRef.current?.(scene)
      if (!compact || visibleRef.current) scene.start()
    }, compact ? 60 : 220)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      scene?.destroy()
      if (sceneRef.current === scene) sceneRef.current = null
      onSceneReadyRef.current?.(null)
    }
  }, [cookieCount, reducedMotion, compact])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
        const scene = sceneRef.current
        if (!scene) return
        if (entry.isIntersecting) scene.start()
        else scene.pause()
      },
      { threshold: 0.12 },
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative isolate aspect-[5/6] w-full select-none overflow-hidden ${className}`}
      aria-label="Interactive cookie packaging scene"
      data-cookie-physics
    >
      {/* Stage light */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(214,178,128,0.28),transparent_62%)] dark:bg-[radial-gradient(ellipse_at_50%_38%,rgba(190,143,88,0.18),transparent_62%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-[10%] bottom-[6.5%] z-0 h-px bg-gradient-to-r from-transparent via-line to-transparent"
      />
      {showOrbit ? (
        <div
          data-hero-orbit={compact ? undefined : ''}
          aria-hidden="true"
          className="absolute left-1/2 top-[48%] z-0 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/10 dark:border-ink/15"
        >
          <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent/70" />
          <span className="absolute -right-1 top-[22%] h-1.5 w-1.5 rounded-full bg-accent/50" />
          <span className="absolute bottom-[8%] left-[18%] h-1 w-1 rounded-full bg-accent/40" />
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
        <BagBack />
      </div>

      {failed ? (
        <div className="absolute inset-0 z-10" aria-hidden="true">
          {FALLBACK_COOKIES.map((cookie, index) => (
            <span
              key={index}
              className="absolute block rounded-full shadow-[0_10px_22px_rgba(30,18,10,0.28)]"
              style={{
                left: cookie.left,
                bottom: cookie.bottom,
                width: cookie.size,
                height: cookie.size,
                transform: `translateX(-50%) rotate(${cookie.rotate}deg)`,
                background: `radial-gradient(circle at 34% 30%, #e9bc82 0%, ${cookie.tone} 52%, #8f5527 100%)`,
                boxShadow: 'inset 0 -4px 10px rgba(60,32,14,.35), 0 8px 18px rgba(30,18,10,.28)',
              }}
            >
              <span
                className="absolute left-[26%] top-[30%] h-2 w-2.5 rounded-full"
                style={{ background: cookie.chip }}
              />
              <span
                className="absolute left-[58%] top-[22%] h-1.5 w-2 rounded-full"
                style={{ background: cookie.chip }}
              />
              <span
                className="absolute left-[48%] top-[58%] h-2 w-2 rounded-full"
                style={{ background: cookie.chip }}
              />
            </span>
          ))}
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 z-10 h-full w-full touch-none ${
            reducedMotion
              ? 'cursor-default'
              : isDragging
                ? 'cursor-grabbing'
                : 'cursor-grab'
          }`}
          role="img"
          aria-label="A bag of MAISON CRUMB cookies. Drag a cookie with the mouse or a finger, then release it to watch gravity pull it back into the bag."
        />
      )}

      <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
        <BagFront />
      </div>

      {!reducedMotion && !failed && showHint ? (
        <div
          className={`pointer-events-none absolute left-1/2 top-[3.5%] z-30 -translate-x-1/2 transition-all duration-700 ${
            hasGrabbed ? 'translate-y-1 opacity-0' : 'opacity-100'
          }`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-bg/80 px-3.5 py-2 font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-ink/70 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-espresso/60 dark:text-ivory/80">
            <Hand className="h-3 w-3" strokeWidth={1.6} />
            Drag a cookie · let it fall
          </span>
        </div>
      ) : null}

      {reducedMotion ? (
        <div className="pointer-events-none absolute left-1/2 top-[3.5%] z-30 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full border border-ink/10 bg-bg/80 px-3.5 py-2 font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-ink/60 backdrop-blur-md dark:border-white/10 dark:bg-espresso/60 dark:text-ivory/70">
            Quiet arrangement · reduced motion
          </span>
        </div>
      ) : null}

      <p className="sr-only">
        This is a real-time physics scene. Twelve cookies can be dragged with a mouse or finger and
        released to fall under gravity, colliding with each other and the packaging.
      </p>
    </div>
  )
}
