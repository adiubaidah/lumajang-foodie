"use client"
import React from "react";
import { Suspense, useState, useEffect } from "react";
import { cn } from "~/lib/utils";
import { Navbar } from "../(site)/components";
import Sidebar from "~/components/ready-use/sidebar-1";

function NavbarHome() {
  const [isToggled, setIsToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      <Suspense>
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
        className={`fixed right-4 top-1 z-[999] block md:hidden ${
          isToggled ? "hamburger-active" : ""
        }`}
        onClick={() => {
          setIsToggled(!isToggled);
        }}
      >
        <span
          className={cn("hamburger-line origin-top-left", "bg-white")}
        ></span>
        <span className={cn("hamburger-line", "bg-white")}></span>
        <span
          className={cn("hamburger-line origin-bottom-left", "bg-white")}
        ></span>
      </button>
    </>
  );
}

export default NavbarHome;
