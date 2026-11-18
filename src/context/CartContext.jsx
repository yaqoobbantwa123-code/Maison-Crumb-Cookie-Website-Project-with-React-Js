import { createContext, useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { calculateCart, validateCoupon } from '../utils/calculateCart'
import { readStorage, writeStorage } from '../utils/storage'

const STORAGE_KEY = 'mc-cart'
const MAX_QUANTITY = 20

export const CartContext = createContext(null)

const loadInitialState = () => {
  const saved = readStorage(STORAGE_KEY, null)
  if (!saved || !Array.isArray(saved.items)) {
    return { items: [], coupon: null }
  }
  const items = saved.items
    .filter(
      (item) =>
        item &&
        typeof item.key === 'string' &&
        typeof item.name === 'string' &&
        Number.isFinite(Number(item.price)) &&
        Number.isFinite(Number(item.quantity)),
    )
    .map((item) => ({
      ...item,
      quantity: Math.min(MAX_QUANTITY, Math.max(1, Number(item.quantity))),
    }))
  return {
    items,
    coupon: typeof saved.coupon === 'string' ? saved.coupon : null,
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item, quantity } = action
      const safeQuantity = Math.min(MAX_QUANTITY, Math.max(1, Number(quantity) || 1))
      const existing = state.items.find((entry) => entry.key === item.key)
      if (existing) {
        return {
          ...state,
          items: state.items.map((entry) =>
            entry.key === item.key
              ? { ...entry, quantity: Math.min(MAX_QUANTITY, entry.quantity + safeQuantity) }
              : entry,
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...item, quantity: safeQuantity }],
      }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.key !== action.key) }
    case 'SET_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.key === action.key
            ? {
                ...item,
                quantity: Math.min(MAX_QUANTITY, Math.max(1, Number(action.quantity) || 1)),
              }
            : item,
        ),
      }
    case 'CLEAR':
      return { items: [], coupon: null }
    case 'SET_COUPON':
      return { ...state, coupon: action.code }
    case 'CLEAR_COUPON':
      return { ...state, coupon: null }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [couponError, setCouponError] = useState('')

  useEffect(() => {
    writeStorage(STORAGE_KEY, state)
  }, [state])

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const toggleCart = useCallback(() => setIsCartOpen((open) => !open), [])

  const addItem = useCallback(
    (item, quantity = 1, { open = true } = {}) => {
      dispatch({ type: 'ADD_ITEM', item, quantity })
      if (open) setIsCartOpen(true)
    },
    [],
  )

  const addProduct = useCallback(
    (product, quantity = 1, options = {}) => {
      addItem(
        {
          key: product.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          meta: product.category,
          kind: 'product',
        },
        quantity,
        options,
      )
    },
    [addItem],
  )

  const addCustomBox = useCallback(
    (box, quantity = 1, options = {}) => {
      addItem(
        {
          key: box.key,
          productId: box.key,
          name: box.name,
          price: box.price,
          image: box.image,
          meta: box.meta,
          kind: 'box',
        },
        quantity,
        options,
      )
    },
    [addItem],
  )

  const removeItem = useCallback((key) => dispatch({ type: 'REMOVE_ITEM', key }), [])
  const updateQuantity = useCallback(
    (key, quantity) => dispatch({ type: 'SET_QUANTITY', key, quantity }),
    [],
  )
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])
  const removeCoupon = useCallback(() => {
    dispatch({ type: 'CLEAR_COUPON' })
    setCouponError('')
  }, [])

  const applyCoupon = useCallback(
    (code) => {
      const { subtotal } = calculateCart(state.items, null)
      const result = validateCoupon(code, subtotal)
      if (!result.ok) {
        setCouponError(result.message)
        return false
      }
      dispatch({ type: 'SET_COUPON', code: result.coupon.code })
      setCouponError('')
      return true
    },
    [state.items],
  )

  const totals = useMemo(() => calculateCart(state.items, state.coupon), [state.items, state.coupon])

  const value = useMemo(
    () => ({
      items: state.items,
      coupon: state.coupon,
      couponError,
      totals,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      addProduct,
      addCustomBox,
      removeItem,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
    }),
    [
      state.items,
      state.coupon,
      couponError,
      totals,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      addProduct,
      addCustomBox,
      removeItem,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
