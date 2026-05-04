import { useEffect, useState } from 'react'
import { BG_IMAGES } from '../lib/bgImages'

function decodeOne(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (img.decode) img.decode().then(resolve, resolve)
      else resolve()
    }
    img.onerror = () => resolve()
    img.src = url
  })
}

export default function BootSplash({ onReady }) {
  const [done, setDone] = useState(0)
  const total = BG_IMAGES.length

  useEffect(() => {
    let cancelled = false
    let count = 0
    Promise.all(
      BG_IMAGES.map((url) =>
        decodeOne(url).then(() => {
          if (cancelled) return
          count += 1
          setDone(count)
        }),
      ),
    ).then(() => {
      if (!cancelled) onReady?.()
    })
    return () => {
      cancelled = true
    }
  }, [onReady])

  const pct = total === 0 ? 100 : Math.round((done / total) * 100)

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white">
      <div className="text-[2rem] font-bold tracking-wide opacity-80">
        Camera dei Deputati
      </div>
      <div className="mt-[1rem] text-[1.25rem] opacity-60">
        Caricamento…
      </div>
      <div className="mt-[3rem] h-[0.5rem] w-[28rem] overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full bg-white transition-[width] duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
