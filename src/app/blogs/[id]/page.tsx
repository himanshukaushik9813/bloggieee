"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BlogPost } from "@/lib/blog-store";
import { getReadingTimeMinutes } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, User, Clock, Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

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

  const readMins = blog ? getReadingTimeMinutes(blog.content) : 0;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = blog ? `${blog.title} — BlogVerse` : "";

  const copyLink = () => {
    if (typeof navigator === "undefined") return;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard");
  };

  const shareTwitter = () => {
    const u = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(u, "_blank", "noopener,noreferrer");
  };

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
        <p className="mb-4 text-2xl font-bold text-foreground">Blog not found</p>
        <Button onClick={() => router.push("/blogs")} variant="outline" className="border-violet-500/50 text-violet-600 dark:text-violet-400">
          Back to Blogs
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/blogs" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Blogs
        </Link>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-400">
            {blog.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {readMins} min read
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            {blog.author}
          </span>
        </div>

        <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-5xl">
          {blog.title}
        </h1>

        <p className="mb-6 text-lg text-muted-foreground">{blog.excerpt}</p>

        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Share:</span>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={copyLink}>
            <Link2 className="h-3.5 w-3.5" />
            Copy link
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={shareTwitter}>
            <Share2 className="h-3.5 w-3.5" />
            Twitter / X
          </Button>
        </div>

        {blog.coverImage && (
          <div className="mb-10 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-border">
            <img src={blog.coverImage} alt={blog.title} className="w-full object-cover" />
          </div>
        )}

        <div className="prose prose-neutral dark:prose-invert prose-violet max-w-none prose-headings:font-semibold prose-p:leading-relaxed prose-p:text-foreground/90">
          {blog.content.split("\n").map((paragraph, i) => (
            <p key={i} className="mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
