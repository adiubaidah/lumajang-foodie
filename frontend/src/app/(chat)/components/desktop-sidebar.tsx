"use client";

import { useState } from "react";

import Avatar from "../chat/components/avatar";
import DesktopItem from "./desktop-item";

import { User } from "~/types";
import { useRoutesChat, useAuth } from "~/hooks";

interface DesktopSidebarProps {
  currentUser: User;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentUser }) => {
  const routes = useRoutesChat();
  const { user } = useAuth();
  return (
    <>
      <div className="dark:bg-dusk dark:border-lightgray hidden justify-between lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-20 lg:flex-col lg:overflow-y-auto lg:border-r-[1px] lg:bg-white lg:pb-4 xl:px-6">
        <nav className="mt-4 flex flex-col justify-between">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {routes.map((item) => (
              <DesktopItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
              />
            ))}
          </ul>
        </nav>
        <nav className="mt-4 flex flex-col items-center justify-between">
          <div className="cursor-pointer transition hover:opacity-75">
            <Avatar user={user as User} />
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar;
