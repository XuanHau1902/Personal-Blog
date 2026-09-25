import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function AuthLayout({ title, children }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-sm">
        <Link to="/" aria-label="Trang chủ" className="mx-auto mb-8 flex h-12 w-12 items-center justify-center">
          <img
            src="/favicon.png"
            alt="Logo"
            className="h-12 w-12 rounded-full border border-white/70 object-cover"
          />
        </Link>

        <div className="rounded-2xl bg-gray-900 p-8 shadow-sm ring-1 ring-white/10">
          <h1 className="text-center text-2xl font-extrabold text-white">{title}</h1>
          <div className="mt-6 space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
