import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { getCurrentUsername, isAdmin } from "../lib/auth";
import { queryKeys } from "../lib/queryKeys";
import Navbar from "../components/Navbar";
import PostThumbnail from "../components/PostThumbnail";
import Avatar from "../components/Avatar";
import ImageLightbox from "../components/ImageLightbox";
import PostContent from "../components/PostContent";
import PostMenu from "../components/PostMenu";
import PostActions from "../components/PostActions";
import CommentPanel from "../components/CommentPanel";
import Skeleton from "../components/Skeleton";
import type { LikeResponse, PostResponse } from "../types";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [thumbnailOpen, setThumbnailOpen] = useState(false);

  const {
    data: post,
    error,
    isLoading,
  } = useQuery({
    queryKey: queryKeys.posts.detail(id!),
    queryFn: async () => (await api.get<PostResponse>(`/posts/${id}`)).data,
    enabled: Boolean(id),
  });

  const canManage = post !== undefined && (post.authorUsername === getCurrentUsername() || isAdmin());

  const likeMutation = useMutation({
    mutationFn: async () => (await api.post<LikeResponse>(`/posts/${id}/likes`)).data,
    onMutate: async () => {
      const key = queryKeys.posts.detail(id!);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<PostResponse>(key);
      if (previous) {
        queryClient.setQueryData<PostResponse>(key, {
          ...previous,
          likedByCurrentUser: !previous.likedByCurrentUser,
          likeCount: previous.likedByCurrentUser ? previous.likeCount - 1 : previous.likeCount + 1,
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.posts.detail(id!), context.previous);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData<PostResponse>(queryKeys.posts.detail(id!), (prev) =>
        prev ? { ...prev, likedByCurrentUser: data.liked, likeCount: data.likeCount } : prev
      );
    },
  });

  function handleToggleLike() {
    if (!getCurrentUsername()) {
      navigate("/login");
      return;
    }
    likeMutation.mutate();
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="flex flex-col md:flex-row md:items-start">
        <main className="min-w-0 flex-1">
          {error && <p className="mt-8 px-6 text-sm text-red-500 md:px-12">Không tìm thấy bài viết.</p>}

          {isLoading && (
            <div className="mx-auto max-w-3xl space-y-4 px-6 pb-24 pt-3 md:px-12">
              <Skeleton className="h-9 w-40" />
              <Skeleton className="aspect-[16/9] w-full" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          )}

          {post && (
            <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 pb-24 md:flex-row md:px-12">
              <article className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm text-gray-400">
                  <Avatar
                    username={post.authorUsername}
                    avatarUrl={post.authorAvatarUrl}
                    avatarPosition={post.authorAvatarPosition}
                    size={36}
                  />
                  {post.authorUsername}
                </p>
                <div className="relative mt-3">
                  <PostThumbnail
                    postId={post.id}
                    title={post.title}
                    coverImageUrl={post.coverImageUrl}
                    coverImagePosition={post.coverImagePosition}
                    onClick={post.coverImageUrl ? () => setThumbnailOpen(true) : undefined}
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
                <h1 className="mt-6 break-words text-3xl font-extrabold leading-tight text-white md:text-4xl">
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

              <div className="flex items-start pt-4 md:shrink-0 md:pt-8">
                <PostActions
                  liked={post.likedByCurrentUser}
                  likeCount={post.likeCount}
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

      {thumbnailOpen && post?.coverImageUrl && (
        <ImageLightbox urls={[post.coverImageUrl]} initialIndex={0} onClose={() => setThumbnailOpen(false)} />
      )}
    </div>
  );
}
