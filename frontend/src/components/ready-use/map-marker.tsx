import { MapPin } from "lucide-react";
import React, { useState } from "react";
import MapGL, {
  LngLat,
  MapLayerMouseEvent,
  Marker,
  ScaleControl,
  ViewState,
} from "react-map-gl";
import { Location as LocationType } from "~/types";

type MapMarkerProps = {
  marker: LngLat | null;
  setMarker: React.Dispatch<React.SetStateAction<LngLat | null>>;
  onChange: (marker: LocationType) => void;
};

const MapMarker = ({ marker, setMarker, onChange }: MapMarkerProps) => {
  const [viewport, setViewport] = useState({
    latitude: -8.11667,
    longitude: 113.15,
    zoom: 10,
  });

  const handleClick = (event: MapLayerMouseEvent) => {
    const { lngLat } = event;
    if (marker) {
      setMarker(null); // Jika marker sudah ada, hapus marker
      onChange({
        latitude: 0,
        longitude: 0,
      });
    } else {
      setMarker(lngLat); // Jika marker belum ada, tambahkan marker
      onChange({
        latitude: lngLat.lat,
        longitude: lngLat.lng,
      });
    }
  };

  return (
    <MapGL
      {...viewport}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_BOX_TOKEN}
      onMove={(evt) => setViewport(evt.viewState)}
      onClick={handleClick}
      style={{ width: "100%", height: 400 }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      {marker && (
        <Marker longitude={marker.lng} latitude={marker.lat}>
          <MapPin color="#e61919" size={40} />
        </Marker>
      )}
      <ScaleControl />
    </MapGL>
  );
};

export default MapMarker;
