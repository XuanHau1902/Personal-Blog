import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
}

export default function PostMenu({ postId }: { postId: number }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleDelete() {
    if (!window.confirm("Xoá bài viết này? Hành động này không thể hoàn tác.")) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${postId}`, { headers: authHeader() });
      navigate("/");
    } catch {
      window.alert("Xoá bài viết thất bại. Vui lòng thử lại.");
      setDeleting(false);
    }
  }

  return (
    <div ref={containerRef} className="absolute right-3 top-3 z-10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Tuỳ chọn bài viết"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition duration-150 hover:scale-110 hover:bg-black/70"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-gray-900 py-1 shadow-lg">
          <button
            type="button"
            onClick={() => navigate(`/posts/${postId}/edit`)}
            className="block w-full px-4 py-2 text-left text-sm text-gray-200 transition hover:bg-white/10"
          >
            Chỉnh sửa
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="block w-full px-4 py-2 text-left text-sm text-red-400 transition hover:bg-white/10 disabled:opacity-50"
          >
            {deleting ? "Đang xoá..." : "Xoá bài viết"}
          </button>
        </div>
      )}
    </div>
  );
}
