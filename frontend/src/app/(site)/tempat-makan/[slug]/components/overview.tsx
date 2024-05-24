import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import MapGL, {
  LngLat,
  MapLayerMouseEvent,
  Marker,
  ScaleControl,
  ViewState,
} from "react-map-gl";
import { EiCheck } from "~/icons";

function Overview({ detail }: { detail: any }) {
  const [viewport, setViewport] = useState({
    latitude: detail.location.coordinates[1],
    longitude: detail.location.coordinates[0],
    zoom: 15, // Atur zoom sesuai keinginan
  });

  return (
    <div>
      <h2 className="text-3xl font-normal">Tentang tempat makan ini</h2>
      <div dangerouslySetInnerHTML={{ __html: detail.description }} />

      <div className="flex items-center">
        <div className="w-1/2">
          <ul>
            <h5 className="text-2xl">Layanan</h5>
            {detail.servesCoffee && (
              <li className="flex items-center">
                <EiCheck width={30} fill="#31af62" />
                <span>Kopi</span>
              </li>
            )}
            {detail.takeout && (
              <li className="flex items-center">
                <EiCheck width={30} fill="#31af62" />
                <span>Takeout</span>
              </li>
            )}
            {detail.liveMusic && (
              <li className="flex items-center">
                <EiCheck width={30} fill="#31af62" />
                <span>Live Musik</span>
              </li>
            )}
            {detail.restRoom && (
              <li className="flex items-center">
                <EiCheck width={30} fill="#31af62" />
                <span>Ruang Istirahat</span>
              </li>
            )}
            {detail.cashOnly && (
              <li className="flex items-center">
                <EiCheck width={30} fill="#31af62" />
                <span>Hanya menerima Cash</span>
              </li>
            )}
          </ul>
        </div>
        <div className="w-1/2 rounded-3xl shadow-[0_4px_] p-7">
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
