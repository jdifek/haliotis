"use client";

import dynamic from "next/dynamic";

const LeafletMapWithMarkers = dynamic(
  () => import("./LeafletMapWithMarkers"),
  {
    ssr: false,
  }
);

export default LeafletMapWithMarkers;