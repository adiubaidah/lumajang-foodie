"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sidebar as SidebarComponent, Menu, MenuItem } from "react-pro-sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  Warehouse,
  Power,
  UtensilsCrossed,
  UserRound,
  Soup,
  GlassWater,
  Home,
} from "lucide-react";

import { axiosInstance, rgbToHex } from "~/lib/utils";

interface SidebarProps {
  toggled: boolean;
  setToggled: (toggled: boolean) => void;
  setBroken: (broken: boolean) => void;
}

function Sidebar({ toggled, setToggled, setBroken }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  // const [toggled, setToggled] = useState(false);

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => {
      return axiosInstance.post("/auth/logout");
    },
    onSuccess: () => {
      router.replace("/login");
    },
  });

  return (
    <SidebarComponent
      backgroundColor="#FFFFFF"
      className="text-black md:hidden"
      toggled={toggled}
      onBackdropClick={() => setToggled(false)}
      breakPoint="md"
      onBreakPoint={setBroken}
      rootStyles={{
        color: "#8A8C91",
        // height: '100%'
      }}
    >
      <div className="flex justify-between bg-white p-6">
        <Image
          src="/assets/logo.png"
          alt="Lumajang Foodie"
          width={300}
          height={300}
          className="w-[156px]"
        />
      </div>
      <div className="mb-2 px-6 text-[10px] uppercase tracking-wide">Main</div>
      <Menu
        menuItemStyles={{
          button: {
            ":hover": {
              backgroundColor: "#F6F6F6",
              ["& > .ps-menu-icon, & > .ps-menu-label"]: {
                color: "#000000",
              },
            },
            ["&.ps-active"]: {
              ["& > .ps-menu-icon, & > .ps-menu-label"]: {
                color: "#000000",
              },
            },
          },
          label: {
            marginTop: "3px",
            color: "#5A5A5A",
          },
        }}
      >
        <MenuItem
          component={<Link href="/" />}
          icon={<Home size={20} />}
          active={pathname === "/"}
        >
          Home
        </MenuItem>
        <MenuItem
          component={<Link href="/tempat-makan" />}
          icon={<UtensilsCrossed size={20} />}
          active={pathname === "/tempat-makan"}
        >
          Restoran
        </MenuItem>
        <MenuItem
          component={<Link href="/makanan" />}
          icon={<Soup size={20} />}
          active={pathname === "/makanan"}
        >
          Makanan
        </MenuItem>
        <MenuItem
          component={<Link href="/minuman" />}
          icon={<GlassWater size={20} />}
          active={pathname === "/minuman"}
        >
          Makanan
        </MenuItem>
      </Menu>
      <div className="mt-6 px-6 text-[10px] uppercase tracking-wide">
        Setting
      </div>
      <Menu
        menuItemStyles={{
          button: {
            ":hover": {
              backgroundColor: "#F6F6F6",
              ["& > .ps-menu-icon, & > .ps-menu-label"]: {
                color: "#000000",
              },
            },
            ["&.ps-active"]: {
              ["& > .ps-menu-icon, & > .ps-menu-label"]: {
                color: "#000000",
              },
            },
          },
          label: {
            marginTop: "3px",
            color: "#5A5A5A",
          },
        }}
      >
        <MenuItem
          component={<Link href="/my-profile" />}
          icon={<UserRound size={20} />}
          active={pathname === "/my-profile"}
        >
          Profile
        </MenuItem>
        <MenuItem icon={<Power />} onClick={() => logoutMutation.mutate()}>
          Logout
        </MenuItem>
      </Menu>
    </SidebarComponent>
  );
}

export default Sidebar;
