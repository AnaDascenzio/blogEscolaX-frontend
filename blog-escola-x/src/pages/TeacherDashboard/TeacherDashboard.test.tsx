import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse, delay } from "msw";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthContext";
import { post } from "../../test/fixtures";
import { server } from "../../test/server";
import { TeacherDashboard } from "./TeacherDashboard";


const teacherToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJuYW1lIjoiUHJvZi4gQW5hIiwicm9sZSI6IlRFQUNIRVIiLCJpYXQiOjE2MDAwMDAwMDB9.signature";

function renderDashboard() {
  localStorage.setItem("access_token", teacherToken);
  return render(
    <AuthProvider>
      <MemoryRouter>
        <TeacherDashboard />
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("TeacherDashboard", () => {
  it("exibe loading enquanto carrega publicações", async () => {
    server.use(
      http.get("http://localhost:3000/posts", async () => {
        await delay(50);
        return HttpResponse.json({
          post: [{ ...post, authorId: "user-1" }],
          total: 1,
        });
      }),
    );
    renderDashboard();
    expect(screen.getByText("Carregando painel...")).toBeInTheDocument();
    expect(await screen.findByText(post.title)).toBeInTheDocument();
  });

  it("exibe erro e estado vazio quando a API falha ou não retorna posts", async () => {
    server.use(
      http.get("http://localhost:3000/posts", () =>
        HttpResponse.json({ message: "offline" }, { status: 500 }),
      ),
    );
    renderDashboard();
    expect(
      await screen.findByText("Não foi possível carregar as publicações."),
    ).toBeInTheDocument();

    server.use(
      http.get("http://localhost:3000/posts", () =>
        HttpResponse.json({ post: [], total: 0 }),
      ),
    );
    renderDashboard();
    expect(
      await screen.findByText("Nenhuma publicação encontrada."),
    ).toBeInTheDocument();
  });

  it("confirma e executa exclusão sem duplicar a requisição", async () => {
    const user = userEvent.setup();
    const deletePost = vi.fn();
    vi.stubGlobal("confirm", vi.fn(() => true));

    const myPost = { ...post, id: "post-1", authorId: "user-1" };

    server.use(
      http.get("http://localhost:3000/posts", () => {
        return HttpResponse.json({ post: [myPost], total: 1 });
      }),
      http.delete("http://localhost:3000/posts/post-1", () => {
        deletePost();
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderDashboard();
    await screen.findByText(myPost.title);

    const removeButton = await screen.findByRole("button", {
      name: "Excluir",
    });
    await user.click(removeButton);
    expect(removeButton).toBeDisabled();
    await waitFor(() => expect(deletePost).toHaveBeenCalledOnce());
  });
});