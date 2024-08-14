import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Subdistricts from "./subdistricts";
import { InstagramCircle, YoutubeCircle } from "~/icons";
import SearchInput from "~/components/ready-use/search-input";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import NavbarHome from "./navbar";
import Footer from "~/components/ready-use/footer";

function Home() {
  return (
    <>
      <NavbarHome />
      <main>
        <section className="container relative flex h-[420px] max-w-full flex-col items-center justify-center bg-[url('/assets/bg_home.jpg')] bg-cover bg-center bg-no-repeat">
          <div
            className="absolute left-0 top-0 z-0 h-full w-full bg-black opacity-50"
            style={{ filter: "brightness(50%)" }}
          />

          <Image
            src="/assets/only-logo.png"
            alt="Lumajang Foodie"
            width={800}
            height={400}
            priority
            className="z-10 h-[80px] w-auto"
          />
          <h2 className="z-10 mt-2 text-center font-helvetica text-2xl text-white md:text-4xl">
            Lumajang Foodie
          </h2>
          <p className="z-10 mt-4 text-center font-product-sans text-2xl text-white md:text-2xl">
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
            className="flex flex-col rounded-2xl p-2 shadow-md transition duration-200 hover:scale-105"
          >
            <div className="h-[134px] md:h-[192px]">
              <SkeletonImage
                src="/assets/restaurant.jpg"
                width={600}
                height={600}
                alt="restaurant"
                className="h-full w-full rounded-tl-2xl rounded-tr-2xl object-cover"
              />
            </div>
            <div className="z-10 ms-auto w-full border-gray-500 bg-white p-2 text-gray-800 md:p-4">
              <h2 className="font-product-sans text-[17px] font-medium md:text-[20px]">
                Tempat Makan
              </h2>
              <p className="text-sm">Cari tempat makan sesuai kesukaan kamu</p>
            </div>
          </Link>
          <Link
            href={"/menu"}
            className="flex flex-col rounded-2xl p-2 shadow-md transition duration-200 hover:scale-105"
          >
            <div className="h-[134px] md:h-[192px]">
              <SkeletonImage
                src="/assets/food.jpg"
                width={600}
                height={600}
                alt="food"
                className="h-full w-full rounded-tl-2xl rounded-tr-2xl object-cover"
              />
            </div>
            <div className="z-10 ms-auto w-full border-gray-500 bg-white p-2 text-gray-800 md:p-4">
              <h2 className="font-product-sans text-[17px] font-medium md:text-[20px]">
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
      <Footer />
    </>
  );
}

export default Home;
