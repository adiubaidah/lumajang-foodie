"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { InstagramCircle, YoutubeCircle } from "~/icons";
import { ChevronRight } from "lucide-react";
import Logo from "~/../public/assets/logo.png";

function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="container bg-[#EEEEEE]">
      <div className="flex max-w-full flex-col justify-between gap-y-5 py-16 md:flex-row">
        <div className="w-full md:max-w-lg">
          <Image
            src={Logo}
            alt="Lumajang Foodie"
            className="h-[56px] w-auto lg:h-16"
          />
          <p className="mt-2 leading-tight">
            Platform Media Sosial Interaktif dengan Integrasi Pencarian Lokasi
            untuk Komunitas Kuliner, sebuah platform media sosial interaktif
            yang inovatif dengan integrasi pencarian lokasi khusus untuk
            Komunitas Kuliner Lumajang.
          </p>
        </div>
        <ul className="space-y-2">
          <li>
            <h5 className="text-[14px] font-medium uppercase tracking-widest">
              Useful Links
            </h5>
          </li>
          <li className="flex items-center">
            <ChevronRight />
            <Link href="/">Beranda</Link>
          </li>
          <li className="flex items-center">
            <ChevronRight />
            <Link href="/tempat-makan">Tempat Makan</Link>
          </li>
          <li className="flex items-center">
            <ChevronRight />
            <Link href="/menu">Menu</Link>
          </li>
        </ul>
        <div>
          <h5 className="text-[14px] font-medium uppercase tracking-widest">
            tautan sosial
          </h5>
          <ul className="flex items-center gap-x-2">
            <li>
              <Link href="https://www.instagram.com/lmjfoodie.pkmkc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D">
                <InstagramCircle width={30} height={30} />
              </Link>
            </li>
            <li>
              <Link href="https://youtube.com/@pkmlumajangfoodie?si=ZSvpC5liiOY2rjP_">
                <YoutubeCircle width={28} height={28} />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <Separator className="bg-slate-700"/>
      <p className="mt-3 text-center">{`© ${year}. All Rights Reserved.`}</p>
    </footer>
  );
}

export default Footer;
