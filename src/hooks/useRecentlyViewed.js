import { useEffect, useState } from 'react'
import { readStorage, writeStorage } from '../utils/storage'

const STORAGE_KEY = 'mc-recently-viewed'
const MAX_ITEMS = 8

export const useRecentlyViewed = (productId) => {
  const [ids, setIds] = useState(() => {
    const saved = readStorage(STORAGE_KEY, [])
    return Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : []
  })

  useEffect(() => {
    if (!productId) return
    setIds((current) => {
      const next = [productId, ...current.filter((id) => id !== productId)].slice(0, MAX_ITEMS)
      writeStorage(STORAGE_KEY, next)
      return next
    })
  }, [productId])

  return ids
}
