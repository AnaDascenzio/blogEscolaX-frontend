import { Outlet } from "react-router-dom";
import { Header } from "../components/Header/Header";
import * as S from "./AppLayout.styles";

export function AppLayout() {
  return (
    <S.Shell>
      <Header />

      <S.Content>
        <Outlet />
      </S.Content>
    </S.Shell>
  );
}
