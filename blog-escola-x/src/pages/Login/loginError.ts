export function getLoginErrorMessage(error: unknown): string {
  const response =
    typeof error === "object" && error !== null && "response" in error
      ? (error as { response?: { data?: { message?: string }; status?: number } }).response
      : undefined;

  const backendMessage = response?.data?.message;
  if (backendMessage && typeof backendMessage === "string" && backendMessage.trim()) {
    return backendMessage;
  }

  const status = response?.status;

  if (status === 401 || status === 403) {
    return "E-mail ou senha inválidos. Verifique suas credenciais.";
  }

  if (status === 500 || status === 502 || status === 503 || status === 504) {
    return "Não foi possível fazer login no momento. Tente novamente mais tarde.";
  }

  return "Não foi possível realizar o login. Verifique suas credenciais.";
}
