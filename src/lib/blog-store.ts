import fs from "fs";
import path from "path";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

const DATA_DIR = path.join(process.cwd(), "data");
const BLOGS_FILE = path.join(DATA_DIR, "blogs.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BLOGS_FILE)) {
    fs.writeFileSync(BLOGS_FILE, JSON.stringify([], null, 2));
  }
}

function readBlogs(): BlogPost[] {
  ensureDataDir();
  const data = fs.readFileSync(BLOGS_FILE, "utf-8");
  return JSON.parse(data);
}

function writeBlogs(blogs: BlogPost[]) {
  ensureDataDir();
  fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2));
}

export function getAllBlogs(): BlogPost[] {
  return readBlogs();
}

export function getPublishedBlogs(): BlogPost[] {
  return readBlogs().filter((b) => b.published);
}

export function getBlogById(id: string): BlogPost | undefined {
  return readBlogs().find((b) => b.id === id);
}

export function createBlog(
  data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
): BlogPost {
  const blogs = readBlogs();
  const blog: BlogPost = {
    ...data,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  blogs.unshift(blog);
  writeBlogs(blogs);
  return blog;
}

export function updateBlog(
  id: string,
  data: Partial<Omit<BlogPost, "id" | "createdAt">>
): BlogPost | null {
  const blogs = readBlogs();
  const index = blogs.findIndex((b) => b.id === id);
  if (index === -1) return null;
  blogs[index] = { ...blogs[index], ...data, updatedAt: new Date().toISOString() };
  writeBlogs(blogs);
  return blogs[index];
}

export function deleteBlog(id: string): boolean {
  const blogs = readBlogs();
  const filtered = blogs.filter((b) => b.id !== id);
  if (filtered.length === blogs.length) return false;
  writeBlogs(filtered);
  return true;
}
