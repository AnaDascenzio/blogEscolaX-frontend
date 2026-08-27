import { GraduationCap, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import * as S from "./Header.styles";

function initials(name?: string): string {
  if (!name) return "?";
  const words = name.trim().split(/\s+/);
  return (words[0][0] + (words[words.length - 1][0] ?? "")).toUpperCase().slice(0, 2);
}

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate("/login", { replace: true });
  }

  const roleLabel = user?.role === "TEACHER" ? "Professor(a)" : "Aluno(a)";

  return (
    <S.Bar>
      <S.Inner>
        <S.Brand>
          <S.Logo>
            <GraduationCap size={20} />
          </S.Logo>
          <S.BrandText>
            <strong>Portal Escolar</strong>
            <span>Blog Escola X</span>
          </S.BrandText>
        </S.Brand>

        <S.Nav>
          <S.NavItem to="/" end>
            Feed
          </S.NavItem>
          {user?.role === "TEACHER" && <S.NavItem to="/professor">Painel do Professor</S.NavItem>}
        </S.Nav>

        <S.UserArea>
          <S.UserCard>
            <S.Avatar>{initials(user?.name ?? user?.email)}</S.Avatar>
            <S.UserText>
              <strong>{user?.name ?? user?.email ?? "Usuário"}</strong>
              <span>{roleLabel}</span>
            </S.UserText>
          </S.UserCard>
          <S.SignOutBtn type="button" onClick={handleSignOut}>
            <LogOut size={15} />
            Sair
          </S.SignOutBtn>
        </S.UserArea>
      </S.Inner>
    </S.Bar>
  );
}
