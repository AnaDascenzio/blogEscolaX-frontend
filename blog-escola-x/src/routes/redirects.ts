import type { UserRole } from "../contexts/AuthContext";

export function getRoleRedirectPath(role?: UserRole | null): string {
  switch (role) {
    case "TEACHER":
      return "/professor";
    case "STUDENT":
      return "/";
    default:
      return "/login";
  }
}

export function getRoleFromToken(token?: string | null): UserRole | null {
  if (!token) return null;

  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const decoded = JSON.parse(atob(payload)) as { role?: UserRole };
    return decoded.role === "TEACHER" || decoded.role === "STUDENT" ? decoded.role : null;
  } catch {
    return null;
  }
}
