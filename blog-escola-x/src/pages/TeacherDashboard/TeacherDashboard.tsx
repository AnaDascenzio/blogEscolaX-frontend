import { useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getPosts, deletePost } from "../../services/posts.service";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { Button } from "../../components/Button/Button";
import * as S from "./TeacherDashboard.styles";
import { SUBJECT_LABELS } from "../../types/api";
import type { Post } from "../../types/api";

const SUBJECT_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  MATHEMATICS: { label: "Matemática", bg: "#f3e8ff", color: "#7c3aed" },
  PORTUGUESE: { label: "Português", bg: "#e0f2fe", color: "#0284c7" },
  SCIENCE: { label: "Ciências", bg: "#ccfbf1", color: "#0d9488" },
  HISTORY: { label: "História", bg: "#fef3c7", color: "#d97706" },
  GEOGRAPHY: { label: "Geografia", bg: "#dcfce7", color: "#16a34a" },
  ACADEMIC: { label: "Acadêmico", bg: "#eff6ff", color: "#2563eb" },
  SPORTS: { label: "Esportes", bg: "#dcfce7", color: "#16a34a" },
  Acadêmico: { label: "Acadêmico", bg: "#eff6ff", color: "#2563eb" },
  Esportes: { label: "Esportes", bg: "#dcfce7", color: "#16a34a" },
  Ciências: { label: "Ciências", bg: "#ccfbf1", color: "#0d9488" },
  Matemática: { label: "Matemática", bg: "#f3e8ff", color: "#7c3aed" },
  Português: { label: "Português", bg: "#e0f2fe", color: "#0284c7" },
  História: { label: "História", bg: "#fef3c7", color: "#d97706" },
  Geografia: { label: "Geografia", bg: "#dcfce7", color: "#16a34a" },
};

function getSubjectBadge(subject: string) {
  return (
    SUBJECT_CONFIG[subject] ?? {
      label: SUBJECT_LABELS[subject] ?? subject,
      bg: "#eff6ff",
      color: "#2563eb",
    }
  );
}

function formatCardDate(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const hasTime = dateStr.includes("T") || dateStr.includes(":");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const time = `${hours}:${minutes}`;

  if (isToday) return hasTime ? `Hoje às ${time}` : "Hoje";
  if (isYesterday) return hasTime ? `Ontem às ${time}` : "Ontem";

  return hasTime
    ? `${date.toLocaleDateString("pt-BR")} às ${time}`
    : date.toLocaleDateString("pt-BR");
}

function getReadingTime(content?: string): number {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function getInitials(name?: string): string {
  if (!name) return "?";
  const words = name.trim().split(/\s+/);
  return (words[0][0] + (words[words.length - 1]?.[0] ?? "")).toUpperCase().slice(0, 2);
}

interface State {
  posts: Post[];
  total: number;
  isLoading: boolean;
  error: string | null;
  deletingId: string | null;
}

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: { post: Post[]; total: number } }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "DELETE_START"; payload: string }
  | { type: "DELETE_SUCCESS"; payload: string }
  | { type: "DELETE_ERROR"; payload: string };

