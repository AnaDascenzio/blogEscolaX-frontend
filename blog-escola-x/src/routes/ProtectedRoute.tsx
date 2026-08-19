import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, type UserRole } from "../contexts/AuthContext";

interface ProtectedRouteProps {
	allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
	const { isAuthenticated, user, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return <main className="page-placeholder">Carregando sessão...</main>;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}
