import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Logo from "~/../public/assets/logo.png";
import Subdistricts from "./subdistricts";
import { InstagramCircle, YoutubeCircle } from "~/icons";
import SearchInput from "~/components/ready-use/search-input";

function Home() {
  return (
    <>
      <main>
        <section className="container relative flex h-[420px] max-w-full flex-col items-center justify-center bg-[url('/assets/bg_home.jpg')] bg-cover bg-center bg-no-repeat">
          <div
            className="absolute left-0 top-0 z-0 h-full w-full bg-black opacity-50"
            style={{ filter: "brightness(50%)" }}
          />
          <Image
            src="/assets/logo.png"
            alt="Lumajang Foodie"
            width={800}
            height={400}
            priority
            className="z-10 h-[80px] w-auto"
          />
          <p className="z-10 mt-4 text-center text-2xl text-white md:text-4xl">
            Temukan makanan & minuman terbaik di <span>Kabupaten Lumajang</span>
          </p>
          <div className="z-10 w-full max-w-[800px]">
            <Suspense>
              <SearchInput />
            </Suspense>
          </div>
        </section>

        <section className="container max-w-full py-5 font-helvetica">
          <h2 className="font-product-sans text-2xl font-light text-[#363636] md:text-4xl">
            Tersebar ke berbagai Kecamatan
          </h2>
          {/* <Subdistricts /> */}
        </section>
      </main>
      <footer className="container flex max-w-full flex-col justify-between gap-y-5 bg-[#EEEEEE] py-16 md:flex-row">
        <div className="w-full md:max-w-lg">
          <Image
            src={Logo}
            alt="Lumajang Foodie"
            className="h-[56px] w-auto lg:h-16"
          />
          <p className="mt-2 leading-tight">
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
