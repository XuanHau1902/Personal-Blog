import { Link } from "react-router-dom";
import type { PostResponse } from "../types";
import { stripGalleryBlocks } from "../lib/galleryContent";
import PostThumbnail from "./PostThumbnail";

function excerpt(content: string, max = 140): string {
  const plain = stripGalleryBlocks(content)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // strip markdown images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // unwrap markdown links
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > max ? `${plain.slice(0, max).trim()}...` : plain;
}

interface Props {
  post: PostResponse;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: Props) {
  if (featured) {
    return (
      <Link
        to={`/posts/${post.id}`}
        className="relative block rounded-3xl border border-white/10 p-5 transition duration-200 ease-out hover:z-10 hover:scale-[1.015] hover:border-white/25 hover:bg-white/5 md:p-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center md:gap-10">
          <PostThumbnail
            postId={post.id}
            title={post.title}
            coverImageUrl={post.coverImageUrl}
            className="aspect-[4/3] w-full"
          />
          <div>
            <p className="text-sm text-gray-400">{post.authorUsername}</p>
            <h2 className="mt-2 break-words text-2xl font-extrabold leading-tight text-white md:text-3xl">
              {post.title}
            </h2>
            <p className="mt-3 break-words text-sm leading-relaxed text-gray-500">
              {excerpt(post.content, 180)}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/posts/${post.id}`}
      className="relative block rounded-2xl border border-white/10 p-4 transition duration-200 ease-out hover:z-10 hover:scale-[1.03] hover:border-white/25 hover:bg-white/5"
    >
      <PostThumbnail
        postId={post.id}
        title={post.title}
        coverImageUrl={post.coverImageUrl}
        className="aspect-[4/3] w-full"
      />
      <p className="mt-3 text-xs text-gray-400">{post.authorUsername}</p>
      <h3 className="mt-1 break-words text-lg font-bold leading-snug text-white">{post.title}</h3>
      <p className="mt-2 break-words text-sm leading-relaxed text-gray-500">{excerpt(post.content)}</p>
    </Link>
  );
}
