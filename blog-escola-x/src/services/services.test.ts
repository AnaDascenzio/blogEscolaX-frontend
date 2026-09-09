import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../test/server";
import { post, teacher, token } from "../test/fixtures";
import api from "./api";
import { createPost, deletePost, getPosts, updatePost } from "./posts.service";
import { getUserByEmail, signIn } from "./users.service";

describe("serviços HTTP", () => {
  it("faz login e consulta o usuário autenticado", async () => {
    await expect(signIn({ email: teacher.email, password: "senha" })).resolves.toEqual({ token });
    await expect(getUserByEmail(teacher.email)).resolves.toEqual(teacher);
  });

  it("envia o bearer token e executa o CRUD paginado de posts", async () => {
    localStorage.setItem("access_token", token);
    const requests: string[] = [];
    server.use(
      http.get("http://localhost:3000/posts", ({ request }) => {
        requests.push(request.headers.get("authorization") ?? "");
        return HttpResponse.json({ post: [post], total: 1 });
      }),
      http.post("http://localhost:3000/posts", async ({ request }) => {
        requests.push(request.method);
        return HttpResponse.json(post);
      }),
      http.put("http://localhost:3000/posts/post-1", () => HttpResponse.json(post)),
      http.delete("http://localhost:3000/posts/post-1", () => new HttpResponse(null, { status: 204 })),
    );

    await expect(getPosts(2, 5)).resolves.toEqual({ post: [post], total: 1 });
    await expect(createPost({ title: post.title })).resolves.toEqual(post);
    await expect(updatePost(post.id, { title: "Atualizado" })).resolves.toEqual(post);
    await expect(deletePost(post.id)).resolves.toBeUndefined();
    expect(requests).toContain(`Bearer ${token}`);
    expect(requests).toContain("POST");
  });

  it("remove a sessão local quando a API retorna 401", async () => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("auth_user", JSON.stringify(teacher));
    server.use(
      http.get("http://localhost:3000/private", () =>
        HttpResponse.json({ message: "expired" }, { status: 401 }),
      ),
    );

    await expect(api.get("/private")).rejects.toMatchObject({ response: { status: 401 } });
    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
  });
});