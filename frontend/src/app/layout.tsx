import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Provider from "~/lib/provider";
import { cn } from "~/lib/utils";

const productSans = localFont({
  src: [
    {
      path: "../fonts/ProductSans-Black.ttf",
      style: "normal",
      weight: "900",
    },
    {
      path: "../fonts/ProductSans-BlackItalic.ttf",
      style: "italic",
      weight: "900",
    },
    {
      path: "../fonts/ProductSans-Bold.ttf",
      style: "normal",
      weight: "700",
    },
    {
      path: "../fonts/ProductSans-BoldItalic.ttf",
      style: "italic",
      weight: "700",
    },
    {
      path: "../fonts/ProductSans-Light.ttf",
      style: "normal",
      weight: "300",
    },
    {
      path: "../fonts/ProductSans-LightItalic.ttf",
      style: "italic",
      weight: "300",
    },
    {
      path: "../fonts/ProductSans-Medium.ttf",
      style: "normal",
      weight: "500",
    },
    {
      path: "../fonts/ProductSans-MediumItalic.ttf",
      style: "italic",
      weight: "500",
    },
    {
      path: "../fonts/ProductSans-Regular.ttf",
      style: "normal",
      weight: "400",
    },
    {
      path: "../fonts/ProductSans-Thin.ttf",
      style: "italic",
      weight: "100",
    },
  ],
  variable: "--font-product-sans",
});

const helvetica = localFont({
  src: [
    {
      path: "../fonts/Helvetica.ttf",
      style: "normal",
      weight: "400",
    },
    {
      path: "../fonts/Helvetica-Light.ttf",
      style: "normal",
      weight: "100",
    },
  ],
  variable: "--font-helvetica",
});

export const metadata: Metadata = {
  title: {
    template: "Lumajang Foodie | %s",
    default: "Lumajang Foodie",
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
      <body
        className={cn(
          productSans.variable,
          helvetica.variable,
          "bg-poteh font-product-sans"
        )}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
