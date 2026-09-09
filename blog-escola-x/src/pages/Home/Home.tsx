import { useEffect, useState } from "react";
import { getPosts } from "../../services/posts.service";
import type { Post } from "../../types/api";
import { Button } from "../../components/Button/Button";

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const result = await getPosts();
        setPosts(result.post);
        setTotal(result.total);
      } catch {
        setErrorMessage("Não foi possível carregar as publicações. Verifique se o backend está rodando.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadPosts();
  }, []);

  return (
    <main className="api-test-page">
      <header className="api-test-header">
        <div>
          <p className="eyebrow">Integração com backend</p>
          <h1>Publicações escolares</h1>
          <p>Teste de retorno do endpoint <strong>GET /posts</strong>.</p>
        </div>
        {!isLoading && !errorMessage && <strong>{total} publicação(ões)</strong>}
      </header>

      {isLoading && <p className="api-test-feedback">Carregando publicações...</p>}
      {errorMessage && <p className="api-test-feedback api-test-error">{errorMessage}</p>}
      {!isLoading && !errorMessage && posts.length === 0 && (
        <p className="api-test-feedback">A API respondeu corretamente, mas não há publicações cadastradas.</p>
      )}

      <div className="api-test-list">
        {posts.map((post) => (
          <article className="api-test-card" key={post.id}>
            <span>{post.subject}</span>
            <h2>{post.title}</h2>
            <p>{post.summary || post.content}</p>
            <small>ID: {post.id} | Autor: {post.author?.name || post.authorId}</small>
          </article>
        ))}
      </div>
      <Button onClick={() => window.location.reload()} disabled={isLoading}>
        Recarregar publicações
      </Button>
    </main>
  );
}