import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Post, Subject } from "../../types/api";
import "./Home.css";

const postsExemplo: Post[] = [
  {
    id: "1",
    title: "Revisão para a avaliação de Matemática",
    summary:
      "Confira os principais conteúdos que serão abordados na próxima avaliação: frações, porcentagem e regra de três.",
    content:
      "Confira os principais conteúdos que serão abordados na próxima avaliação: frações, porcentagem e regra de três.",
    subject: "MATHEMATICS",
    authorId: "1",
    author: {
      id: "1",
      name: "Prof. Carlos",
      email: "carlos@escola.com",
      role: "TEACHER",
    },
    isDeleted: false,
    createdAt: "2026-09-05",
  },
  {
    id: "2",
    title: "Feira de Ciências: inscrições abertas",
    summary:
      "Monte seu grupo e prepare um experimento criativo para apresentar na Feira de Ciências da escola.",
    content:
      "Monte seu grupo e prepare um experimento criativo para apresentar na Feira de Ciências da escola.",
    subject: "SCIENCE",
    authorId: "2",
    author: {
      id: "2",
      name: "Profa. Marina",
      email: "marina@escola.com",
      role: "TEACHER",
    },
    isDeleted: false,
    createdAt: "2026-09-04",
  },
  {
    id: "3",
    title: "Leitura recomendada para este mês",
    summary:
      "Veja a lista de livros e textos selecionados para apoiar as atividades de Português.",
    content:
      "Veja a lista de livros e textos selecionados para apoiar as atividades de Português.",
    subject: "PORTUGUESE",
    authorId: "3",
    author: {
      id: "3",
      name: "Profa. Ana",
      email: "ana@escola.com",
      role: "TEACHER",
    },
    isDeleted: false,
    createdAt: "2026-09-02",
  },
  {
    id: "4",
    title: "Atividade sobre a formação do Brasil",
    summary:
      "Leia o material de apoio e responda às questões propostas para nossa próxima aula de História.",
    content:
      "Leia o material de apoio e responda às questões propostas para nossa próxima aula de História.",
    subject: "HISTORY",
    authorId: "4",
    author: {
      id: "4",
      name: "Prof. João",
      email: "joao@escola.com",
      role: "TEACHER",
    },
    isDeleted: false,
    createdAt: "2026-09-01",
  },
];

const materias: { value: Subject | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todas" },
  { value: "MATHEMATICS", label: "Matemática" },
  { value: "PORTUGUESE", label: "Português" },
  { value: "SCIENCE", label: "Ciências" },
  { value: "HISTORY", label: "História" },
  { value: "GEOGRAPHY", label: "Geografia" },
];

function traduzirMateria(subject: Subject) {
  const nomes: Record<string, string> = {
    MATHEMATICS: "Matemática",
    PORTUGUESE: "Português",
    SCIENCE: "Ciências",
    HISTORY: "História",
    GEOGRAPHY: "Geografia",
  };

  return nomes[subject] || subject;
}

function formatarData(data?: string) {
  if (!data) return "Data não informada";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${data}T12:00:00`));
}

export function Home() {
    const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [materiaSelecionada, setMateriaSelecionada] =
    useState<Subject | "ALL">("ALL");

  const postsFiltrados = useMemo(() => {
    const textoBusca = busca.toLowerCase().trim();

    return postsExemplo.filter((post) => {
      const pertenceAMateria =
        materiaSelecionada === "ALL" || post.subject === materiaSelecionada;

      const correspondeABusca =
        !textoBusca ||
        post.title.toLowerCase().includes(textoBusca) ||
        post.summary?.toLowerCase().includes(textoBusca) ||
        post.content.toLowerCase().includes(textoBusca);

      return pertenceAMateria && correspondeABusca;
    });
  }, [busca, materiaSelecionada]);

  return (
    <div className="feed-page">
      <header className="feed-header">
        <div className="feed-header-content">
          <a className="brand" href="/">
            <span className="brand-icon">🎓</span>
            <span>Portal Escolar</span>
          </a>

          <nav className="feed-nav" aria-label="Menu principal">
            <a className="active" href="/">
              Início
            </a>
            <a href="#materias">Matérias</a>
            <a href="#avisos">Avisos</a>
          </nav>

          <a className="login-link" href="/login">
            Área do professor
          </a>
        </div>
      </header>

      <main className="feed-container">
        <section className="feed-content">
          <div className="feed-hero">
            <p className="eyebrow">BLOG ESCOLAR</p>
            <h1>Fique por dentro das novidades</h1>
            <p>
              Conteúdos, avisos e materiais preparados pelos professores para
              apoiar seus estudos.
            </p>
          </div>

          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Pesquisar publicações..."
              aria-label="Pesquisar publicações"
            />
          </label>

          <section id="materias" className="filter-section">
            <div>
              <h2>Publicações recentes</h2>
              <p>
                {postsFiltrados.length} publicação(ões) encontrada(s)
              </p>
            </div>

            <div className="filters" aria-label="Filtrar por matéria">
              {materias.map((materia) => (
                <button
                  key={materia.value}
                  type="button"
                  className={
                    materiaSelecionada === materia.value ? "selected" : ""
                  }
                  onClick={() => setMateriaSelecionada(materia.value)}
                >
                  {materia.label}
                </button>
              ))}
            </div>
          </section>

          <div className="posts-list">
            {postsFiltrados.map((post) => (
              <article className="post-card" key={post.id}>
                <div className="post-card-top">
                  <span className="subject-tag">
                    {traduzirMateria(post.subject)}
                  </span>
                  <time>{formatarData(post.createdAt)}</time>
                </div>

                <h2>{post.title}</h2>
                <p>{post.summary || post.content}</p>

                <div className="post-card-footer">
                  <span>
                    Por {post.author?.name || "Professor(a) responsável"}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    Ler publicação →
                  </button>
                </div>
              </article>
            ))}
          </div>

          {postsFiltrados.length === 0 && (
            <div className="empty-state">
              <span>🔎</span>
              <h2>Nenhuma publicação encontrada</h2>
              <p>Tente pesquisar outro termo ou selecione outra matéria.</p>
              <button
                type="button"
                onClick={() => {
                  setBusca("");
                  setMateriaSelecionada("ALL");
                }}
              >
                Limpar filtros
              </button>
            </div>
          )}
        </section>

        <aside className="sidebar">
          <section className="sidebar-card" id="avisos">
            <h2>Links rápidos</h2>
            <a href="#materias">📚 Materiais de estudo</a>
            <a href="#avisos">📅 Calendário escolar</a>
            <a href="#avisos">📢 Mural de avisos</a>
          </section>

          <section className="sidebar-card highlighted">
            <p className="eyebrow">PRECISA DE AJUDA?</p>
            <h2>Converse com sua turma ou professor.</h2>
            <p>
              Fique atento às novidades publicadas no Portal Escolar.
            </p>
          </section>
        </aside>
      </main>
    </div>
  );
}
