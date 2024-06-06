import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

function MapComponent({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null); // Set initial value to null

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_BOX_TOKEN as string;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!, // Use non-null assertion operator
      style: "mapbox://styles/mapbox/streets-v11",
      center: [longitude, latitude], // replace with your longitude and latitude
      zoom: 10,
      
    });
    // Add marker
    new mapboxgl.Marker()
      .setLngLat([longitude, latitude]) // replace with your longitude and latitude
      .addTo(map);

    // Clean up on unmount
    return () => map.remove();
  }, [latitude, longitude]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "320px" }} />
  );
}

export default MapComponent;
