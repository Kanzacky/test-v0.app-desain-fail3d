"use client";

import { useState, useCallback } from "react";
import { FloatingStanza } from "./FloatingStanza";

interface Stanza {
  id: number;
  lines: string[];
}

const poemData: Stanza[] = [
  {
    id: 1,
    lines: ["In the silence of the void,", "words begin to breathe."],
  },
  {
    id: 2,
    lines: ["They float like embers,", "remnants of forgotten fires."],
  },
  {
    id: 3,
    lines: ["Each syllable a heartbeat,", "echoing through darkness."],
  },
  {
    id: 4,
    lines: ["We are but whispers,", "searching for the light."],
  },
  {
    id: 5,
    lines: ["And in the end,", "only echoes remain."],
  },
];

interface PoemManagerProps {
  onStanzaChange?: (index: number, total: number) => void;
}

export function PoemManager({ onStanzaChange }: PoemManagerProps) {
  const [currentStanzaIndex, setCurrentStanzaIndex] = useState(0);

  const handleStanzaComplete = useCallback(() => {
    setCurrentStanzaIndex((prev) => {
      const nextIndex = (prev + 1) % poemData.length;
      onStanzaChange?.(nextIndex, poemData.length);
      return nextIndex;
    });
  }, [onStanzaChange]);

  return (
    <group>
      {poemData.map((stanza, index) => (
        <FloatingStanza
          key={stanza.id}
          lines={stanza.lines}
          isActive={index === currentStanzaIndex}
          onComplete={handleStanzaComplete}
          position={[0, 0, 0]}
        />
      ))}
    </group>
  );
}
