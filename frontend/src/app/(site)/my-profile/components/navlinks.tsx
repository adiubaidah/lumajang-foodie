"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "~/lib/utils";

const links = [
  { link: ["/my-profile/ulasan", "/my-profile"], label: "Ulasan" },
  { link: ["/my-profile/koneksi"], label: "Koneksi" },
];

function NavLinks() {
  const path = usePathname();
  return (
    <ul className="flex w-full flex-row border-2 border-gray-100 p-3 text-davy md:flex-col gap-x-3 md:gap-y-4 lg:w-1/4">
      <h4 className="hidden pl-3 uppercase tracking-widest md:block">
        aktivitas
      </h4>
      {links.map(({ link, label }, index) => (
        <li key={index}>
          <Link
            href={link[0]}
            className={cn(
              "inline-block text-start text-lg md:w-full md:pl-3",
              link.includes(path) &&
                "border-b-2 border-puce bg-transparent text-puce md:border-l-4 md:bg-gradient-to-r md:from-white md:to-[#c9a5a5]",
            )}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default NavLinks;
