import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import Input from "../components/Input";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", { username, password });
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Đăng ký thất bại (username có thể đã tồn tại)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Đăng ký">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        <Input
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Đã có tài khoản?{" "}
          <Link to="/login" className="font-medium text-pink-500 hover:text-pink-600">
            Đăng nhập
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
