import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  let city = "Unknown City";
  try {
    const body = await req.json();
    city = body.city || city;
    const { temperature, humidity, wind, condition, intensity } = body;

    const fallbackRoasts = [
      `Wow, ${city}'s weather is as boring as a dial-up connection.`,
      `I'd roast ${city}'s weather, but it's already a complete joke.`,
      `Looking at ${city}'s forecast makes me want to uninstall myself.`,
      `Even the clouds in ${city} are disappointed to be there.`,
      `The weather in ${city} is proof that the universe has given up on you.`
    ];
    const staticFallback = fallbackRoasts[Math.floor(Math.random() * fallbackRoasts.length)];

    // 1. Prewritten extreme roasts
    if (temperature > 42) {
      return NextResponse.json({ roast: `It's basically a furnace in ${city}. You don't need sunscreen, you need an oven mitt.` });
    }
    if (temperature < -5) {
      return NextResponse.json({ roast: `Welcome to ${city}, where your tears freeze before they even hit your damn face.` });
    }
    if (condition && condition.toLowerCase().includes('thunderstorm')) {
      return NextResponse.json({ roast: `Zeus is personally trying to smite ${city} right now, good luck surviving that shit.` });
    }
    if (condition && (condition.toLowerCase().includes('heavy rain') || condition.toLowerCase().includes('violent rain'))) {
      return NextResponse.json({ roast: `It's practically underwater in ${city}, hope you brought a submarine because an umbrella ain't doing shit.` });
    }

    // 2. Smart model routing
    let model = "llama-3.1-8b-instant";
    if (intensity === "Nuclear") {
      model = "llama-3.3-70b-versatile";
    }

    const systemPrompt = `You are a viral internet comedian who ruthlessly roasts cities based on their weather.
Your roast MUST follow these rules exactly:
- Maximum 25 words
- Exactly ONE sentence
- Extremely sarcastic, unhinged, dark, and funny
- Can use abusive slangs naturally to be funny
- NO emojis
- NO explanation
- Returns ONLY the roast string
Roast intensity level requested: ${intensity}`;

    const userPrompt = `City: ${city}. Weather: ${temperature}°C, ${humidity}% humidity, ${wind}km/h wind, Condition: ${condition}. Roast them.`;

    let roastContent = "";

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        model,
        temperature: 0.9,
        max_tokens: 40,
        top_p: 0.95,
      });
      roastContent = chatCompletion.choices[0]?.message?.content || "";
    } catch (error) {
      console.error(`Primary model (${model}) failed, falling back to llama-3.1-8b-instant`, error);
      try {
        const fallbackCompletion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          model: "llama-3.1-8b-instant",
          temperature: 0.9,
          max_tokens: 40,
          top_p: 0.95,
        });
        roastContent = fallbackCompletion.choices[0]?.message?.content || "";
      } catch (fallbackError) {
        console.error("Fallback AI failed, returning static fallback.", fallbackError);
        return NextResponse.json({ roast: staticFallback });
      }
    }

    if (!roastContent) {
        return NextResponse.json({ roast: staticFallback });
    }

    // Clean up response if AI added extra sentences/newlines/quotes
    let finalRoast = roastContent.trim();
    if (finalRoast.startsWith('"') && finalRoast.endsWith('"')) {
      finalRoast = finalRoast.slice(1, -1);
    }
    finalRoast = finalRoast.split(/(?<=[.!?])\s/)[0] || finalRoast; // Keep first sentence roughly

    return NextResponse.json({ roast: finalRoast });

  } catch (error) {
    console.error("Roast engine error:", error);
    return NextResponse.json({ roast: `Wow, the weather in ${city} is so bad it literally broke my circuits.` });
  }
}
