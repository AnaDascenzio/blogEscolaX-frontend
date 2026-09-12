import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../services/posts.service";
import { SUBJECT_LABELS } from "../../types/api";
import { Footer } from "../../components/Footer/Footer";
import { useAuth } from "../../contexts/AuthContext";
import { isAxiosError } from "axios";
import type { Post } from "../../types/api";
import * as S from "./Home.styles";

export function Home() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubject, setActiveSubject] = useState("ALL");

  const LIMIT = 6;
  const totalPages = Math.ceil(total / LIMIT) || 1;

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      setError(null);

      try {
        const resposta = await getPosts(page, LIMIT);
        setPosts(resposta.post);
        setTotal(resposta.total);
      } catch (err) {
        if (
          isAxiosError(err) &&
          (err.response?.status === 401 || err.response?.status === 403)
        ) {
          signOut();
          navigate("/login", { replace: true });
          return;
        }
        setError(
          "Não foi possível carregar as publicações. Verifique se a API está disponível."
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadPosts();
  }, [page, navigate, signOut]);

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

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
    <S.Page>
      <S.Container>
        <S.SearchInput
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar posts por palavra-chave ou autor..."
        />

        <S.FilterGroup>
          <S.FilterButton
            type="button"
            onClick={() => {
              setActiveSubject("ALL");
              setPage(1);
            }}
            $active={activeSubject === "ALL"}
          >
            Todos
          </S.FilterButton>

          {availableSubjects.map((subject) => (
            <S.FilterButton
              type="button"
              key={subject}
              onClick={() => {
                setActiveSubject(subject);
                setPage(1);
              }}
              $active={activeSubject === subject}
            >
              {SUBJECT_LABELS[subject] ?? subject}
            </S.FilterButton>
          ))}
        </S.FilterGroup>

        <S.MainGrid>
          <S.PostsSection>
            {isLoading && (
              <S.StatusCard>Carregando publicações...</S.StatusCard>
            )}

            {error && (
              <S.ErrorCard>
                <p>{error}</p>
              </S.ErrorCard>
            )}

            {!isLoading && !error && visiblePosts.length === 0 && (
              <S.StatusCard>Nenhuma publicação encontrada.</S.StatusCard>
            )}

            {!isLoading &&
              !error &&
              visiblePosts.map((post) => (
                <S.PostCard key={post.id}>
                  <S.PostHeader>
                    <S.SubjectBadge>
                      {SUBJECT_LABELS[post.subject] ?? post.subject}
                    </S.SubjectBadge>

                    {post.createdAt && (
                      <S.PostDate>
                        {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                      </S.PostDate>
                    )}
                  </S.PostHeader>

                  <S.PostTitle onClick={() => navigate(`/post/${post.id}`)}>
                    {post.title}
                  </S.PostTitle>

                  <S.PostSummary>
                    {post.summary ?? post.content.slice(0, 120)}
                  </S.PostSummary>

                  <S.PostFooter>
                    <S.PostAuthor>
                      {post.author?.name ?? "Professor(a) responsável"}
                    </S.PostAuthor>

                    <S.ReadMoreButton
                      type="button"
                      onClick={() => navigate(`/post/${post.id}`)}
                    >
                      Ler post completo →
                    </S.ReadMoreButton>
                  </S.PostFooter>
                </S.PostCard>
              ))}

           {!error && totalPages > 1 && (
          <S.PaginationContainer>
            <S.PaginationButton
              type="button"
              onClick={handlePrevPage}
              disabled={isLoading || page === 1}
            >
              Anterior
            </S.PaginationButton>

            <span>
              Página <strong>{page}</strong> de <strong>{totalPages}</strong>
            </span>

            <S.PaginationButton
              type="button"
              onClick={handleNextPage}
              disabled={isLoading || page >= totalPages}
            >
              Próxima
            </S.PaginationButton>
          </S.PaginationContainer>
        )}
          </S.PostsSection>

          <S.Sidebar>
            <S.WelcomeCard>
              <strong>Bem-vindo(a) ao Portal do Aluno!</strong>
              <p>
                Acompanhe conteúdos, materiais e avisos publicados pelos seus
                professores.
              </p>
            </S.WelcomeCard>

            <S.SafeSpaceCard>
              <strong>Espaço Seguro & Moderado</strong>
              <p>
                As publicações são organizadas pela equipe pedagógica para
                manter um ambiente saudável de aprendizagem.
              </p>
            </S.SafeSpaceCard>
          </S.Sidebar>
        </S.MainGrid>
      </S.Container>
      <Footer />
    </S.Page>
  );
}