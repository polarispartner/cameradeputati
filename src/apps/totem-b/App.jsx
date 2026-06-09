import { useState } from "react";
import bgImg from "../../shared/assets/homepage-bg.jpg";
import logoCamera from "../../shared/assets/logo-camera.png";
import logo80 from "../../shared/assets/logo-80.png";
import anniImg from "../../shared/assets/anni.png";
import homeIcon from "../../shared/assets/home.png";
import HiddenReload from "../../shared/components/HiddenReload";
import { AUTHORS } from "./data/content";
import { PDF_PAGES } from "./assets/pdfs/manifest";

const CRONOLOGIA_PAGES = PDF_PAGES["Cronologia Istituzionale"] ?? [];

// Il totem dell'area incontri ospita due contenuti: "La Memorialistica" (elenco
// di 17 autori, ognuno con il proprio brano sfogliabile) e la "Cronologia
// istituzionale" (un documento sfogliabile). Una Home con due scelte porta alle
// rispettive sezioni; entrambe sfogliano a doppia pagina come "La Costituzione".
export default function App() {
  const [view, setView] = useState("home"); // 'home' | 'memorialistica' | 'cronologia'
  const [author, setAuthor] = useState(null);

  const goHome = () => {
    setAuthor(null);
    setView("home");
  };

  const title =
    view === "cronologia"
      ? "Cronologia istituzionale"
      : view === "memorialistica"
        ? "La Memorialistica"
        : null;

  return (
    <>
      <HiddenReload />
      <div className="flex h-full w-full flex-col overflow-hidden bg-blu">
        <Header title={title} />

        <main className="relative flex flex-1 min-h-0 flex-col items-center justify-start px-[2rem] pt-[2.5rem] pb-[2rem]">
          {view === "home" && (
            <HomeView
              onPickMemo={() => setView("memorialistica")}
              onPickCrono={() => setView("cronologia")}
            />
          )}

          {view === "memorialistica" &&
            (author ? (
              <ReaderView author={author} onBack={() => setAuthor(null)} />
            ) : (
              <ListView onSelect={setAuthor} onHome={goHome} />
            ))}

          {view === "cronologia" && (
            <SpreadFlipbook pages={CRONOLOGIA_PAGES} onHome={goHome} homeLabel="Home" />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}

function Header({ title }) {
  return (
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
        {title && (
          <h1 className="mt-[1.5rem] text-center text-[4rem] leading-[1.05] font-extrabold tracking-[-0.01em]">
            {title}
          </h1>
        )}
      </div>
    </header>
  );
}

function Footer() {
  return (
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
  );
}

function HomeView({ onPickMemo, onPickCrono }) {
  return (
    <div className="flex h-full w-full max-w-[42rem] flex-col items-stretch justify-center gap-[2.5rem]">
      <HomeCard label="La Memorialistica" onClick={onPickMemo} />
      <HomeCard label="Cronologia istituzionale" onClick={onPickCrono} />
    </div>
  );
}

function HomeCard({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[11rem] w-full cursor-pointer items-center justify-center rounded-[1.25rem] bg-white px-[2.5rem] py-[2.5rem] text-center text-blu shadow-2xl transition-transform duration-150 active:scale-[0.98]"
    >
      <span className="text-[3.25rem] leading-[1.1] font-extrabold tracking-[-0.01em]">
        {label}
      </span>
    </button>
  );
}

function ListView({ onSelect, onHome }) {
  return (
    <div className="flex h-full w-full min-h-0 flex-col">
      <div className="grid w-full min-h-0 flex-1 grid-cols-2 content-start gap-x-[1.25rem] gap-y-[0.75rem]">
        {AUTHORS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelect(a)}
            className="flex w-full cursor-pointer flex-col items-start rounded-[0.75rem] bg-white/10 px-[1.25rem] py-[0.9rem] text-left transition-transform duration-150 active:scale-[0.98] active:bg-white/20"
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
      <HomeButton label="Home" onClick={onHome} />
    </div>
  );
}

function ReaderView({ author, onBack }) {
  const pages = PDF_PAGES[author.id] ?? [];
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
      {/* key=author.id: rimonta il flipbook all'autore nuovo, riparte da pag. 1 */}
      <SpreadFlipbook key={author.id} pages={pages} onHome={onBack} homeLabel="Indietro" />
    </div>
  );
}

// Spread N (N>=0) mostra le pagine [2N, 2N+1] (1-based: 2N+1 e 2N+2).
// La copertina (pagina 1) sta da sola nel primo spread, con il retro vuoto.
function buildSpreads(pages) {
  const out = [];
  if (!pages || pages.length === 0) return out;
  out.push([null, pages[0]]);
  for (let i = 1; i < pages.length; i += 2) {
    out.push([pages[i], pages[i + 1] ?? null]);
  }
  return out;
}

function SpreadFlipbook({ pages, onHome, homeLabel }) {
  const spreads = buildSpreads(pages);
  const [spread, setSpread] = useState(0);
  const total = spreads.length;
  const canPrev = spread > 0;
  const canNext = spread < total - 1;
  const goPrev = () => canPrev && setSpread((s) => s - 1);
  const goNext = () => canNext && setSpread((s) => s + 1);
  const [leftPage, rightPage] = spreads[spread] ?? [null, null];

  return (
    <div className="flex h-full w-full min-h-0 flex-col items-center justify-start">
      <div className="relative flex w-full min-h-0 flex-1 items-start justify-center">
        <div className="flex h-full w-full items-stretch justify-center gap-[0.25rem]">
          <SpreadHalf src={leftPage} side="left" />
          <SpreadHalf src={rightPage} side="right" />
        </div>

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

      <HomeButton label={homeLabel} onClick={onHome} />
    </div>
  );
}

function HomeButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-[1.75rem] flex shrink-0 cursor-pointer items-center gap-[0.75rem] self-center rounded-full bg-white px-[1.75rem] py-[0.875rem] text-blu transition-opacity duration-150 active:opacity-80"
    >
      <img src={homeIcon} alt="" className="h-[1.5rem] w-auto" draggable={false} />
      <span className="text-[1.5rem] font-bold">{label}</span>
    </button>
  );
}

function SpreadHalf({ src, side }) {
  // Metà spread: occupa il 50% di larghezza, adatta l'immagine all'altezza,
  // allineata al bordo interno.
  const align = side === "left" ? "justify-end" : "justify-start";
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
  );
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
      {dir === "left" ? (
        <polyline points="15 6 9 12 15 18" />
      ) : (
        <polyline points="9 6 15 12 9 18" />
      )}
    </svg>
  );
}
