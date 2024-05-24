export const Role = ["admin", "foodie", "owner"] as const;
export const PlacePhotoType = ["gallery", "menu", "thumbnail"] as const;

export const days = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
] as const;

export const placeFeature = {
  takeout: "Takeout",
  delivery: "Pengantaran",
  liveMusic: "Live Musik",
  restRoom: "Ruang Istirahat",
  cashOnly: "Hanya Tunai",
  servesCoffee: "Kopi",
};


export const getColorRating = (rate: number)=> {
  if(rate <= 1) return ''
}