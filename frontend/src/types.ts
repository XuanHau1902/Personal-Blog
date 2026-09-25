export interface PostResponse {
  id: number;
  title: string;
  content: string;
  coverImageUrl: string | null;
  coverImagePosition: string | null;
  published: boolean;
  authorUsername: string;
  tags: string[];
  likeCount: number;
  likedByCurrentUser: boolean;
}

export interface LikeResponse {
  likeCount: number;
  liked: boolean;
}

export interface CommentResponse {
  id: number;
  content: string;
  authorUsername: string;
  postId: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
