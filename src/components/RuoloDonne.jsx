import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Sidebar from "./Sidebar";
import bgImg from "../assets/images/ruolo-donne-bg.jpg";

const THEME = "#1ed0c7";

const sections = [
  { id: "suffragio", title: "Suffragio" },
  { id: "consulta", title: "La Consulta" },
  { id: "sindache", title: "Le Sindache" },
  { id: "costituenti", title: "Le Costituenti" },
];

const submenu = [
  { id: "foto", title: "Foto/video" },
  { id: "giornale", title: "Giornale" },
  { id: "documenti", title: "Documenti" },
];

function Submenu({ items, onPick }) {
  // Coordinate in unità viewBox (1 unit = 1px @ 1rem=16px). Scalano con rem.
  const ITEM_H = 48; // text-[3rem] leading-[1]
  const GAP = 28;
  const R = 16; // raggio angolo stondato
  const STUB = 20; // segmento orizzontale dopo l'angolo
  const X = 2; // colonna verticale
  const W = X + R + STUB + 4;
  const centers = items.map((_, i) => i * (ITEM_H + GAP) + ITEM_H / 2);
  const lastCy = centers[centers.length - 1];
  // La verticale si ferma dove inizia l'ultima curva: così non resta un cap sotto.
  const lineBottom = lastCy - R;
  const H = lastCy + 4;

  return (
    <div className="absolute top-[calc(3rem+1.5rem)] left-1/2 flex items-start gap-[0.75rem]">
      <svg
        width={`${W / 16}rem`}
        height={`${H / 16}rem`}
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1={X} y1="0" x2={X} y2={lineBottom} />
        {centers.map((cy) => (
          <path
            key={cy}
            d={`M ${X} ${cy - R} Q ${X} ${cy} ${X + R} ${cy} L ${X + R + STUB} ${cy}`}
          />
        ))}
      </svg>
      <ul
        className="flex flex-col"
        style={{ gap: `${GAP / 16}rem` }}
      >
        {items.map((sub) => (
          <li key={sub.id} style={{ height: `${ITEM_H / 16}rem` }} className="flex items-center">
            <button
              type="button"
              onClick={() => onPick(sub.id)}
              className="cursor-pointer text-[3rem] leading-[1] font-black text-white transition-opacity duration-150 active:opacity-70"
            >
              {sub.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RuoloDonne() {
  const [openId, setOpenId] = useState(null);
  const navigate = useNavigate();

  const onSection = (id) => {
    setOpenId((curr) => (curr === id ? null : id));
  };

  const onSub = (sectionId, subId) => {
    if (subId === "foto") {
      navigate({ to: "/donne/$sectionId/foto", params: { sectionId } });
    }
  };

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-black">
      <Sidebar bgColor={THEME} showBack />

      <main className="relative flex-1 overflow-hidden">
        <img
          src={bgImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <h1
            className="text-center text-[5.5rem] leading-[1] font-black tracking-tight"
            style={{ color: THEME }}
          >
            Il ruolo delle donne
          </h1>

          {/* Grafica a pettine che collega il titolo alle 4 sezioni */}
          <div className="mt-[3rem] w-[90%]">
            <svg
              viewBox="0 0 1000 120"
              preserveAspectRatio="none"
              className="block h-[6rem] w-full"
              aria-hidden="true"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* stanghetta centrale dal titolo */}
              <line x1="500" y1="0" x2="500" y2="40" />
              {/* traversa con angoli stondati verso l'alto agli estremi */}
              <path d="M 125 118 L 125 52 Q 125 40 137 40 L 863 40 Q 875 40 875 52 L 875 118" />
              {/* verticali interne verso le sezioni */}
              <line x1="375" y1="40" x2="375" y2="118" />
              <line x1="625" y1="40" x2="625" y2="118" />
            </svg>
          </div>

          <ul className="flex w-[90%] items-start justify-between">
            {sections.map((s) => {
              const isOpen = openId === s.id;
              return (
                <li key={s.id} className="relative flex w-[25%] flex-col items-center">
                  <button
                    type="button"
                    onClick={() => onSection(s.id)}
                    className="cursor-pointer whitespace-nowrap text-[3rem] leading-[1] font-black text-white transition-opacity duration-150 active:opacity-70"
                    style={{ color: isOpen ? THEME : "#ffffff" }}
                  >
                    {s.title}
                  </button>

                  {isOpen && <Submenu items={submenu} onPick={(subId) => onSub(s.id, subId)} />}
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </div>
  );
}
