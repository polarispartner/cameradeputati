import { useEffect, useState } from "react";

const imageModules = import.meta.glob(
  "../assets/images/**/*.{jpg,jpeg,png,svg,webp}",
  { eager: true, query: "?url", import: "default" }
);
const ALL_IMAGES = Object.values(imageModules);

async function preloadOne(url) {
  const img = new Image();
  img.decoding = "async";
  img.src = url;
  try {
    if (img.decode) await img.decode();
    else
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });
  } catch {
    // network/decoding errors: don't block boot, the SW retry/UI fallback handles it
  }
}

export default function BootSplash({ onReady }) {
  const [done, setDone] = useState(0);
  const total = ALL_IMAGES.length;

  useEffect(() => {
    let cancelled = false;
    let count = 0;

    Promise.all(
      ALL_IMAGES.map((url) =>
        preloadOne(url).then(() => {
          if (cancelled) return;
          count += 1;
          setDone(count);
        })
      )
    ).then(() => {
      if (!cancelled) onReady?.();
    });

    return () => {
      cancelled = true;
    };
  }, [onReady]);

  const pct = total === 0 ? 100 : Math.round((done / total) * 100);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white">
      <div className="text-[2rem] font-bold tracking-wide opacity-80">
        Camera dei Deputati
      </div>
      <div className="mt-[1rem] text-[1.25rem] opacity-60">
        Caricamento contenuti…
      </div>
      <div className="mt-[3rem] h-[0.5rem] w-[28rem] overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full bg-white transition-[width] duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-[0.75rem] text-[1rem] tabular-nums opacity-50">
        {done} / {total}
      </div>
    </div>
  );
}
