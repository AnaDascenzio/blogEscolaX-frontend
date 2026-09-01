import api from "./api";
import type { AuthUser } from "../contexts/AuthContext";

export async function createUser(data: object): Promise<AuthUser> {
  const response = await api.post<AuthUser>("/users", data);

  return response.data;
}

export async function signIn(data: {
  email: string;
  password: string;
}): Promise<{ token: string }> {
  const response = await api.post<{ token: string }>("/users/signin", data);

  return response.data;
}

export async function getUserById(id: string): Promise<AuthUser> {
  const response = await api.get<AuthUser>(`/users/${id}`);

  return response.data;
}

export async function getUserByEmail(email: string): Promise<AuthUser> {
  const response = await api.get<AuthUser>(
    `/users/email/${encodeURIComponent(email)}`,
  );

  return response.data;
}

export async function getUserByName(name: string): Promise<AuthUser> {
  const response = await api.get<AuthUser>(
    `/users/name/${encodeURIComponent(name)}`,
  );

  return response.data;
}

export async function updateUser(id: string, data: object): Promise<AuthUser> {
  const response = await api.put<AuthUser>(`/users/${id}`, data);

  return response.data;
}