import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Workbox } from 'workbox-window'
import App from './App.jsx'
import './index.css'

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  const wb = new Workbox('/sw.js')
  wb.addEventListener('waiting', () => wb.messageSkipWaiting())
  wb.register().catch(() => {})
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
