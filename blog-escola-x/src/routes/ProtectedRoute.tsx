import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, type UserRole } from "../contexts/AuthContext";
import styled from "styled-components";

interface ProtectedRouteProps {
	allowedRoles?: UserRole[];
}

const LoadingPage = styled.main`
	min-height: 100vh;
	display: grid;
	place-content: center;
	padding: 32px;
	color: var(--color-text);
	text-align: center;
`;

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
	const { isAuthenticated, user, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return <LoadingPage>Carregando sessão...</LoadingPage>;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}
