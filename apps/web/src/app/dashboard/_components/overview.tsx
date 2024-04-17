"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

export function Overview() {
  const Map = useMemo(
    () =>
      dynamic(() => import("../../_components/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [],
  );

  return <Map zoom={13} position={[-9.390472517435533, -40.49732535541828]} />;
}
