import type { Post } from "../types/api";

export function resolveImageUrl(urlOrPath?: string): string | undefined {
  if (!urlOrPath) return undefined;

  // URLs completas ou data/blob URLs
  if (
    urlOrPath.startsWith("http://") ||
    urlOrPath.startsWith("https://") ||
    urlOrPath.startsWith("blob:") ||
    urlOrPath.startsWith("data:")
  ) {
    return urlOrPath;
  }

  // Caminhos relativos do backend (ex: /uploads/... ou uploads/...)
  const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");
  const cleanPath = urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`;
  return `${apiBase}${cleanPath}`;
}

export function getPostImageUrl(post?: Partial<Post> | null): string | undefined {
  if (!post) return undefined;
  const raw = post.imageUrl || post.image || post.image_url || post.coverUrl || post.cover;
  return resolveImageUrl(raw);
}
