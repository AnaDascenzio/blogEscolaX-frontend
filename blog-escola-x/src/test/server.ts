import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { post, token, teacher } from "./fixtures";

const apiUrl = "http://localhost:3000";

export const handlers = [
  http.post(`${apiUrl}/users/signin`, async () =>
    HttpResponse.json({ token }),
  ),
  http.get(`${apiUrl}/users/email/:email`, () => HttpResponse.json(teacher)),
  http.get(`${apiUrl}/posts`, () => HttpResponse.json({ post: [post], total: 1 })),
  http.get(`${apiUrl}/posts/:id`, () => HttpResponse.json(post)),
  http.get(`${apiUrl}/posts/search`, () => HttpResponse.json([post])),
  http.post(`${apiUrl}/posts`, () => HttpResponse.json({ ...post, id: "post-new" })),
  http.put(`${apiUrl}/posts/:id`, () => HttpResponse.json(post)),
  http.delete(`${apiUrl}/posts/:id`, () => new HttpResponse(null, { status: 204 })),
];

export const server = setupServer(...handlers);