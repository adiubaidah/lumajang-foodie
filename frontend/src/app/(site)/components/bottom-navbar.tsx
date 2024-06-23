import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "~/lib/utils";

const BottomNavbar = () => {
  const path = usePathname();
  return (
    (path === "/tempat-makan" || path === "/menu") && (
      <ul className="flex items-center gap-x-3 text-[20px] border-b-2 border-b-gray-300 mb-6">
        <li
          className={cn(path === "/tempat-makan" && "border-b-2 border-b-orange text-orange", 'flex items-center gap-x-3 px-3 py-4')}
        >
          <div className="w-[60px] h-[60px] bg-gray-300 rounded-full" />
          <Link href="/tempat-makan"> Tempat Makan </Link>
        </li>
        <li className={cn(path === "/menu" && "border-b-2 border-b-orange text-orange", 'flex items-center gap-x-3 px-3 py-4')}>
          <div className="w-[60px] h-[60px] bg-gray-300 rounded-full"/>
          <Link href="/menu"> Menu </Link>
        </li>
      </ul>
    )
  );
};

export default BottomNavbar;
