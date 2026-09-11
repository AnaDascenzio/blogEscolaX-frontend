import type { Post } from "../types/api";

export const teacher = {
  id: "teacher-1",
  name: "Prof. Ana",
  email: "ana@escola.com",
  role: "TEACHER" as const,
};

export const post: Post = {
  id: "post-1",
  title: "Post de teste",
  content: "Conteúdo suficiente para validar o post.",
  summary: "Resumo do post",
  subject: "SCIENCE",
  authorId: teacher.id,
  author: teacher,
  isDeleted: false,
  createdAt: "2026-09-08",
};

export const token = `header.${btoa(JSON.stringify({ role: "TEACHER" }))}.signature`;
export const studentToken = `header.${btoa(JSON.stringify({ role: "STUDENT" }))}.signature`;