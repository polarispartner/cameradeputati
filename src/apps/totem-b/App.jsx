import { useState } from 'react'
import bgImg from '../../shared/assets/homepage-bg.jpg'
import logoCamera from '../../shared/assets/logo-camera.png'
import logo80 from '../../shared/assets/logo-80.png'
import anniImg from '../../shared/assets/anni.png'
import homeIcon from '../../shared/assets/home.png'
import HiddenReload from '../../shared/components/HiddenReload'
import PdfFlipbook from '../../shared/components/PdfFlipbook'
import { AUTHORS } from './data/content'
import { PDF_PAGES } from './assets/pdfs/manifest'

export default function App() {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <HiddenReload />
      <div className="flex h-full w-full flex-col overflow-hidden bg-blu">
        <Header />

        <main className="relative flex flex-1 min-h-0 flex-col items-center justify-start px-[2rem] pt-[2rem] pb-[1.5rem]">
          {selected ? (
            <ReaderView author={selected} onBack={() => setSelected(null)} />
          ) : (
            <ListView onSelect={setSelected} />
          )}
        </main>

        <Footer />
      </div>
    </>
  )
}

function Header() {
  return (
    <header className="relative flex shrink-0 flex-col items-center bg-white pt-[2rem] pb-[2rem]">
      <img
        src={bgImg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-white/55" />
      <div className="relative flex flex-col items-center text-blu">
        <div className="flex items-center gap-[1.5rem]">
          <img src={logoCamera} alt="Camera dei deputati" className="h-[5rem] w-auto" draggable={false} />
          <img src={logo80} alt="80° Assemblea Costituente" className="h-[5rem] w-auto" draggable={false} />
        </div>
        <h1 className="mt-[1.25rem] text-center text-[3.75rem] leading-[1.05] font-extrabold tracking-[-0.01em]">
          La Memorialistica
        </h1>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="relative flex shrink-0 items-center justify-center bg-white py-[2rem]">
      <img
        src={bgImg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-white/55" />
      <div className="relative flex items-center gap-[1.5rem] text-blu">
        <img src={anniImg} alt="1945 1946 1947" className="h-[9rem] w-auto" draggable={false} />
        <div className="flex flex-col">
          <h2 className="text-[2.5rem] leading-[1] font-bold tracking-[-0.01em]">
            Nasce la
            <br />
            Repubblica
          </h2>
          <p className="mt-[0.75rem] text-[1.5rem] leading-[1.2] font-medium">
            L'Assemblea
            <br />
            Costituente
            <br />a Montecitorio
          </p>
        </div>
      </div>
    </footer>
  )
}

function ListView({ onSelect }) {
  return (
    <div className="flex h-full w-full min-h-0 flex-col">
      <div className="grid h-full w-full grid-cols-2 gap-x-[1.25rem] gap-y-[0.75rem] content-start">
        {AUTHORS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelect(a)}
            className="flex w-full flex-col items-start rounded-[0.75rem] bg-white/8 px-[1.25rem] py-[0.9rem] text-left transition-opacity duration-150 active:scale-[0.98] active:bg-white/15"
          >
            <span className="text-[1.6rem] leading-[1.1] font-bold text-white">
              {a.name}
            </span>
            <span className="mt-[0.35rem] line-clamp-2 text-[1.05rem] leading-[1.2] font-medium text-white/70">
              {a.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ReaderView({ author, onBack }) {
  const pages = PDF_PAGES[author.id] ?? []

  return (
    <div className="flex h-full w-full min-h-0 flex-col items-stretch">
      <div className="flex shrink-0 flex-col items-center px-[1rem] pb-[1.25rem] text-center text-white">
        <h2 className="text-[2.25rem] leading-[1.1] font-extrabold tracking-[-0.01em]">
          {author.name}
        </h2>
        <p className="mt-[0.4rem] text-[1.35rem] leading-[1.2] font-medium text-white/80">
          {author.title}
        </p>
      </div>

      <div className="relative flex min-h-0 flex-1">
        <PdfFlipbook pages={pages} themeColor="#063955" arrows="side" />
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-[1.25rem] flex shrink-0 cursor-pointer items-center justify-center gap-[0.75rem] self-center rounded-full bg-white px-[1.75rem] py-[0.875rem] text-blu transition-opacity duration-150 active:opacity-80"
      >
        <img src={homeIcon} alt="" className="h-[1.5rem] w-auto" draggable={false} />
        <span className="text-[1.5rem] font-bold">Indietro</span>
      </button>
    </div>
  )
}
