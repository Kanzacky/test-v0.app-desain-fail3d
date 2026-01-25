"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface OverlayProps {
  currentStanza: number;
  totalStanzas: number;
}

export function Overlay({ currentStanza, totalStanzas }: OverlayProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(() => {});
        audioRef.current.muted = false;
      } else {
        audioRef.current.muted = true;
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {/* Hidden audio element - using a royalty-free ambient URL */}
      <audio
        ref={audioRef}
        loop
        muted
        preload="none"
        src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 md:p-10"
      >
        <div className="font-sans text-sm tracking-[0.3em] text-foreground/60 uppercase">
          Echoes
        </div>

        <button
          onClick={toggleMute}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 bg-background/30 text-foreground/60 backdrop-blur-sm transition-all hover:border-foreground/40 hover:text-foreground"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </motion.header>

      {/* Center instructions */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <p className="font-sans text-sm tracking-widest text-foreground/40 uppercase">
                Click the words to continue
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-10"
      >
        {Array.from({ length: totalStanzas }).map((_, index) => (
          <motion.div
            key={index}
            className="h-1 w-6 rounded-full"
            animate={{
              backgroundColor:
                index === currentStanza
                  ? "rgba(255, 255, 255, 0.8)"
                  : "rgba(255, 255, 255, 0.2)",
              scale: index === currentStanza ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="absolute bottom-6 right-6 text-right md:bottom-10 md:right-10"
      >
        <p className="font-sans text-xs tracking-widest text-foreground/30 uppercase">
          Scroll to explore
        </p>
      </motion.footer>

      {/* Vignette effect */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(5, 5, 16, 0.4) 70%, rgba(5, 5, 16, 0.8) 100%)",
        }}
      />
    </div>
  );
}
