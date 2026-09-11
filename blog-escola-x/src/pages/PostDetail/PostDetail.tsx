import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Calendar, MessageSquare, SearchX, Shield } from "lucide-react";
import { isAxiosError } from "axios";
import { getPostById, getPosts } from "../../services/posts.service";
import type { Post } from "../../types/api";
import { useAuth } from "../../contexts/AuthContext";
import { getPostImageUrl } from "../../utils/imageUrl";
import { Footer } from "../../components/Footer/Footer";
import * as S from "./PostDetail.styles";

// ─── Helpers ────────────────────────────────────────────────────────────────

const SUBJECT_MAP: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  MATHEMATICS: { label: "Matemática", color: "#7c3aed", bg: "#f3e8ff" },
  PORTUGUESE: { label: "Português", color: "#0369a1", bg: "#e0f2fe" },
  HISTORY: { label: "História", color: "#b45309", bg: "#fef3c7" },
  GEOGRAPHY: { label: "Geografia", color: "#15803d", bg: "#dcfce7" },
  BIOLOGY: { label: "Biologia", color: "#059669", bg: "#d1fae5" },
  PHYSICS: { label: "Física", color: "#2563eb", bg: "#dbeafe" },
  CHEMISTRY: { label: "Química", color: "#d97706", bg: "#fef3c7" },
  ENGLISH: { label: "Inglês", color: "#4f46e5", bg: "#e0e7ff" },
  PHILOSOPHY: { label: "Filosofia", color: "#9333ea", bg: "#f3e8ff" },
  SOCIOLOGY: { label: "Sociologia", color: "#ea580c", bg: "#ffedd5" },
  PHYSICAL_EDUCATION: { label: "Educação Física", color: "#16a34a", bg: "#dcfce7" },
  ARTS: { label: "Artes", color: "#db2777", bg: "#fce7f3" },
};

function subjectInfo(subject: string) {
  return (
    SUBJECT_MAP[subject] ?? { label: subject, color: "#64748b", bg: "#f1f5f9" }
  );
}

function readingTime(content: string): number {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

function formatLongDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

function formatShortDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(dateStr));
}

function formatRelatedDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(dateStr));
}

function initials(name?: string): string {
  if (!name) return "?";
  const words = name.trim().split(/\s+/);
  return (words[0][0] + (words[words.length - 1][0] ?? ""))
    .toUpperCase()
    .slice(0, 2);
}


