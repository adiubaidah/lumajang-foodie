export const Role = ["admin", "foodie", "owner"] as const;
export type Role = typeof Role[number];
export const PlacePhotoType = ["gallery", "menu", "thumbnail"] as const;

export const days = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
] as const;

export const placeFeature = {
  takeout: "Takeout",
  delivery: "Pengantaran",
  liveMusic: "Live Musik",
  restRoom: "Ruang Istirahat",
  cashOnly: "Hanya Tunai",
  servesCoffee: "Kopi",
};

export const rateColor = [
  "#FF9941",
  "#FF9133",
  "#FF7F12",
  "#F97300",
  "#E26700",
];
