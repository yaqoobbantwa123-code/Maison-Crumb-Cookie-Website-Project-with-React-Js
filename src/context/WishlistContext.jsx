import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { getProductById } from '../data/products'
import { readStorage, writeStorage } from '../utils/storage'

const STORAGE_KEY = 'mc-wishlist'
export const WishlistContext = createContext(null)

const loadWishlist = () => {
  const saved = readStorage(STORAGE_KEY, [])
  if (!Array.isArray(saved)) return []
  return [...new Set(saved.filter((id) => typeof id === 'string' && getProductById(id)))]
}

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(loadWishlist)

  useEffect(() => {
    writeStorage(STORAGE_KEY, ids)
  }, [ids])

  const toggleWishlist = useCallback((productId) => {
    setIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [productId, ...current],
    )
  }, [])

  const addToWishlist = useCallback((productId) => {
    setIds((current) => (current.includes(productId) ? current : [productId, ...current]))
  }, [])

  const removeFromWishlist = useCallback((productId) => {
    setIds((current) => current.filter((id) => id !== productId))
  }, [])

  const isWishlisted = useCallback((productId) => ids.includes(productId), [ids])

  const clearWishlist = useCallback(() => setIds([]), [])

  const products = useMemo(
    () => ids.map((id) => getProductById(id)).filter(Boolean),
    [ids],
  )

  const value = useMemo(
    () => ({
      ids,
      products,
      count: products.length,
      toggleWishlist,
      addToWishlist,
      removeFromWishlist,
      isWishlisted,
      clearWishlist,
    }),
    [
      ids,
      products,
      toggleWishlist,
      addToWishlist,
      removeFromWishlist,
      isWishlisted,
      clearWishlist,
    ],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
