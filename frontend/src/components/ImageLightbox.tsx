import { useEffect, useRef, useState } from "react";

function NavButton({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Ảnh trước" : "Ảnh tiếp theo"}
      className={`fixed top-1/2 z-[60] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition duration-150 hover:scale-110 hover:bg-white/20 ${
        direction === "left" ? "left-4" : "right-4"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
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

interface Props {
  urls: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function ImageLightbox({ urls, initialIndex, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  function go(direction: 1 | -1) {
    setZoomed(false);
    setIndex((i) => (i + direction + urls.length) % urls.length);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls.length]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current || !containerRef.current) return;
      containerRef.current.scrollLeft -= e.clientX - lastPos.current.x;
      containerRef.current.scrollTop -= e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
    }
    function onMouseUp() {
      dragging.current = false;
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Đóng"
        className="fixed right-4 top-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition duration-150 hover:scale-110 hover:bg-white/20"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </svg>
      </button>

      {urls.length > 1 && (
        <>
          <NavButton direction="left" onClick={() => go(-1)} />
          <NavButton direction="right" onClick={() => go(1)} />
        </>
      )}

      <div
        ref={containerRef}
        onMouseDown={(e) => {
          if (!zoomed) return;
          dragging.current = true;
          lastPos.current = { x: e.clientX, y: e.clientY };
        }}
        className={`flex h-full w-full items-center justify-center ${zoomed ? "cursor-grab overflow-auto" : "overflow-hidden"}`}
      >
        <img
          src={urls[index]}
          alt=""
          onClick={(e) => {
            e.stopPropagation();
            setZoomed((z) => !z);
          }}
          className={
            zoomed
              ? "max-w-none cursor-zoom-out select-none"
              : "max-h-[88vh] max-w-[88vw] cursor-zoom-in select-none object-contain"
          }
          style={zoomed ? { width: "160%" } : undefined}
          draggable={false}
        />
      </div>

      {urls.length > 1 && (
        <p className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 text-sm text-gray-400">
          {index + 1} / {urls.length}
        </p>
      )}
    </div>
  );
}
