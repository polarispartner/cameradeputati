import { useMemo, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import Sidebar from "./Sidebar";
import ScreenLoader from "./ScreenLoader";
import { findTopic, findSection, findSubsection } from "../data/content";
import { useImagesReady } from "../lib/useImagesReady";
import { useOrientation } from "../lib/orientation";

const PAGE_SIZE = 18;
const ANIM_MS = 280;

export default function GridPage() {
  const { topicId, sectionId, subType } = useParams({
    from: "/t/$topicId/$sectionId/$subType",
  });
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState("next");
  const [pressedId, setPressedId] = useState(null);
  const isVertical = useOrientation() === "vertical";

  const topic = findTopic(topicId);
  const section = findSection(topicId, sectionId);
  const subsection = findSubsection(topicId, sectionId, subType);
  const items = subsection?.items ?? [];

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const visible = useMemo(
    () => items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [items, page],
  );

  const preloadUrls = useMemo(() => {
    const urls = visible.map((it) => it.thumb ?? it.image).filter(Boolean);
    if (topic?.bg) urls.push(topic.bg);
    return urls;
  }, [visible, topic?.bg]);
  const ready = useImagesReady(preloadUrls);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const goPrev = () => {
    if (!canPrev) return;
    setDirection("prev");
    setPage((p) => p - 1);
  };
  const goNext = () => {
    if (!canNext) return;
    setDirection("next");
    setPage((p) => p + 1);
  };

  const handleCardPress = (itemId) => {
    if (pressedId) return;
    setPressedId(itemId);
    setTimeout(() => {
      navigate({
        to: "/t/$topicId/$sectionId/$subType/$itemId",
        params: { topicId, sectionId, subType, itemId },
      });
    }, 180);
  };

  if (!topic) return null;

  const theme = topic.theme;
  const animation =
    direction === "next"
      ? `slide-in-right ${ANIM_MS}ms ease-out`
      : `slide-in-left ${ANIM_MS}ms ease-out`;

  return (
    <div
      className={`relative flex h-full w-full overflow-hidden bg-black ${isVertical ? "flex-col" : ""}`}
    >
      <Sidebar
        bgColor={theme}
        showBack
        onBack={() => navigate({ to: "/t/$topicId", params: { topicId } })}
      />

      <main className="relative flex-1 overflow-hidden">
        {!ready && <ScreenLoader themeColor={theme} />}

        <img
          src={topic.bg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/45" />

        {ready && (
          <div className="relative flex h-full w-full min-h-0 flex-col px-[4rem] py-[2.5rem]">
            <header className="shrink-0">
              <h1
                className="text-[4.5rem] leading-[1] font-black tracking-tight"
                style={{ color: theme }}
              >
                {section?.title ?? "Sezione"}
              </h1>
              <h2 className="mt-[0.5rem] text-[2.75rem] leading-[1] font-black tracking-tight text-white">
                {subsection?.title ?? ""}
              </h2>
            </header>

            <div className="mt-[2rem] flex min-h-0 flex-1 flex-col">
              <div
                key={page}
                className={`grid min-h-0 flex-1 gap-x-[1.5rem] gap-y-[1.25rem] ${
                  isVertical ? "grid-cols-3 grid-rows-6" : "grid-cols-6 grid-rows-3"
                }`}
                style={{ animation }}
              >
                {visible.map((item) => {
                  const isPressed = pressedId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleCardPress(item.id)}
                      className="flex min-h-0 cursor-pointer flex-col items-center gap-[0.5rem]"
                    >
                      <div
                        className="aspect-square min-h-0 max-h-full max-w-full flex-1 overflow-hidden border-[0.4rem] transition-colors duration-150"
                        style={{ borderColor: isPressed ? theme : "#ffffff" }}
                      >
                        <img
                          src={item.thumb ?? item.image}
                          alt=""
                          draggable={false}
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="line-clamp-3 h-[3.9rem] w-full shrink-0 text-center text-[1rem] leading-[1.3] font-medium text-white">
                        {item.title}
                      </p>
                    </button>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-[1rem] flex shrink-0 justify-end gap-[1rem]">
                  <PagerButton
                    direction="prev"
                    disabled={!canPrev}
                    onPress={goPrev}
                    theme={theme}
                  />
                  <PagerButton
                    direction="next"
                    disabled={!canNext}
                    onPress={goNext}
                    theme={theme}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function PagerButton({ direction, disabled, onPress, theme }) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      aria-label={isPrev ? "Pagina precedente" : "Pagina successiva"}
      className="flex h-[3.5rem] w-[3.5rem] cursor-pointer items-center justify-center rounded-full bg-white transition-opacity duration-150 active:opacity-70 disabled:cursor-default disabled:opacity-40"
      style={{ color: theme }}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[1.5rem] w-[1.5rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isPrev ? (
          <polyline points="15 6 9 12 15 18" />
        ) : (
          <polyline points="9 6 15 12 9 18" />
        )}
      </svg>
    </button>
  );
}
