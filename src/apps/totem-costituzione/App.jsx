import { useState } from 'react'
import bgImg from '../../shared/assets/homepage-bg.jpg'
import logoCamera from '../../shared/assets/logo-camera.png'
import logo80 from '../../shared/assets/logo-80.png'
import anniImg from '../../shared/assets/anni.png'
import homeIcon from '../../shared/assets/home.png'
import { PDF_PAGES } from './assets/pdfs/manifest'

const ALL_PAGES = PDF_PAGES['Costituzione_copia_anastatica'] ?? []

// Spread N (N>=0) shows pages [2N, 2N+1] (1-based: pages 2N+1 e 2N+2).
// La copertina (pagina 1) sta da sola nel primo spread, con il retro vuoto.
const SPREADS = (() => {
  const out = []
  if (ALL_PAGES.length === 0) return out
  out.push([null, ALL_PAGES[0]]) // copertina sola sulla destra
  for (let i = 1; i < ALL_PAGES.length; i += 2) {
    out.push([ALL_PAGES[i], ALL_PAGES[i + 1] ?? null])
  }
  return out
})()

export default function App() {
  const [spread, setSpread] = useState(0)
  const total = SPREADS.length
  const canPrev = spread > 0
  const canNext = spread < total - 1

  const goPrev = () => canPrev && setSpread((s) => s - 1)
  const goNext = () => canNext && setSpread((s) => s + 1)
  const goHome = () => setSpread(0)

  const [leftPage, rightPage] = SPREADS[spread] ?? [null, null]

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-blu">
      {/* Header */}
      <header className="relative flex shrink-0 flex-col items-center bg-white pt-[2.5rem] pb-[3rem]">
        <img
          src={bgImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-white/55" />
        <div className="relative flex flex-col items-center text-blu">
          <div className="flex items-center gap-[1.5rem]">
            <img
              src={logoCamera}
              alt="Camera dei deputati"
              className="h-[5rem] w-auto"
              draggable={false}
            />
            <img
              src={logo80}
              alt="80° Assemblea Costituente"
              className="h-[5rem] w-auto"
              draggable={false}
            />
          </div>
          <h1 className="mt-[1.5rem] text-center text-[4rem] leading-[1.05] font-extrabold tracking-[-0.01em]">
            Costituzione della
            <br />
            Repubblica Italiana
          </h1>
        </div>
      </header>

      {/* Flipbook */}
      <main className="relative flex flex-1 min-h-0 flex-col items-center justify-start px-[2rem] pt-[2.5rem] pb-[2rem]">
        <div className="relative flex w-full min-h-0 flex-1 items-start justify-center">
          {/* spread */}
          <div className="flex h-full w-full items-stretch justify-center gap-[0.25rem]">
            <SpreadHalf src={leftPage} side="left" />
            <SpreadHalf src={rightPage} side="right" />
          </div>

          {/* arrows */}
          <button
            type="button"
            onClick={goPrev}
            disabled={!canPrev}
            aria-label="Pagina precedente"
            className="absolute left-[-2rem] top-1/2 flex h-[5rem] w-[5rem] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-blu shadow-lg transition-opacity duration-150 active:scale-95 disabled:opacity-30"
          >
            <ArrowIcon dir="left" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canNext}
            aria-label="Pagina successiva"
            className="absolute right-[-2rem] top-1/2 flex h-[5rem] w-[5rem] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-blu shadow-lg transition-opacity duration-150 active:scale-95 disabled:opacity-30"
          >
            <ArrowIcon dir="right" />
          </button>
        </div>

        <button
          type="button"
          onClick={goHome}
          className="mt-[1.75rem] flex shrink-0 cursor-pointer items-center gap-[0.75rem] rounded-full bg-white px-[1.75rem] py-[0.875rem] text-blu transition-opacity duration-150 active:opacity-80"
        >
          <img src={homeIcon} alt="" className="h-[1.5rem] w-auto" draggable={false} />
          <span className="text-[1.5rem] font-bold">Home</span>
        </button>
      </main>

      {/* Footer */}
      <footer className="relative flex shrink-0 items-center justify-center bg-white py-[3rem]">
        <img
          src={bgImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-white/55" />
        <div className="relative flex items-center gap-[2rem] text-blu">
          <img
            src={anniImg}
            alt="1945 1946 1947"
            className="h-[12rem] w-auto"
            draggable={false}
          />
          <div className="flex flex-col">
            <h2 className="text-[3.25rem] leading-[1] font-bold tracking-[-0.01em]">
              Nasce la
              <br />
              Repubblica
            </h2>
            <p className="mt-[1rem] text-[1.75rem] leading-[1.2] font-medium">
              L'Assemblea
              <br />
              Costituente
              <br />a Montecitorio
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function SpreadHalf({ src, side }) {
  // Half a spread: occupies 50% width, fits image to height; aligns to inner edge.
  const align = side === 'left' ? 'justify-end' : 'justify-start'
  return (
    <div className={`flex h-full w-1/2 items-center ${align}`}>
      {src ? (
        <img
          src={src}
          alt=""
          draggable={false}
          decoding="async"
          className="max-h-full max-w-full object-contain shadow-2xl"
        />
      ) : (
        <div className="h-full w-full" aria-hidden="true" />
      )}
    </div>
  )
}

function ArrowIcon({ dir }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[2rem] w-[2rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {dir === 'left' ? (
        <polyline points="15 6 9 12 15 18" />
      ) : (
        <polyline points="9 6 15 12 9 18" />
      )}
    </svg>
  )
}
