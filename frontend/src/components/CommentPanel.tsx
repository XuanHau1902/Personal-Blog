import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { getCurrentUsername } from "../lib/auth";
import type { CommentResponse } from "../types";
import Button from "./Button";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
}

interface Props {
  postId: number;
  open: boolean;
  onClose: () => void;
  onCountChange: (count: number) => void;
}

export default function CommentPanel({ postId, open, onClose, onCountChange }: Props) {
  const [comments, setComments] = useState<CommentResponse[] | null>(null);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const isAuthed = Boolean(getCurrentUsername());

  useEffect(() => {
    if (!open) return;
    api
      .get<CommentResponse[]>(`/comments/posts/${postId}`)
      .then((res) => setComments(res.data))
      .catch(() => setError("Không tải được bình luận."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, postId]);

  // Reporting the count to the parent is a side effect of `comments` changing,
  // not something to do inside a setState updater (that runs during render).
  useEffect(() => {
    if (comments !== null) onCountChange(comments.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    setError("");
    try {
      const res = await api.post<CommentResponse>(
        `/comments/posts/${postId}`,
        { content: text },
        { headers: authHeader() }
      );
      setComments((prev) => [...(prev ?? []), res.data]);
      setText("");
    } catch {
      setError("Đăng bình luận thất bại.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div
      className="shrink-0 overflow-hidden border-l border-white/10 bg-gray-950 transition-[width] duration-300 ease-out"
      style={{ width: open ? 360 : 0 }}
    >
      <div className="flex h-full w-[360px] flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <h2 className="text-sm font-semibold text-white">Bình luận</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bình luận"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          {comments === null && !error && <p className="text-sm text-gray-500">Đang tải...</p>}

          {comments !== null && comments.length === 0 && (
            <p className="text-sm text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          )}

          <ul className="space-y-4">
            {comments?.map((c) => (
              <li key={c.id}>
                <p className="text-xs font-medium text-gray-400">{c.authorUsername}</p>
                <p className="mt-0.5 break-words text-sm text-gray-200">{c.content}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-white/10 p-4">
          {isAuthed ? (
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Thêm bình luận..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20"
              />
              <Button type="submit" disabled={posting || !text.trim()} className="!px-3 !py-2 text-xs">
                Gửi
              </Button>
            </form>
          ) : (
            <p className="text-sm text-gray-400">
              <Link to="/login" className="text-pink-500 hover:text-pink-600">
                Đăng nhập
              </Link>{" "}
              để bình luận.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
