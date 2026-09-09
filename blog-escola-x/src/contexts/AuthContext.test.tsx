import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Cria um JWT fake com payload arbitrário (assinatura fictícia). */
function fakeJwt(payload: object): string {
	const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
	const body = btoa(JSON.stringify(payload));
	return `${header}.${body}.fake-signature`;
}

/** Cria um JWT fake com expiração no futuro (1h). */
function validToken(overrides: object = {}) {
	return fakeJwt({
		sub: "user-1",
		email: "professor@escola.com",
		role: "TEACHER",
		name: "Prof. Silva",
		exp: Math.floor(Date.now() / 1000) + 3600,
		...overrides,
	});
}

/** Cria um JWT fake com expiração no passado. */
function expiredToken(overrides: object = {}) {
	return fakeJwt({
		sub: "user-1",
		email: "professor@escola.com",
		role: "TEACHER",
		exp: Math.floor(Date.now() / 1000) - 3600,
		...overrides,
	});
}

/** Componente auxiliar que expõe os valores do AuthContext para testes. */
function AuthConsumer({ onRender }: { onRender: (auth: ReturnType<typeof useAuth>) => void }) {
	const auth = useAuth();
	onRender(auth);
	return null;
}

// ─── Testes ───────────────────────────────────────────────────────────────────

