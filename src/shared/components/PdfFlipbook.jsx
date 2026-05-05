import { useState } from 'react'

export default function PdfFlipbook({ pages, themeColor, arrows = 'below' }) {
  const [pageIndex, setPageIndex] = useState(0)
  const total = pages.length
  const canPrev = pageIndex > 0
  const canNext = pageIndex < total - 1
  const goPrev = () => canPrev && setPageIndex((i) => i - 1)
  const goNext = () => canNext && setPageIndex((i) => i + 1)

  const arrowBtn = (dir) => {
    const isPrev = dir === 'prev'
    const sideClass = arrows === 'side'
      ? `absolute top-1/2 -translate-y-1/2 ${isPrev ? 'left-[0.5rem]' : 'right-[0.5rem]'} shadow-lg`
      : ''
    return (
      <button
        type="button"
        onClick={isPrev ? goPrev : goNext}
        disabled={isPrev ? !canPrev : !canNext}
        aria-label={isPrev ? 'Pagina precedente' : 'Pagina successiva'}
        className={`flex h-[5rem] w-[5rem] items-center justify-center rounded-full text-[2.5rem] font-black text-white transition-opacity duration-150 active:scale-95 disabled:opacity-30 ${sideClass}`}
        style={{ backgroundColor: themeColor }}
      >
        {isPrev ? '‹' : '›'}
      </button>
    )
  }

  return (
    <div className="flex h-full w-full min-h-0 flex-col items-stretch">
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <img
          key={pageIndex}
          src={pages[pageIndex]}
          alt=""
          draggable={false}
          decoding="async"
          className="max-h-full max-w-full object-contain"
        />
        {total > 1 && arrows === 'side' && (
          <>
            {arrowBtn('prev')}
            {arrowBtn('next')}
          </>
        )}
      </div>

      {total > 1 && arrows === 'below' && (
        <div className="mt-[1.5rem] flex shrink-0 items-center justify-center gap-[1.5rem]">
          {arrowBtn('prev')}
          <div className="min-w-[6rem] text-center text-[1.5rem] font-bold tabular-nums text-white">
            {pageIndex + 1} / {total}
          </div>
          {arrowBtn('next')}
        </div>
      )}

      {total > 1 && arrows === 'side' && (
        <div className="mt-[1rem] shrink-0 text-center text-[1.5rem] font-bold tabular-nums text-white">
          {pageIndex + 1} / {total}
        </div>
      )}
    </div>
  )
}
