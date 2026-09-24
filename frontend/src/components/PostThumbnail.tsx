import { gradientForId } from "../lib/gradients";

interface Props {
  postId: number | string;
  title: string;
  coverImageUrl: string | null;
  className?: string;
}

export default function PostThumbnail({ postId, title, coverImageUrl, className = "" }: Props) {
  if (coverImageUrl) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-cover bg-center ${className}`}
        style={{ backgroundImage: `url(${coverImageUrl})` }}
        role="img"
        aria-label={title}
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
