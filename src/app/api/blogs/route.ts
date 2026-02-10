import { NextRequest, NextResponse } from "next/server";
import { getAllBlogs, getPublishedBlogs, createBlog } from "@/lib/blog-store";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const isAdmin = await verifyAuth();
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";
  const blogs = all && isAdmin ? getAllBlogs() : getPublishedBlogs();
  return NextResponse.json(blogs);
}

export async function POST(req: NextRequest) {
  const isAdmin = await verifyAuth();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const blog = createBlog(data);
  return NextResponse.json(blog, { status: 201 });
}
