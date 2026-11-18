import { readStorage, writeStorage } from './storage'

const STORAGE_KEY = 'mc-orders'

export const getOrders = () => {
  const saved = readStorage(STORAGE_KEY, [])
  return Array.isArray(saved) ? saved : []
}

export const saveOrder = (order) => {
  const orders = getOrders()
  const next = [order, ...orders].slice(0, 25)
  writeStorage(STORAGE_KEY, next)
  return order
}

export const findOrder = (number, email) => {
  const normalisedNumber = String(number || '').trim().toUpperCase()
  const normalisedEmail = String(email || '').trim().toLowerCase()
  if (!normalisedNumber) return null
  return (
    getOrders().find(
      (order) =>
        order.id.toUpperCase() === normalisedNumber &&
        (!normalisedEmail || order.customer.email.toLowerCase() === normalisedEmail),
    ) || null
  )
}

export const createOrderNumber = () => {
  const now = new Date()
  const year = String(now.getFullYear()).slice(2)
  const stamp = String(now.getTime()).slice(-4)
  const random = Math.floor(1000 + Math.random() * 9000)
  return `MC-${year}${stamp}-${random}`
}

export const formatOrderDate = (value) =>
  new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))

export const addDays = (date, days) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}
