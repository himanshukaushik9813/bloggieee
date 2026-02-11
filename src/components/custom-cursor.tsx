"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

type CursorMode = "default" | "hover" | "crazy";

const TRAIL_LENGTH = 8;
const CRAZY_TRAIL_LENGTH = 14;

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [smoothPos, setSmoothPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState<Array<{ x: number; y: number; t: number }>>([]);
  const [mode, setMode] = useState<CursorMode>("default");
  const [isOverClickable, setIsOverClickable] = useState(false);
  const [visible, setVisible] = useState(false);
  const [enableCursor, setEnableCursor] = useState(false);
  const smoothRef = useRef(smoothPos);
  const trailRef = useRef<Array<{ x: number; y: number; t: number }>>([]);
  const rafRef = useRef<number>(0);

  const isCrazy = mode === "crazy";

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    setEnableCursor(finePointer);
  }, []);

  const handleMove = useCallback(
    (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (isCrazy) {
        trailRef.current = [
          { x: e.clientX, y: e.clientY, t: Date.now() },
          ...trailRef.current.slice(0, CRAZY_TRAIL_LENGTH - 1),
        ];
        setTrail([...trailRef.current]);
      }
    },
    [isCrazy]
  );

  const handleOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const clickable =
      target.closest("a, button, [role='button'], input, textarea, [data-cursor-hover]");
    setIsOverClickable(!!clickable);
  }, []);

  const handleLeave = useCallback(() => setVisible(false), []);
  const handleEnter = useCallback(() => setVisible(true), []);

  // Cycle cursor mode: Ctrl+Shift+C or Cmd+Shift+C
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        setMode((m) => (m === "default" ? "hover" : m === "hover" ? "crazy" : "default"));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!enableCursor) return;
    document.body.addEventListener("mouseenter", handleEnter);
    document.body.addEventListener("mouseleave", handleLeave);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    document.body.style.cursor = "none";
    return () => {
      document.body.removeEventListener("mouseenter", handleEnter);
      document.body.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      document.body.style.cursor = "";
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enableCursor, handleMove, handleOver, handleEnter, handleLeave]);

  // Smooth follow
  useEffect(() => {
    smoothRef.current = smoothPos;
  }, [smoothPos]);

  useEffect(() => {
    let last = { x: pos.x, y: pos.y };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const step = () => {
      const smooth = 0.18;
      last = {
        x: lerp(last.x, pos.x, smooth),
        y: lerp(last.y, pos.y, smooth),
      };
      setSmoothPos(last);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pos.x, pos.y]);

  const displayMode = isOverClickable && mode !== "crazy" ? "hover" : mode;
  const size = displayMode === "hover" ? 44 : isCrazy ? 12 : 10;
  const ringSize = displayMode === "hover" ? 56 : isCrazy ? 28 : 24;

  if (!enableCursor || !visible) return null;

  return (
    <>
      {/* Crazy trail */}
      {isCrazy &&
        trail.slice(1).map((p, i) => (
          <motion.div
            key={`${p.x}-${p.y}-${i}`}
            className="pointer-events-none fixed left-0 top-0 z-[99998]"
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.4 }}
            style={{
              left: p.x,
              top: p.y,
              width: 12,
              height: 12,
              marginLeft: -6,
              marginTop: -6,
              borderRadius: "50%",
              background: `hsl(${(i * 30) % 360}, 80%, 60%)`,
              boxShadow: "0 0 20px currentColor",
            }}
          />
        ))}

      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[99999] mix-blend-difference"
        style={{
          left: smoothPos.x,
          top: smoothPos.y,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          width: ringSize,
          height: ringSize,
          borderRadius: "50%",
          border: isCrazy ? "2px solid rgba(255,100,255,0.9)" : "2px solid rgba(255,255,255,0.6)",
          boxShadow: isCrazy
            ? "0 0 30px rgba(255,100,255,0.6), inset 0 0 20px rgba(255,100,255,0.2)"
            : "0 0 0 1px rgba(0,0,0,0.2)",
        }}
        animate={{
          scale: displayMode === "hover" ? 1.1 : 1,
          transition: { type: "spring", stiffness: 500, damping: 28 },
        }}
      />

      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[99999]"
        style={{
          left: smoothPos.x,
          top: smoothPos.y,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          width: size,
          height: size,
          borderRadius: "50%",
          background: isCrazy
            ? "radial-gradient(circle, rgba(255,100,255,0.95) 0%, rgba(150,50,255,0.8) 100%)"
            : displayMode === "hover"
              ? "rgba(139, 92, 246, 0.9)"
              : "rgba(255,255,255,0.95)",
          boxShadow: isCrazy
            ? "0 0 25px rgba(255,100,255,0.8)"
            : "0 1px 4px rgba(0,0,0,0.3)",
        }}
        animate={{
          scale: displayMode === "hover" ? 1.2 : 1,
          transition: { type: "spring", stiffness: 500, damping: 28 },
        }}
      />

      {/* Mode hint - only in crazy */}
      {isCrazy && (
        <div
          className="pointer-events-none fixed bottom-4 left-1/2 z-[99999] -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-xs font-medium text-violet-300 backdrop-blur-sm"
          style={{ bottom: 24 }}
        >
          Crazy cursor on · Ctrl+Shift+C to cycle
        </div>
      )}
    </>
  );
}
