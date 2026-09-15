import type { AuthUser, UserRole } from "./AuthContext";

export const TOKEN_KEY = "access_token";

/**
 * Decodifica o payload do JWT para exibição na UI.
 *
 * ⚠️ SEGURANÇA: Esta decodificação NÃO valida a assinatura do token.
 * Os dados extraídos (role, email, id) servem apenas para otimização
 * visual da interface. Toda autorização real DEVE ser feita no backend
 * a partir das claims verificadas do token.
 */
export function decodeToken(jwt: string): Partial<AuthUser> | null {
	try {
		const parts = jwt.split(".");
		if (parts.length !== 3) return null;

		const normalizedPayload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
		const payload = JSON.parse(atob(normalizedPayload)) as Record<string, unknown>;

		// Rejeitar tokens expirados
		if (typeof payload.exp === "number" && Date.now() >= payload.exp * 1000) {
			return null;
		}

		// Rejeitar tokens sem role válida
		const role = payload.role as string | undefined;
		if (role !== "TEACHER" && role !== "STUDENT") {
			return null;
		}

		return {
			id: (payload.sub || payload.id) as string,
			email: payload.email as string,
			role: role as UserRole,
			name: payload.name as string | undefined,
		};
	} catch {
		return null;
	}
}
