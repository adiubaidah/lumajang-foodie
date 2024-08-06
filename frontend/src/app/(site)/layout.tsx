"use client";
import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import { YoutubeCircle, InstagramCircle } from "~/icons";
import Logo from "~/../public/assets/logo.png";
import { BottomNavbar, Navbar } from "./components";
import Breadcrumb from "~/components/ready-use/breadcrumb";
import Sidebar from "~/components/ready-use/sidebar-1";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isToggled, setIsToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  // const isDesktop = false
  return (
    <>
      <Suspense>
        <Navbar />
        {isClient && (
          <Sidebar
            setBroken={setBroken}
            setToggled={setIsToggled}
            toggled={isToggled}
          />
        )}
      </Suspense>

      <button
        id="hamburger"
        name="hamburger"
        type="button"
        className={`fixed right-4 top-1 block md:hidden ${
          isToggled ? "hamburger-active" : ""
        }`}
        onClick={() => {
          setIsToggled(!isToggled);
        }}
      >
        <span className="hamburger-line origin-top-left"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line origin-bottom-left"></span>
      </button>
      <main className="container max-w-full py-5">
        <Breadcrumb />
        {children}
      </main>

      <footer className="container flex max-w-full flex-col justify-between gap-y-5 bg-[#EEEEEE] py-16 md:flex-row">
        <div className="w-full md:max-w-lg">
          <Image
            src={Logo}
            alt="Lumajang Foodie"
            className="h-[56px] w-auto lg:h-16"
          />
          <p className="mt-3 leading-tight">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum
            repellendus necessitatibus corrupti soluta sed recusandae ipsum ipsa
            nulla deleniti nisi?
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
              <Link href="https://instagram.com">
                <InstagramCircle width={30} height={30} />
              </Link>
            </li>
            <li>
              <Link href="https://youtube.com">
                <YoutubeCircle width={28} height={28} />
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
