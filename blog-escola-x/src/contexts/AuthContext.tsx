import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { getUserByEmail, getUserById } from "../services/users.service";

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
	validateSession: () => boolean;
}

export const TOKEN_KEY = "access_token";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(() => {
		const stored = localStorage.getItem(TOKEN_KEY);
		if (!stored) return null;
		// Rejeitar token expirado na inicialização
		const decoded = decodeToken(stored);
		if (!decoded) {
			localStorage.removeItem(TOKEN_KEY);
			sessionStorage.removeItem("auth_user_name");
			return null;
		}
		return stored;
	});
	const [user, setUser] = useState<AuthUser | null>(() => {
		const stored = localStorage.getItem(TOKEN_KEY);
		if (!stored) return null;
		const decoded = decodeToken(stored);
		if (!decoded) {
			sessionStorage.removeItem("auth_user_name");
			return null;
		}
		const cachedName = sessionStorage.getItem("auth_user_name");
		if (cachedName && !decoded.name) {
			decoded.name = cachedName;
		}
		return decoded as AuthUser | null;
	});
	const isLoading = false;

	// Se o usuário está autenticado mas ainda não tem o nome (ex: vindo de reload), busca no backend
	useEffect(() => {
		if (token && user && !user.name) {
			let isCancelled = false;
			const fetchUserProfile = async () => {
				try {
					let profile: AuthUser | null = null;
					if (user.email) {
						profile = await getUserByEmail(user.email);
					} else if (user.id) {
						profile = await getUserById(user.id);
					}
					if (!isCancelled && profile?.name) {
						sessionStorage.setItem("auth_user_name", profile.name);
						setUser((prev) => (prev ? { ...prev, name: profile.name } : prev));
					}
				} catch {
					// Fallback silencioso
				}
			};
			void fetchUserProfile();
			return () => {
				isCancelled = true;
			};
		}
	}, [token, user?.email, user?.id, user?.name]);

	// Escutar evento de sessão expirada emitido pelo interceptor de 401/403 (api.ts)
	// ou quando o token no localStorage for alterado/apagado/adulterado
	useEffect(() => {
		const handleSessionExpired = () => {
			localStorage.removeItem(TOKEN_KEY);
			sessionStorage.removeItem("auth_user_name");
			setToken(null);
			setUser(null);
		};

		// Se o token for adulterado ou removido no localStorage
		const syncStorage = () => {
			const current = localStorage.getItem(TOKEN_KEY);
			if (!current || !decodeToken(current)) {
				handleSessionExpired();
			} else if (current !== token) {
				const decoded = decodeToken(current);
				if (decoded) {
					setToken(current);
					setUser((prev) => ({
						...decoded,
						name: decoded.name || prev?.name || sessionStorage.getItem("auth_user_name") || undefined,
					} as AuthUser));
				}
			}
		};

		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === TOKEN_KEY) {
				syncStorage();
			}
		};

		window.addEventListener("session:expired", handleSessionExpired);
		window.addEventListener("storage", handleStorageChange);
		window.addEventListener("focus", syncStorage);
		window.addEventListener("visibilitychange", syncStorage);
		return () => {
			window.removeEventListener("session:expired", handleSessionExpired);
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("focus", syncStorage);
			window.removeEventListener("visibilitychange", syncStorage);
		};
	}, [token]);

	const signOut = useCallback(() => {
		localStorage.removeItem(TOKEN_KEY);
		sessionStorage.removeItem("auth_user_name");
		setToken(null);
		setUser(null);
	}, []);

	const signIn = useCallback((nextToken: string, nextUser?: Partial<AuthUser>) => {
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

		if (nextAuthUser.name) {
			sessionStorage.setItem("auth_user_name", nextAuthUser.name);
		}

		localStorage.setItem(TOKEN_KEY, nextToken);
		setToken(nextToken);
		setUser(nextAuthUser);
	}, []);

	const validateSession = useCallback((): boolean => {
		const stored = localStorage.getItem(TOKEN_KEY);
		if (!stored) {
			signOut();
			return false;
		}
		const decoded = decodeToken(stored);
		if (!decoded) {
			signOut();
			return false;
		}
		if (stored !== token) {
			setToken(stored);
			setUser(decoded as AuthUser);
		}
		return true;
	}, [token, signOut]);

	return (
		<AuthContext.Provider
			value={{
				token,
				user,
				isAuthenticated: Boolean(token),
				isLoading,
				signIn,
				signOut,
				validateSession,
			}}
		>
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
