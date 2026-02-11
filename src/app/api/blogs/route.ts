import { NextRequest, NextResponse } from "next/server";
import { getAllBlogs, getPublishedBlogs, createBlog } from "@/lib/blog-store";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const isAdmin = await verifyAuth();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const blogs = all && isAdmin ? await getAllBlogs() : await getPublishedBlogs();
    return NextResponse.json(blogs);
  } catch (err) {
    console.error("GET /api/blogs error:", err);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const isAdmin = await verifyAuth();

    const blog = await createBlog({
      ...data,
      published: isAdmin ? (data.published ?? true) : true,
    });
    return NextResponse.json(blog, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create blog";
    console.error("POST /api/blogs error:", err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
