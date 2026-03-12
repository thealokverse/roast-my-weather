# Roast My Weather

Welcome to **Roast My Weather**, a totally unhinged, AI-powered weather app that doesn't just tell you if it's raining—it brutally insults your city for it.

Built with Next.js, this app uses real-time weather data and Groq's blazing-fast Llama 3 models to deliver cynical, sarcastic, and frankly disrespectful commentary on your local climate.

## Features

- **Real-Time Weather Data**: Fetches accurate temperature, humidity, wind speed, and conditions using the free [Open-Meteo API](https://open-meteo.com/).
- **AI-Powered Roasts**: Uses [Groq SDK](https://groq.com/) and Llama 3 models to generate personalized insults based on your city's exact weather.
- **Adjustable Intensity Limits**: Choose how much emotional damage you want to take:
  - **Mild**: Light teasing.
  - **Savage**: Standard ruthless internet roasting using `llama-3.1-8b-instant`.
  - **Nuclear**: Unfiltered, extreme roasting using the massive `llama-3.3-70b-versatile` model.
- **World Roast Heatmap**: A gorgeous interactive globe (built with `react-simple-maps` and `d3`) plotting the locations of all the cities you've roasted, color-coded by how brutal the weather (and the roast) was.
- **Top Roasted Leaderboard**: A local-storage backed leaderboard tracking the top 5 cities that received the harshest "Roast Scores".
- **Premium UI/UX**: Crafted with modern web aesthetics using **Tailwind CSS v4**, **Lucide React** icons, and butter-smooth **Framer Motion** animations for a dark, glassmorphic, and dynamic look.


## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & Styling**: React 19, [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI engine**: [Groq SDK](https://github.com/groq/groq-typescript) (Llama-3.1-8b-instant / Llama-3.3-70b-versatile)
- **Maps & Data Viz**: `react-simple-maps`, `d3`, `topojson-client`
- **Weather API**: Open-Meteo API

## How it works

1. You type in a city.
2. The frontend fetches coordinates and weather metrics via Open-Meteo.
3. The app POSTs the geodata and weather details to the `/api/roast` route.
4. The server crafts a custom prompt and pings Groq's Llama models.
5. The model responds with a one-sentence brutal roast.
6. The app calculates a "Roast Score", limits it to 100, saves it to your local storage, and updates the World Heatmap and Leaderboard.
