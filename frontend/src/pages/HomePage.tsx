import { useEffect, useState } from "react";
import { api } from "../api";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import type { Page, PostResponse } from "../types";

export default function HomePage() {
  const [posts, setPosts] = useState<PostResponse[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Page<PostResponse>>("/posts")
      .then((res) => setPosts(res.data.content))
      .catch(() => setError("Không tải được danh sách bài viết."));
  }, []);

  const [featured, ...rest] = posts ?? [];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pb-24 md:px-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-6xl">
          The Blog
        </h1>

        {error && <p className="mt-8 text-sm text-red-500">{error}</p>}

        {posts === null && !error && (
          <p className="mt-12 text-sm text-gray-400">Đang tải...</p>
        )}

        {posts !== null && posts.length === 0 && (
          <p className="mt-12 text-sm text-gray-400">Chưa có bài viết nào.</p>
        )}

        {featured && (
          <div className="mt-12">
            <PostCard post={featured} featured />
          </div>
        )}

        {rest.length > 0 && (
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
            {rest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
