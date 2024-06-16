"use client";
import { useState } from "react";
import Image from "next/image";
import Logo from "~/../public/assets/logo.png";
import { Navbar } from "./components";
import Breadcrumb from "~/components/ready-use/breadcrumb";
import Sidebar from "~/components/ready-use/sidebar-1";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isToggled, setIsToggled] = useState(true);
  const [broken, setBroken] = useState(false);
  // const isDesktop = false
  return (
    <>
      <Navbar />
      <Sidebar
        setBroken={setBroken}
        setToggled={setIsToggled}
        toggled={isToggled}
      />

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

      <footer className="flex items-center justify-between bg-[#EEEEEE] p-16">
        <div className="w-full md:w-1/2">
          <Image
            src={Logo}
            alt="Lumajang Foodie"
            className="h-[56px] w-auto lg:h-16"
          />
          <p className="leading-tight">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum
            deleniti similique quam consequuntur quo illum? Rerum minima eveniet
            quibusdam aspernatur quae soluta ab non quas sequi nesciunt, aliquid
            modi alias vitae? Deleniti suscipit laudantium exercitationem
            consequuntur. Temporibus iusto dolore exercitationem?
          </p>
        </div>
        <div className="flex gap-x-5">
          <ul className="space-y-2">
            <li>
              
              <h5>Useful Links</h5>
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
            <h5>Kontak Kami</h5>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid,
              qui.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
