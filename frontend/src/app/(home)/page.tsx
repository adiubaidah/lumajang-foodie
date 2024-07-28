import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Logo from "~/../public/assets/logo.png";
import Subdistricts from "./subdistricts";
import { InstagramCircle, YoutubeCircle } from "~/icons";
import SearchInput from "~/components/ready-use/search-input";
import SkeletonImage from "~/components/ready-use/skeleton-image";

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

        <section className="container mt-7 grid grid-cols-2 gap-5">
          <Link
            href={"/tempat-makan"}
            className="flex flex-col rounded-2xl p-2 hover:scale-105 transition duration-200 shadow-md"
          >
            <div className="h-[134px] md:h-[192px]">
              <SkeletonImage
                src="/assets/restaurant.jpg"
                width={600}
                height={600}
                alt="restaurant"
                className="h-full w-full object-cover rounded-tr-2xl rounded-tl-2xl"
              />
            </div>
            <div className="z-10 ms-auto w-full bg-white p-2 md:p-4 text-gray-800 border-gray-500">
              <h2 className="font-product-sans text-[17px] md:text-[20px] font-medium">
                Tempat Makan
              </h2>
              <p className="text-sm">Cari tempat makan sesuai kesukaan kamu</p>
            </div>
          </Link>
          <Link
            href={"/menu"}
            className="flex flex-col rounded-2xl p-2 hover:scale-105 transition duration-200 shadow-md"
          >
            <div className="h-[134px] md:h-[192px]">
              <SkeletonImage
                src="/assets/food.jpg"
                width={600}
                height={600}
                alt="food"
                className="h-full w-full object-cover rounded-tr-2xl rounded-tl-2xl"
              />
            </div>
            <div className="z-10 ms-auto w-full bg-white p-2 md:p-4 text-gray-800 border-gray-500">
              <h2 className="font-product-sans text-[17px] md:text-[20px] font-medium">
                Makanan
              </h2>
              <p className="text-sm">Cari menu favoritmu</p>
            </div>
          </Link>
        </section>

        <section className="container max-w-full py-5 font-helvetica">
          <h2 className="font-product-sans text-2xl font-light text-[#363636] md:text-4xl">
            Tersebar ke berbagai Kecamatan
          </h2>
          <Subdistricts />
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
