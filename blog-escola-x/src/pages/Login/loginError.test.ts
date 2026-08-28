import { describe, expect, it } from "vitest";
import { getLoginErrorMessage } from "./loginError";

describe("getLoginErrorMessage", () => {
  it("retorna mensagem amigável para credenciais inválidas", () => {
    const error = { response: { status: 401 } };

    expect(getLoginErrorMessage(error)).toBe("E-mail ou senha inválidos. Verifique suas credenciais.");
  });

  it("retorna mensagem amigável para erro interno do servidor", () => {
    const error = { response: { status: 500 } };

    expect(getLoginErrorMessage(error)).toBe("Não foi possível fazer login no momento. Tente novamente mais tarde.");
  });

  it("prioriza a mensagem do backend quando ela estiver disponível", () => {
    const error = { response: { data: { message: "Usuário não encontrado." }, status: 500 } };

    expect(getLoginErrorMessage(error)).toBe("Usuário não encontrado.");
  });
});
