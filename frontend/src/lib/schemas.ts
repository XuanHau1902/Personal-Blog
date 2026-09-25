import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Vui lòng nhập username"),
  password: z.string().min(1, "Vui lòng nhập password"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .max(32, "Username tối đa 32 ký tự"),
  password: z.string().min(6, "Password phải có ít nhất 6 ký tự"),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const postEditorSchema = z.object({
  title: z.string().trim().min(1, "Vui lòng nhập tiêu đề").max(200, "Tiêu đề tối đa 200 ký tự"),
  content: z.string().trim().min(1, "Vui lòng nhập nội dung"),
  tags: z.string(),
  published: z.boolean(),
});
export type PostEditorFormValues = z.infer<typeof postEditorSchema>;
