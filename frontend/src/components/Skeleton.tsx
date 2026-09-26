import type { CSSProperties } from "react";

export default function Skeleton({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return <div className={`animate-pulse rounded-lg bg-white/5 ${className}`} style={style} />;
}
