import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Sidebar from "./Sidebar";
import { useOrientation } from "../lib/orientation";
import bgImg from "../assets/images/menu-bg.jpg";
import donneRetino from "../assets/images/menu/01_Il ruolo delle donne_RETINO.svg";
import donnePieno from "../assets/images/menu/01_Il ruolo delle donne_PIENO.svg";
import consultaRetino from "../assets/images/menu/02_La Consulta nazionale_RETINO.svg";
import consultaPieno from "../assets/images/menu/02_La Consulta nazionale_PIENO.svg";
import referendumRetino from "../assets/images/menu/03_Il-Referendum_RETINO.svg";
import referendumPieno from "../assets/images/menu/03_Il Referendum_PIENO.svg";
import costituenteRetino from "../assets/images/menu/04_Assemblea_RETINO.svg";
import costituentePieno from "../assets/images/menu/04_Assemblea_PIENO.svg";

const sections = [
  { id: "donne", to: "/t/donne", alt: "Il ruolo delle donne", retino: donneRetino, pieno: donnePieno },
  { id: "consulta", to: "/t/consulta", alt: "La Consulta nazionale", retino: consultaRetino, pieno: consultaPieno },
  { id: "referendum", to: "/t/referendum", alt: "Il Referendum del 2 giugno", retino: referendumRetino, pieno: referendumPieno },
  { id: "costituente", to: "/t/costituente", alt: "L'Assemblea Costituente", retino: costituenteRetino, pieno: costituentePieno },
];

export default function Menu() {
  const navigate = useNavigate();
  const [tapped, setTapped] = useState(null);
  const isVertical = useOrientation() === "vertical";

  const onSection = (s) => {
    if (tapped) return;
    setTapped(s.id);
    setTimeout(() => {
      setTapped(null);
      if (s.to) navigate({ to: s.to });
    }, 120);
  };

  return (
    <div
      className={`relative flex h-full w-full overflow-hidden bg-black ${isVertical ? "flex-col" : ""}`}
    >
      <Sidebar />

      <main className="relative flex-1 overflow-hidden">
        <img
          src={bgImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/45" />

        <ul className="relative flex h-full flex-col justify-center gap-[2rem] pl-[4rem] pr-[3rem]">
          {sections.map((s) => {
            const isFilled = tapped === s.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onSection(s)}
                  className="block cursor-pointer"
                >
                  <img
                    src={isFilled ? s.pieno : s.retino}
                    alt={s.alt}
                    className="h-[6rem] w-auto"
                    draggable={false}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
