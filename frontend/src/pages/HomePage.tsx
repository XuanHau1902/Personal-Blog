import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../api";
import { queryKeys } from "../lib/queryKeys";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import Skeleton from "../components/Skeleton";
import type { Page, PostResponse } from "../types";

const PAGE_SIZE = 12;

function CardSkeleton({ featured = false }: { featured?: boolean }) {
  if (featured) {
    return (
      <div className="grid grid-cols-1 gap-6 rounded-3xl border border-white/10 p-5 md:grid-cols-2 md:items-center md:gap-10 md:p-6">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3 rounded-2xl border border-white/10 p-4">
      <Skeleton className="aspect-[4/3] w-full" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export default function HomePage() {
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: queryKeys.posts.list({}),
    queryFn: async ({ pageParam }) => {
      const res = await api.get<Page<PostResponse>>("/posts", {
        params: { page: pageParam, size: PAGE_SIZE },
      });
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.number + 1 < lastPage.totalPages ? lastPage.number + 1 : undefined,
  });

  const posts = data?.pages.flatMap((page) => page.content) ?? null;
  const [featured, ...rest] = posts ?? [];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pb-24 md:px-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-6xl">
          The Blog
        </h1>

        {error && <p className="mt-8 text-sm text-red-500">Không tải được danh sách bài viết.</p>}

        {isLoading && (
          <>
            <div className="mt-12">
              <CardSkeleton featured />
            </div>
            <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </>
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

        {hasNextPage && (
          <div className="mt-16 flex justify-center">
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-gray-300 transition hover:border-white/40 hover:text-white disabled:opacity-50"
            >
              {isFetchingNextPage ? "Đang tải..." : "Xem thêm bài viết"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
