# Portal Escolar - Frontend

Frontend do Portal Escolar, desenvolvido com React, Vite e TypeScript.

## Rodando localmente

```bash
npm install
cp .env.example .env
npm run dev
```

O backend deve estar rodando em `http://localhost:3000`. Altere `VITE_API_URL` quando necessário.

## Scripts

- `npm run dev`: servidor de desenvolvimento
- `npm run build`: typecheck e build de produção
- `npm run lint`: ESLint
- `npm run preview`: serve o build localmente

## Contrato do backend

O frontend usa as rotas existentes no backend `AnaDascenzio/blogEscolaX`:

- `POST /users/signin` retorna `{ token }`.
- `GET /posts` retorna `{ post, total }` e aceita `page` e `limit`.
- `GET /posts/search?keyword=` busca publicações.
- `GET /posts/:id` busca uma publicação.
- `POST /posts`, `PUT /posts/:id` e `DELETE /posts/:id` exigem JWT de professor.

## Organização para trabalho paralelo

- `src/components`: componentes compartilhados, sem regra de negócio.
- `src/contexts`: estado global, incluindo autenticação.
- `src/services`: acesso à API; páginas não devem criar instâncias Axios.
- `src/types`: contratos compartilhados de API.
- `src/pages`: cada dev é dono da sua pasta de tela.
- `src/routes`: apenas composição de rotas e autorização.

As rotas e componentes base já estão registrados. Cada dev pode substituir o placeholder da sua rota pela página real sem alterar o cliente HTTP ou o contexto global.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
