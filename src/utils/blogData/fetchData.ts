// src/utils/blogData/fetchData.ts
import { promises as fs } from "node:fs";
import path from "node:path";
import type { BlogData } from "@src/types/blog";

export async function fetchBlogData(): Promise<BlogData> {
    const file = path.join(process.cwd(), "public", "data", "data.json");
    const json = await fs.readFile(file, "utf8");
    return JSON.parse(json) as BlogData;
}
