// src/components/Map.jsx
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

const locations = [
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

export default function Map() {
  useEffect(() => {
    const map = L.map("myth-map").setView([34.5, -92.5], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const bounds = [];

    locations.forEach((loc) => {
      const marker = L.marker(loc.coords).addTo(map);
      marker.bindPopup(`<strong>${loc.name}</strong><br>${loc.description}`);
      bounds.push(loc.coords);
    });

    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      map.remove(); // Cleanup
    };
  }, []);

  return (
    <div className="rounded-lg shadow-md overflow-hidden">
      <div id="myth-map" className="w-full h-[400px] z-0 rounded-xl" />
    </div>
  );
}
