"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type Intensity = "Mild" | "Savage" | "Nuclear";

interface RoastSliderProps {
  intensity: Intensity;
  setIntensity: (intensity: Intensity) => void;
}

const marks: Intensity[] = ["Mild", "Savage", "Nuclear"];

export function RoastSlider({ intensity, setIntensity }: RoastSliderProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center px-1">
        <span className="text-sm font-medium text-white/60">Roast Intensity</span>
        <span className={cn(
          "text-sm font-bold tracking-wider uppercase px-2 py-0.5 rounded text-white border",
          intensity === "Mild" && "bg-white/10 border-white/10",
          intensity === "Savage" && "bg-[var(--color-secondary)]/20 border-[var(--color-secondary)]/30 text-[var(--color-secondary)]",
          intensity === "Nuclear" && "bg-[var(--color-primary)]/20 border-[var(--color-primary)]/30 text-[var(--color-primary)]"
        )}>
          {intensity}
        </span>
      </div>
      
      <div className="relative bg-[#1A1A1A] h-14 rounded-full p-1 flex items-center border border-white/5 shadow-inner">
        <div className="absolute inset-0 w-full h-full flex z-0">
          {marks.map((mark, i) => (
             <div key={i} className="flex-1" />
          ))}
        </div>
        
        {marks.map((mark) => {
          const isActive = intensity === mark;
          return (
            <button
              key={mark}
              onClick={() => setIntensity(mark)}
              className={cn(
                "relative z-10 flex-1 h-full rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300",
                isActive ? "text-white" : "text-white/40 hover:text-white/70"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="slider-active-bg"
                  className={cn(
                    "absolute inset-0 rounded-full",
                    mark === "Mild" && "bg-white/10",
                    mark === "Savage" && "bg-[var(--color-secondary)]/20",
                    mark === "Nuclear" && "bg-[var(--color-primary)]/20"
                  )}
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-20">{mark}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
