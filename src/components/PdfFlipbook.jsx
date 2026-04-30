import { useState } from 'react'

export default function PdfFlipbook({ pages, themeColor }) {
  const [pageIndex, setPageIndex] = useState(0)
  const total = pages.length
  const canPrev = pageIndex > 0
  const canNext = pageIndex < total - 1

  return (
    <div className="flex h-full w-full min-h-0 flex-col items-stretch">
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        {pages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            draggable={false}
            className="absolute max-h-full max-w-full object-contain transition-opacity duration-200"
            style={{ opacity: i === pageIndex ? 1 : 0 }}
          />
        ))}
      </div>

      <div className="mt-[1.5rem] flex shrink-0 items-center justify-center gap-[1.5rem]">
        <button
          type="button"
          onClick={() => canPrev && setPageIndex((i) => i - 1)}
          disabled={!canPrev}
          aria-label="Pagina precedente"
          className="flex h-[5rem] w-[5rem] items-center justify-center rounded-full text-[2.5rem] font-black text-white transition-opacity duration-150 active:scale-95 disabled:opacity-30"
          style={{ backgroundColor: themeColor }}
        >
          ‹
        </button>

        <div className="min-w-[6rem] text-center text-[1.5rem] font-bold tabular-nums text-white">
          {pageIndex + 1} / {total}
        </div>

        <button
          type="button"
          onClick={() => canNext && setPageIndex((i) => i + 1)}
          disabled={!canNext}
          aria-label="Pagina successiva"
          className="flex h-[5rem] w-[5rem] items-center justify-center rounded-full text-[2.5rem] font-black text-white transition-opacity duration-150 active:scale-95 disabled:opacity-30"
          style={{ backgroundColor: themeColor }}
        >
          ›
        </button>
      </div>
    </div>
  )
}
