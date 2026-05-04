export default function ScreenLoader({ themeColor = '#ffffff' }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
      <div
        className="h-[3rem] w-[3rem] animate-spin rounded-full border-[0.25rem] border-white/15"
        style={{ borderTopColor: themeColor }}
        aria-label="Caricamento"
        role="status"
      />
    </div>
  )
}
