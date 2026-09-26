export const queryKeys = {
  posts: {
    list: (params: { tag?: string; q?: string }) => ["posts", "list", params] as const,
    detail: (id: string | number) => ["posts", "detail", String(id)] as const,
  },
  comments: {
    byPost: (postId: string | number) => ["comments", "byPost", String(postId)] as const,
  },
  users: {
    me: () => ["users", "me"] as const,
  },
};
