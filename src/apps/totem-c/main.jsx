import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { setOrientation } from '../../shared/lib/orientation.js'
import '../../shared/index.css'

setOrientation('vertical')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
