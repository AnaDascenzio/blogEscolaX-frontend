import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ImageIcon, Link2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
  createPost,
  getPostById,
  updatePost,
} from "../../services/posts.service";
import * as S from "./PostForm.styles";

// ─── Constantes ──────────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

const SUBJECTS = [
  { value: "MATHEMATICS", label: "Matemática" },
  { value: "PORTUGUESE", label: "Português" },
  { value: "SCIENCE", label: "Ciências" },
  { value: "HISTORY", label: "História" },
  { value: "GEOGRAPHY", label: "Geografia" },
];

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
  subject: z.string().min(1, "Selecione uma matéria."),
  summary: z.string().optional(),
  content: z
    .string()
    .min(10, "O conteúdo deve ter pelo menos 10 caracteres."),
  link: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ─── Componente ───────────────────────────────────────────────────────────────

export function PostForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      subject: "",
      summary: "",
      content: "",
      link: "",
    },
  });

  // Em modo edição, busca os dados do post e preenche o formulário
  useEffect(() => {
    if (!isEditing || !id) return;

    getPostById(id)
      .then((post) => {
        reset({
          title: post.title,
          subject: post.subject,
          summary: post.summary ?? "",
          content: post.content,
          link: post.link ?? "",
        });
        if (post.imageUrl) setImagePreview(post.imageUrl);
      })
      .catch(() => {
        toast.error("Não foi possível carregar a publicação.");
      });
  }, [id, isEditing, reset]);

  // ─── Handlers de imagem ────────────────────────────────────────────────────

  const validateAndSetImage = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setImageError("Formato inválido. Use PNG, JPG ou WEBP.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setImageError("Arquivo muito grande. O limite é 5 MB.");
      return;
    }
    setImageError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetImage(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetImage(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      let data: FormData | object;

      if (imageFile) {
        const fd = new FormData();
        fd.append("title", values.title);
        fd.append("subject", values.subject);
        if (values.summary) fd.append("summary", values.summary);
        fd.append("content", values.content);
        if (values.link) fd.append("link", values.link);
        fd.append("image", imageFile);
        if (user?.id) fd.append("authorId", String(user.id));
        data = fd;
      } else {
        data = {
          title: values.title,
          subject: values.subject,
          ...(values.summary ? { summary: values.summary } : {}),
          content: values.content,
          ...(values.link ? { link: values.link } : {}),
          ...(user?.id ? { authorId: user.id } : {}),
        };
      }

      if (isEditing && id) {
        await updatePost(id, data);
        toast.success("Publicação atualizada com sucesso!");
      } else {
        await createPost(data);
        toast.success("Publicação criada com sucesso!");
      }

      navigate("/professor");
    } catch {
      toast.error("Erro ao salvar a publicação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <S.PageWrapper>
      {/* ── Conteúdo principal ── */}
      <S.Container>
        <S.Breadcrumb to="/">← Voltar para o feed</S.Breadcrumb>

        <S.Grid>
          {/* ── Formulário ── */}
          <S.FormCard>
            <S.FormHeader>
              <h1>{isEditing ? "Editar Publicação" : "Nova Publicação"}</h1>
              <p>
                Preencha os campos abaixo para compartilhar conteúdos e avisos
                com a escola.
              </p>
            </S.FormHeader>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <S.FormBody>
                {/* Título */}
                <S.Field>
                  <label htmlFor="title">
                    Título da Postagem <S.Required>*</S.Required>
                  </label>
                  <S.FieldInput
                    id="title"
                    type="text"
                    placeholder="Digite o título da sua publicação..."
                    $hasError={Boolean(errors.title)}
                    {...register("title")}
                  />
                  {errors.title && (
                    <S.ErrorMsg>{errors.title.message}</S.ErrorMsg>
                  )}
                </S.Field>

                {/* Matéria */}
                <S.Field>
                  <label htmlFor="subject">
                    Matéria / Categoria <S.Required>*</S.Required>
                  </label>
                  <S.FieldSelect
                    id="subject"
                    $hasError={Boolean(errors.subject)}
                    {...register("subject")}
                  >
                    <option value="">Selecione a matéria</option>
                    {SUBJECTS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </S.FieldSelect>
                  {errors.subject && (
                    <S.ErrorMsg>{errors.subject.message}</S.ErrorMsg>
                  )}
                </S.Field>

                {/* Resumo */}
                <S.Field>
                  <label htmlFor="summary">
                    Resumo <S.Optional>(opcional)</S.Optional>
                  </label>
                  <S.FieldTextarea
                    id="summary"
                    rows={3}
                    placeholder="Escreva um breve resumo que aparecerá no feed principal..."
                    {...register("summary")}
                  />
                  <S.Hint>
                    Recomendamos um resumo curto para atrair a atenção dos
                    leitores no mural.
                  </S.Hint>
                </S.Field>

                {/* Conteúdo */}
                <S.Field>
                  <label htmlFor="content">
                    Conteúdo da Publicação <S.Required>*</S.Required>
                  </label>
                  <S.FieldTextarea
                    id="content"
                    rows={8}
                    placeholder="Escreva o conteúdo completo aqui. Use parágrafos claros para explicar suas ideias, roteiros de aula ou detalhes do evento..."
                    $hasError={Boolean(errors.content)}
                    {...register("content")}
                  />
                  {errors.content && (
                    <S.ErrorMsg>{errors.content.message}</S.ErrorMsg>
                  )}
                </S.Field>

                {/* Imagem de Capa */}
                <S.Field>
                  <label>
                    Imagem de Capa <S.Optional>(opcional)</S.Optional>
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    hidden
                    onChange={handleFileChange}
                  />

                  {imagePreview ? (
                    <S.ImagePreview>
                      <img src={imagePreview} alt="Preview da capa" />
                      <S.RemoveImage type="button" onClick={removeImage}>
                        ✕ Remover imagem
                      </S.RemoveImage>
                    </S.ImagePreview>
                  ) : (
                    <S.Dropzone
                      $isDragOver={isDragOver}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon size={28} strokeWidth={1.5} />
                      <p>
                        <S.DropzoneLink>Clique para enviar</S.DropzoneLink> ou
                        arraste uma imagem
                      </p>
                      <small>
                        PNG, JPG ou WEBP de até 5MB (Recomendado: 1200x630px)
                      </small>
                    </S.Dropzone>
                  )}

                  {imageError && <S.ErrorMsg>{imageError}</S.ErrorMsg>}
                </S.Field>

                {/* Link Externo */}
                <S.Field>
                  <label htmlFor="link">
                    Link Externo <S.Optional>(opcional)</S.Optional>
                  </label>
                  <S.InputIconWrap>
                    <S.InputIcon>
                      <Link2 size={15} />
                    </S.InputIcon>
                    <S.FieldInput
                      id="link"
                      type="url"
                      placeholder="https://exemplo.com/detalhes-adicionais (opcional)"
                      {...register("link")}
                    />
                  </S.InputIconWrap>
                  {errors.link && (
                    <S.ErrorMsg>{errors.link.message}</S.ErrorMsg>
                  )}
                </S.Field>
              </S.FormBody>

              {/* Rodapé do formulário */}
              <S.FormFooter>
                <S.Disclaimer>
                  Ao publicar, o post ficará visível imediatamente para todos
                  os alunos e professores do Portal.
                </S.Disclaimer>
                <S.FormBtns>
                  <S.BtnCancel
                    type="button"
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </S.BtnCancel>
                  <S.BtnPublish type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Publicando..."
                      : isEditing
                        ? "Salvar Alterações"
                        : "Publicar Post"}
                  </S.BtnPublish>
                </S.FormBtns>
              </S.FormFooter>
            </form>
          </S.FormCard>

          {/* ── Sidebar ── */}
          <S.Sidebar>
            <S.SidebarCard>
              <h3>Dicas de Escrita 💡</h3>
              <S.TipsList>
                <S.TipsItem>
                  <S.TipDot />
                  <div>
                    <strong>Seja claro no título:</strong> Capte a atenção dos
                    estudantes com títulos diretos e organizados.
                  </div>
                </S.TipsItem>
                <S.TipsItem>
                  <S.TipDot />
                  <div>
                    <strong>Categorize bem:</strong> Atribuir a matéria correta
                    ajuda os alunos a filtrarem o conteúdo no feed de estudos.
                  </div>
                </S.TipsItem>
                <S.TipsItem>
                  <S.TipDot />
                  <div>
                    <strong>Linguagem acessível:</strong> Lembre-se que o
                    público-alvo principal são os alunos. Mantenha um tom
                    encorajador.
                  </div>
                </S.TipsItem>
                <S.TipsItem>
                  <S.TipDot />
                  <div>
                    <strong>Moderação ativa:</strong> Como espaço escolar,
                    garanta que todos os textos sigam o código de ética e
                    convivência.
                  </div>
                </S.TipsItem>
              </S.TipsList>
            </S.SidebarCard>

            <S.SidebarCard>
              <h3>Informações do Autor</h3>
              <S.AuthorInfo>
                <S.AuthorRow>
                  <S.AuthorLabel>Autor:</S.AuthorLabel>
                  <S.AuthorValue>{user?.name ?? "Professor"}</S.AuthorValue>
                </S.AuthorRow>
                <S.AuthorRow>
                  <S.AuthorLabel>Status:</S.AuthorLabel>
                  <S.StatusBadge>Rascunho</S.StatusBadge>
                </S.AuthorRow>
                <S.AuthorRow>
                  <S.AuthorLabel>Data de Criação:</S.AuthorLabel>
                  <S.AuthorValue>Hoje</S.AuthorValue>
                </S.AuthorRow>
              </S.AuthorInfo>
            </S.SidebarCard>
          </S.Sidebar>
        </S.Grid>
      </S.Container>

      {/* ── Rodapé da página ── */}
      <S.PageFooter>
        ◈ Portal Escolar • Espaço seguro &amp; moderado para livre expressão de
        professores e alunos
      </S.PageFooter>
    </S.PageWrapper>
  );
}
