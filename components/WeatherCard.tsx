"use client";

import { motion } from "framer-motion";
import { Cloud, Droplets, Wind, Thermometer } from "lucide-react";

interface WeatherCardProps {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
}

export function WeatherCard({ temperature, humidity, windSpeed, condition }: WeatherCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--color-card)] border border-white/5 shadow-2xl rounded-3xl p-6 w-full text-[var(--color-foreground)] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/10 blur-3xl rounded-full" />
      
      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white/50 uppercase tracking-wider mb-1">Current Weather</span>
            <span className="text-xl font-semibold">{condition}</span>
          </div>
          <Cloud className="w-8 h-8 text-[var(--color-primary)]" strokeWidth={1.5} />
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-bold tracking-tighter">{temperature}°</span>
          <span className="text-2xl text-white/40">C</span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5">
              <Droplets className="w-4 h-4 text-[var(--color-secondary)]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-white/40">Humidity</span>
              <span className="font-medium">{humidity}%</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5">
              <Wind className="w-4 h-4 text-[var(--color-secondary)]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-white/40">Wind</span>
              <span className="font-medium">{windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
