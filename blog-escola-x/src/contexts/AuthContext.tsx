import { createContext, useContext, useState, type ReactNode } from "react";

export type UserRole = "TEACHER" | "STUDENT";

export interface AuthUser {
	id: number;
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
const USER_KEY = "auth_user";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
	const storedUser = localStorage.getItem(USER_KEY);
	if (!storedUser) return null;

	try {
		return JSON.parse(storedUser) as AuthUser;
	} catch {
		localStorage.removeItem(USER_KEY);
		return null;
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
	const [user, setUser] = useState<AuthUser | null>(readStoredUser);
	const isLoading = false;

	function signIn(nextToken: string, nextUser?: Partial<AuthUser>) {
		const payload = nextToken.split(".")[1];
		const tokenUser = (() => {
			try {
				return payload ? JSON.parse(atob(payload)) as Partial<AuthUser> : {};
			} catch {
				return {};
			}
		})();

		const nextAuthUser = { ...tokenUser, ...nextUser } as AuthUser;
		localStorage.setItem(TOKEN_KEY, nextToken);
		localStorage.setItem(USER_KEY, JSON.stringify(nextAuthUser));
		setToken(nextToken);
		setUser(nextAuthUser);
	}

	function signOut() {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_KEY);
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
