import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import { days } from "~/constant";
import { OpeningHours } from "~/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function rgbToHex(rgb: string): string {
  // Memisahkan string RGB menjadi array
  let splitedRgb = rgb.split(",").map(Number);

  // Fungsi untuk mengubah satu nilai RGB menjadi Hex
  let toHex = (rgbValue: number): string => {
    let hex = rgbValue.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  // Mengubah setiap nilai RGB menjadi Hex dan menggabungkannya
  let hexColor =
    "#" + toHex(splitedRgb[0]) + toHex(splitedRgb[1]) + toHex(splitedRgb[2]);

  return hexColor;
}

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const imageFromBackend = (url: string) => {
  const check = url.startsWith("public");
  return check
    ? (process.env.NEXT_PUBLIC_SERVER_URL as string) + "/" + url
    : url;
};

export const createQueryString = (params: Object) => {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
};

export function isOpen(openingHours: OpeningHours[]) {
  const now = moment();
  const dayIndex = now.day(); // 0 (Minggu) - 6 (Sabtu)
  const todayOpeningHours = openingHours.find(
    (day) => day.day === days[dayIndex],
  );

  if (!todayOpeningHours) return false;

  const openTime = moment(todayOpeningHours.openHours, "HH:mm");
  const closeTime = moment(todayOpeningHours.closeHours, "HH:mm");

  return now.isBetween(openTime, closeTime);
}

export function getOpeningTime(openingHours: OpeningHours[]) {
  const now = moment();
  const dayIndex = now.day(); // 0 (Minggu) - 6 (Sabtu)
  const todayOpeningHours = openingHours.find(
    (day) => day.day === days[dayIndex],
  );

  if (!todayOpeningHours) return null;

  return todayOpeningHours.openHours;
}

export function getClosingTime(openingHours: OpeningHours[]) {
  const now = moment();
  const dayIndex = now.day(); // 0 (Minggu) - 6 (Sabtu)
  const todayOpeningHours = openingHours.find(
    (day) => day.day === days[dayIndex],
  );

  if (!todayOpeningHours) return null;

  return todayOpeningHours.closeHours;
}

export const betterToKm = (distance: number): string => {
  if (distance <= 1000) {
    return Math.round(distance) + " m";
  } else {
    return (distance / 1000).toFixed(2) + " km";
  }
};

export const humanizeIdTime = (date: string) => {
  let localId = moment(date);
  localId.locale("id");
  return localId.fromNow();
};

