const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0)

export const formatNumber = (value) => new Intl.NumberFormat('en-US').format(Number(value) || 0)
