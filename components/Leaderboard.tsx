"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Flame } from "lucide-react";

export interface RoastedCity {
  city: string;
  latitude: number;
  longitude: number;
  roast: string;
  roastScore: number;
  timestamp: number;
  temperature: number;
  condition: string;
}

export function Leaderboard() {
  const [cities, setCities] = useState<RoastedCity[]>([]);

  // Periodically check local storage
  useEffect(() => {
    const loadCities = () => {
      try {
        const stored = localStorage.getItem("roasted_cities");
        if (stored) {
          const parsed: RoastedCity[] = JSON.parse(stored);
          // Sort by highest score, then newest
          parsed.sort((a, b) => b.roastScore - a.roastScore || b.timestamp - a.timestamp);
          setCities(parsed.slice(0, 5)); // Top 5
        }
      } catch (e) {
        console.error("Failed to load cities for leaderboard", e);
      }
    };

    loadCities();
    
    // Listen for custom event triggered when a new roast happens
    window.addEventListener("roasts_updated", loadCities);
    return () => window.removeEventListener("roasts_updated", loadCities);
  }, []);

  if (cities.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--color-card)] border border-white/5 shadow-2xl rounded-3xl p-6 w-full mt-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-5 h-5 text-[var(--color-secondary)]" />
        <h2 className="text-xl font-semibold text-white tracking-tight">Top Roasted Cities</h2>
      </div>

      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {cities.map((item, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              key={`${item.city}-${item.timestamp}`}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#1A1A1A] border border-white/5 group hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-white/40 font-mono text-sm w-4">{index + 1}</span>
                <div className="flex flex-col">
                  <span className="font-medium text-white group-hover:text-[var(--color-secondary)] transition-colors">{item.city}</span>
                  <span className="text-xs text-white/40 line-clamp-1 italic max-w-xs md:max-w-md">"{item.roast}"</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-1 text-[var(--color-primary)]">
                  <Flame className="w-3 h-3" />
                  <span className="font-bold text-sm tracking-tighter">{item.roastScore}</span>
                </div>
                <span className="text-xs text-white/30">{item.temperature}°C</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
