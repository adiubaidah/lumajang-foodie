"use client";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "~/lib/utils";

function NavLinks() {
  const path = usePathname();
  const params = useParams<{ id: string }>();
  const getLinks = (id: string) => {
    const links = [
      {
        link: [`/user-detail/${id}/ulasan `, `/user-detail/${id}`],
        label: "Ulasan",
      },
      { link: [`/user-detail/${id}/koneksi`], label: "Koneksi" },
      { link: [`/user-detail/${id}/arsip`], label: "Arsip" },
    ];
    return links;
  };
  return (
    <ul className="flex w-full flex-row gap-x-3 border-2 border-gray-100 p-3 text-davy md:flex-col md:gap-y-4 lg:w-1/4">
      <h4 className="hidden pl-3 uppercase tracking-widest md:block">
        aktivitas
      </h4>
      {getLinks(params.id).map(({ link, label }, index) => (
        <li key={index}>
          <Link
            href={link[0]}
            className={cn(
              "inline-block text-start text-lg md:w-full md:pl-3",
              link.includes(path) &&
                "border-b-2 border-puce bg-transparent text-puce md:border-b-0 md:border-l-4 md:bg-gradient-to-r md:from-white md:to-[#c9a5a5]",
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
