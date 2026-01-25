"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { Overlay } from "@/components/ui/Overlay";

// Dynamic import for the 3D experience to avoid SSR issues
const Experience = dynamic(
  () => import("@/components/3d/Experience").then((mod) => mod.Experience),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center bg-[#050510]">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60 mx-auto" />
          <p className="font-sans text-sm tracking-widest text-foreground/40 uppercase">
            Entering the void...
          </p>
        </div>
      </div>
    ),
  }
);

export default function PoetryExperience() {
  const [stanzaInfo, setStanzaInfo] = useState({ current: 0, total: 5 });

  const handleStanzaChange = (index: number, total: number) => {
    setStanzaInfo({ current: index, total });
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#050510]">
      <Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center bg-[#050510]">
            <p className="font-sans text-sm tracking-widest text-foreground/40 uppercase">
              Loading...
            </p>
          </div>
        }
      >
        <Experience onStanzaChange={handleStanzaChange} />
      </Suspense>
      <Overlay
        currentStanza={stanzaInfo.current}
        totalStanzas={stanzaInfo.total}
      />
    </main>
  );
}
