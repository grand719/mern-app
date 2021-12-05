/* eslint-disable new-cap */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-new */
import React, { useRef, useEffect } from "react";

import "./Map.css";

declare const window: any;

type MapType = {
  className?: string;
  style?: React.CSSProperties;
  center: { lat: number; lng: number };
  zoom: any;
};

const Map = ({
  className, style, center, zoom,
}: MapType) => {
  const mapRef = useRef<any>();

  useEffect(() => {
    console.log(center);
    new window.ol.Map({
      target: mapRef.current.id,
      layers: [
        new window.ol.layer.Tile({
          source: new window.ol.source.OSM(),
        }),
      ],
      view: new window.ol.View({
        center: window.ol.proj.fromLonLat([center.lng, center.lat]),
        zoom,
      }),
    });
  }, [center, zoom]);

  return (
    <div
      className={`map ${className}`}
      style={style}
      ref={mapRef}
      id="map"
    >
    </div>
  );
};

export default Map;
