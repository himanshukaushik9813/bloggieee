import { getDb } from "./mongodb";
import { ObjectId } from "mongodb";

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

function mapDocToBlog(doc: any): BlogPost {
  return {
    id: doc._id.toString(),
    title: doc.title,
    excerpt: doc.excerpt,
    content: doc.content,
    coverImage: doc.coverImage ?? "",
    category: doc.category,
    author: doc.author,
    createdAt: doc.createdAt?.toISOString?.() ?? String(doc.createdAt),
    updatedAt: doc.updatedAt?.toISOString?.() ?? String(doc.updatedAt),
    published: !!doc.published,
  };
}

export async function getAllBlogs(): Promise<BlogPost[]> {
  const db = await getDb();
  const docs = await db
    .collection("blogs")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(mapDocToBlog);
}

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  const db = await getDb();
  const docs = await db
    .collection("blogs")
    .find({ published: true })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(mapDocToBlog);
}

export async function getBlogById(id: string): Promise<BlogPost | null> {
  const db = await getDb();
  const doc = await db
    .collection("blogs")
    .findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  return mapDocToBlog(doc);
}

export async function createBlog(
  data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
): Promise<BlogPost> {
  const db = await getDb();
  const now = new Date();

  const doc = {
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    coverImage: data.coverImage || "",
    category: data.category,
    author: data.author,
    published: data.published,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection("blogs").insertOne(doc);
  return mapDocToBlog({ _id: result.insertedId, ...doc });
}

export async function updateBlog(
  id: string,
  data: Partial<Omit<BlogPost, "id" | "createdAt">>
): Promise<BlogPost | null> {
  const db = await getDb();
  const now = new Date();

  const update: any = { updatedAt: now };

  if (data.title !== undefined) update.title = data.title;
  if (data.excerpt !== undefined) update.excerpt = data.excerpt;
  if (data.content !== undefined) update.content = data.content;
  if (data.coverImage !== undefined) update.coverImage = data.coverImage;
  if (data.category !== undefined) update.category = data.category;
  if (data.author !== undefined) update.author = data.author;
  if (data.published !== undefined) update.published = data.published;

  const result = await db
    .collection("blogs")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );

  const doc = result.value;
  if (!doc) return null;
  return mapDocToBlog(doc);
}

export async function deleteBlog(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db
    .collection("blogs")
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

