"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BlogPost } from "@/lib/blog-store";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blogs/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((d) => { setBlog(d); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="mb-4 text-2xl font-bold text-white">Blog not found</p>
        <Button onClick={() => router.push("/blogs")} variant="outline" className="border-violet-500/50 text-violet-400">
          Back to Blogs
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/blogs" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Blogs
        </Link>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-400">
            {blog.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <User className="h-3 w-3" />
            {blog.author}
          </span>
        </div>

        <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl">
          {blog.title}
        </h1>

        <p className="mb-8 text-lg text-gray-400">{blog.excerpt}</p>

        {blog.coverImage && (
          <div className="mb-10 overflow-hidden rounded-2xl">
            <img src={blog.coverImage} alt={blog.title} className="w-full object-cover" />
          </div>
        )}

        <div className="prose prose-invert prose-violet max-w-none">
          {blog.content.split("\n").map((paragraph, i) => (
            <p key={i} className="mb-4 leading-relaxed text-gray-300">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
