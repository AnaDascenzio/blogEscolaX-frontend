import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "./AppLayout";
import { Login } from "../pages/Login/Login";
import { Home } from "../pages/Home/Home";
import { TeacherDashboard } from "../pages/TeacherDashboard/TeacherDashboard";
import { CriarPublicacao } from "../pages/CriarPublicacao/CriarPublicacao";
import { LeituraPost } from "../pages/LeituraPost/LeituraPost";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Navigate to="/aluno" replace />} />
        <Route path="/aluno" element={<Home />} />
        <Route path="/post/:id" element={<LeituraPost />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
              <Route path="/post/novo" element={<CriarPublicacao />} />
              <Route path="/post/editar/:id" element={<CriarPublicacao />} />
            </Route>
          </Route>

          {/* Painel do professor mantém seu próprio cabeçalho, por isso fica fora do AppLayout */}
          <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
            <Route path="/professor" element={<TeacherDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/aluno" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
