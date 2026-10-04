export const formatUSD = (value: number, options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: Number.isInteger(value) ? 0 : 2, ...options }).format(value)

export const formatDate = (value: string | Date) => new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
}).format(new Date(value))

export const todayInBhutan = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Thimphu', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now)
  const dateParts = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`
}

export const safeExternalUrl = (value: string) => {
  try {
    const url = new URL(value)
    if (url.protocol === 'https:') return Boolean(url.hostname) && !url.username && !url.password
    return url.protocol === 'mailto:' || url.protocol === 'tel:'
  } catch {
    return false
  }
}
