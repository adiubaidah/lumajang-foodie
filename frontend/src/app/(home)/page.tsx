import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { ChevronRight } from "lucide-react";
import Logo from "~/../public/assets/logo.png";
import Subdistricts from "./subdistricts";
import { InstagramCircle, YoutubeCircle } from "~/icons";
import SearchInput from "~/components/ready-use/search-input";

function Home() {
  return (
    <>
      <main>
        <section className="flex h-[420px] flex-col items-center justify-center bg-gray-800">
          <Image
            src="/assets/logo.png"
            alt="Lumajang Foodie"
            width={800}
            height={400}
            priority
            className="h-[80px] w-auto"
          />
          <p className="mt-4 text-4xl text-white">
            Temukan makanan & minuman terbaik di <span>Kabupaten Lumajang</span>
          </p>

          <SearchInput />
        </section>

        <section className="container max-w-full py-5 font-helvetica">
          <Subdistricts />
        </section>
      </main>
      <footer className="container flex max-w-full justify-between bg-[#EEEEEE] py-16">
        <div className="w-full md:max-w-lg">
          <Image
            src={Logo}
            alt="Lumajang Foodie"
            className="h-[56px] w-auto lg:h-16"
          />
          <p className="leading-tight">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum
            repellendus necessitatibus corrupti soluta sed recusandae ipsum ipsa
            nulla deleniti nisi?
          </p>
        </div>
        <ul className="space-y-2">
          <li>
            <h5 className="text-[14px] font-medium uppercase tracking-widest">
              Useful Links
            </h5>
          </li>
          <li className="flex items-center">
            <ChevronRight />
            <Link href="/">Beranda</Link>
          </li>
          <li className="flex items-center">
            <ChevronRight />
            <Link href="/tempat-makan">Tempat Makan</Link>
          </li>
          <li className="flex items-center">
            <ChevronRight />
            <Link href="/menu">Menu</Link>
          </li>
        </ul>
        <div>
          <h5 className="text-[14px] font-medium uppercase tracking-widest">
            tautan sosial
          </h5>
          <ul className="flex items-center gap-x-2">
            <li>
              <Link href="https://instagram.com">
                <InstagramCircle width={30} height={30} />
              </Link>
            </li>
            <li>
              <Link href="https://youtube.com">
                <YoutubeCircle width={28} height={28} />
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}

export default Home;
