import { useEffect } from 'react'
import { getLenis } from '../utils/smoothScroll'

let lockCount = 0
let previousOverflow = ''

/**
 * Locks native scroll and pauses Lenis while a drawer, menu or dialog is open.
 * Uses a shared counter so nested overlays do not unlock each other.
 */
export const useLockBody = (locked) => {
  useEffect(() => {
    if (!locked || typeof document === 'undefined') return undefined

    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      getLenis()?.stop()
    }
    lockCount += 1

    return () => {
      lockCount = Math.max(0, lockCount - 1)
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow
        getLenis()?.start()
      }
    }
  }, [locked])
}
