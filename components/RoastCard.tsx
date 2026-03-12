"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Copy, Share2, Twitter, MessageCircle, Send, X } from "lucide-react";
import { useState, useEffect } from "react";

interface RoastCardProps {
  city: string;
  temperature: number;
  condition: string;
  roast: string;
}

export function RoastCard({ city, temperature, condition, roast }: RoastCardProps) {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Initialize voices (some browsers require an event listener, others load synchronously)
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    if ("speechSynthesis" in window) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speakRoast = () => {
    if (!roast) return;
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel(); // Stop any current speech
        
        const utterance = new SpeechSynthesisUtterance(roast);
        const voices = window.speechSynthesis.getVoices();
        
        // Optional: assign a voice if available (e.g., an English voice)
        if (voices.length > 0) {
          const voice = voices.find((v) => v.lang.startsWith("en")) || voices[0];
          utterance.voice = voice;
        }

        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        window.speechSynthesis.speak(utterance);
      } else {
        console.warn("Your browser does not support text-to-speech.");
      }
    } catch (error) {
      console.error("Speech synthesis failed:", error);
    }
  };

  const getShareText = () => {
    return `🔥 Roast My Weather\n\nCity: ${city}\nWeather: ${temperature}°C ${condition}\n\n"${roast}"`;
  };

  const showToastNotification = () => {
    setCopied(true);
    setShowToast(true);
    setTimeout(() => {
      setCopied(false);
      setShowToast(false);
    }, 2000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareText());
      showToastNotification();
      setShowShareMenu(false); // Close menu if open
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Roast My Weather",
      text: getShareText(),
    };
    
    try {
      // Layer 1: Web Share API if available
      if (typeof navigator !== "undefined" && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Layer 2: Custom Share Menu
        setShowShareMenu(true);
      }
    } catch (err) {
      console.error("Web share failed, falling back to copy", err);
      // Layer 3: Fallback straight to copy if even Layer 1 aborts/errors unusually (not user cancellation)
      if ((err as Error).name !== 'AbortError') {
          await handleCopy();
      }
    }
  };

  const handleCustomShare = (platform: "whatsapp" | "telegram" | "x") => {
    const text = encodeURIComponent(getShareText());
    let url = "";
    if (platform === "whatsapp") url = `https://wa.me/?text=${text}`;
    if (platform === "telegram") url = `https://t.me/share/url?url=&text=${text}`;
    if (platform === "x") url = `https://twitter.com/intent/tweet?text=${text}`;
    
    window.open(url, "_blank", "noopener,noreferrer");
    setShowShareMenu(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-[var(--color-card)] border border-white/10 shadow-2xl rounded-3xl p-8 w-full relative overflow-visible z-10"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] opacity-10 blur-xl rounded-3xl -z-10" />
      
      <div className="relative z-10 flex flex-col gap-8">
        <blockquote className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-white leading-tight">
          "{roast}"
        </blockquote>
        
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 relative">
          <button
            onClick={speakRoast}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full transition-colors text-sm font-medium"
          >
            <Volume2 className="w-4 h-4 text-[var(--color-primary)]" />
            Hear the Roast
          </button>
          
          <div className="flex gap-3 relative">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full transition-colors text-sm font-medium"
            >
              <Copy className="w-4 h-4 text-white/70" />
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] hover:bg-[#ff8c33] text-black rounded-full transition-colors text-sm font-semibold relative"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full right-0 mb-3 w-48 bg-[#161616] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-1">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Share to</span>
                    <button onClick={() => setShowShareMenu(false)} className="text-white/40 hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={() => handleCustomShare("whatsapp")} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl transition-colors text-sm text-white/90 font-medium w-full text-left">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" /> WhatsApp
                  </button>
                  <button onClick={() => handleCustomShare("telegram")} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl transition-colors text-sm text-white/90 font-medium w-full text-left">
                    <Send className="w-4 h-4 text-[#229ED9]" /> Telegram
                  </button>
                  <button onClick={() => handleCustomShare("x")} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl transition-colors text-sm text-white/90 font-medium w-full text-left">
                    <Twitter className="w-4 h-4 text-white" /> X (Twitter)
                  </button>
                  <button onClick={handleCopy} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl transition-colors text-sm text-white/90 font-medium w-full text-left mt-1 border-t border-white/5 pt-3">
                    <Copy className="w-4 h-4 text-white/60" /> Copy to Clipboard
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            className="fixed bottom-6 left-1/2 bg-white text-black px-4 py-2 rounded-full text-sm font-medium shadow-2xl z-[100] flex items-center gap-2 whitespace-nowrap"
          >
            Copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
