"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileText, Image, User } from "lucide-react";

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("General");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt: excerpt || content.slice(0, 140) + (content.length > 140 ? "..." : ""),
          content,
          coverImage,
          category,
          author: author || "Guest Writer",
          // published flag is enforced on the server:
          // non-admin users' posts are stored as drafts for review.
          published: false,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = body?.error || `Failed to submit blog (${res.status})`;
        throw new Error(msg);
      }

      toast.success("Your blog is live! View it on the Blogs page.");
      router.push("/blogs");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-3"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-500/25">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Write a Blog</h1>
          <p className="text-sm text-gray-400">
            Share your thoughts with the community. Your post will appear on the site right away.
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label className="text-gray-300">Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title..."
            className="mt-1.5 border-white/10 bg-white/5 text-white placeholder:text-gray-500"
          />
        </div>

        <div>
          <Label className="text-gray-300">Short Description (optional)</Label>
          <Input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="One or two lines about your blog..."
            className="mt-1.5 border-white/10 bg-white/5 text-white placeholder:text-gray-500"
          />
        </div>

        <div>
          <Label className="text-gray-300">Content</Label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here..."
            rows={10}
            className="mt-1.5 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-gray-300">
              <span className="flex items-center gap-1">
                <Image className="h-3 w-3" /> Cover Image URL (optional)
              </span>
            </Label>
            <Input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="mt-1.5 border-white/10 bg-white/5 text-white placeholder:text-gray-500"
            />
          </div>
          <div>
            <Label className="text-gray-300">Category</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Technology, Lifestyle"
              className="mt-1.5 border-white/10 bg-white/5 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <div>
          <Label className="text-gray-300">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" /> Your Name (optional)
            </span>
          </Label>
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="How should we credit you?"
            className="mt-1.5 border-white/10 bg-white/5 text-white placeholder:text-gray-500"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-linear-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/20 hover:from-violet-700 hover:to-purple-700"
          >
            {submitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Submit Blog"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

