import type { ReactNode } from "react";

interface Props {
  liked: boolean;
  likeCount: number;
  onToggleLike: () => void;
  commentCount: number;
  commentsOpen: boolean;
  onToggleComments: () => void;
}

function ActionButton({
  onClick,
  active,
  count,
  children,
}: {
  onClick?: () => void;
  active?: boolean;
  count: number | string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 text-gray-300"
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full transition duration-150 hover:scale-110 ${
          active ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        {children}
      </span>
      <span className="text-xs font-medium text-gray-400">{count}</span>
    </button>
  );
}

export default function PostActions({
  liked,
  likeCount,
  onToggleLike,
  commentCount,
  commentsOpen,
  onToggleComments,
}: Props) {
  return (
    <div className="flex flex-row gap-4 py-4 md:flex-col md:items-center md:gap-6 md:py-0">
      <ActionButton count={likeCount} active={liked} onClick={onToggleLike}>
        <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} className="h-5 w-5" stroke="currentColor" strokeWidth={liked ? 0 : 2}>
          <path
            d="M12 21s-6.7-4.35-9.3-8.1C1 10.2 1.6 6.9 4.3 5.4c2.2-1.2 4.6-.5 6 1.3l1.7 2.1 1.7-2.1c1.4-1.8 3.8-2.5 6-1.3 2.7 1.5 3.3 4.8 1.6 7.5C18.7 16.65 12 21 12 21z"
            strokeLinejoin="round"
          />
        </svg>
      </ActionButton>

      <ActionButton count={commentCount} active={commentsOpen} onClick={onToggleComments}>
        <svg viewBox="0 0 24 24" fill={commentsOpen ? "currentColor" : "none"} className="h-5 w-5">
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ActionButton>
    </div>
  );
}
