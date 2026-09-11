import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthContext";
import { Login } from "./Login";
import { token } from "../../test/fixtures";

describe("Login", () => {
  it("limpa sessão residual do storage ao montar se o token estiver corrompido", () => {
    localStorage.setItem("access_token", "token-quebrado-invalido");
    sessionStorage.setItem("auth_user_name", "Prof. Antigo");

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>
      </AuthProvider>,
    );

    // Deve exibir o formulário de login imediatamente
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();

    // Cache e token quebrado devem ter sido limpos
    expect(localStorage.getItem("access_token")).toBeNull();
    expect(sessionStorage.getItem("auth_user_name")).toBeNull();
  });

  it("redireciona para rota do papel quando já autenticado com token válido", () => {
    localStorage.setItem("access_token", token);

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>
      </AuthProvider>,
    );

    // Como é TEACHER, redireciona e não exibe form de login
    expect(screen.queryByLabelText(/senha/i)).not.toBeInTheDocument();
  });
});

