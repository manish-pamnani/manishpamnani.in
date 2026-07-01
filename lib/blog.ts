import fs from "node:fs";
import path from "node:path";

export type BlogPost = {
  title: string;
  slug: string;
  date: Date;
  description: string;
  tags: string[];
  href: string;
};

const POSTS_DIR = path.join(process.cwd(), "hugo/content/posts");
const BLOG_BASE = "/blogs";

function unquote(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function parseFrontmatter(
  raw: string,
): Record<string, string | string[]> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const data: Record<string, string | string[]> = {};
  let currentKey: string | null = null;
  let currentList: string[] | null = null;

  for (const line of match[1].split("\n")) {
    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && currentKey && currentList) {
      currentList.push(unquote(listItem[1].trim()));
      continue;
    }

    const keyValue = line.match(/^(\w+):\s*(.*)$/);
    if (!keyValue) continue;

    if (currentKey && currentList) {
      data[currentKey] = currentList;
    }

    currentKey = keyValue[1];
    const value = keyValue[2].trim();

    if (value === "") {
      currentList = [];
      continue;
    }

    data[currentKey] = unquote(value);
    currentList = null;
  }

  if (currentKey && currentList) {
    data[currentKey] = currentList;
  }

  return data;
}

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const posts = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      const frontmatter = parseFrontmatter(raw);
      const slug = String(frontmatter.slug ?? file.replace(/\.md$/, ""));

      return {
        title: String(frontmatter.title ?? slug),
        slug,
        date: new Date(String(frontmatter.date ?? "")),
        description: String(frontmatter.description ?? ""),
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        href: `${BLOG_BASE}/${slug}/`,
      };
    });

  return posts.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function formatBlogDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
