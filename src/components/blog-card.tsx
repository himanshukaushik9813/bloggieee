"use client";

import { BlogPost } from "@/lib/blog-store";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function BlogCard({ blog, index }: { blog: BlogPost; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blogs/${blog.id}`} className="group block">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/30 hover:bg-white/10 hover:shadow-lg hover:shadow-violet-500/5">
          {blog.coverImage && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-3 left-3 rounded-full bg-violet-500/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {blog.category}
              </span>
            </div>
          )}
          {!blog.coverImage && (
            <div className="flex h-48 items-center justify-center bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
              <span className="rounded-full bg-violet-500/80 px-3 py-1 text-xs font-medium text-white">
                {blog.category}
              </span>
            </div>
          )}
          <div className="p-5">
            <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-violet-400">
              {blog.title}
            </h3>
            <p className="mb-4 line-clamp-2 text-sm text-gray-400">{blog.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <span className="flex items-center gap-1 text-xs text-violet-400 opacity-0 transition-opacity group-hover:opacity-100">
                Read more <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
