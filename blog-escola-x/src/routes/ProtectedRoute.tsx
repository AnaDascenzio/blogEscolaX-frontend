import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, type UserRole } from "../contexts/AuthContext";

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
