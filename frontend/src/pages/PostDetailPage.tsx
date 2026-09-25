import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { getCurrentUsername, isAdmin } from "../lib/auth";
import Navbar from "../components/Navbar";
import PostThumbnail from "../components/PostThumbnail";
import PostContent from "../components/PostContent";
import PostMenu from "../components/PostMenu";
import PostActions from "../components/PostActions";
import CommentPanel from "../components/CommentPanel";
import type { LikeResponse, PostResponse } from "../types";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [error, setError] = useState("");
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const canManage = post !== null && (post.authorUsername === getCurrentUsername() || isAdmin());

  useEffect(() => {
    api
      .get<PostResponse>(`/posts/${id}`)
      .then((res) => {
        setPost(res.data);
        setLiked(res.data.likedByCurrentUser);
        setLikeCount(res.data.likeCount);
      })
      .catch(() => setError("Không tìm thấy bài viết."));
  }, [id]);

  async function handleToggleLike() {
    if (!getCurrentUsername()) {
      navigate("/login");
      return;
    }
    // Optimistic update — reverted if the request fails.
    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);
    try {
      const res = await api.post<LikeResponse>(`/posts/${id}/likes`);
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch {
      setLiked(prevLiked);
      setLikeCount(prevCount);
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="flex">
        <main className="min-w-0 flex-1">
          {error && <p className="mt-8 px-6 text-sm text-red-500 md:px-12">{error}</p>}

          {!post && !error && <p className="mt-12 px-6 text-sm text-gray-400 md:px-12">Đang tải...</p>}

          {post && (
            <div className="mx-auto flex max-w-3xl gap-4 px-6 pb-24 md:px-12">
              <article className="min-w-0 flex-1">
                <div className="relative">
                  <PostThumbnail
                    postId={post.id}
                    title={post.title}
                    coverImageUrl={post.coverImageUrl}
                    className="aspect-[16/9] w-full"
                  />
                  <Link
                    to="/"
                    aria-label="Về trang chủ"
                    className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition duration-150 hover:scale-110 hover:bg-black/70"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  {canManage && <PostMenu postId={post.id} />}
                </div>
                <p className="mt-6 text-sm text-gray-400">{post.authorUsername}</p>
                <h1 className="mt-2 break-words text-3xl font-extrabold leading-tight text-white md:text-4xl">
                  {post.title}
                </h1>
                {post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <PostContent content={post.content} />
              </article>

              <div className="flex shrink-0 items-start pt-8">
                <PostActions
                  liked={liked}
                  likeCount={likeCount}
                  onToggleLike={handleToggleLike}
                  commentCount={commentCount}
                  commentsOpen={commentsOpen}
                  onToggleComments={() => setCommentsOpen((v) => !v)}
                />
              </div>
            </div>
          )}
        </main>

        {post && (
          <CommentPanel
            postId={post.id}
            open={commentsOpen}
            onClose={() => setCommentsOpen(false)}
            onCountChange={setCommentCount}
          />
        )}
      </div>
    </div>
  );
}
