"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface DiveCenterMarker {
  id: number;
  name: string;
  slug: string;
  color: string;
  iconUrl: string;
  latitude: number;
  longitude: number;
}

function createMarkerIcon(color: string) {
  return L.divIcon({
    className: "custom-dive-marker",
    html: `<div style="
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: ${color || "#281d4d"};
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

export default function LeafletMapWithMarkers({
  markers,
}: {
  markers: DiveCenterMarker[];
}) {
  const center: [number, number] =
    markers.length > 0
      ? [markers[0].latitude, markers[0].longitude]
      : [39.5, -9.0];

  console.log("Leaflet markers:", markers);

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.latitude, marker.longitude]}
          icon={createMarkerIcon(marker.color)}
        >
          <Popup>{marker.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}