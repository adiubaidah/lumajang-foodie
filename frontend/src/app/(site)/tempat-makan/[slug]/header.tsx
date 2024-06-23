"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { IconsDistance } from "~/icons";
import { BadgeRate } from "~/components/ready-use/badge-rate";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import {
  getClosingTime,
  getOpeningTime,
  isOpen,
  cn,
  imageFromBackend,
} from "~/lib/utils";
import { useMediaQuery } from "~/hooks";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import ArchiveButton from "../components/archive-button";
import { buttonVariants } from "~/components/ui/button";

function Header({ imagePreview, detail }: { imagePreview: any; detail: any }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const params = useParams<{ slug: string }>();
  const path = usePathname();

  // return JSON.stringify(detail);
  return (
    <div className="py-3">
      {imagePreview && imagePreview.result && (
        <>
          {!isDesktop ? (
            <Carousel>
              <CarouselContent className="h-[300px]">
                <CarouselItem>
                  <SkeletonImage
                    src={imageFromBackend(imagePreview.result[0].url)}
                    height={500}
                    width={500}
                    className="h-full w-full object-cover"
                    alt="preview-1"
                  />
                </CarouselItem>
                <CarouselItem>
                  <SkeletonImage
                    src={imageFromBackend(imagePreview.result[1].url)}
                    height={500}
                    width={500}
                    className="h-full w-full object-cover"
                    alt="preview-2"
                  />
                </CarouselItem>
                <CarouselItem>
                  <SkeletonImage
                    src={imageFromBackend(imagePreview.result[2].url)}
                    height={500}
                    width={500}
                    className="h-full w-full object-cover"
                    alt="preview-3"
                  />
                </CarouselItem>
                <CarouselItem>
                  <SkeletonImage
                    src={imageFromBackend(imagePreview.result[3].url)}
                    height={500}
                    width={500}
                    className="h-full w-full object-cover"
                    alt="preview-4"
                  />
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          ) : (
            <div className="flex h-[350px] w-full items-center space-x-2">
              <div className="h-full w-3/5">
                <SkeletonImage
                  src={imageFromBackend(imagePreview.result[0].url)}
                  height={500}
                  width={500}
                  className="h-full w-full object-cover"
                  alt="preview-1"
                />
              </div>
              <div className="flex h-full w-2/5 items-center gap-x-2">
                <div className="flex h-full w-1/2 flex-col gap-y-2 overflow-y-hidden">
                  <SkeletonImage
                    src={imageFromBackend(imagePreview.result[1].url)}
                    height={500}
                    width={500}
                    className="h-1/2 object-cover"
                    skeletonStyle={{ height: "50%", width: "100%" }}
                    alt="preview-1"
                  />
                  <SkeletonImage
                    src={imageFromBackend(imagePreview.result[2].url)}
                    height={500}
                    width={500}
                    className="h-1/2 object-cover"
                    skeletonStyle={{ height: "50%", width: "100%" }}
                    alt="preview-1"
                  />
                </div>
                <div className="h-full w-1/2">
                  <SkeletonImage
                    src={imageFromBackend(imagePreview.result[3].url)}
                    height={500}
                    width={500}
                    className="h-full object-cover"
                    alt="preview-3"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-normal">{detail.name}</h1>
          <div className="flex items-center gap-x-2">
            <BadgeRate rate={detail.rate._avg.star} />
            {detail.rate._count.id > 0 && (
              <div className="flex flex-col">
                <span className="text-davy">{detail.rate._count.id}</span>
                <span className="font-light text-davy">Ulasan</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-2xl font-light text-davy">{detail.address}</p>
        <div className="flex gap-x-2 font-light text-davy">
          {isOpen(detail.openingHours) ? (
            <>
              <span className="text-islamic">Buka</span>-
              <span>Tutup jam {getClosingTime(detail.openingHours)}</span>
            </>
          ) : (
            <>
              <span className="text-puce">Tutup</span>-
              <span>Buka Jam {getOpeningTime(detail.openingHours)}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-x-2">
          <Link className={cn(buttonVariants({variant: "outline"}), 'flex items-center gap-x-2')} href={"#"}>
            <IconsDistance width={27} fill="#A65F5F" height={27} />
            <span>Petunjuk</span>
          </Link>
          <ArchiveButton place={detail.id} />
        </div>
      </div>

      <ul className="my-3 flex items-center bg-transparent">
        <li>
          <Link
            href={`/tempat-makan/${params.slug}`}
            className={cn(
              "px-5 py-3 text-xl font-light text-davy",
              path === `/tempat-makan/${params.slug}` &&
                "border-b-2 border-puce bg-transparent text-puce",
            )}
          >
            Sekilas
          </Link>
        </li>
        <li>
          <Link
            href={`/tempat-makan/${params.slug}/ulasan`}
            className={cn(
              "px-5 py-3 text-xl font-light text-davy",
              path === `/tempat-makan/${params.slug}/ulasan` &&
                "border-b-2 border-puce bg-transparent text-puce",
            )}
          >
            Ulasan
          </Link>
        </li>
        <li>
          <Link
            href={`/tempat-makan/${params.slug}/foto`}
            className={cn(
              "px-5 py-3 text-xl font-light text-davy",
              path === `/tempat-makan/${params.slug}/foto` &&
                "border-b-2 border-puce bg-transparent text-puce",
            )}
          >
            Foto
          </Link>
        </li>
        <li>
          <Link
            href={`/tempat-makan/${params.slug}/menu`}
            className={cn(
              "px-5 py-3 text-xl font-light text-davy",
              path === `/tempat-makan/${params.slug}/menu` &&
                "border-b-2 border-puce bg-transparent text-puce",
            )}
          >
            Menu
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Header;