const initialState: State = {
  posts: [],
  total: 0,
  isLoading: true,
  error: null,
  deletingId: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        posts: action.payload.post,
        total: action.payload.total,
      };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "DELETE_START":
      return { ...state, deletingId: action.payload };
    case "DELETE_SUCCESS":
      return {
        ...state,
        deletingId: null,
        posts: state.posts.filter((p) => String(p.id) !== String(action.payload)),
        total: Math.max(0, state.total - 1),
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
  const { posts, total, isLoading, error, deletingId } = state;

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubject, setActiveSubject] = useState<string>("ALL");

  const LIMIT = 6;

  useEffect(() => {
    async function loadPosts() {
      dispatch({ type: "FETCH_START" });
      try {
        const response = await getPosts(page, LIMIT);
        dispatch({ type: "FETCH_SUCCESS", payload: response });
      } catch {
        dispatch({
          type: "FETCH_ERROR",
          payload: "Não foi possível carregar as publicações.",
        });
      }
    }

    void loadPosts();
  }, [page]);

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

  const totalPages = Math.ceil(total / LIMIT) || 1;

  const handleSubjectChange = (subject: string) => {
    setActiveSubject(subject);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta publicação?")) return;
    dispatch({ type: "DELETE_START", payload: id });
    try {
      await deletePost(id);
      dispatch({ type: "DELETE_SUCCESS", payload: id });
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 403) {
        dispatch({
          type: "DELETE_ERROR",
          payload: "Você não tem permissão para excluir esta publicação.",
        });
      } else {
        dispatch({
          type: "DELETE_ERROR",
          payload: "Não foi possível excluir a publicação.",
        });
      }
    }
  }

  if (isLoading && posts.length === 0) {
    return <S.Loading>Carregando painel...</S.Loading>;
  }

  return (
    <S.Page>
      <S.Container>
        <Header showNewPost />

        <S.Search
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Buscar posts por palavra-chave ou autor..."
        />

        <S.Filters>
          <S.Filter
            onClick={() => handleSubjectChange("ALL")}
            $active={activeSubject === "ALL"}
          >
            Todos
          </S.Filter>
          {availableSubjects.map((subject) => (
            <S.Filter
              key={subject}
              onClick={() => handleSubjectChange(subject)}
              $active={activeSubject === subject}
            >
              {SUBJECT_LABELS[subject] ?? subject}
            </S.Filter>
          ))}
        </S.Filters>

        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

        <S.Grid>
          <S.PostList>
            {visiblePosts.length === 0 && (
              <S.Empty>Nenhuma publicação encontrada.</S.Empty>
            )}
            {visiblePosts.map((post) => {
              const isOwnPost = String(post.authorId) === String(user?.id);
              const badge = getSubjectBadge(post.subject);
              const authorName = post.author?.name ?? "Autor desconhecido";
              const authorSubtitle =
                SUBJECT_LABELS[post.subject] ??
                (post.author?.role === "TEACHER" ? "Professor(a)" : "Estudante");
              const readingTime = getReadingTime(post.content);
              const formattedDate = formatCardDate(post.createdAt);

              return (
                <S.Post key={post.id}>
                  <S.PostMeta>
                    <S.SubjectBadge $bg={badge.bg} $color={badge.color}>
                      {badge.label}
                    </S.SubjectBadge>
                    {formattedDate && <S.DateText>{formattedDate}</S.DateText>}
                  </S.PostMeta>

                  <S.Title onClick={() => navigate(`/post/${post.id}`)}>
                    {post.title}
                  </S.Title>

                  <S.Summary>
                    {post.summary ?? post.content.slice(0, 160)}
                  </S.Summary>

                  <S.PostFooter>
                    <S.AuthorContainer>
                      <S.AuthorAvatar>{getInitials(authorName)}</S.AuthorAvatar>
                      <S.AuthorInfo>
                        <S.AuthorName>
                          {authorName}
                          {isOwnPost && " (Você)"}
                        </S.AuthorName>
                        <S.AuthorSubtitle>{authorSubtitle}</S.AuthorSubtitle>
                      </S.AuthorInfo>
                    </S.AuthorContainer>

                    {isOwnPost ? (
                      <S.Actions>
                        <S.EditButton
                          type="button"
                          onClick={() => navigate(`/post/editar/${post.id}`)}
                        >
                          <Pencil size={15} />
                          <span>Editar</span>
                        </S.EditButton>
                        <S.DeleteButton
                          type="button"
                          onClick={() => handleDelete(post.id)}
                          disabled={String(deletingId) === String(post.id)}
                        >
                          <Trash2 size={15} />
                          <span>
                            {String(deletingId) === String(post.id)
                              ? "Excluindo..."
                              : "Excluir"}
                          </span>
                        </S.DeleteButton>
                      </S.Actions>
                    ) : (
                      <S.ReadMoreSection>
                        <S.ReadingTime>{readingTime} min de leitura</S.ReadingTime>
                        <S.Separator>|</S.Separator>
                        <S.ReadMoreButton
                          type="button"
                          onClick={() => navigate(`/post/${post.id}`)}
                        >
                          <span>Ler post completo</span>
                          <ArrowRight size={16} />
                        </S.ReadMoreButton>
                      </S.ReadMoreSection>
                    )}
                  </S.PostFooter>
                </S.Post>
              );
            })}

            {/* Controles de Paginação */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "16px",
                  marginTop: "24px",
                }}
              >
                <Button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1 || isLoading}
                >
                  Anterior
                </Button>
                <span>
                  Página {page} de {totalPages}
                </span>
                <Button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page >= totalPages || isLoading}
                >
                  Próxima
                </Button>
              </div>
            )}
          </S.PostList>

          <S.Sidebar>
            <S.Welcome>
              <p>Bem-vindo(a), {user?.name ?? "Professor(a)"}!</p>
              <p>
                Gerencie suas publicações, compartilhe conhecimento e inspire seus alunos.
              </p>
            </S.Welcome>
            <S.InfoCard>
              <p>Espaço Seguro & Moderado</p>
              <p>
                Todos os comentários e publicações passam pela moderação da equipe pedagógica
                para garantir um ambiente saudável.
              </p>
            </S.InfoCard>
            <S.InfoCard>
              <p>Suas publicações</p>
              <S.Count>{myPostsCount}</S.Count>
              <p>Posts nesta página</p>
            </S.InfoCard>
          </S.Sidebar>
        </S.Grid>
        <Footer />
      </S.Container>
    </S.Page>
  );
}