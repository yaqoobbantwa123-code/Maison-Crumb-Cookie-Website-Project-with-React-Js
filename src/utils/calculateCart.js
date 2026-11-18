export const FREE_SHIPPING_THRESHOLD = 60
export const STANDARD_SHIPPING = 6.95
export const EXPRESS_SHIPPING = 12

export const COUPONS = {
  CRUMB10: {
    code: 'CRUMB10',
    type: 'percent',
    value: 10,
    label: '10% off your order',
    minSpend: 0,
  },
  SWEET15: {
    code: 'SWEET15',
    type: 'percent',
    value: 15,
    label: '15% off orders over $75',
    minSpend: 75,
  },
  FREESHIP: {
    code: 'FREESHIP',
    type: 'shipping',
    value: 0,
    label: 'Complimentary shipping',
    minSpend: 0,
  },
}

export const validateCoupon = (rawCode, subtotal) => {
  const code = String(rawCode || '').trim().toUpperCase()
  if (!code) {
    return { ok: false, message: 'Enter a code to continue.' }
  }
  const coupon = COUPONS[code]
  if (!coupon) {
    return { ok: false, message: 'That code is not recognised. Try CRUMB10.' }
  }
  if (subtotal < coupon.minSpend) {
    return {
      ok: false,
      message: `This code unlocks at ${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(coupon.minSpend)}.`,
    }
  }
  return { ok: true, coupon }
}

/**
 * All cart maths live here so totals are always derived from current state.
 */
export const calculateCart = (items = [], couponCode = null, options = {}) => {
  const { shippingMethod = 'standard' } = options
  const itemCount = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  )

  const coupon = couponCode ? COUPONS[String(couponCode).toUpperCase()] : null
  const couponEligible = Boolean(coupon && subtotal >= coupon.minSpend)

  let discount = 0
  if (couponEligible) {
    if (coupon.type === 'percent') {
      discount = subtotal * (coupon.value / 100)
    } else if (coupon.type === 'fixed') {
      discount = Math.min(coupon.value, subtotal)
    }
  }
  discount = Math.round(discount * 100) / 100

  const freeShipping = couponEligible && coupon.type === 'shipping'
  let shipping = 0
  if (items.length > 0) {
    if (shippingMethod === 'express') {
      shipping = EXPRESS_SHIPPING
    } else if (freeShipping || subtotal >= FREE_SHIPPING_THRESHOLD) {
      shipping = 0
    } else {
      shipping = STANDARD_SHIPPING
    }
  }

  const total = Math.max(0, Math.round((subtotal - discount + shipping) * 100) / 100)
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  return {
    itemCount,
    subtotal,
    discount,
    shipping,
    total,
    coupon,
    couponEligible,
    freeShipping,
    remainingForFreeShipping,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    shippingMethod,
  }
}