describe("AuthContext", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		localStorage.clear();
	});

	// ── Inicialização ─────────────────────────────────────────────────────

	describe("inicialização", () => {
		it("inicia não autenticado quando localStorage está vazio", () => {
			let authValue: ReturnType<typeof useAuth> | null = null;

			render(
				<AuthProvider>
					<AuthConsumer onRender={(auth) => { authValue = auth; }} />
				</AuthProvider>,
			);

			expect(authValue!.isAuthenticated).toBe(false);
			expect(authValue!.token).toBeNull();
			expect(authValue!.user).toBeNull();
		});

		it("restaura sessão de token válido no localStorage", () => {
			const token = validToken();
			localStorage.setItem("access_token", token);

			let authValue: ReturnType<typeof useAuth> | null = null;

			render(
				<AuthProvider>
					<AuthConsumer onRender={(auth) => { authValue = auth; }} />
				</AuthProvider>,
			);

			expect(authValue!.isAuthenticated).toBe(true);
			expect(authValue!.token).toBe(token);
			expect(authValue!.user).not.toBeNull();
			expect(authValue!.user!.id).toBe("user-1");
			expect(authValue!.user!.email).toBe("professor@escola.com");
			expect(authValue!.user!.role).toBe("TEACHER");
		});

		it("rejeita token expirado no localStorage e limpa storage", () => {
			const token = expiredToken();
			localStorage.setItem("access_token", token);

			let authValue: ReturnType<typeof useAuth> | null = null;

			render(
				<AuthProvider>
					<AuthConsumer onRender={(auth) => { authValue = auth; }} />
				</AuthProvider>,
			);

			expect(authValue!.isAuthenticated).toBe(false);
			expect(authValue!.token).toBeNull();
			expect(authValue!.user).toBeNull();
			expect(localStorage.getItem("access_token")).toBeNull();
		});

		it("rejeita token malformado no localStorage", () => {
			localStorage.setItem("access_token", "not-a-jwt");

			let authValue: ReturnType<typeof useAuth> | null = null;

			render(
				<AuthProvider>
					<AuthConsumer onRender={(auth) => { authValue = auth; }} />
				</AuthProvider>,
			);

			expect(authValue!.isAuthenticated).toBe(false);
			expect(localStorage.getItem("access_token")).toBeNull();
		});
	});

	// ── signIn ────────────────────────────────────────────────────────────

	describe("signIn", () => {
		it("autentica com token válido", () => {
			let authValue: ReturnType<typeof useAuth> | null = null;

			render(
				<AuthProvider>
					<AuthConsumer onRender={(auth) => { authValue = auth; }} />
				</AuthProvider>,
			);

			const token = validToken();

			act(() => {
				authValue!.signIn(token);
			});

			expect(authValue!.isAuthenticated).toBe(true);
			expect(authValue!.user!.id).toBe("user-1");
			expect(authValue!.user!.role).toBe("TEACHER");
			expect(localStorage.getItem("access_token")).toBe(token);
		});

		it("dá prioridade aos dados do token sobre dados complementares para id, email e role", () => {
			let authValue: ReturnType<typeof useAuth> | null = null;

			render(
				<AuthProvider>
					<AuthConsumer onRender={(auth) => { authValue = auth; }} />
				</AuthProvider>,
			);

			const token = validToken({ sub: "real-id", email: "real@escola.com", role: "TEACHER" });

			act(() => {
				// Passa dados complementares que tentam sobrescrever id/role
				authValue!.signIn(token, {
					id: "forged-id",
					email: "forged@evil.com",
					role: "STUDENT",
					name: "Nome do Backend",
				});
			});

			// Dados do token prevalecem
			expect(authValue!.user!.id).toBe("real-id");
			expect(authValue!.user!.email).toBe("real@escola.com");
			expect(authValue!.user!.role).toBe("TEACHER");
		});

		it("preserva name do backend quando token não contém name", () => {
			let authValue: ReturnType<typeof useAuth> | null = null;

			render(
				<AuthProvider>
					<AuthConsumer onRender={(auth) => { authValue = auth; }} />
				</AuthProvider>,
			);

			const token = fakeJwt({
				sub: "user-1",
				email: "prof@escola.com",
				role: "TEACHER",
				exp: Math.floor(Date.now() / 1000) + 3600,
				// sem name no token
			});

			act(() => {
				authValue!.signIn(token, { name: "Prof. Silva" });
			});

			expect(authValue!.user!.name).toBe("Prof. Silva");
		});

		it("ignora token expirado no signIn", () => {
			let authValue: ReturnType<typeof useAuth> | null = null;

			render(
				<AuthProvider>
					<AuthConsumer onRender={(auth) => { authValue = auth; }} />
				</AuthProvider>,
			);

			const token = expiredToken();

			act(() => {
				authValue!.signIn(token);
			});

			expect(authValue!.isAuthenticated).toBe(false);
			expect(authValue!.user).toBeNull();
		});

		it("ignora token malformado no signIn", () => {
			let authValue: ReturnType<typeof useAuth> | null = null;

			render(
				<AuthProvider>
					<AuthConsumer onRender={(auth) => { authValue = auth; }} />
				</AuthProvider>,
			);

			act(() => {
				authValue!.signIn("not-a-jwt");
			});

			expect(authValue!.isAuthenticated).toBe(false);
		});

		it("não armazena dados do usuário separadamente no localStorage", () => {
			let authValue: ReturnType<typeof useAuth> | null = null;

			render(
				<AuthProvider>
					<AuthConsumer onRender={(auth) => { authValue = auth; }} />
				</AuthProvider>,
			);

			act(() => {
				authValue!.signIn(validToken());
			});

			// Apenas access_token deve existir — auth_user NÃO deve ser armazenado
			expect(localStorage.getItem("access_token")).not.toBeNull();
			expect(localStorage.getItem("auth_user")).toBeNull();
		});
	});

	// ── signOut ───────────────────────────────────────────────────────────

	describe("signOut", () => {
		it("limpa estado e localStorage", () => {
			let authValue: ReturnType<typeof useAuth> | null = null;

			render(
				<AuthProvider>
					<AuthConsumer onRender={(auth) => { authValue = auth; }} />
				</AuthProvider>,
			);

			act(() => {
				authValue!.signIn(validToken());
			});

			expect(authValue!.isAuthenticated).toBe(true);

			act(() => {
				authValue!.signOut();
			});

			expect(authValue!.isAuthenticated).toBe(false);
			expect(authValue!.token).toBeNull();
			expect(authValue!.user).toBeNull();
			expect(localStorage.getItem("access_token")).toBeNull();
		});
	});

	// ── Evento session:expired (CR-05) ────────────────────────────────────

	describe("session:expired", () => {
		it("limpa estado React ao receber evento session:expired", () => {
			let authValue: ReturnType<typeof useAuth> | null = null;

			render(
				<AuthProvider>
					<AuthConsumer onRender={(auth) => { authValue = auth; }} />
				</AuthProvider>,
			);

			// Primeiro, autenticar
			act(() => {
				authValue!.signIn(validToken());
			});

			expect(authValue!.isAuthenticated).toBe(true);

			// Simular 401 — emitir evento
			act(() => {
				window.dispatchEvent(new CustomEvent("session:expired"));
			});

			expect(authValue!.isAuthenticated).toBe(false);
			expect(authValue!.token).toBeNull();
			expect(authValue!.user).toBeNull();
			expect(localStorage.getItem("access_token")).toBeNull();
		});

		it("não quebra quando session:expired é emitido sem sessão ativa", () => {
			let authValue: ReturnType<typeof useAuth> | null = null;

			render(
				<AuthProvider>
					<AuthConsumer onRender={(auth) => { authValue = auth; }} />
				</AuthProvider>,
			);

			// Emitir sem sessão ativa — não deve lançar erro
			act(() => {
				window.dispatchEvent(new CustomEvent("session:expired"));
			});

			expect(authValue!.isAuthenticated).toBe(false);
		});

		it("permite re-login após session:expired sem recarregar a página", () => {
			let authValue: ReturnType<typeof useAuth> | null = null;

			render(
				<AuthProvider>
					<AuthConsumer onRender={(auth) => { authValue = auth; }} />
				</AuthProvider>,
			);

			const token1 = validToken({ sub: "user-1" });
			const token2 = validToken({ sub: "user-2", email: "outro@escola.com" });

			// Login inicial
			act(() => {
				authValue!.signIn(token1);
			});
			expect(authValue!.user!.id).toBe("user-1");

			// Sessão expira
			act(() => {
				window.dispatchEvent(new CustomEvent("session:expired"));
			});
			expect(authValue!.isAuthenticated).toBe(false);

			// Re-login com outro usuário
			act(() => {
				authValue!.signIn(token2);
			});
			expect(authValue!.isAuthenticated).toBe(true);
			expect(authValue!.user!.id).toBe("user-2");
			expect(authValue!.user!.email).toBe("outro@escola.com");
		});

		it("remove o event listener ao desmontar o AuthProvider", () => {
			const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

			const { unmount } = render(
				<AuthProvider>
					<div />
				</AuthProvider>,
			);

			unmount();

			expect(removeEventListenerSpy).toHaveBeenCalledWith(
				"session:expired",
				expect.any(Function),
			);

			removeEventListenerSpy.mockRestore();
		});
	});

	// ── useAuth fora do Provider ──────────────────────────────────────────

	describe("useAuth", () => {
		it("lança erro quando usado fora do AuthProvider", () => {
			// React 19 captura erros de render internamente — usamos um ErrorBoundary
			// para verificar que o erro é propagado.
			const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

			let caughtError: Error | null = null;

			function ProblemChild() {
				const _auth = useAuth(); // vai lançar
				return null;
			}

			// Renderizar com window.onerror para capturar o erro
			const origOnError = window.onerror;
			window.onerror = () => true; // suprimir

			try {
				render(<ProblemChild />);
			} catch (e) {
				caughtError = e as Error;
			}

			// Se React não propagou o throw, verificar via console.error
			if (!caughtError) {
				const errorCalls = consoleSpy.mock.calls.flat().map(String);
				const hasAuthError = errorCalls.some((msg) =>
					msg.includes("useAuth must be used inside AuthProvider"),
				);
				expect(hasAuthError).toBe(true);
			} else {
				expect(caughtError.message).toContain("useAuth must be used inside AuthProvider");
			}

			window.onerror = origOnError;
			consoleSpy.mockRestore();
		});
	});
});
