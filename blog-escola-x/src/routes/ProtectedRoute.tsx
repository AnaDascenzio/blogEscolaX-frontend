import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, decodeToken, TOKEN_KEY, type UserRole } from "../contexts/AuthContext";
import styled from "styled-components";

interface ProtectedRouteProps {
	allowedRoles?: UserRole[];
}

/**
 * Proteção de rota no lado do cliente — apenas otimização de UX.
 *
 * Esta verificação impede navegação indesejada na interface, mas NÃO
 * constitui uma fronteira de segurança. Toda autorização é imposta pelo
 * backend via validação do JWT e verificação de papel/propriedade.
 */
const LoadingPage = styled.main`
	min-height: 100vh;
	display: grid;
	place-content: center;
	padding: 32px;
	color: var(--color-text);
	text-align: center;
`;

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
	const { isAuthenticated, user, isLoading, signOut } = useAuth();
	const location = useLocation();

	// Valida ativamente o token no storage a cada navegação/renderização da rota
	const storedToken = localStorage.getItem(TOKEN_KEY);
	const validTokenData = storedToken ? decodeToken(storedToken) : null;
	const isSessionValid = Boolean(isAuthenticated && user?.role && storedToken && validTokenData);

	useEffect(() => {
		if (!isSessionValid && (isAuthenticated || storedToken)) {
			signOut();
		}
	}, [isSessionValid, isAuthenticated, storedToken, signOut]);

	if (isLoading) {
		return <LoadingPage>Carregando sessão...</LoadingPage>;
	}

	if (!isSessionValid || !validTokenData) {
		localStorage.removeItem(TOKEN_KEY);
		sessionStorage.removeItem("auth_user_name");
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	const role = validTokenData.role;
	if (role && allowedRoles && !allowedRoles.includes(role)) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}
