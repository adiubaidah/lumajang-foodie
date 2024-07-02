

import Link from "next/link";
import { cn } from "~/lib/utils";
interface MobileItemProps {
  href: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}

const MobileLink: React.FC<MobileItemProps> = ({
  href,
  icon: Icon,
  active,

}) => {

  return (
    <Link
      href={href}
      className={cn(
        `group flex w-full justify-center gap-x-3 p-4 text-sm font-semibold leading-6 text-gray-500 hover:bg-gray-100 hover:text-black`,
        active && "dark:bg-lightgray bg-gray-100 text-black",
      )}
    >
      <Icon className="h-6 w-6" />
    </Link>
  );
};

export default MobileLink;
