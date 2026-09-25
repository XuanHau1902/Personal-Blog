import { gradientForId } from "../lib/gradients";

interface Props {
  postId: number | string;
  title: string;
  coverImageUrl: string | null;
  coverImagePosition?: string | null;
  onClick?: () => void;
  className?: string;
}

export default function PostThumbnail({
  postId,
  title,
  coverImageUrl,
  coverImagePosition,
  onClick,
  className = "",
}: Props) {
  if (coverImageUrl) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-cover ${onClick ? "cursor-zoom-in" : ""} ${className}`}
        style={{ backgroundImage: `url(${coverImageUrl})`, backgroundPosition: coverImagePosition || "50% 50%" }}
        role={onClick ? "button" : "img"}
        tabIndex={onClick ? 0 : undefined}
        aria-label={title}
        onClick={onClick}
        onKeyDown={onClick ? (e) => (e.key === "Enter" || e.key === " ") && onClick() : undefined}
      />
    );
  }

  const theme = gradientForId(postId);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${theme.className} ${className}`}>
      {theme.bubbles.map((bubble, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: bubble.size,
            height: bubble.size,
            top: bubble.top,
            left: bubble.left,
            opacity: bubble.opacity,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}
