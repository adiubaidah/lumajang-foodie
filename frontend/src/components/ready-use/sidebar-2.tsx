"use client";
import { Sidebar as SidebarComponent, Menu, MenuItem } from "react-pro-sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, MapPin, Power, UsersRound } from "lucide-react";
import { Role } from "~/constant";
import { useMutation } from "@tanstack/react-query";

import { axiosInstance, rgbToHex } from "~/lib/utils";
import { useAuth } from "~/hooks";

interface SidebarProps {
  toggled: boolean;
  setToggled: (toggled: boolean) => void;
  setBroken: (broken: boolean) => void;
}

type Links = {
  label: string;
  icon: JSX.Element;
  link: string;
  roles: ("admin" | "owner" | "foodie")[];
};

export const links: Links[] = [
  {
    label: "Dashboard",
    icon: <Home size={20} />,
    link: "",
    roles: [Role[0], Role[2]],
  },
  {
    label: "Tempat Makan",
    icon: <MapPin size={20} />,
    link: "/tempat-makan",
    roles: [Role[2]],
  },
  {
    label: "User",
    icon: <UsersRound size={20} />,
    link: "/users",
    roles: [Role[0]],
  },
];
function Sidebar({ toggled, setToggled, setBroken }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuth();

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
      backgroundColor="#1f2937"
      toggled={toggled}
      onBackdropClick={() => setToggled(false)}
      breakPoint="md"
      onBreakPoint={setBroken}
      rootStyles={{
        color: "#8A8C91",
        // height: '100%'
      }}
    >
      <div className="p-6 bg-zinc-600 flex justify-between">
        <h1
          className={"font-bold text-xl text-nowrap text-stone-300 uppercase"}
        >
          {user && user.role} page
        </h1>
      </div>
      <Menu
        menuItemStyles={{
          button: {
            ":hover": {
              backgroundColor: "#1f2937",
              ["& > .ps-menu-icon, & > .ps-menu-label"]: {
                color: rgbToHex("214,211,209"),
              },
            },
            ["&.ps-active"]: {
              ["& > .ps-menu-icon, & > .ps-menu-label"]: {
                color: rgbToHex("214,211,209"),
              },
            },
          },
          label: {
            marginTop: "3px",
          },
        }}
      >
        {links.map(
          (link) =>
            link.roles.includes(user.role) && (
              <MenuItem
                key={link.link}
                component={<Link href={"/manage" + link.link} />}
                icon={link.icon}
                active={pathname === "/manage" + link.link}
              >
                {link.label}
              </MenuItem>
            )
        )}
        <MenuItem icon={<Power />} onClick={() => logoutMutation.mutate()}>
          Logout
        </MenuItem>
      </Menu>
    </SidebarComponent>
  );
}

export default Sidebar;
