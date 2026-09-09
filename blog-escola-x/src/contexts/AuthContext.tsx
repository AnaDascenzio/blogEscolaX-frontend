import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

//passar para uma interface depois
export type UserRole = "TEACHER" | "STUDENT";

export interface AuthUser {
	id: string;
	email: string;
	role: UserRole;
	name?: string;
}

interface AuthContextValue {
	token: string | null;
	user: AuthUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	signIn: (token: string, user?: Partial<AuthUser>) => void;
	signOut: () => void;
}

const TOKEN_KEY = "access_token";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Decodifica o payload do JWT para exibição na UI.
 *
 * ⚠️ SEGURANÇA: Esta decodificação NÃO valida a assinatura do token.
 * Os dados extraídos (role, email, id) servem apenas para otimização
 * visual da interface. Toda autorização real DEVE ser feita no backend
 * a partir das claims verificadas do token.
 */
function decodeToken(jwt: string): Partial<AuthUser> | null {
	try {
		const parts = jwt.split(".");
		if (parts.length !== 3) return null;

		const normalizedPayload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
		const payload = JSON.parse(atob(normalizedPayload)) as Record<string, unknown>;

		// Rejeitar tokens expirados
		if (typeof payload.exp === "number" && Date.now() >= payload.exp * 1000) {
			return null;
		}

		return {
			id: (payload.sub || payload.id) as string,
			email: payload.email as string,
			role: payload.role as UserRole,
			name: payload.name as string | undefined,
		};
	} catch {
		return null;
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(() => {
		const stored = localStorage.getItem(TOKEN_KEY);
		if (!stored) return null;
		// Rejeitar token expirado na inicialização
		const decoded = decodeToken(stored);
		if (!decoded) {
			localStorage.removeItem(TOKEN_KEY);
			return null;
		}
		return stored;
	});
	const [user, setUser] = useState<AuthUser | null>(() => {
		const stored = localStorage.getItem(TOKEN_KEY);
		if (!stored) return null;
		const decoded = decodeToken(stored);
		return decoded as AuthUser | null;
	});
	const isLoading = false;

	// Escutar evento de sessão expirada emitido pelo interceptor de 401 (api.ts).
	// Ao receber, limpa o estado React para que ProtectedRoute redirecione para /login.
	useEffect(() => {
		const handleSessionExpired = () => {
			localStorage.removeItem(TOKEN_KEY);
			setToken(null);
			setUser(null);
		};

		window.addEventListener("session:expired", handleSessionExpired);
		return () => window.removeEventListener("session:expired", handleSessionExpired);
	}, []);

	function signIn(nextToken: string, nextUser?: Partial<AuthUser>) {
		const tokenData = decodeToken(nextToken);
		if (!tokenData) return; // Token inválido — não fazer login

		// Mesclar dados do token com dados complementares do backend (ex: name)
		// ⚠️ Dados do token têm prioridade para id, email e role
		const nextAuthUser = {
			...nextUser,
			...tokenData,
			// Preservar name do backend se não vier no token
			name: tokenData.name || nextUser?.name,
		} as AuthUser;

		localStorage.setItem(TOKEN_KEY, nextToken);
		setToken(nextToken);
		setUser(nextAuthUser);
	}

	function signOut() {
		localStorage.removeItem(TOKEN_KEY);
		setToken(null);
		setUser(null);
	}

	return (
		<AuthContext.Provider value={{ token, user, isAuthenticated: Boolean(token), isLoading, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used inside AuthProvider");
	return context;
}
