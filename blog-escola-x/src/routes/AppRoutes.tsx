import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "./AppLayout";
import { Login } from "../pages/Login/Login";
import { Home } from "../pages/Home/Home";
import { TeacherDashboard } from "../pages/TeacherDashboard/TeacherDashboard";
import { PostForm } from "../pages/PostForm/PostForm";
import { PostDetail } from "../pages/PostDetail/PostDetail";

function PagePlaceholder({ title }: { title: string }) {
  return (
    <main className="page-placeholder">
      <p className="eyebrow">Portal Escolar</p>
      <h1>{title}</h1>
      <p>Esta tela está pronta para receber a implementação da sua user story.</p>
    </main>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/api-test" element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<PagePlaceholder title="Últimas publicações" />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
              <Route path="/post/novo" element={<PostForm />} />
              <Route path="/post/editar/:id" element={<PostForm />} />
            </Route>
          </Route>
          {/* Painel do professor mantém seu próprio cabeçalho, por isso fica fora do AppLayout */}
          <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
            <Route path="/professor" element={<TeacherDashboard />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}