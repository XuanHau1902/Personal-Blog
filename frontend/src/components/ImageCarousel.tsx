import { useEffect, useRef, useState } from "react";
import ImageLightbox from "./ImageLightbox";

function ArrowButton({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Ảnh trước" : "Ảnh tiếp theo"}
      className={`absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition duration-150 hover:scale-110 hover:bg-black/80 ${
        direction === "left" ? "left-2" : "right-2"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Gỡ ảnh"
      className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition duration-150 hover:scale-110 hover:bg-red-500"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </svg>
    </button>
  );
}

function DotIndicator({ total, active }: { total: number; active: number }) {
  return (
    <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1.5 backdrop-blur">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-200 ${
            i === active ? "w-4 bg-white" : "w-1.5 bg-white/40"
          }`}
        />
      ))}
    </div>
  );
}

interface Props {
  urls: string[];
  /** Editable mode: shows a remove button on each image and disables the lightbox. */
  onRemove?: (index: number) => void;
}

export default function ImageCarousel({ urls, onRemove }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const editable = Boolean(onRemove);

  function goTo(index: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!el || el.clientWidth === 0) return;
        setActive(Math.round(el.scrollLeft / el.clientWidth));
      });
    }
    el.addEventListener("scroll", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (urls.length === 0) return null;

  return (
    <div className="relative my-6 overflow-hidden rounded-2xl bg-gray-900">
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {urls.map((url, i) => (
          <div key={i} className="relative aspect-[4/3] w-full shrink-0 snap-center bg-gray-900">
            <img
              src={url}
              alt=""
              loading="lazy"
              onClick={() => !editable && setLightboxIndex(i)}
              className={`h-full w-full object-contain ${editable ? "" : "cursor-zoom-in"}`}
            />
            {editable && <RemoveButton onClick={() => onRemove!(i)} />}
          </div>
        ))}
      </div>

      {urls.length > 1 && (
        <>
          {active > 0 && <ArrowButton direction="left" onClick={() => goTo(active - 1)} />}
          {active < urls.length - 1 && <ArrowButton direction="right" onClick={() => goTo(active + 1)} />}
          <DotIndicator total={urls.length} active={active} />
        </>
      )}

      {lightboxIndex !== null && (
        <ImageLightbox urls={urls} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
}
