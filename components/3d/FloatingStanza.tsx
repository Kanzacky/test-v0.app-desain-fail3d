"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { Text, Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";

interface FloatingStanzaProps {
  lines: string[];
  isActive: boolean;
  onComplete: () => void;
  position?: [number, number, number];
}

interface InteractiveWordProps {
  word: string;
  position: [number, number, number];
  isActive: boolean;
  delay: number;
  onWordClick: () => void;
}

function InteractiveWord({
  word,
  position,
  isActive,
  delay,
  onWordClick,
}: InteractiveWordProps) {
  const [hovered, setHovered] = useState(false);
  const textRef = useRef<THREE.Mesh>(null);
  const [animatedOpacity, setAnimatedOpacity] = useState(0);
  const [animatedScale, setAnimatedScale] = useState(0.5);
  const [animatedPos, setAnimatedPos] = useState<[number, number, number]>([
    position[0] + (Math.random() - 0.5) * 5,
    position[1] + (Math.random() - 0.5) * 5,
    position[2] - 10,
  ]);
  const targetPos = useRef(position);
  const glitchActive = useRef(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        targetPos.current = position;
      }, delay);
      return () => clearTimeout(timer);
    } else {
      targetPos.current = [
        position[0] + (Math.random() - 0.5) * 8,
        position[1] + (Math.random() - 0.5) * 8,
        position[2] - 15,
      ];
    }
  }, [isActive, delay, position]);

  useFrame(() => {
    // Smooth opacity transition
    const targetOpacity = isActive ? 1 : 0;
    setAnimatedOpacity((prev) => prev + (targetOpacity - prev) * 0.08);

    // Smooth scale transition
    const targetScale = isActive ? (hovered ? 1.15 : 1) : 0.5;
    setAnimatedScale((prev) => prev + (targetScale - prev) * 0.1);

    // Smooth position transition
    setAnimatedPos((prev) => [
      prev[0] + (targetPos.current[0] - prev[0]) * 0.06,
      prev[1] + (targetPos.current[1] - prev[1]) * 0.06,
      prev[2] + (targetPos.current[2] - prev[2]) * 0.06,
    ]);

    // Glitch effect on hover
    if (hovered && textRef.current) {
      textRef.current.position.x =
        animatedPos[0] + (Math.random() - 0.5) * 0.03;
      textRef.current.position.y =
        animatedPos[1] + (Math.random() - 0.5) * 0.03;
    } else if (textRef.current) {
      textRef.current.position.x = animatedPos[0];
      textRef.current.position.y = animatedPos[1];
    }
  });

  return (
    <Text
      ref={textRef}
      font="/fonts/Geist-Regular.ttf"
      fontSize={0.4}
      position={animatedPos}
      scale={animatedScale}
      color={hovered ? "#d4a574" : "#ffffff"}
      anchorX="center"
      anchorY="middle"
      onClick={onWordClick}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      {word}
      <meshBasicMaterial
        transparent
        opacity={animatedOpacity}
        color={hovered ? "#d4a574" : "#ffffff"}
      />
    </Text>
  );
}

export function FloatingStanza({
  lines,
  isActive,
  onComplete,
  position = [0, 0, 0],
}: FloatingStanzaProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isExiting, setIsExiting] = useState(false);

  const words = useMemo(() => {
    const result: {
      word: string;
      position: [number, number, number];
      delay: number;
    }[] = [];
    let wordIndex = 0;

    lines.forEach((line, lineIndex) => {
      const wordsInLine = line.split(" ");
      const totalWidth = wordsInLine.length * 1.2;
      const startX = -totalWidth / 2 + 0.6;

      wordsInLine.forEach((word, i) => {
        result.push({
          word,
          position: [
            position[0] + startX + i * 1.2,
            position[1] - lineIndex * 0.7,
            position[2],
          ],
          delay: wordIndex * 80,
        });
        wordIndex++;
      });
    });

    return result;
  }, [lines, position]);

  const handleClick = () => {
    if (!isExiting && isActive) {
      setIsExiting(true);
      setTimeout(() => {
        onComplete();
        setIsExiting(false);
      }, 600);
    }
  };

  const showWords = isActive && !isExiting;

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.15}
      floatIntensity={0.25}
      floatingRange={[-0.05, 0.05]}
    >
      <group ref={groupRef}>
        {words.map((wordData, index) => (
          <InteractiveWord
            key={`${wordData.word}-${index}`}
            word={wordData.word}
            position={wordData.position}
            isActive={showWords}
            delay={wordData.delay}
            onWordClick={handleClick}
          />
        ))}
      </group>
    </Float>
  );
}
