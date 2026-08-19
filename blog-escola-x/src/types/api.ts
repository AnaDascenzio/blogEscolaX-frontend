import type { AuthUser } from "../contexts/AuthContext";

export type Subject = "MATHEMATICS" | "PORTUGUESE" | "SCIENCE" | "HISTORY" | "GEOGRAPHY" | string;

export interface Post {
  id: number;
  title: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  link?: string;
  subject: Subject;
  authorId: number;
  author?: AuthUser;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedPosts {
  post: Post[];
  total: number;
}