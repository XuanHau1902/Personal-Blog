export interface PostResponse {
  id: number;
  title: string;
  content: string;
  coverImageUrl: string | null;
  coverImagePosition: string | null;
  published: boolean;
  authorUsername: string;
  authorAvatarUrl: string | null;
  authorAvatarPosition: string | null;
  tags: string[];
  likeCount: number;
  likedByCurrentUser: boolean;
}

export interface UserProfile {
  username: string;
  avatarUrl: string | null;
  avatarPosition: string | null;
}

export interface LikeResponse {
  likeCount: number;
  liked: boolean;
}

export interface CommentResponse {
  id: number;
  content: string;
  authorUsername: string;
  authorAvatarUrl: string | null;
  authorAvatarPosition: string | null;
  postId: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
