import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Sidebar from "./Sidebar";
import bgImg from "../assets/images/menu-bg.jpg";

// I titoli erano SVG (glifi convertiti in tracciati): non editabili e con copy
// obsoleto. Ora sono testo vero in Open Sans (già caricato) riproducendo i due
// stati del design: "retino" (riempimento a righe diagonali) di default e
// "pieno" (bianco solido) al tocco. Modificare i titoli qui sotto.
const sections = [
  { id: "consulta", to: "/t/consulta", title: "La Consulta Nazionale" },
  { id: "donne", to: "/t/donne", title: "Il voto alle donne" },
  { id: "referendum", to: "/t/referendum", title: "Il referendum istituzionale" },
  { id: "costituente", to: "/t/costituente", title: "L'Assemblea Costituente" },
];

// Riempimento "retino": righe diagonali bianche sottili che salgono da sinistra
// verso destra (/), ottenute con un gradiente ripetuto ritagliato sul testo.
// Le misure sono in `em` così scalano col font.
const RETINO_FILL =
  "repeating-linear-gradient(45deg, #fff 0 0.06em, transparent 0.06em 0.09em)";

export default function Menu() {
  const navigate = useNavigate();
  const [tapped, setTapped] = useState(null);

  const onSection = (s) => {
    if (tapped) return;
    setTapped(s.id);
    setTimeout(() => {
      setTapped(null);
      if (s.to) navigate({ to: s.to });
    }, 120);
  };

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-black">
      <Sidebar />

      <main className="relative flex-1 overflow-hidden">
        <img
          src={bgImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/45" />

        <ul className="relative flex h-full flex-col justify-center gap-[2.5rem] pl-[4rem] pr-[3rem]">
          {sections.map((s) => {
            const isFilled = tapped === s.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onSection(s)}
                  aria-label={s.title}
                  className="block cursor-pointer text-left"
                >
                  <span
                    className={`block whitespace-nowrap text-[5rem] leading-none font-extrabold ${
                      isFilled ? "text-white" : "bg-clip-text text-transparent"
                    }`}
                    style={isFilled ? undefined : { backgroundImage: RETINO_FILL }}
                  >
                    {s.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
