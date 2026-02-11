import { motion } from "framer-motion";

export function BlogCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      className="overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="h-48 animate-pulse bg-muted" />
      <div className="p-5">
        <div className="mb-2 h-5 w-4/5 animate-pulse rounded bg-muted" />
        <div className="mb-4 h-4 w-full animate-pulse rounded bg-muted" />
        <div className="mb-4 h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="flex justify-between">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </motion.div>
  );
}
