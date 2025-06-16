// src/components/Map.jsx
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

const defaultLocations = [
  {
    name: "O. Henry Museum",
    description: "Home of America's twist-ending master.",
    coords: [30.2672, -97.7431],
  },
  {
    name: "Branch Davidian Compound",
    description: "Apocalyptic modern myth site.",
    coords: [31.5820, -97.1771],
  },
  {
    name: "Hot Springs National Park",
    description: "Native healing waters turned luxury spa town.",
    coords: [34.5133, -93.0540],
  },
  {
    name: "Petit Jean State Park",
    description: "Named after a ghostly love legend.",
    coords: [35.1334, -92.9371],
  },
  {
    name: "Memphis Pyramid",
    description: "Modern monument to weird Americana.",
    coords: [35.1557, -90.0520],
  },
  {
    name: "Bell Witch Cave",
    description: "Infamous American haunting legend.",
    coords: [36.5850, -87.0669],
  },
  {
    name: "Jonesborough, TN",
    description: "Oldest town in TN, home of storytelling.",
    coords: [36.2948, -82.4735],
  },
];

export default function Map({ 
  locations = defaultLocations, 
  center = [34.5, -92.5], 
  zoom = 6, 
  mapId = "myth-map",
  height = "400px"
}) {
  useEffect(() => {
    // Remove existing map if it exists
    const existingMap = document.getElementById(mapId);
    if (existingMap && existingMap._leaflet_id) {
      existingMap._leaflet_id = null;
    }

    const map = L.map(mapId).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const bounds = [];

    locations.forEach((loc) => {
      const marker = L.marker(loc.coords).addTo(map);
      marker.bindPopup(`<strong>${loc.name}</strong><br>${loc.description}`);
      bounds.push(loc.coords);
    });

    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      map.remove(); // Cleanup
    };
  }, [locations, center, zoom, mapId]);

  return (
    <div className="rounded-lg shadow-md overflow-hidden">
      <div id={mapId} className="w-full z-0 rounded-xl" style={{ height }} />
    </div>
  );
}
