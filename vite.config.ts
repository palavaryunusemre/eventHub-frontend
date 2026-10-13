import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Operatör backend'i (main_operator.py) varsayılan olarak port 8001'de
// çalışır. Dev sunucusunda proxy kullanmak, cookie tabanlı oturumu
// (bkz. app/core/auth.py) CORS karmaşasına hiç girmeden, tarayıcının
// tek bir origin (localhost:5173) gördüğü basit bir modelle çalıştırır
// — prod build ayrı sunulacaksa CORS_ALLOWED_ORIGINS zaten hazır.
//
// Not: "test" alanı Vitest'e ait, ama vitest kendi iç içe vite kopyasını
// getirdiğinden `vite` paketinden gelen UserConfig tipiyle çakışıyor —
// bu yüzden bütün config nesnesi `any` olarak geçiriliyor (yalnızca bu
// dosyaya özel, uygulama kodunun type-checking'ini etkilemiyor).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Docker'ın Windows port yönlendirmesinde localhost bazen IPv6 (::1)
        // adresine çözülüyor ve backend yanıtı beklemede kalabiliyor.
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    server: {
      deps: {
        inline: [/@ant-design\/colors/, /@ant-design\/icons/],
      },
    },
  },
} as never)
