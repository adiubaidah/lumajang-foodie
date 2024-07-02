"use client";

import { User } from "~/types";

import { useRoutesChat, useConversation } from "~/hooks";
import MobileItem from "./mobile-item";
import MobileLink from "./mobile-link";

interface MobileFooterProps {
  currentUser: User;
}

const MobileFooter: React.FC<MobileFooterProps> = ({ currentUser }) => {
  const routes = useRoutesChat();
  const { isOpen } = useConversation();

  if (isOpen) {
    return null;
  }

  return (
    <>
      <div className="dark:bg-dusk dark:border-lightgray fixed bottom-0 z-40 flex w-full items-center justify-between border-t-[1px] bg-white lg:hidden">
        {routes.map((route) => (
          <MobileLink
            key={route.href}
            href={route.href}
            active={route.active}
            icon={route.icon}
          />
        ))}
      </div>
    </>
  );
};

export default MobileFooter;
