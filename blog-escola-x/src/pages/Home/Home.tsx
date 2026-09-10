import { useEffect, useMemo, useState } from "react";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../services/posts.service";
import { SUBJECT_LABELS } from "../../types/api";
import { Footer } from "../../components/Footer/Footer";
import type { Post } from "../../types/api";


export function Home() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubject, setActiveSubject] = useState("ALL");

  async function loadPosts() {
    setIsLoading(true);
    setError(null);

    try {
      const resposta = await getPosts(1, 100);
      setPosts(resposta.post);
    } catch {
      setError(
        "Não foi possível carregar as publicações. Verifique se a API está disponível."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadPosts();
  }, []);

  const activePosts = useMemo(
    () => posts.filter((post) => !post.isDeleted),
    [posts]
  );

  const availableSubjects = useMemo(() => {
    const subjects = new Set(activePosts.map((post) => post.subject));
    return Array.from(subjects);
  }, [activePosts]);

  const visiblePosts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return activePosts.filter((post) => {
      const matchesSubject =
        activeSubject === "ALL" || post.subject === activeSubject;

      const matchesSearch =
        term === "" ||
        post.title.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term) ||
        (post.author?.name?.toLowerCase().includes(term) ?? false);

      return matchesSubject && matchesSearch;
    });
  }, [activePosts, activeSubject, searchTerm]);

  return (
    <main className="min-h-screen bg-blue-50 px-4 py-4 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        {/* Mesmo modelo visual do cabeçalho do professor */}
        <header className="mb-5 flex items-center rounded-xl bg-white px-5 py-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-100 text-blue-600">
              <GraduationCap size={21} strokeWidth={2} />
            </div>

            <div>
              <strong className="block text-sm text-slate-900">
                Portal Escolar
              </strong>
              <span className="block text-xs text-slate-500">
                Painel do Aluno
              </span>
            </div>
          </div>
        </header>

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar posts por palavra-chave ou autor..."
          className="mb-4 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
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
              type="button"
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_272px]">
          <section className="space-y-4">
            {isLoading && (
              <p className="rounded-xl bg-white p-6 text-center text-slate-500 shadow-sm">
                Carregando publicações...
              </p>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 p-5 text-sm text-red-600 shadow-sm">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => void loadPosts()}
                  className="mt-2 font-medium text-blue-600 hover:underline"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!isLoading && !error && visiblePosts.length === 0 && (
              <p className="rounded-xl bg-white p-6 text-center text-slate-500 shadow-sm">
                Nenhuma publicação encontrada.
              </p>
            )}

            {!isLoading &&
              !error &&
              visiblePosts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
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

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-sm text-slate-600">
                      {post.author?.name ?? "Professor(a) responsável"}
                    </span>

                    <button
                      type="button"
                      onClick={() => navigate(`/post/${post.id}`)}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Ler post completo →
                    </button>
                  </div>
                </article>
              ))}
          </section>

          <aside className="space-y-4">
            <div className="rounded-xl bg-blue-600 p-5 text-white shadow-sm">
              <p className="font-semibold">Bem-vindo(a) ao Portal do Aluno!</p>
              <p className="mt-1 text-sm text-blue-100">
                Acompanhe conteúdos, materiais e avisos publicados pelos seus
                professores.
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-700">
                Espaço Seguro & Moderado
              </p>
              <p className="mt-1 text-xs text-slate-500">
                As publicações são organizadas pela equipe pedagógica para
                manter um ambiente saudável de aprendizagem.
              </p>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </main>
  );
}
