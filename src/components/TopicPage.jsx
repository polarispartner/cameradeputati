import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import Sidebar from "./Sidebar";
import { findTopic } from "../data/content";

function Submenu({ items, onPick }) {
  const ITEM_H = 48;
  const GAP = 28;
  const R = 16;
  const STUB = 20;
  const X = 2;
  const W = X + R + STUB + 4;
  const centers = items.map((_, i) => i * (ITEM_H + GAP) + ITEM_H / 2);
  const lastCy = centers[centers.length - 1];
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
      <ul className="flex flex-col" style={{ gap: `${GAP / 16}rem` }}>
        {items.map((sub) => (
          <li
            key={sub.id}
            style={{ height: `${ITEM_H / 16}rem` }}
            className="flex items-center"
          >
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

// Pettine SVG parametrico: collega il titolo a N colonne equispaziate.
function Pettine({ count }) {
  if (count < 1) return null;
  const W = 1000;
  const H = 120;
  const MARGIN = 125;
  const R = 12;
  const topY = 40;
  const xs = Array.from({ length: count }, (_, i) =>
    count === 1 ? W / 2 : MARGIN + (i * (W - 2 * MARGIN)) / (count - 1),
  );
  const leftX = xs[0];
  const rightX = xs[xs.length - 1];
  const innerXs = xs.slice(1, -1);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="block h-[6rem] w-full"
      aria-hidden="true"
      fill="none"
      stroke="#ffffff"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1={W / 2} y1="0" x2={W / 2} y2={topY} />
      {count === 1 ? (
        <line x1={W / 2} y1={topY} x2={W / 2} y2={H - 2} />
      ) : (
        <>
          <path
            d={`M ${leftX} ${H - 2} L ${leftX} ${topY + R} Q ${leftX} ${topY} ${leftX + R} ${topY} L ${rightX - R} ${topY} Q ${rightX} ${topY} ${rightX} ${topY + R} L ${rightX} ${H - 2}`}
          />
          {innerXs.map((x) => (
            <line key={x} x1={x} y1={topY} x2={x} y2={H - 2} />
          ))}
        </>
      )}
    </svg>
  );
}

export default function TopicPage() {
  const { topicId } = useParams({ from: "/t/$topicId" });
  const topic = findTopic(topicId);
  const [openId, setOpenId] = useState(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setBgLoaded(false);
  }, [topic?.bg]);

  if (!topic) return null;

  const onSection = (id) => {
    setOpenId((curr) => (curr === id ? null : id));
  };

  const onSub = (sectionId, subType) => {
    navigate({
      to: "/t/$topicId/$sectionId/$subType",
      params: { topicId, sectionId, subType },
    });
  };

  const widthPct = 100 / topic.sections.length;

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-black">
      <Sidebar bgColor={topic.theme} showBack />

      <main className="relative flex-1 overflow-hidden">
        <img
          src={topic.bg}
          alt=""
          onLoad={() => setBgLoaded(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
          style={{ opacity: bgLoaded ? 1 : 0 }}
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <h1
            className="text-center text-[5.5rem] leading-[1] font-black tracking-tight"
            style={{ color: topic.theme }}
          >
            {topic.title}
          </h1>

          <div className="mt-[3rem] w-[90%]">
            <Pettine count={topic.sections.length} />
          </div>

          <ul className="flex w-[90%] items-start justify-between">
            {topic.sections.map((s) => {
              const isOpen = openId === s.id;
              const submenuItems = s.subsections.map((sub) => ({
                id: sub.type,
                title: sub.title,
              }));
              return (
                <li
                  key={s.id}
                  className="relative flex flex-col items-center"
                  style={{ width: `${widthPct}%` }}
                >
                  <button
                    type="button"
                    onClick={() => onSection(s.id)}
                    className="cursor-pointer whitespace-nowrap text-[3rem] leading-[1] font-black text-white transition-opacity duration-150 active:opacity-70"
                    style={{ color: isOpen ? topic.theme : "#ffffff" }}
                  >
                    {s.title}
                  </button>

                  {isOpen && (
                    <Submenu
                      items={submenuItems}
                      onPick={(subType) => onSub(s.id, subType)}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </div>
  );
}
