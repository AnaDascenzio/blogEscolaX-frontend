# Blog da Escola X — Frontend

Aplicação web de blogging dinâmico para a rede estadual de ensino, permitindo que professores publiquem, editem e gerenciem postagens educacionais, enquanto alunos visualizam e navegam pelos conteúdos de forma organizada e acessível.

Projeto desenvolvido como entrega do **Tech Challenge (Fase 03)** do curso de **Pós-graduação Full Stack da FIAP**, consumindo os endpoints REST implementados na Fase 02.

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
| :--- | :--- | :--- |
| **React** | 19.x | Biblioteca principal da interface |
| **TypeScript** | 6.x | Tipagem estática |
| **Vite** | 8.x | Build tool e servidor de desenvolvimento |
| **React Router DOM** | 7.x | Roteamento client-side e guarda de rotas |
| **Styled Components** | 6.x | Estilização CSS-in-JS (padrão do projeto) |
| **React Hook Form** | 7.x | Gerenciamento de formulários |
| **Zod** | 4.x | Validação de schemas de formulário |
| **Axios** | 1.x | Cliente HTTP para consumo da API REST |
| **Sonner** | 2.x | Notificações toast de sucesso e erro |
| **Lucide React** | 1.x | Coleção de ícones |
| **Vitest** | 4.x | Test runner |
| **React Testing Library** | 16.x | Testes de componentes |
| **MSW (Mock Service Worker)** | 2.x | Mock de requisições HTTP nos testes |

---

## 🏗️ Arquitetura e Estrutura de Pastas

O projeto é uma SPA organizada por responsabilidade para permitir o desenvolvimento paralelo entre os integrantes da equipe com o mínimo de conflitos:

```text
src/
├── components/   # Componentes compartilhados sem regra de negócio (Avatar, Button, Modal, etc.)
├── contexts/     # Estado global (AuthContext: sessão e autenticação JWT)
├── pages/        # Telas da aplicação (Home, Login, PostDetail, PostForm, TeacherDashboard)
├── routes/       # Composição de rotas e autorização (AppRoutes, ProtectedRoute)
├── services/     # Acesso à API via instância única do Axios (api.ts, posts.service.ts, users.service.ts)
├── styles/       # GlobalStyle, resets e variáveis de design
├── test/         # Fixtures, setup e servidores de mock (MSW)
├── types/        # Contratos TypeScript de API compartilhados
└── utils/        # Funções utilitárias (imageUrl.ts, etc.)

```


🔒 Autenticação e Segurança 

Gerenciamento de Sessão: Baseado em JWT retornado no login e armazenado em localStorage.

Derivação de Papel (Role): O papel do usuário (TEACHER ou STUDENT) é extraído exclusivamente do token a cada carregamento.

Interpretação de Expirados (401): O interceptor do Axios dispara um evento (session:expired) que desloga o usuário e redireciona
para a tela de login preservando a rota pretendida.

Validação Ativa:

O ProtectedRoute valida o token a cada navegação e sincroniza em tempo real caso o token seja alterado/removido em outra aba.Para mais detalhes, 
consulte o arquivo THREAT_MODEL.md do repositório.

🛣️ Rotas da Aplicação 

| Rota | Componente | Permissão de Acesso |
| :--- | :--- | :--- |
| `/login` | `Login` | Público |
| `/` | `Home` | Autenticado (Alunos e Professores) |
| `/post/:id` | `PostDetail` | Autenticado |
| `/post/novo` | `PostForm` | Autenticado + Papel TEACHER |
| `/post/editar/:id` | `PostForm` | Autenticado + Papel TEACHER |
| `/professor` | `TeacherDashboard` | Autenticado + Papel TEACHER |
| `*` | Redirecionamento | Redireciona para `/` |

🔌 Contrato com o Backend (blogEscolaX)
URL Base padrão: http://localhost:3000 (configurável via VITE_API_URL).

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `POST` | `/users` | Cria novo usuário |
| `GET` | `/users/email/:email` | Busca usuário por e-mail |
| `GET` | `/users/name/:name` | Busca usuário por nome |
| `GET` | `/posts` | Lista posts de forma paginada (`page` e `limit`) |
| `GET` | `/posts/:id` | Busca detalhes de uma publicação |
| `GET` | `/posts/search?keyword=` | Busca posts por palavra-chave |
| `POST` | `/posts` | Criação de publicação *(Exige JWT de Professor)* |
| `PUT` | `/posts/:id` | Edição de publicação *(Exige JWT de Professor)* |
| `DELETE` | `/posts/:id` | Exclusão de publicação / soft delete *(Exige JWT de Professor)* |

⚙️ Como Rodar o Projeto

Pré-requisitos: 

Node.js (v18 ou superior)

Backend da aplicação rodando em http://localhost:3000

### 1. Execução Local

npm install
cp .env.example .env
npm run dev

 Configurar as variáveis de ambiente
cp .env.example .env

Iniciar o servidor de desenvolvimento
npm run dev

### 2. Execução via Docker 🐳

Subir o container da aplicação
docker compose up -d --build

Parar o container
docker compose down

### 🧪 Testes

A suíte utiliza Vitest, React Testing Library e MSW, cobrindo a decodificação de tokens no AuthContext, 
as guardas de rota do ProtectedRoute, os interceptores de serviço do Axios e as telas do PostForm e TeacherDashboard.

Executar a suíte de testes uma única vez
npm test

Executar os testes em modo watch
npm run test:watch

No Windows (evita estourar workers em ambientes limitados)
npx vitest run --maxWorkers=1

### 📜 Scripts Disponíveis

| Script | Finalidade |
| :--- | :--- |
| `npm run dev` | Executa o servidor de desenvolvimento via Vite |
| `npm run build` | Executa o typecheck (`tsc -b`) e gera o build de produção |
| `npm run lint` | Executa a verificação estática de código via ESLint |
| `npm test` | Executa a suíte de testes unitários e de integração |
| `npm run preview` | Serve os arquivos estáticos do build localmente |

👥 Equipe do Projeto

Ana — Tech Lead / Core (Setup, Design System base, Roteamento e Axios)

Matheus — Auth & Perfil (Login, Gestão de JWT e Header/User Card)

Gabriel — Feed & Alunos (Feed principal, Filtros por matéria e Busca)

Wanderson — Painel do Professor (Dashboard, Métricas, Header, Paginação e ações do CRUD)

Igor — Post & Formulário (Leitura completa de posts e Formulário com upload)
