export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function clearCookie(name: string): void {
  document.cookie = `${name}=; Max-Age=0; path=/`
}