// ─── Componente ───────────────────────────────────────────────────────────────

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coverError, setCoverError] = useState(false);
  const [loadedPostId, setLoadedPostId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const postId = id;
    let cancelled = false;

    async function loadPost() {
      setIsLoading(true);
      setError(null);
      setRelated([]);
      setCoverError(false);

      try {
        const data = await getPostById(postId);
        if (cancelled) return;

        setPost(data);
        setLoadedPostId(postId);

        const result = await getPosts(1, 10);
        if (cancelled) return;

        const others = result.post
          .filter((p) => p.id !== data.id && !p.isDeleted)
          .sort((a) => (a.subject === data.subject ? -1 : 1))
          .slice(0, 3);
        setRelated(others);
      } catch (err) {
        if (isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
          navigate("/login", { replace: true });
          return;
        }
        if (!cancelled) {
          setError(
            "Ops! O post que você procura não está disponível ou não existe. Que tal voltar ao feed e explorar outras publicações?"
          );
          setLoadedPostId(postId);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadPost();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ── Loading / Error ──────────────────────────────────────────────────────

  if (isLoading || loadedPostId !== id) {
    return (
      <S.Page>
        <S.Container>
          <S.StateMsg>Carregando publicação...</S.StateMsg>
        </S.Container>
      </S.Page>
    );
  }

  if (error || !post) {
    return (
      <S.Page>
        <S.Container>
          <S.ErrorWrapper>
            <S.ErrorCard>
              <S.ErrorIconCircle>
                <SearchX size={36} color="var(--color-primary)" strokeWidth={1.5} />
              </S.ErrorIconCircle>
              <S.ErrorTitle>Publicação não encontrada</S.ErrorTitle>
              <S.ErrorDescription>
                O post que você procura não está disponível ou não existe.
                Ele pode ter sido removido ou o link pode estar incorreto.
              </S.ErrorDescription>
              <S.ErrorBtn to="/">
                <ArrowLeft size={16} />
                Voltar para o feed
              </S.ErrorBtn>
            </S.ErrorCard>
          </S.ErrorWrapper>
        </S.Container>
      </S.Page>
    );
  }

  // ── Derivações ────────────────────────────────────────────────────────────

  const subject = subjectInfo(post.subject);
  const minutes = readingTime(post.content);
  const paragraphs = post.content.split(/\n+/).filter(Boolean);
  const authorName =
    post.author?.name ||
    (user && String(user.id) === String(post.authorId) ? user.name : undefined) ||
    "Professor(a)";
  const authorRole = "Professor(a)";

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <S.Page>
      <S.Container>
        <S.BackButton onClick={() => navigate(-1)}>← Voltar</S.BackButton>

        <S.Grid>
          {/* ════ Artigo ════ */}
          <S.Article>
            {/* Categoria + tempo de leitura */}
            <S.MetaRow>
              <S.Badge style={{ color: subject.color, background: subject.bg }}>
                {subject.label}
              </S.Badge>
              <S.ReadingTime>
                <BookOpen size={13} strokeWidth={2} />
                {minutes} min de leitura
              </S.ReadingTime>
            </S.MetaRow>

            {/* Título */}
            <S.Title>{post.title}</S.Title>

            {/* Linha do autor */}
            <S.AuthorRow>
              <S.Avatar $size="sm">{initials(authorName)}</S.Avatar>
              <S.AuthorMeta>
                <strong>{authorName}</strong>
                <span>{subject.label}</span>
              </S.AuthorMeta>
              {post.createdAt && (
                <S.PubDate>
                  Publicado em {formatLongDate(post.createdAt)}
                </S.PubDate>
              )}
            </S.AuthorRow>

            {/* Imagem de capa */}
            {(() => {
              const coverUrl = getPostImageUrl(post);
              if (!coverUrl || coverError) return null;
              return (
                <S.Cover>
                  <img
                    src={coverUrl}
                    alt={post.title}
                    onError={() => {
                      console.error("Erro ao carregar imagem de capa:", coverUrl);
                      setCoverError(true);
                    }}
                  />
                </S.Cover>
              );
            })()}

            {/* Corpo do texto */}
            <S.Body>
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </S.Body>

            {/* Tag matéria */}
            <S.SubjectRow>
              <S.SubjectLabel>Matéria:</S.SubjectLabel>
              <S.SubjectValue style={{ color: subject.color }}>
                {subject.label}
              </S.SubjectValue>
            </S.SubjectRow>

            {/* Callout — Saiba mais */}
            {post.link && (
              <S.Callout>
                <S.CalloutTitle>Saiba mais</S.CalloutTitle>
                <S.CalloutLink
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Acesse o site oficial para ver mais detalhes →
                </S.CalloutLink>
              </S.Callout>
            )}

            {/* Timestamps */}
            {(post.createdAt || post.updatedAt) && (
              <S.Timestamps>
                {post.createdAt && (
                  <span>Criado em: {formatShortDate(post.createdAt)}</span>
                )}
                {post.updatedAt && post.updatedAt !== post.createdAt && (
                  <span>
                    {" "}
                    • Atualizado em: {formatShortDate(post.updatedAt)}
                  </span>
                )}
              </S.Timestamps>
            )}

            {/* Card do autor */}
            <S.AuthorCard>
              <S.Avatar $size="lg">{initials(authorName)}</S.Avatar>
              <S.AuthorCardBody>
                <S.AuthorCardName>{authorName}</S.AuthorCardName>
                <S.AuthorCardRole style={{ color: subject.color }}>
                  {authorRole} de {subject.label} •{" "}
                  <span style={{ color: subject.color }}>
                    Corpo Docente
                  </span>
                </S.AuthorCardRole>
                <S.AuthorCardBio>
                  Entusiasta de metodologias ativas e projetos educacionais.
                  Acredita que a melhor forma de aprender é colocando a mão na
                  massa e desenvolvendo soluções criativas.
                </S.AuthorCardBio>
              </S.AuthorCardBody>
            </S.AuthorCard>
          </S.Article>

          {/* ════ Sidebar ════ */}
          <S.Sidebar>
            {/* Posts relacionados */}
            <S.SidebarCard>
              <h3>Posts Relacionados</h3>
              {related.length === 0 ? (
                <S.SidebarEmpty>Nenhum post encontrado.</S.SidebarEmpty>
              ) : (
                <S.RelatedList>
                  {related.map((rp) => {
                    const rs = subjectInfo(rp.subject);
                    const relCoverUrl = getPostImageUrl(rp);
                    return (
                      <S.RelatedItem key={rp.id}>
                        <S.RelatedLink to={`/post/${rp.id}`}>
                          <S.RelatedThumb>
                            {relCoverUrl ? (
                              <img
                                src={relCoverUrl}
                                alt={rp.title}
                                onError={(e) => {
                                  const t = e.currentTarget.parentElement;
                                  if (t) {
                                    t.innerHTML = `<div style="width:100%;height:100%;display:grid;place-items:center;background:${rs.bg};font-weight:700;font-size:1.1rem;color:${rs.color}">${rs.label.charAt(0)}</div>`;
                                  }
                                }}
                              />
                            ) : (
                              <S.RelatedThumbBg style={{ background: rs.bg }}>
                                <span style={{ color: rs.color }}>
                                  {rs.label.charAt(0)}
                                </span>
                              </S.RelatedThumbBg>
                            )}
                          </S.RelatedThumb>
                          <S.RelatedText>
                            <S.RelatedTop>
                              <S.BadgeXs
                                style={{ color: rs.color, background: rs.bg }}
                              >
                                {rs.label}
                              </S.BadgeXs>
                              {rp.createdAt && (
                                <S.RelatedDate>
                                  {formatRelatedDate(rp.createdAt)}
                                </S.RelatedDate>
                              )}
                            </S.RelatedTop>
                            <S.RelatedTitle>{rp.title}</S.RelatedTitle>
                          </S.RelatedText>
                        </S.RelatedLink>
                      </S.RelatedItem>
                    );
                  })}
                </S.RelatedList>
              )}
            </S.SidebarCard>

            {/* Espaço Seguro */}
            <S.SidebarCard>
              <S.SafeHeader>
                <Shield size={15} color="var(--color-primary)" />
                <h3>Espaço Seguro &amp; Moderado</h3>
              </S.SafeHeader>
              <S.SafeDesc>
                Todos os comentários e publicações passam por moderação da
                equipe pedagógica para garantir um ambiente saudável.
              </S.SafeDesc>
            </S.SidebarCard>

            {/* Links úteis */}
            <S.SidebarCard>
              <h3>Links Úteis</h3>
              <S.LinksList>
                <li>
                  <BookOpen size={14} color="var(--color-text-secondary)" />
                  <S.UsefulLink href="#">Diretrizes do Blog</S.UsefulLink>
                </li>
                <li>
                  <Calendar size={14} color="var(--color-text-secondary)" />
                  <S.UsefulLink href="#">Calendário Escolar 2026</S.UsefulLink>
                </li>
                <li>
                  <MessageSquare
                    size={14}
                    color="var(--color-text-secondary)"
                  />
                  <S.UsefulLink href="#">Fale com a Coordenação</S.UsefulLink>
                </li>
              </S.LinksList>
            </S.SidebarCard>
          </S.Sidebar>
        </S.Grid>
      </S.Container>
      <Footer />
    </S.Page>
  );
}