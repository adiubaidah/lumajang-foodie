import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import Provider from "~/lib/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "Lumajang Foodie | %s",
    default: "Lumajang Foodie"
  },
  description: "Foodie nya orang Lumajang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
