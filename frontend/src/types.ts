import { z } from "zod";
import {
  loginSchema,
  menuSchema,
  messageSchema,
  openingHourSchema,
  placePhotoSchema,
  placeReviewSchema,
  placeSchema,
  registerSchema,
  userSchema,
  editPasswordSchema,
  menuReviewSchema,
  placePreferenceSchema,
} from "./schema";
import { Role as RoleConstant } from "./constant";

export type Role = typeof RoleConstant[number];
export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;
export type NewUser = z.infer<typeof userSchema>;
export type User = NewUser & { id: string };
export type UserComplete = User & {
  subdistrict: Subdistrict;
  _count: {
    menuReviews: number;
    placeReviews: number;
    ownerPlaces: number;
    followers: number;
    following: number;
  };
};
export type EditPassword = z.infer<typeof editPasswordSchema>;

export type OpeningHours = z.infer<typeof openingHourSchema>;

export type Location = { latitude: number; longitude: number };
export type NewPlace = z.infer<typeof placeSchema>;
export type Place = NewPlace & { id: string; slug: string };
export type PlaceComplete = Place & {
  googleRating?: number;
  promotedMenus: Menu[];
  photoForThumbnail?: PlacePhoto;
  averageStar: number;
  subdistrict: string;
  distance?: number;
};

export type NewPlacePhoto = z.infer<typeof placePhotoSchema> & {
  placeId: string;
};
export type PlacePhoto = NewPlacePhoto & {
  id: string;
  url: string;
};

export type NewPlacePreference = z.infer<typeof placePreferenceSchema>;
export type PlacePreference = {id: string} & NewPlacePreference;

export type NewPlaceReview = z.infer<typeof placeReviewSchema>;
export type PlaceReview = NewPlaceReview & { id: string };
export type NewMenu = z.infer<typeof menuSchema>;
export type Menu = NewMenu & { id: string; slug: string; averageStar: number };
export type MenuWithPhoto = Menu & { photo: string };
export type NewMenuReview = z.infer<typeof menuReviewSchema>;
export type MenuReview = NewMenuReview & { id: string };
export type NewMessage = z.infer<typeof messageSchema>;
export type Message = NewMessage & { id: string, createdAt: Date};
export type Subdistrict = { id: string; name: string };


export type Conversation = {
  id: string;
  isGroup: boolean;
  userIds: string[];
  users: string[];
  messages: Message[];
  lastMessageAt: Date;
}

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};

export type ModalCrud = "add" | "edit" | "delete";

export type ModalProps<T> = {
  body: T;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export type Pagination = {
  prev: number | null;
  next: number | null;
  page: number;
  total: number;
  pageCount: number;
};
