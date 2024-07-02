import { usePathname } from "next/navigation";
import Link from "next/link";
import Restaurant from "~/../public/assets/restaurant.svg";
import Food from "~/../public/assets/food.svg";
import { cn } from "~/lib/utils";

const BottomNavbar = () => {
  const path = usePathname();
  return (
    (path === "/tempat-makan" || path === "/menu") && (
      <ul className="mb-6 flex items-center gap-x-3 border-b-2 border-b-gray-300 text-[20px]">
        <li
          className={cn(
            path === "/tempat-makan" &&
              "border-b-2 border-b-orange text-orange",
            "flex items-center gap-x-3 px-3 py-4",
          )}
        >
          <div
            className={cn(
              "rounded-full p-3",
              path === "/tempat-makan" ? "bg-yellow-200" : "bg-gray-300",
            )}
          >
            <Restaurant width={40} height={40} className="h-full w-full" />
          </div>
          <Link href="/tempat-makan"> Tempat Makan </Link>
        </li>
        <li
          className={cn(
            path === "/menu" && "border-b-2 border-b-orange text-orange",
            "flex items-center gap-x-3 px-3 py-4",
          )}
        >
          <div
            className={cn(
              "rounded-full p-3",
              path === "/menu" ? "bg-yellow-200" : "bg-gray-300",
            )}
          >
            <Food width={40} height={40} className="h-full w-full" />
          </div>
          <Link href="/menu"> Menu </Link>
        </li>
      </ul>
    )
  );
};

export default BottomNavbar;
