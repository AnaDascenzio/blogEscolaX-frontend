import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import { studentToken, token } from "../test/fixtures";

function renderRoute(allowedRoles?: Array<"TEACHER" | "STUDENT">) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
            <Route path="/protected" element={<p>conteúdo protegido</p>} />
          </Route>
          <Route path="/login" element={<p>login</p>} />
          <Route path="/" element={<p>home</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("ProtectedRoute", () => {
  it("redireciona usuário anônimo para login", () => {
    renderRoute();
    expect(screen.getByText("login")).toBeInTheDocument();
  });

  it("permite professor no papel autorizado", () => {
    localStorage.setItem("access_token", token);
    renderRoute(["TEACHER"]);
    expect(screen.getByText("conteúdo protegido")).toBeInTheDocument();
  });

  it("redireciona usuário autenticado sem o papel exigido", () => {
    // A role vem do token (fonte da verdade pós CR-04), não de um dado solto no localStorage.
    localStorage.setItem("access_token", studentToken);
    renderRoute(["TEACHER"]);
    expect(screen.getByText("home")).toBeInTheDocument();
  });

  it("redireciona para login quando o token for inválido", () => {
    localStorage.setItem("access_token", "invalid.token.here");
    renderRoute();
    expect(screen.getByText("login")).toBeInTheDocument();
  });

  it("redireciona para login quando o token é corrompido após login durante a navegação", async () => {
    localStorage.setItem("access_token", token);

    const { useNavigate } = await import("react-router-dom");
    const { fireEvent } = await import("@testing-library/react");

    function NavComponent() {
      const navigate = useNavigate();
      return (
        <div>
          <button onClick={() => navigate("/outra-pagina")}>Ir para outra página</button>
        </div>
      );
    }

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/protected"]}>
          <NavComponent />
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/protected" element={<p>conteúdo protegido</p>} />
              <Route path="/outra-pagina" element={<p>outra pagina protegida</p>} />
            </Route>
            <Route path="/login" element={<p>login</p>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText("conteúdo protegido")).toBeInTheDocument();

    // Corrompe o token no localStorage
    localStorage.setItem("access_token", "token-invalido-quebrado");

    // Tenta navegar para outra página protegida
    fireEvent.click(screen.getByRole("button", { name: "Ir para outra página" }));

    expect(screen.getByText("login")).toBeInTheDocument();
    expect(screen.queryByText("outra pagina protegida")).not.toBeInTheDocument();
    expect(localStorage.getItem("access_token")).toBeNull();
  });

  it("redireciona para login quando o token é removido após login durante a navegação", async () => {
    localStorage.setItem("access_token", token);

    const { useNavigate } = await import("react-router-dom");
    const { fireEvent } = await import("@testing-library/react");

    function NavComponent() {
      const navigate = useNavigate();
      return (
        <div>
          <button onClick={() => navigate("/outra-pagina")}>Ir para outra página</button>
        </div>
      );
    }

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/protected"]}>
          <NavComponent />
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/protected" element={<p>conteúdo protegido</p>} />
              <Route path="/outra-pagina" element={<p>outra pagina protegida</p>} />
            </Route>
            <Route path="/login" element={<p>login</p>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText("conteúdo protegido")).toBeInTheDocument();

    // Remove o token do localStorage
    localStorage.removeItem("access_token");

    // Tenta navegar para outra página protegida
    fireEvent.click(screen.getByRole("button", { name: "Ir para outra página" }));

    expect(screen.getByText("login")).toBeInTheDocument();
    expect(screen.queryByText("outra pagina protegida")).not.toBeInTheDocument();
  });
});