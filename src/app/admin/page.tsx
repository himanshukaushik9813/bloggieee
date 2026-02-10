"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BlogPost } from "@/lib/blog-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Plus, Trash2, Edit3, Eye, EyeOff, LogOut,
  LayoutDashboard, FileText, X, Save, Image,
} from "lucide-react";

interface BlogForm {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  published: boolean;
}

const emptyForm: BlogForm = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "Technology",
  author: "Admin",
  published: true,
};

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((d) => {
        if (!d.authenticated) router.push("/login");
        else { setAuthed(true); loadBlogs(); }
      })
      .catch(() => router.push("/login"))
      .finally(() => setChecking(false));
  }, [router]);

  async function loadBlogs() {
    const res = await fetch("/api/blogs?all=true");
    const data = await res.json();
    setBlogs(data);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out successfully");
    router.push("/");
  }

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setShowEditor(true);
  }

  function openEdit(blog: BlogPost) {
    setForm({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      category: blog.category,
      author: blog.author,
      published: blog.published,
    });
    setEditingId(blog.id);
    setShowEditor(true);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await fetch(`/api/blogs/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Blog updated!");
      } else {
        await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Blog created!");
      }
      setShowEditor(false);
      loadBlogs();
    } catch {
      toast.error("Failed to save blog");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    toast.success("Blog deleted");
    loadBlogs();
  }

  async function togglePublish(blog: BlogPost) {
    await fetch(`/api/blogs/${blog.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !blog.published }),
    });
    toast.success(blog.published ? "Blog unpublished" : "Blog published");
    loadBlogs();
  }

  if (checking || !authed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-purple-600">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-gray-400">Manage your blog posts</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={openNew} className="bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700">
            <Plus className="mr-2 h-4 w-4" /> New Blog
          </Button>
          <Button onClick={handleLogout} variant="outline" className="border-white/10 text-gray-400 hover:text-white">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Posts", value: blogs.length, color: "from-violet-500 to-purple-500" },
          { label: "Published", value: blogs.filter((b) => b.published).length, color: "from-green-500 to-emerald-500" },
          { label: "Drafts", value: blogs.filter((b) => !b.published).length, color: "from-amber-500 to-orange-500" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className={`mt-1 text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Blog List */}
      {blogs.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-center">
          <FileText className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-lg font-semibold text-white">No blog posts yet</p>
          <p className="mb-4 text-sm text-gray-400">Create your first blog post to get started</p>
          <Button onClick={openNew} className="bg-violet-600 text-white hover:bg-violet-700">
            <Plus className="mr-2 h-4 w-4" /> Create Post
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map((blog, i) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-violet-500/20 hover:bg-white/10"
            >
              {blog.coverImage ? (
                <img src={blog.coverImage} alt="" className="h-16 w-24 flex-shrink-0 rounded-lg object-cover" />
              ) : (
                <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
                  <FileText className="h-6 w-6 text-gray-500" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-white">{blog.title}</h3>
                  <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    blog.published ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {blog.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-gray-400">{blog.excerpt}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {blog.category} &middot; {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-1">
                <Button size="icon" variant="ghost" onClick={() => togglePublish(blog)} className="h-8 w-8 text-gray-400 hover:text-white" title={blog.published ? "Unpublish" : "Publish"}>
                  {blog.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => openEdit(blog)} className="h-8 w-8 text-gray-400 hover:text-violet-400">
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(blog.id)} className="h-8 w-8 text-gray-400 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-6 pt-20 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowEditor(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#12121a] p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {editingId ? "Edit Blog Post" : "Create New Blog Post"}
                </h2>
                <Button size="icon" variant="ghost" onClick={() => setShowEditor(false)} className="text-gray-400 hover:text-white">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Enter blog title..."
                    className="mt-1.5 border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Excerpt</Label>
                  <Input
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="Short description..."
                    className="mt-1.5 border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Content</Label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Write your blog content here..."
                    rows={10}
                    className="mt-1.5 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-gray-300">
                      <span className="flex items-center gap-1"><Image className="h-3 w-3" /> Cover Image URL</span>
                    </Label>
                    <Input
                      value={form.coverImage}
                      onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                      placeholder="https://..."
                      className="mt-1.5 border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Category</Label>
                    <Input
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="Technology"
                      className="mt-1.5 border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-gray-300">Author</Label>
                    <Input
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      placeholder="Author name"
                      className="mt-1.5 border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={form.published}
                        onChange={(e) => setForm({ ...form, published: e.target.checked })}
                        className="h-4 w-4 rounded border-white/10 bg-white/5 text-violet-500"
                      />
                      <span className="text-sm text-gray-300">Publish immediately</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700"
                  >
                    {saving ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {editingId ? "Update Post" : "Create Post"}
                      </>
                    )}
                  </Button>
                  <Button onClick={() => setShowEditor(false)} variant="outline" className="border-white/10 text-gray-400 hover:text-white">
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
