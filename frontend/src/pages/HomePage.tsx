import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg space-y-4">
        <h1 className="text-xl font-semibold">Personal Blog</h1>

        {accessToken ? (
          <>
            <p className="text-green-600">Đã đăng nhập thành công.</p>
            <p className="text-xs text-gray-500 break-all">
              Access token: {accessToken}
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <p className="text-gray-600">Chưa đăng nhập.</p>
        )}
      </div>
    </div>
  );
}
