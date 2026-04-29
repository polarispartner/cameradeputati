import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Workbox } from 'workbox-window'
import App from './App.jsx'
import BootSplash from './components/BootSplash.jsx'
import './index.css'

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  const wb = new Workbox('/sw.js')
  wb.addEventListener('waiting', () => wb.messageSkipWaiting())
  wb.register().catch(() => {
    // Registration failure shouldn't block the app
  })
}

function Boot() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!ready) return
    document.documentElement.dataset.booted = 'true'
  }, [ready])
  return (
    <>
      {!ready && <BootSplash onReady={() => setReady(true)} />}
      {ready && <App />}
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Boot />
  </StrictMode>,
)
