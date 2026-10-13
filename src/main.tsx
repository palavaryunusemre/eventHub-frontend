import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/list-page.css'
import './i18n/i18n'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('#root elementi bulunamadı')

createRoot(rootElement).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
)
