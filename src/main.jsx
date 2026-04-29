import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Workbox } from 'workbox-window'
import App from './App.jsx'
import BootSplash from './components/BootSplash.jsx'
import { preloadAll } from './lib/preloadImages.js'
import './index.css'

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  const wb = new Workbox('/sw.js')
  wb.addEventListener('waiting', () => wb.messageSkipWaiting())
  wb.register().catch(() => {})
}

// Se il SW è già in controllo della pagina, gli asset sono in Cache Storage:
// salta lo splash e precarica in background per popolare la memory cache del browser.
const hasSWController =
  'serviceWorker' in navigator && !!navigator.serviceWorker.controller

if (hasSWController) {
  preloadAll()
}

function Boot() {
  const [ready, setReady] = useState(hasSWController)
  return ready ? <App /> : <BootSplash onReady={() => setReady(true)} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Boot />
  </StrictMode>,
)
