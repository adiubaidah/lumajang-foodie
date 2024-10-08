"use client";
import { cn } from "~/lib/utils";
import { Suspense, useState, useEffect } from "react";
import { Navbar } from "./components";
import Breadcrumb from "~/components/ready-use/breadcrumb";
import Sidebar from "~/components/ready-use/sidebar-1";
import Footer from "~/components/ready-use/footer";

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
        <span
          className={cn("hamburger-line origin-top-left", "bg-black")}
        ></span>
        <span className={cn("hamburger-line", "bg-black")}></span>
        <span
          className={cn("hamburger-line origin-bottom-left", "bg-black")}
        ></span>
      </button>
      <main className="container max-w-full py-5">
        <Breadcrumb />
        {children}
      </main>

      <Footer />
    </>
  );
}
