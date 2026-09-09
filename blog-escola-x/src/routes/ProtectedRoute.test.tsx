import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import { teacher, token } from "../test/fixtures";

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
    localStorage.setItem("auth_user", JSON.stringify(teacher));
    renderRoute(["TEACHER"]);
    expect(screen.getByText("conteúdo protegido")).toBeInTheDocument();
  });

  it("redireciona usuário autenticado sem o papel exigido", () => {
    const studentToken = `header.${btoa(JSON.stringify({ sub: "student-1", role: "STUDENT" }))}.signature`;
    localStorage.setItem("access_token", studentToken);
    localStorage.setItem("auth_user", JSON.stringify({ ...teacher, role: "STUDENT" }));
    renderRoute(["TEACHER"]);
    expect(screen.getByText("home")).toBeInTheDocument();
  });
});