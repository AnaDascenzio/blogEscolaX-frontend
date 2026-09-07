import { GraduationCap, LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Avatar from "../Avatar/Avatar";
import * as S from "./Header.styles";

interface HeaderProps {
  showNewPost?: boolean;
}

export function Header({ showNewPost = false }: HeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate("/login", { replace: true });
  }

  return (
    <S.HeaderBar>
      <S.Brand>
        <S.BrandIcon aria-hidden="true">
          <GraduationCap size={21} strokeWidth={2} />
        </S.BrandIcon>
        <S.BrandText>
          <strong>Portal Escolar</strong>
          <span>{user?.role === "TEACHER" ? "Painel do Professor" : "O blog oficial da nossa escola"}</span>
        </S.BrandText>
      </S.Brand>

      <S.Actions>
        {showNewPost && (
          <S.NewPostButton type="button" onClick={() => navigate("/post/novo")}>
            <Plus size={16} aria-hidden="true" /> Nova publicação
          </S.NewPostButton>
        )}
        <S.User>
          <S.UserText>
            <strong>{user?.name ?? user?.email ?? "Usuário"}</strong>
            <span>{user?.role === "TEACHER" ? "Professor" : "Aluno"}</span>
          </S.UserText>
          <Avatar name={user?.name ?? user?.email ?? "?"} />
          <S.LogoutButton type="button" onClick={handleSignOut} aria-label="Sair">
            <LogOut size={16} aria-hidden="true" />
            <span>Sair</span>
          </S.LogoutButton>
        </S.User>
      </S.Actions>
    </S.HeaderBar>
  );
}

export default Header;