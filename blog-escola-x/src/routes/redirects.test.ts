import { describe, expect, it } from "vitest";
import { getRoleRedirectPath } from "./redirects";

describe("getRoleRedirectPath", () => {
  it("redireciona professor para o painel do professor", () => {
    expect(getRoleRedirectPath("TEACHER")).toBe("/professor");
  });

  it("redireciona aluno para a home protegida", () => {
    expect(getRoleRedirectPath("STUDENT")).toBe("/");
  });

  it("retorna login para usuários sem perfil válido", () => {
    expect(getRoleRedirectPath(undefined)).toBe("/login");
  });
});
