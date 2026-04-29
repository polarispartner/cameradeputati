import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Workbox } from 'workbox-window'
import App from './App.jsx'
import BootSplash from './components/BootSplash.jsx'
import ImageCacheKeeper from './components/ImageCacheKeeper.jsx'
import './index.css'

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  const wb = new Workbox('/sw.js')
  wb.addEventListener('waiting', () => wb.messageSkipWaiting())
  wb.register().catch(() => {})
}

const hasSWController =
  'serviceWorker' in navigator && !!navigator.serviceWorker.controller

function Boot() {
  const [ready, setReady] = useState(hasSWController)
  return ready ? (
    <>
      <App />
      <ImageCacheKeeper />
    </>
  ) : (
    <BootSplash onReady={() => setReady(true)} />
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Boot />
  </StrictMode>,
)
