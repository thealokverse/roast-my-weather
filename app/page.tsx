"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { fetchWeather, WeatherData } from "@/lib/weather";
import { WeatherCard } from "@/components/WeatherCard";
import { RoastCard } from "@/components/RoastCard";
import { RoastSlider, Intensity } from "@/components/RoastSlider";
import { RoastHeatmap } from "@/components/RoastHeatmap";
import { Leaderboard, RoastedCity } from "@/components/Leaderboard";

export default function Home() {
  const [cityInput, setCityInput] = useState("");
  const [intensity, setIntensity] = useState<Intensity>("Savage");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [searchedCity, setSearchedCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [roast, setRoast] = useState("");

  const handleRoast = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cityInput.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);
    setRoast("");
    

    try {
      // 1. Fetch weather
      const weatherData = await fetchWeather(cityInput);
      setWeather(weatherData);
      setSearchedCity(cityInput);

      // 2. Fetch Roast
      let finalRoast = "";
      try {
        const roastRes = await fetch("/api/roast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city: cityInput,
            temperature: weatherData.temperature,
            humidity: weatherData.humidity,
            wind: weatherData.windSpeed,
            condition: weatherData.condition,
            intensity,
          }),
        });
        
        const roastData = await roastRes.json();
        if (!roastRes.ok || !roastData.roast) {
          finalRoast = `Even my AI doesn't want to talk about how depressing ${cityInput}'s weather is.`;
        } else {
          finalRoast = roastData.roast;
        }
      } catch (err) {
        finalRoast = `Wow, ${cityInput}'s weather is so bad it literally broke my connection to reality.`;
      }
      
      setRoast(finalRoast);

      // 3. Calculate Score
      let baseScore = intensity === "Mild" ? 20 : intensity === "Savage" ? 50 : 100;
      if (weatherData.temperature > 35 || weatherData.temperature < 0) baseScore += 20;
      if (weatherData.windSpeed > 40) baseScore += 10;
      
      const newRoastedCity: RoastedCity = {
        city: cityInput,
        latitude: weatherData.latitude,
        longitude: weatherData.longitude,
        roast: finalRoast,
        roastScore: Math.min(baseScore, 100), 
        timestamp: Date.now(),
        temperature: weatherData.temperature,
        condition: weatherData.condition,
      };

      // 4. Save to LocalStorage
      const stored = localStorage.getItem("roasted_cities");
      let citiesMap = stored ? JSON.parse(stored) : [];
      citiesMap = citiesMap.filter((c: RoastedCity) => c.city.toLowerCase() !== cityInput.toLowerCase());
      citiesMap.push(newRoastedCity);
      localStorage.setItem("roasted_cities", JSON.stringify(citiesMap));

      // 5. Trigger event for Map and Leaderboard update
      window.dispatchEvent(new Event("roasts_updated"));

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col items-center text-center mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 drop-shadow-sm mt-8">
          Roast My Weather
        </h1>
        <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light">
          AI that brutally roasts your city's weather. Find out how pathetic your local climate really is.
        </p>
      </motion.div>

      <form onSubmit={handleRoast} className="w-full max-w-md relative mb-12 z-20">
        <div className="relative flex items-center shadow-2xl rounded-full bg-[var(--color-card)] border border-white/10 hover:border-white/20 transition-colors">
          <Search className="absolute left-6 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Enter your city..."
            className="w-full bg-transparent border-none py-5 pl-14 pr-32 text-white placeholder-white/30 focus:outline-none focus:ring-0 text-lg rounded-full"
            disabled={loading}
          />
          <button
            disabled={loading || !cityInput.trim()}
            className="absolute right-2 px-6 py-3 bg-[var(--color-primary)] hover:bg-[#ff8c33] disabled:opacity-50 text-black font-semibold rounded-full transition-all flex items-center justify-center min-w-[100px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Roast It"}
          </button>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 mt-4 text-center font-medium"
          >
            {error}
          </motion.p>
        )}
      </form>

      <div className="w-full max-w-4xl mx-auto mb-10 z-10 relative">
         <RoastSlider intensity={intensity} setIntensity={setIntensity} />
      </div>

      <AnimatePresence>
        {weather && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="w-full"
          >
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16 items-stretch">
              <div className="lg:col-span-1 flex">
                <WeatherCard {...weather} />
              </div>
              <div className="lg:col-span-2 flex">
                {roast ? (
                  <RoastCard
                    city={searchedCity}
                    temperature={weather.temperature}
                    condition={weather.condition}
                    roast={roast}
                  />
                ) : (
                  <div className="w-full h-full min-h-[250px] bg-[var(--color-card)] rounded-3xl border border-white/5 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-6 items-stretch">
        <div className="flex-1 min-w-[300px]">
          <RoastHeatmap />
        </div>
        <div className="shrink-0 w-full md:w-96">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
