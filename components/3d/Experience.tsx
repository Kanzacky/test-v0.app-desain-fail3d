"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { PoemManager } from "./PoemManager";
import type * as THREE from "three";
import { Fog } from "three";

function CameraController() {
  const { camera } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      targetRotation.current.x = y * 0.1;
      targetRotation.current.y = x * 0.1;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      targetRotation.current.x += event.deltaY * 0.0002;
      targetRotation.current.x = Math.max(
        -0.3,
        Math.min(0.3, targetRotation.current.x)
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useFrame(() => {
    currentRotation.current.x +=
      (targetRotation.current.x - currentRotation.current.x) * 0.05;
    currentRotation.current.y +=
      (targetRotation.current.y - currentRotation.current.y) * 0.05;

    camera.rotation.x = currentRotation.current.x;
    camera.rotation.y = currentRotation.current.y;
  });

  return null;
}

function ParticleField() {
  const sparklesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (sparklesRef.current) {
      sparklesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <>
      <Stars
        radius={50}
        depth={100}
        count={3000}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />
      <Sparkles
        ref={sparklesRef}
        count={200}
        scale={20}
        size={2}
        speed={0.3}
        opacity={0.5}
        color="#ffffff"
      />
    </>
  );
}

function FogScene() {
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new Fog("#050510", 5, 30);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  return null;
}

interface ExperienceProps {
  onStanzaChange?: (index: number, total: number) => void;
}

export function Experience({ onStanzaChange }: ExperienceProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: "#050510" }}
    >
      <color attach="background" args={["#050510"]} />
      <FogScene />

      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.2} color="#4a90d9" />

      <CameraController />
      <ParticleField />
      <PoemManager onStanzaChange={onStanzaChange} />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={0.8}
        />
      </EffectComposer>
    </Canvas>
  );
}
