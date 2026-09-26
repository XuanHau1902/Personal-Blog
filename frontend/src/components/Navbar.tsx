import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { getCurrentUsername } from "../lib/auth";
import { queryKeys } from "../lib/queryKeys";
import Button from "./Button";
import Avatar from "./Avatar";
import EditAvatarModal from "./EditAvatarModal";
import type { UserProfile } from "../types";

function AccountMenu() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const username = getCurrentUsername() ?? "";
  const [open, setOpen] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: profile } = useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: async () => (await api.get<UserProfile>("/users/me")).data,
  });

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

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Tài khoản"
        className="block transition duration-150 hover:scale-110"
      >
        <Avatar
          username={username}
          avatarUrl={profile?.avatarUrl}
          avatarPosition={profile?.avatarPosition}
          size={34}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-gray-900 py-1 shadow-lg">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-200 transition hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
              <path
                d="M4 20c0-4 3.6-6 8-6s8 2 8 6M12 12a4 4 0 100-8 4 4 0 000 8z"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Xem trang cá nhân
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setEditingAvatar(true);
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-200 transition hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
              <path
                d="M4 20l4.3-1 10-10a2 2 0 000-3l-.3-.3a2 2 0 00-3 0l-10 10L4 20z"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Chỉnh sửa avatar
          </button>
          <div className="my-1 h-px bg-white/10" />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-400 transition hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
              <path
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Đăng xuất
          </button>
        </div>
      )}

      {editingAvatar && profile && (
        <EditAvatarModal
          profile={profile}
          onClose={() => setEditingAvatar(false)}
          onSaved={(updated) => queryClient.setQueryData(queryKeys.users.me(), updated)}
        />
      )}
    </div>
  );
}

export default function Navbar() {
  const isAuthed = Boolean(localStorage.getItem("accessToken"));

  return (
    <nav className="flex items-center justify-between px-6 py-6 md:px-12">
      <Link to="/" aria-label="Trang chủ" className="flex h-10 w-10 items-center justify-center">
        <img
          src="/favicon.png"
          alt="Logo"
          className="h-10 w-10 rounded-full border border-white/70 object-cover"
        />
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
        <Link to="/" className="border-b-2 border-pink-500 pb-1 text-pink-500">
          Blog
        </Link>

        {isAuthed ? (
          <>
            <Link to="/posts/new">
              <Button className="!px-4 !py-2 text-xs">Viết bài</Button>
            </Link>
            <AccountMenu />
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-white">
              Đăng nhập
            </Link>
            <Link to="/register" className="hover:text-white">
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
