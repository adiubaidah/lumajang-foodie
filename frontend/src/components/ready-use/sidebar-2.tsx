"use client";
import { Sidebar as SidebarComponent, Menu, MenuItem } from "react-pro-sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, MapPin, Power, UsersRound, Settings } from "lucide-react";
import { Role } from "~/constant";
import { useMutation } from "@tanstack/react-query";

import { axiosInstance, rgbToHex } from "~/lib/utils";
import { useAuth } from "~/hooks";
import SkeletonImage from "./skeleton-image";

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
  const { user } = useAuth();

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
      backgroundColor="#A65F5F"
      toggled={toggled}
      onBackdropClick={() => setToggled(false)}
      breakPoint="md"
      onBreakPoint={setBroken}
      rootStyles={{
        color: "#8A8C91",
        // height: '100%'
      }}
    >
      <div className="flex justify-center p-6">
        <Link href="/manage/profile">
          <SkeletonImage
            src={user && user.image}
            alt="Foto"
            className="w-20 rounded-full outline outline-2 outline-stroke hover:outline-offset-1"
            width={400}
            height={400}
            skeletonStyle={{ width: 80, height: 80 }}
          />
        </Link>
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
          icon: {
            color: "white",
          },
          label: {
            marginTop: "3px",
            color: "white",
          },
        }}
      >
        {user &&
          links.map(
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
              ),
          )}
        <MenuItem icon={<Power />} onClick={() => logoutMutation.mutate()}>
          Logout
        </MenuItem>
      </Menu>

      <div>
        <h1></h1>
      </div>
    </SidebarComponent>
  );
}

export default Sidebar;
