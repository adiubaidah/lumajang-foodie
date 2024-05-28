import React, { useState, useEffect } from "react";
import { MapPin, PlusSquareIcon } from "lucide-react";
import MapGL, {
  LngLat,
  MapLayerMouseEvent,
  Marker,
  ScaleControl,
  ViewState,
} from "react-map-gl";
import { EiCheck } from "~/icons";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { imageFromBackend } from "~/lib/utils";
import { Button } from "~/components/ui/button";

function Overview({ detail }: { detail: any }) {
  const [viewport, setViewport] = useState({
    latitude: detail.location.coordinates[1],
    longitude: detail.location.coordinates[0],
    zoom: 15, // Atur zoom sesuai keinginan
  });

  return (
    <div>
      <h2 className="text-3xl font-normal">Tentang tempat makan ini</h2>
      <div
        dangerouslySetInnerHTML={{ __html: detail.description }}
        className="font-normal text-davy text-lg"
      />

      {detail.owner && (
        <div className="mt-3">
          <h2 className="text-3xl font-normal">Pemilik restoran</h2>
          <div className="flex items-center justify-between">
            <div className="mt-4 flex items-center gap-x-2">
              <SkeletonImage
                src={imageFromBackend(detail.owner.image)}
                width={100}
                height={100}
                alt={detail.owner.name}
                className="rounded-full w-[120px] h-[120px] border-soft-red border-2 outline-soft-red outline-2"
              />
              <span>
                <p className="font-bold text-davy text-lg">
                  {detail.owner.name}
                </p>
                <p className="font-normal text-davy space-x-2">
                  <span>{detail.owner._count.followers}</span>
                  <span>Follower</span>
                </p>
              </span>
            </div>
            <Button variant={"ghost"} className="border-2 border-stroke group text-stroke gap-x-3 hover:bg-puce">
              <PlusSquareIcon className="text-puce group-hover:text-white" />
              <span className="group-hover:text-white">Ikuti</span>
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:items-center md:flex-row">
        <div className="w-1/2">
          <ul>
            <h5 className="text-2xl">Layanan</h5>
            {detail.servesCoffee && (
              <li className="flex items-center font-light text-davy text-lg">
                <EiCheck width={30} fill="#31af62" />
                <span>Kopi</span>
              </li>
            )}
            {detail.takeout && (
              <li className="flex items-center font-light text-davy text-lg">
                <EiCheck width={30} fill="#31af62" />
                <span>Takeout</span>
              </li>
            )}
            {detail.liveMusic && (
              <li className="flex items-center font-light text-davy text-lg">
                <EiCheck width={30} fill="#31af62" />
                <span>Live Musik</span>
              </li>
            )}
            {detail.restRoom && (
              <li className="flex items-center font-light text-davy text-lg">
                <EiCheck width={30} fill="#31af62" />
                <span>Ruang Istirahat</span>
              </li>
            )}
            {detail.cashOnly && (
              <li className="flex items-center font-light text-davy text-lg">
                <EiCheck width={30} fill="#31af62" />
                <span>Hanya menerima Cash</span>
              </li>
            )}
          </ul>
        </div>
        <div className="w-full md:w-1/2 rounded-3xl shadow-[0px_4px_7.3px_0px_rgba(0,0,0,0.2)] p-7">
          <h5 className="text-davy font-black text-xl">Petunjuk</h5>
          <MapGL
            {...viewport}
            onMove={(evt) => setViewport(evt.viewState)}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_BOX_TOKEN}
            style={{
              width: "100%",
              height: 400,
              marginTop: 30,
              boxShadow: "0px 4px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
          >
            <Marker
              longitude={detail.location.coordinates[0]}
              latitude={detail.location.coordinates[1]}
            >
              <MapPin color="#e61919" size={40} />
            </Marker>
            <ScaleControl />
          </MapGL>
        </div>
      </div>
    </div>
  );
}

export default Overview;
