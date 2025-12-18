const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export function resolveCoverUrl(url: string | null) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${API_BASE_URL}${url}`
}