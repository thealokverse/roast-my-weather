"use client";

import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { RoastedCity } from "./Leaderboard";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export function RoastHeatmap() {
  const [cities, setCities] = useState<RoastedCity[]>([]);
  const [hoveredCity, setHoveredCity] = useState<RoastedCity | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadCities = () => {
      try {
        const stored = localStorage.getItem("roasted_cities");
        if (stored) {
          setCities(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load map data", e);
      }
    };
    
    loadCities();
    window.addEventListener("roasts_updated", loadCities);
    return () => window.removeEventListener("roasts_updated", loadCities);
  }, []);

  if (!mounted) return <div className="w-full aspect-[2/1] bg-[#1A1A1A] rounded-2xl animate-pulse" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--color-card)] border border-white/5 shadow-2xl rounded-3xl p-6 w-full relative group mt-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
        <h2 className="text-xl font-semibold text-white tracking-tight">World Roast Map</h2>
      </div>

      <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/5">
        <ComposableMap
          projectionConfig={{ scale: 140 }}
          width={800}
          height={400}
          style={{ width: "100%", height: "100%", outline: "none" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1A1A1A"
                  stroke="#FFFFFF"
                  strokeWidth={0.2}
                  strokeOpacity={0.1}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#222" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {cities.map((cityData) => {
            const isMild = cityData.roastScore <= 30;
            const isSavage = cityData.roastScore > 30 && cityData.roastScore <= 70;
            const color = isMild ? "#FFB347" : isSavage ? "#FF7A18" : "#990000";

            return (
              <Marker
                key={`${cityData.city}-${cityData.timestamp}`}
                coordinates={[cityData.longitude, cityData.latitude]}
                onMouseEnter={() => setHoveredCity(cityData)}
                onMouseLeave={() => setHoveredCity(null)}
              >
                <circle
                  r={isMild ? 4 : isSavage ? 6 : 8}
                  fill={color}
                  className="cursor-pointer transition-all duration-300 outline-none"
                  style={{ 
                    filter: `drop-shadow(0 0 ${isMild ? 5 : isSavage ? 8 : 12}px ${color})`,
                    outline: 'none'
                  }}
                />
              </Marker>
            );
          })}
        </ComposableMap>

        <AnimatePresence>
          {hoveredCity && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-4 right-4 md:w-80 bg-[#161616]/95 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl pointer-events-none"
            >
              <div className="flex justify-between items-start mb-3 border-b border-white/10 pb-3">
                <span className="font-bold text-white text-lg">{hoveredCity.city}</span>
                <div className="flex flex-col items-end">
                  <span className="font-medium text-[var(--color-primary)]">{hoveredCity.temperature}°C</span>
                  <span className="text-xs text-white/50">{hoveredCity.condition}</span>
                </div>
              </div>
              <p className="text-sm text-white/90 italic leading-relaxed">
                "{hoveredCity.roast}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
