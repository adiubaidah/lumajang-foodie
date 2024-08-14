import { z } from "zod";
import { PlacePhotoType, Role, days } from "~/constant";

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

export const editPasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, { message: "Password lama minimal 6 karakter" }),
    newPassword: z
      .string()
      .min(6, { message: "Password baru minimal 6 karakter" }),
    confirmNewPassword: z
      .string()
      .min(6, { message: "Konfirmasi password diperlukan" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Konfirmasi password tidak sesuai",
    path: ["confirmNewPassword"],
  });

export const gender = z.enum(["L", "P"]);

export const userSchema = z.object({
  email: z
    .string()
    .email({ message: "Email tidak valid" })
    .min(2, { message: "Email diperlukan" }),
  isActive: z.boolean().default(true),
  isPrivate: z.boolean().default(false),
  role: z.enum(Role),
  name: z.string().min(2, { message: "Nama diperlukan" }),
  gender: gender.optional(),
  subdistrictId: z
    .string()
    .min(2, { message: "Kecamatan tidak valid" })
    .optional(),
  description: z
    .string()
    .min(5, { message: "Deskripsi terlalu singkat" })
    .optional(),
  image: z.string().optional(),
  backgroundImage: z.string().optional(),
});

export const openingHourSchema = z.object({
  day: z.enum(days),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
});

export const placePreferenceSchema = z.object({
  label: z.string().min(2, { message: "Label diperlukan" }),
  value: z.string().min(2, { message: "Value diperlukan" }),
});

export const placeSchema = z.object({
  name: z.string().min(2, { message: "Nama tempat makan harus ada" }),
  description: z
    .string()
    .min(2, { message: "Deskripsi terlalu singkat" })
    .optional(),
  address: z.string().min(3, { message: "Alamat tempat makan harus ada" }),
  preferences: z.array(z.string()).optional(),
  websiteUri: z.string().optional(),
  location: z.object({
    latitude: z.number().gte(-90).lte(90),
    longitude: z.number().gte(-180).lte(180),
  }),
  phoneNumber: z
    .string()
    .min(10, { message: "No Telepon terlalu singkat" })
    .max(20, { message: "No telepon terlalu banyak" }),
  subdistrictId: z.string().min(5, { message: "Kecamatan harus ada" }),
  openingHours: z.array(openingHourSchema).refine((data) => {
    const days = data.map((item) => item.day);
    return new Set(days).size === 7;
  }),
});

export const placePhotoSchema = z.object({
  type: z.enum(PlacePhotoType),
  placeId: z.string().min(3, { message: "Tempat dibutuhkan" }),
  thumbnailPosition: z.number().max(4, "Posisi maksimuma adalah 4").optional(),
});
export const placeReviewSchema = z.object({
  star: z.number().min(1, { message: "Rating bintang tidak valid" }),
  review: z.string().min(3, { message: "Review dibutuhkan" }),
  placeId: z.string().min(3, { message: "Tempat dibutuhkan" }),
});

export const menuSchema = z.object({
  name: z.string().min(3, { message: "Nama menu diperlukan" }),
  type: z.enum(["food", "drink"]),
  price: z.number().min(100, { message: "Harga diperlukan" }),
  promo: z.string().optional(),
  placeId: z.string().min(4, { message: "Tempat makan diperlukan" }),
});

export const menuReviewSchema = z.object({
  star: z.number().min(1, { message: "Rating bintang tidak valid" }),
  review: z.string().min(3, { message: "Review dibutuhkan" }),
  menuId: z.string().min(3, { message: "Menu diperlukan" }),
});

export const messageSchema = z.object({
  body: z.string().min(1, { message: "Pesan diperlukan" }),
  placeId: z.string().optional()
});
