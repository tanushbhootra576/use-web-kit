"use client";

import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface KineticTextProps {
  text: string;
  className?: string;
}

export default function KineticText({ text, className = "" }: KineticTextProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate mouse position relative to the center of the container
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Split text into words, then words into letters, preserving spaces
  const words = text.split(" ");

  return (
    <h1 ref={containerRef} className={`relative flex flex-wrap ${className}`}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-flex whitespace-nowrap mr-[0.25em]">
          {word.split("").map((letter, letterIdx) => {
            return (
              <KineticLetter 
                key={letterIdx} 
                letter={letter} 
                mouseX={mousePos.x} 
                mouseY={mousePos.y} 
                containerRef={containerRef}
              />
            );
          })}
        </span>
      ))}
    </h1>
  );
}

function KineticLetter({ 
  letter, 
  mouseX, 
  mouseY, 
  containerRef 
}: { 
  letter: string; 
  mouseX: number; 
  mouseY: number; 
  containerRef: React.RefObject<HTMLHeadingElement | null> 
}) {
  const letterRef = useRef<HTMLSpanElement>(null);
  
  // Calculate distance from mouse to this specific letter
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isHovered = useRef(false);

  useEffect(() => {
    if (!letterRef.current || !containerRef.current) return;
    
    // Get letter center position relative to the container
    const letterRect = letterRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const letterCenterX = (letterRect.left - containerRect.left) + letterRect.width / 2;
    const letterCenterY = (letterRect.top - containerRect.top) + letterRect.height / 2;

    // Calculate distance vector
    const dx = mouseX - letterCenterX;
    const dy = mouseY - letterCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Repulsion radius and strength
    const radius = 120;
    const strength = 60;

    if (distance < radius) {
      isHovered.current = true;
      const pushFactor = (radius - distance) / radius;
      // Push away from mouse
      const pushX = -(dx / distance) * pushFactor * strength;
      const pushY = -(dy / distance) * pushFactor * strength;
      
      setOffset({ x: pushX, y: pushY });
    } else if (isHovered.current) {
      isHovered.current = false;
      setOffset({ x: 0, y: 0 });
    }
  }, [mouseX, mouseY, containerRef]);

  return (
    <motion.span
      ref={letterRef}
      className="inline-block origin-center"
      animate={{ 
        x: offset.x, 
        y: offset.y, 
        rotate: offset.x * 0.2, // Slight tilt based on repulsion
        scale: offset.x === 0 && offset.y === 0 ? 1 : 1.1,
        color: offset.x === 0 && offset.y === 0 ? "inherit" : "#5BE30C" // Glow green when repelled
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 15,
        mass: 0.8 
      }}
    >
      {letter}
    </motion.span>
  );
}