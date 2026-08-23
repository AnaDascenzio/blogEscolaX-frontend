import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { Home } from "../pages/Home/Home";
import { CriarPublicacao } from "../pages/CriarPublicacao/CriarPublicacao";
import { LeituraPost } from "../pages/LeituraPost/LeituraPost";

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
        <Route path="/login" element={<PagePlaceholder title="Login" />} />
        <Route path="/api-test" element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<PagePlaceholder title="Últimas publicações" />} />
          <Route path="/post/:id" element={<LeituraPost />} />
          <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
            <Route path="/professor" element={<PagePlaceholder title="Painel do professor" />} />
            <Route path="/post/novo" element={<CriarPublicacao />} />
            <Route path="/post/editar/:id" element={<CriarPublicacao />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}