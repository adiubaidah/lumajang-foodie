import { z } from "zod";
import {
  loginSchema,
  menuSchema,
  messageSchema,
  placePhotoSchema,
  placeReviewSchema,
  placeSchema,
  registerSchema,
  userSchema,
} from "./schema";

export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;
export type NewUser = z.infer<typeof userSchema>;
export type User = NewUser & { id: string };

export type Location = { latitude: number; longitude: number };
export type NewPlace = z.infer<typeof placeSchema>;
export type Place = NewPlace & { id: string; slug: string };

export type NewPlacePhoto = z.infer<typeof placePhotoSchema> & {
  placeId: string;
};
export type PlacePhoto = NewPlacePhoto & {
  id: string;
  url: string;
};

export type NewPlaceReview = z.infer<typeof placeReviewSchema>;
export type PlaceReview = NewPlaceReview & { id: string };
export type NewMenu = z.infer<typeof menuSchema>;
export type Menu = NewMenu & { id: string };
export type NewMessage = z.infer<typeof messageSchema>;
export type Message = NewMessage & { id: string };
export type Subdistrict = { id: string; name: string };

export type ModalCrud = "add" | "edit" | "delete";

export type ModalProps<T> = {
  body: T;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
