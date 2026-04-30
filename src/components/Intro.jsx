import { useNavigate } from '@tanstack/react-router'
import bgImg from '../assets/images/homepage-bg.jpg'
import logoCamera from '../assets/images/logo-camera.png'
import logo80 from '../assets/images/logo-80.png'
import anniImg from '../assets/images/anni.png'
import { useOrientation, setOrientation } from '../lib/orientation'

/*
  Schermata di intro (00_HP).
  Canvas PSD 1920x1080.
  - BG: foto folla 4K
  - Overlay bianco a tutta larghezza dietro il blocco contenuti
  - Contenuto allineato a sinistra all'interno dell'overlay
  - Colonna anni: immagine PNG
*/

export default function Intro() {
  const navigate = useNavigate()
  const orientation = useOrientation()
  const onEnter = () => navigate({ to: '/menu' })

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      <img
        src={bgImg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Overlay bianco a tutta larghezza dietro il blocco contenuti */}
      <div className="absolute top-1/2 left-0 flex w-full -translate-y-1/2 justify-center bg-white/60 py-[4rem]">
        <div className="flex flex-col items-center text-blu">
          <div className="flex flex-col items-start">
          {/* Loghi */}
          <div className="flex items-center gap-[1.75rem]">
            <img src={logoCamera} alt="Camera dei deputati" className="h-[4rem] w-auto" draggable={false} />
            <img src={logo80} alt="80° Assemblea Costituente" className="h-[4rem] w-auto" draggable={false} />
          </div>

          {/* Blocco titolo */}
          <div className="mt-[2.5rem] flex items-center gap-[2rem]">
            <img
              src={anniImg}
              alt="1945 1946 1947"
              className="h-[24rem] w-auto"
              draggable={false}
            />
            <h1 className="text-[7rem] leading-[7rem] font-bold tracking-[-0.01em]">
              Nasce la
              <br />
              Repubblica
            </h1>
          </div>

            <p className="mt-[1.5rem] text-[3.5rem] leading-[3.5rem] font-bold">
              L'Assemblea Costituente a Montecitorio
            </p>
          </div>

          <button
            type="button"
            onClick={onEnter}
            className="mt-[2.25rem] cursor-pointer rounded-full bg-blu px-[1.5rem] py-[1rem] text-[2rem] font-bold text-white transition-opacity duration-150 active:opacity-80"
          >
            Scopri i contenuti
          </button>
        </div>
      </div>

      <div className="absolute bottom-[1.5rem] left-1/2 -translate-x-1/2 flex items-center gap-[0.25rem] rounded-full bg-blu/90 p-[0.25rem] text-white">
        <OrientationOption
          label="Tavolo orizzontale"
          active={orientation === 'horizontal'}
          onClick={() => setOrientation('horizontal')}
        />
        <OrientationOption
          label="Totem verticale"
          active={orientation === 'vertical'}
          onClick={() => setOrientation('vertical')}
        />
      </div>
    </div>
  )
}

function OrientationOption({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full px-[1.25rem] py-[0.625rem] text-[1.125rem] font-bold transition-colors duration-150 ${
        active ? 'bg-white text-blu' : 'text-white active:opacity-70'
      }`}
    >
      {label}
    </button>
  )
}
