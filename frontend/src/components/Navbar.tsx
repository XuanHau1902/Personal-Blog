import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthed = Boolean(localStorage.getItem("accessToken"));

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  }

  return (
    <nav className="flex items-center justify-between px-6 py-6 md:px-12">
      <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 font-bold text-white">
        P
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
            <button onClick={handleLogout} className="hover:text-white">
              Đăng xuất
            </button>
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
