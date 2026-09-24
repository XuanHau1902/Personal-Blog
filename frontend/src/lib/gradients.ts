export interface Bubble {
  size: number; // px
  top: string; // %
  left: string; // %
  opacity: number;
}

export interface GradientTheme {
  className: string; // tailwind gradient classes
  bubbles: Bubble[];
}

const THEMES: GradientTheme[] = [
  {
    className: "bg-gradient-to-br from-fuchsia-500 via-pink-500 to-orange-400",
    bubbles: [
      { size: 120, top: "28%", left: "38%", opacity: 0.35 },
      { size: 28, top: "20%", left: "18%", opacity: 0.5 },
      { size: 18, top: "68%", left: "72%", opacity: 0.5 },
    ],
  },
  {
    className: "bg-gradient-to-br from-sky-400 to-blue-600",
    bubbles: [
      { size: 70, top: "18%", left: "65%", opacity: 0.4 },
      { size: 26, top: "60%", left: "20%", opacity: 0.5 },
    ],
  },
  {
    className: "bg-gradient-to-br from-teal-400 to-blue-500",
    bubbles: [
      { size: 90, top: "55%", left: "55%", opacity: 0.3 },
      { size: 22, top: "25%", left: "30%", opacity: 0.5 },
    ],
  },
  {
    className: "bg-gradient-to-br from-violet-500 to-purple-700",
    bubbles: [
      { size: 100, top: "40%", left: "50%", opacity: 0.25 },
      { size: 20, top: "70%", left: "25%", opacity: 0.5 },
      { size: 14, top: "20%", left: "70%", opacity: 0.5 },
    ],
  },
  {
    className: "bg-gradient-to-br from-pink-500 via-rose-400 to-orange-400",
    bubbles: [
      { size: 60, top: "30%", left: "20%", opacity: 0.4 },
      { size: 36, top: "65%", left: "65%", opacity: 0.4 },
    ],
  },
  {
    className: "bg-gradient-to-br from-indigo-500 to-violet-600",
    bubbles: [
      { size: 80, top: "50%", left: "50%", opacity: 0.3 },
      { size: 18, top: "22%", left: "24%", opacity: 0.5 },
      { size: 18, top: "75%", left: "75%", opacity: 0.5 },
    ],
  },
];

/** Deterministic pick so the same post always renders the same theme. */
export function gradientForId(id: number | string): GradientTheme {
  const key = typeof id === "number" ? id : hashString(id);
  const index = Math.abs(key) % THEMES.length;
  return THEMES[index];
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
