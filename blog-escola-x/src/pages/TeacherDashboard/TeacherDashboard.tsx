import { useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { getPosts, deletePost } from "../../services/posts.service";
import { Header } from "../../components/Header/Header";
import type { Post } from "../../types/api";
import { Footer } from "../../components/Footer/Footer";
import * as S from "./TeacherDashboard.styles";

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

  // Verificação visual apenas — a autorização real é imposta pelo backend
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
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 403) {
        dispatch({ type: "DELETE_ERROR", payload: "Você não tem permissão para excluir esta publicação." });
      } else {
        dispatch({ type: "DELETE_ERROR", payload: "Não foi possível excluir a publicação." });
      }
    }
  }

  if (isLoading) {
    return (
      <S.Loading>Carregando painel...</S.Loading>
    );
  }

  return (
    <S.Page>
      <S.Container>
        <Header showNewPost />

 
        <S.Search
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar posts por palavra-chave ou autor..."
        />

        <S.Filters>
          <S.Filter
            onClick={() => setActiveSubject("ALL")}
            $active={activeSubject === "ALL"}
          >
            Todos
          </S.Filter>
          {availableSubjects.map((subject) => (
            <S.Filter
              key={subject}
              onClick={() => setActiveSubject(subject)}
              $active={activeSubject === subject}
            >
              {SUBJECT_LABELS[subject] ?? subject}
            </S.Filter>
          ))}
        </S.Filters>

        {error && (
          <S.ErrorMessage>{error}</S.ErrorMessage>
        )}

        {/* Layout de duas colunas: feed + sidebar */}
        <S.Grid>
          <S.PostList>
            {visiblePosts.length === 0 && (
              <S.Empty>
                Nenhuma publicação encontrada.
              </S.Empty>
            )}
            {visiblePosts.map((post) => {
              {/* Verificação visual apenas — a autorização real é imposta pelo backend */}
              const isOwnPost = String(post.authorId) === String(user?.id);
              return (
                <S.Post key={post.id}>
                  <S.PostMeta>
                    <S.Subject>
                      {SUBJECT_LABELS[post.subject] ?? post.subject}
                    </S.Subject>
                    {post.createdAt && (
                      <S.DateText>
                        {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                      </S.DateText>
                    )}
                  </S.PostMeta>
                  <S.Title
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    {post.title}
                  </S.Title>
                  <S.Summary>
                    {post.summary ?? post.content.slice(0, 120)}
                  </S.Summary>
                  <S.PostFooter>
                    <span>
                      {post.author?.name ?? "Autor desconhecido"}
                      {isOwnPost && " (Você)"}
                    </span>
                    {isOwnPost ? (
                      <S.Actions>
                        <S.Action
                          onClick={() => navigate(`/post/editar/${post.id}`)}
                        >
                          Editar
                        </S.Action>
                        <S.Action
                          onClick={() => handleDelete(post.id)}
                          disabled={String(deletingId) === String(post.id)}
                          $danger
                        >
                          {String(deletingId) === String(post.id) ? "Excluindo..." : "Excluir"}
                        </S.Action>
                      </S.Actions>
                    ) : (
                      <S.Action
                        onClick={() => navigate(`/post/${post.id}`)}
                        $link
                      >
                        Ler post completo →
                      </S.Action>
                    )}
                  </S.PostFooter>
                </S.Post>
              );
            })}
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
              <p>Posts publicados</p>
            </S.InfoCard>
          </S.Sidebar>
        </S.Grid>
        <Footer />
      </S.Container>
    </S.Page>
  );
}