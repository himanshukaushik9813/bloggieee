"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import BlogCard from "@/components/blog-card";
import { BlogPost } from "@/lib/blog-store";
import { ArrowRight, Sparkles, BookOpen, Zap } from "lucide-react";

const ThreeBackground = dynamic(() => import("@/components/three-background"), {
  ssr: false,
});

export default function HomePage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((d) => setBlogs(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <ThreeBackground />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/20 to-background" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-600 shadow-lg shadow-violet-500/5 dark:text-violet-300">
              <Sparkles className="h-4 w-4" />
              Welcome to BlogVerse
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
              Ideas That{" "}
              <span className="bg-linear-to-r from-violet-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:via-purple-400 dark:to-cyan-400">
                Inspire
              </span>
              <br />
              The World
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Discover stories, insights, and perspectives from creative minds.
              Dive into a universe of knowledge and inspiration.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/blogs">
                <Button size="lg" className="bg-linear-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/20 hover:from-violet-700 hover:to-purple-700">
                  Explore Blogs <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-10 text-xs font-medium uppercase tracking-widest text-muted-foreground"
            >
              A space created by <span className="text-amber-500 dark:text-amber-400/90">Himanshu Kaushik</span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 grid gap-6 md:grid-cols-3"
        >
          {[
            {
              icon: BookOpen,
              title: "Curated Content",
              desc: "Handpicked articles covering technology, design, and innovation.",
              gradient: "from-violet-500 to-purple-500",
            },
            {
              icon: Zap,
              title: "Fresh Perspectives",
              desc: "Unique viewpoints that challenge conventional thinking.",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              icon: Sparkles,
              title: "Stunning Experience",
              desc: "Beautiful reading experience with modern design and animations.",
              gradient: "from-cyan-500 to-blue-500",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group rounded-2xl border border-border bg-card p-6 shadow-xl backdrop-blur-sm transition-all hover:border-violet-500/20 hover:shadow-violet-500/5 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
            >
              <div className={`mb-4 inline-flex rounded-xl bg-linear-to-r ${feature.gradient} p-3 shadow-lg`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Latest Blogs Section */}
      {blogs.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Latest Posts</h2>
              <p className="mt-2 text-muted-foreground">Fresh from our writers</p>
            </div>
            <Link href="/blogs">
              <Button variant="ghost" className="text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.slice(0, 3).map((blog, i) => (
              <BlogCard key={blog.id} blog={blog} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
