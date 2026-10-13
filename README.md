# EventHub — Frontend

Etkinlik/seminer platformunun React arayüzü: etkinlik keşfi/oluşturma, QR ile
kayıt ve check-in, sertifika görüntüleme/indirme ve admin onay kuyruğu.

## Docker ile çalıştırma

Bu proje `../eventhub-backend/docker-stack/docker-compose.yml` içindeki
`eventhub-frontend` servisi olarak build edilir (Dockerfile burada, `../..`
göreli yoluyla referans alınır):

```bash
cd ../eventhub-backend/docker-stack
docker compose up -d --build eventhub-frontend
```

`http://localhost:8081` üzerinden erişilir. nginx (`nginx.conf`), `/api/*`
isteklerini aynı origin üzerinden `eventhub-backend:8080`'e proxy'ler — bu
sayede backend'in yazdığı HttpOnly auth/refresh cookie'leri cross-origin
sorunu yaşamadan çalışır.

## Yerel geliştirme (Docker olmadan)

```bash
npm install
npm run dev
```

`vite.config.ts`, dev sunucusunda `/api` isteklerini `http://127.0.0.1:8080`'e proxy'ler
(backend'in Docker dışında, doğrudan `mvnw spring-boot:run` ile ayakta olduğu varsayılır).

## Testler

```bash
npm run test     # Vitest + React Testing Library
npm run build    # tsc -b && vite build
npm run lint
```

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
