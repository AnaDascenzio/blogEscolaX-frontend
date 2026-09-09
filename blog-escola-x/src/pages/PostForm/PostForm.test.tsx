import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse, delay } from "msw";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthContext";
import { teacher } from "../../test/fixtures";
import { server } from "../../test/server";
import { PostForm } from "./PostForm";

function renderForm() {
  localStorage.setItem("access_token", "test-token");
  localStorage.setItem("auth_user", JSON.stringify(teacher));
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/post/novo"]}>
        <PostForm />
      </MemoryRouter>
    </AuthProvider>,
  );
}

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Título da Postagem/), "Aula de Ciências");
  await user.selectOptions(screen.getByLabelText(/Matéria/), "SCIENCE");
  await user.type(screen.getByLabelText(/Conteúdo da Publicação/), "Conteúdo com mais de dez caracteres.");
}

function getFileInput() {
  const input = document.querySelector<HTMLInputElement>('input[type="file"]');
  if (!input) throw new Error("Input de arquivo não encontrado");
  return input;
}

describe("PostForm", () => {
  it("valida campos obrigatórios antes de submeter", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "Publicar Post" }));

    expect(await screen.findByText("O título deve ter pelo menos 3 caracteres.")).toBeInTheDocument();
    expect(screen.getByText("Selecione uma matéria.")).toBeInTheDocument();
    expect(screen.getByText("O conteúdo deve ter pelo menos 10 caracteres.")).toBeInTheDocument();
  });

  it("rejeita upload inválido e limpa object URL ao remover preview válido", async () => {
    const user = userEvent.setup();
    const createObjectURL = vi.fn(() => "blob:test-image");
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectURL });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revokeObjectURL });
    renderForm();
    const input = getFileInput();

    fireEvent.change(input, {
      target: { files: [new File(["text"], "arquivo.txt", { type: "text/plain" })] },
    });
    expect(await screen.findByText("Formato inválido. Use PNG, JPG ou WEBP.")).toBeInTheDocument();

    fireEvent.change(input, {
      target: { files: [new File(["image"], "capa.png", { type: "image/png" })] },
    });
    expect(createObjectURL).toHaveBeenCalledOnce();
    await user.click(screen.getByRole("button", { name: /Remover imagem/ }));
    await waitFor(() => expect(revokeObjectURL).toHaveBeenCalledWith("blob:test-image"));
  });

  it("envia FormData com imagem e impede duplo submit", async () => {
    const user = userEvent.setup();
    let requestCount = 0;
    let receivedContentType = "";
    server.use(
      http.post("http://localhost:3000/posts", async ({ request }) => {
        requestCount += 1;
        receivedContentType = request.headers.get("content-type") ?? "";
        await delay(50);
        return HttpResponse.json({ id: "created" });
      }),
    );
    renderForm();
    await fillRequiredFields(user);
    const input = getFileInput();
    fireEvent.change(input, {
      target: { files: [new File(["image"], "capa.png", { type: "image/png" })] },
    });

    const submit = screen.getByRole("button", { name: "Publicar Post" });
    await user.click(submit);
    expect(submit).toBeDisabled();
    expect(submit).toHaveTextContent("Publicando...");
    await user.click(submit);
    await waitFor(() => expect(requestCount).toBe(1));
    expect(receivedContentType).toContain("multipart/form-data");
  });
});