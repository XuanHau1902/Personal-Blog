import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { loginSchema, type LoginFormValues } from "../lib/schemas";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import Input from "../components/Input";

export default function LoginPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setError("");
    try {
      const res = await api.post("/auth/login", values);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      navigate("/");
    } catch {
      setError("Sai username hoặc password");
    }
  }

  return (
    <AuthLayout title="Đăng nhập">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        <div>
          <Input label="Username" autoComplete="username" {...register("username")} />
          {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
        </div>
        <div>
          <Input label="Password" type="password" autoComplete="current-password" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="font-medium text-pink-500 hover:text-pink-600">
            Đăng ký
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
