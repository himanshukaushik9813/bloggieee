"use client";

import { motion } from "framer-motion";
import { Heart, ShieldCheck } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Owner certification - bold & distinctive */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(251, 191, 36, 0.15)",
                  "0 0 40px rgba(251, 191, 36, 0.2)",
                  "0 0 20px rgba(251, 191, 36, 0.15)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-amber-500/50 bg-linear-to-r from-amber-500/15 via-orange-500/15 to-rose-500/15 px-6 py-3"
            >
              <ShieldCheck className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                Certified Owner & Creator
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl"
            >
              <span className="bg-linear-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent dark:from-amber-300 dark:via-orange-300 dark:to-rose-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                Himanshu Kaushik
              </span>
            </motion.p>
            <p className="mt-2 text-sm italic text-muted-foreground">
              Built this from scratch · Your words, his platform
            </p>
          </motion.div>

          <div className="h-px w-32 bg-linear-to-r from-transparent via-amber-500/30 to-transparent" />

          <p className="text-sm text-muted-foreground">
            <span suppressHydrationWarning>&copy; {new Date().getFullYear()} BlogVerse</span>
            {" · "}
            Made with <Heart className="inline h-3.5 w-3.5 text-rose-500 fill-rose-500" /> by Himanshu Kaushik
          </p>
        </div>
      </div>
    </footer>
  );
}
