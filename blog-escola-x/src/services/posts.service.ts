import api from "./api";
import type { PaginatedPosts, Post } from "../types/api";

export async function getPosts(page = 1, limit = 10): Promise<PaginatedPosts> {
  const response = await api.get<PaginatedPosts>("/posts", { params: { page, limit } });

  return response.data;
}

export async function getPostById(id: string): Promise<Post> {
  const response = await api.get<Post>(`/posts/${id}`);

  return response.data;
}

export async function searchPosts(keyword: string): Promise<Post[]> {
  const response = await api.get<Post[]>("/posts/search", {
    params: {
      keyword,
    },
  });

  return response.data;
}

export async function createPost(data: FormData | object): Promise<Post> {
  const response = await api.post<Post>("/posts", data);

  return response.data;
}

export async function updatePost(id: string, data: FormData | object): Promise<Post> {
  const response = await api.put<Post>(`/posts/${id}`, data);

  return response.data;
}

export async function deletePost(id: string): Promise<void> {
  await api.delete(`/posts/${id}`);
}