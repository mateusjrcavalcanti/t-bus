"use client";

import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import type { LatLngExpression } from "leaflet";

export default function Map(props: {
  position: LatLngExpression;
  zoom: number;
  children?: React.ReactNode;
}) {
  const { position, zoom } = props;

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={true}
      className="absolute h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {props.children}
    </MapContainer>
  );
}
