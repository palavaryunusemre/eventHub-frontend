/**
 * axiosInstance ile AuthContext arasında döngüsel import olmadan haberleşmek
 * için minik bir pub/sub — refresh token da geçersiz çıkarsa (7 günlük
 * oturum tamamen bitmiş) AuthContext'e "kullanıcıyı çıkışa düşür" sinyali
 * gönderir.
 */
type Listener = () => void
const listeners = new Set<Listener>()

export function onSessionExpired(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function notifySessionExpired(): void {
  listeners.forEach((listener) => listener())
}
