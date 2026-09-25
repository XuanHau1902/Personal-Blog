import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { registerSchema, type RegisterFormValues } from "../lib/schemas";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import Input from "../components/Input";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    setError("");
    try {
      await api.post("/auth/register", values);
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Đăng ký thất bại (username có thể đã tồn tại)");
    }
  }

  return (
    <AuthLayout title="Đăng ký">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        <div>
          <Input label="Username" autoComplete="username" {...register("username")} />
          {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
        </div>
        <div>
          <Input label="Password" type="password" autoComplete="new-password" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
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
