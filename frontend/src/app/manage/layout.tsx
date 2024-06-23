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
      <section className="w-full px-5 mt-3 overflow-y-auto">{children}</section>
    </main>
  );
}
