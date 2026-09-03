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
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalizedPayload)) as {
      role?: unknown;
      roles?: unknown;
      authority?: unknown;
      authorities?: unknown;
    };
    const claims = [decoded.role, decoded.roles, decoded.authority, decoded.authorities]
      .flatMap((claim) => (Array.isArray(claim) ? claim : [claim]))
      .filter((claim): claim is string => typeof claim === "string")
      .map((claim) => claim.toUpperCase());

    if (claims.some((claim) => claim.includes("TEACHER") || claim.includes("PROFESSOR"))) {
      return "TEACHER";
    }
    if (claims.some((claim) => claim.includes("STUDENT") || claim.includes("ALUNO"))) {
      return "STUDENT";
    }
    return null;
  } catch {
    return null;
  }
}
