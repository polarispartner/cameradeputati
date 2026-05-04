import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Workbox } from 'workbox-window'
import App from './App.jsx'
import BootSplash from '../../shared/components/BootSplash.jsx'
import BgKeeper from './components/BgKeeper.jsx'
import { setOrientation } from '../../shared/lib/orientation.js'
import { BG_IMAGES } from './lib/bgImages.js'
import '../../shared/index.css'

setOrientation('horizontal')

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
      <BgKeeper />
    </>
  ) : (
    <BootSplash images={BG_IMAGES} onReady={() => setReady(true)} />
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Boot />
  </StrictMode>,
)
