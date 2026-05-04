import { useEffect, useState } from 'react'

const REVEAL_MS = 4000

const POSITIONS = {
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0',
  'bottom-right': 'bottom-0 right-0',
  'bottom-left': 'bottom-0 left-0',
}

// Invisible touch zone (~4rem) in a corner. Tap reveals a reload button
// for REVEAL_MS; tap the button to force window.location.reload().
export default function HiddenReload({ corner = 'top-right' }) {
  const [revealed, setRevealed] = useState(false)
  const pos = POSITIONS[corner] ?? POSITIONS['top-right']

  useEffect(() => {
    if (!revealed) return
    const t = setTimeout(() => setRevealed(false), REVEAL_MS)
    return () => clearTimeout(t)
  }, [revealed])

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={() => setRevealed(true)}
        aria-label="Mostra reload"
        className={`fixed ${pos} z-[10000] h-[4rem] w-[4rem] opacity-0`}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      aria-label="Ricarica"
      className={`fixed ${pos} z-[10000] m-[1rem] flex h-[3.5rem] w-[3.5rem] cursor-pointer items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-opacity duration-150 active:opacity-70`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[1.75rem] w-[1.75rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    </button>
  )
}
