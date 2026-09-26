interface Props {
  username: string;
  avatarUrl?: string | null;
  avatarPosition?: string | null;
  size?: number;
  className?: string;
}

/** Falls back to a deterministic per-user placeholder (DiceBear, seeded by
 * username) until the user uploads a real avatar. */
export default function Avatar({ username, avatarUrl, avatarPosition, size = 24, className = "" }: Props) {
  const src = avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(username)}`;

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={`inline-block shrink-0 rounded-full bg-gray-800 object-cover ${className}`}
      style={{ width: size, height: size, objectPosition: avatarPosition || "50% 50%" }}
    />
  );
}
