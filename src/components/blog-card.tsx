"use client";

import { BlogPost } from "@/lib/blog-store";
import { getReadingTimeMinutes } from "@/lib/utils";
import Link from "next/link";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function BlogCard({ blog, index }: { blog: BlogPost; index: number }) {
  const readMins = getReadingTimeMinutes(blog.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blogs/${blog.id}`} className="group block">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-violet-500/30 hover:shadow-violet-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-violet-500/25 dark:hover:bg-white/[0.06]">
          {blog.coverImage && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-3 left-3 rounded-full bg-violet-500/90 px-3 py-1 text-xs font-medium text-white shadow-lg backdrop-blur-sm">
                {blog.category}
              </span>
            </div>
          )}
          {!blog.coverImage && (
            <div className="flex h-48 items-center justify-center bg-linear-to-br from-violet-500/15 to-cyan-500/15">
              <span className="rounded-full bg-violet-500/80 px-3 py-1 text-xs font-medium text-white shadow">
                {blog.category}
              </span>
            </div>
          )}
          <div className="p-5">
            <h3 className="mb-2 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-300">
              {blog.title}
            </h3>
            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{blog.excerpt}</p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {readMins} min read
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-violet-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-violet-400">
                Read more <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
