import type { AuthUser } from "../contexts/AuthContext";

export type Subject =
  | "PORTUGUESE"
  | "MATHEMATICS"
  | "HISTORY"
  | "GEOGRAPHY"
  | "BIOLOGY"
  | "PHYSICS"
  | "CHEMISTRY"
  | "ENGLISH"
  | "PHILOSOPHY"
  | "SOCIOLOGY"
  | "PHYSICAL_EDUCATION"
  | "ARTS";

export const SUBJECT_LABELS: Record<string, string> = {
  PORTUGUESE: "Português",
  MATHEMATICS: "Matemática",
  HISTORY: "História",
  GEOGRAPHY: "Geografia",
  BIOLOGY: "Biologia",
  PHYSICS: "Física",
  CHEMISTRY: "Química",
  ENGLISH: "Inglês",
  PHILOSOPHY: "Filosofia",
  SOCIOLOGY: "Sociologia",
  PHYSICAL_EDUCATION: "Educação Física",
  ARTS: "Artes",
};

export const SUBJECT_OPTIONS = Object.entries(SUBJECT_LABELS).map(([value, label]) => ({
  value: value as Subject,
  label,
}));

export interface Post {
  id: string;
  title: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  image?: string;
  image_url?: string;
  cover?: string;
  coverUrl?: string;
  link?: string;
  subject: Subject;
  authorId: string;
  author?: AuthUser;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedPosts {
  post: Post[];
  total: number;
}
