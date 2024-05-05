import { z } from "zod";

export const registerSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Email tidak valid" })
      .min(2, { message: "Email diperlukan" }),
    name: z.string().min(2, { message: "Nama lengkap diperlukan" }),
    password: z.string().min(6, { message: "Password minimal 6 karakter" }),
    confirm_password: z
      .string()
      .min(6, { message: "Konfirmasi password diperlukan" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Konfirmasi password tidak sesuai",
    path: ["confirm_password"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Email tidak valid" })
    .min(2, { message: "Email diperlukan" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});
