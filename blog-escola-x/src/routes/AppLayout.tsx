import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import * as S from "./AppLayout.styles";

function initials(name?: string): string {
  if (!name) return "?";
  const words = name.trim().split(/\s+/);
  return (words[0][0] + (words[words.length - 1][0] ?? "")).toUpperCase().slice(0, 2);
}

export function AppLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate("/login", { replace: true });
  }

  return (
    <S.Shell>
      <S.Nav>
        <S.NavInner>
          <S.NavBrand to="/">
            <S.NavLogo>◈</S.NavLogo>
            <S.NavBrandText>
              <strong>Portal Escolar</strong>
              <span>Blog da escola</span>
            </S.NavBrandText>
          </S.NavBrand>

          <S.NavUser>
            <S.NavAvatar>{initials(user?.name)}</S.NavAvatar>
            <S.NavUserText>
              <strong>{user?.name ?? user?.email ?? "Usuário"}</strong>
              <span>{user?.role === "TEACHER" ? "Professor(a)" : "Aluno(a)"}</span>
            </S.NavUserText>
            <S.BtnSair type="button" onClick={handleSignOut}>
              Sair
            </S.BtnSair>
          </S.NavUser>
        </S.NavInner>
      </S.Nav>

      <S.Content>
        <Outlet />
      </S.Content>
    </S.Shell>
  );
}
