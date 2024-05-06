"use client";

import dynamic from "next/dynamic";

import { useBusMapController } from "./mapProvider";

export default function Home() {
  const Map = dynamic(() => import("@unibus/ui/map"), {
    loading: () => <p>A map is loading</p>,
    ssr: false,
  });
  return (
    <>
      <Map zoom={13} position={[-9.390472517435533, -40.49732535541828]}>
        <Markers />
      </Map>
      <ConnStatus />
    </>
  );
}

const ConnStatus = () => {
  const { state } = useBusMapController();
  return (
    <>
      <p>Status: {state.isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {state.transport}</p>
    </>
  );
};

const Markers = () => {
  const Marker = dynamic(() =>
    import("@unibus/ui/leaflet").then((mod) => mod.Marker),
  );
  const Popup = dynamic(() =>
    import("@unibus/ui/leaflet").then((mod) => mod.Popup),
  );

  const { state } = useBusMapController();

  state.positions.map((position) =>
    console.log(position.plate, position.coordinates),
  );

  return (
    <>
      {state.positions.map((position) => {
        const [lat, lng] = position.coordinates;
        return (
          <Marker position={position.coordinates} key={position.plate}>
            <Popup>{`plate: ${position.plate} coordinates: ${lat}, ${lng}`}</Popup>
          </Marker>
        );
      })}
    </>
  );
};
