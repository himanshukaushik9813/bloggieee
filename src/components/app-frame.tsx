"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, X, Maximize2, Minimize2 } from "lucide-react";

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [closeShake, setCloseShake] = useState(false);
  const [closeMessage, setCloseMessage] = useState(false);

  const handleClose = () => {
    setCloseShake(true);
    setCloseMessage(true);
    setTimeout(() => setCloseShake(false), 500);
    setTimeout(() => setCloseMessage(false), 2000);
  };

  const handleMinimize = () => {
    setMinimized(true);
    setTimeout(() => setMinimized(false), 600);
  };

  const handleMaximize = () => {
    setMaximized(!maximized);
  };

  return (
    <div className="flex flex-col">
      {/* Title bar - browser-style with crazy controls */}
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-muted/50 px-4 py-2 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleClose}
              className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ff5f57] shadow-inner transition-all hover:scale-110 hover:brightness-110 active:scale-95"
              aria-label="Close"
            >
              <motion.span
                animate={closeShake ? { x: [0, -5, 5, -3, 3, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="flex"
              >
                <X className="h-2 w-2 text-[#4d0000]" strokeWidth={3} />
              </motion.span>
            </button>
            <button
              type="button"
              onClick={handleMinimize}
              className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#febc2e] shadow-inner transition-all hover:scale-110 hover:brightness-110 active:scale-95"
              aria-label="Minimize"
            >
              <Minus className="h-2 w-2 text-[#995700]" strokeWidth={3} />
            </button>
            <button
              type="button"
              onClick={handleMaximize}
              className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#28c840] shadow-inner transition-all hover:scale-110 hover:brightness-110 active:scale-95"
              aria-label="Maximize"
            >
              {maximized ? (
                <Minimize2 className="h-2 w-2 text-[#006600]" strokeWidth={3} />
              ) : (
                <Maximize2 className="h-2 w-2 text-[#006600]" strokeWidth={3} />
              )}
            </button>
          </div>
          <span className="ml-2 text-xs font-medium text-muted-foreground">BlogVerse</span>
          <span className="text-muted-foreground/50">·</span>
          <span className="text-[10px] text-muted-foreground">by Himanshu Kaushik</span>
        </div>

        <div className="flex items-center gap-2">
          <kbd className="rounded border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            Ctrl+Shift+C
          </kbd>
          <span className="text-[10px] text-muted-foreground">cursor</span>
        </div>
      </div>

      <AnimatePresence>
        {closeMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-amber-500/30 bg-amber-500/10"
          >
            <p className="px-4 py-2 text-center text-sm font-medium text-amber-400">
              Just kidding! You&apos;re stuck here. — Himanshu Kaushik
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          opacity: minimized ? 0.3 : 1,
          scale: minimized ? 0.98 : 1,
          filter: minimized ? "blur(2px)" : "blur(0px)",
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="flex-1"
      >
        <div
          className="overflow-auto"
          style={{ maxHeight: maximized ? "calc(100vh - 3.5rem)" : undefined }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
