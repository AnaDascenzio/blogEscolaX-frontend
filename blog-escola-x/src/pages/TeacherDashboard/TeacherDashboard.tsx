import { useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getPosts, deletePost } from "../../services/posts.service";
import { Header } from "../../components/Header/Header";
import type { Post } from "../../types/api";
import { Footer } from "../../components/Footer/Footer";

const SUBJECT_LABELS: Record<string, string> = {
  MATHEMATICS: "Matemática",
  PORTUGUESE: "Português",
  SCIENCE: "Ciências",
  HISTORY: "História",
  GEOGRAPHY: "Geografia",
};

interface State {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  deletingId: string | null;
}

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Post[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "DELETE_START"; payload: string }
  | { type: "DELETE_SUCCESS"; payload: string }
  | { type: "DELETE_ERROR"; payload: string };

const initialState: State = {
  posts: [],
  isLoading: true,
  error: null,
  deletingId: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, posts: action.payload };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "DELETE_START":
      return { ...state, deletingId: action.payload };
    case "DELETE_SUCCESS":
      return {
        ...state,
        deletingId: null,
        posts: state.posts.filter((p) => String(p.id) !== String(action.payload)),
      };
    case "DELETE_ERROR":
      return { ...state, deletingId: null, error: action.payload };
    default:
      return state;
  }
}

export function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { posts, isLoading, error, deletingId } = state;
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubject, setActiveSubject] = useState<string>("ALL");

  useEffect(() => {
    async function loadPosts() {
      dispatch({ type: "FETCH_START" });
      try {
        const { post } = await getPosts(1, 100);
        dispatch({ type: "FETCH_SUCCESS", payload: post });
      } catch {
        dispatch({ type: "FETCH_ERROR", payload: "Não foi possível carregar as publicações." });
      }
    }

    void loadPosts();
  }, []);

  const activePosts = useMemo(() => posts.filter((p) => !p.isDeleted), [posts]);

  const availableSubjects = useMemo(() => {
    const set = new Set(activePosts.map((p) => p.subject));
    return Array.from(set);
  }, [activePosts]);

  const visiblePosts = useMemo(() => {
    return activePosts.filter((post) => {
      const matchesSubject = activeSubject === "ALL" || post.subject === activeSubject;
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        term === "" ||
        post.title.toLowerCase().includes(term) ||
        (post.author?.name?.toLowerCase().includes(term) ?? false);
      return matchesSubject && matchesSearch;
    });
  }, [activePosts, activeSubject, searchTerm]);

  const myPostsCount = useMemo(
    () => activePosts.filter((p) => String(p.authorId) === String(user?.id)).length,
    [activePosts, user]
  );

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta publicação?")) return;
    dispatch({ type: "DELETE_START", payload: id });
    try {
      await deletePost(id);
      dispatch({ type: "DELETE_SUCCESS", payload: id });
    } catch {
      dispatch({ type: "DELETE_ERROR", payload: "Não foi possível excluir a publicação." });
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-blue-50">
        <p className="text-blue-500">Carregando painel...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-blue-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Cabeçalho: logo + Nova publicação + usuário/sair, tudo numa linha */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-6 rounded-xl bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
           <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
              <span className="h-4 w-4 rotate-45 rounded-sm bg-blue-600" />
            </span>
            <div>
              <p className="font-bold text-slate-900">Portal Escolar</p>
              <p className="text-sm text-slate-500">Painel do Professor</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/post/novo")}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              + Nova publicação
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <Header />
          </div>
        </header>

 
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar posts por palavra-chave ou autor..."
          className="mb-4 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubject("ALL")}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              activeSubject === "ALL"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Todos
          </button>
          {availableSubjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setActiveSubject(subject)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                activeSubject === subject
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {SUBJECT_LABELS[subject] ?? subject}
            </button>
          ))}
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        {/* Layout de duas colunas: feed + sidebar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <section className="space-y-4">
            {visiblePosts.length === 0 && (
              <p className="rounded-xl bg-white p-6 text-center text-slate-500 shadow-sm">
                Nenhuma publicação encontrada.
              </p>
            )}
            {visiblePosts.map((post) => {
              const isOwnPost = String(post.authorId) === String(user?.id);
              return (
                <article key={post.id} className="rounded-xl bg-white p-5 shadow-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                      {SUBJECT_LABELS[post.subject] ?? post.subject}
                    </span>
                    {post.createdAt && (
                      <span className="text-xs text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </div>
                  <h2
                    onClick={() => navigate(`/post/${post.id}`)}
                    className="mb-1 cursor-pointer font-semibold text-slate-900 hover:underline"
                  >
                    {post.title}
                  </h2>
                  <p className="mb-3 text-sm text-slate-500">
                    {post.summary ?? post.content.slice(0, 120)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      {post.author?.name ?? "Autor desconhecido"}
                      {isOwnPost && " (Você)"}
                    </span>
                    {isOwnPost ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/post/editar/${post.id}`)}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={String(deletingId) === String(post.id)}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {String(deletingId) === String(post.id) ? "Excluindo..." : "Excluir"}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => navigate(`/post/${post.id}`)}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        Ler post completo →
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </section>

         
          <aside className="space-y-4">
            <div className="rounded-xl bg-blue-600 p-5 text-white shadow-sm">
              <p className="font-semibold">Bem-vindo(a), {user?.name ?? "Professor(a)"}!</p>
              <p className="mt-1 text-sm text-blue-100">
                Gerencie suas publicações, compartilhe conhecimento e inspire seus alunos.
              </p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-700">Espaço Seguro & Moderado</p>
              <p className="mt-1 text-xs text-slate-500">
                Todos os comentários e publicações passam pela moderação da equipe pedagógica
                para garantir um ambiente saudável.
              </p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="mb-2 text-sm font-medium text-slate-700">Suas publicações</p>
              <p className="text-2xl font-bold text-slate-900">{myPostsCount}</p>
              <p className="text-xs text-slate-500">Posts publicados</p>
            </div>
          </aside>
        </div>
        <Footer />
      </div>
    </main>
  );
}