"use client";
import { useState } from "react";
import Sidebar from "~/components/ready-use/sidebar-2";
export default function Layout({ children }: { children: React.ReactNode }) {
  const [isToggled, setIsToggled] = useState(false);
  const [broken, setBroken] = useState(true);
  return (
    <main className="flex h-screen">
      <Sidebar
        setBroken={setBroken}
        setToggled={setIsToggled}
        toggled={isToggled}
      />
      <button
        id="hamburger"
        name="hamburger"
        type="button"
        className={`block fixed right-4 top-1 md:hidden ${
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
      <section className="w-full mt-4 container overflow-y-scroll py-6">
        {children}
      </section>
    </main>
  );
}
