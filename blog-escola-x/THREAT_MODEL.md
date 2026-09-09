# Modelo de Ameaça — Blog Escola X (Frontend)

Este documento descreve o modelo de ameaça do frontend e as decisões de segurança tomadas na aplicação.

## Princípios de Segurança

### 1. O frontend NÃO é uma fronteira de segurança

Todas as verificações de autorização no frontend (papel do usuário, propriedade de posts, proteção de rotas) servem **exclusivamente como otimização de UX** — para esconder botões, redirecionar páginas e melhorar a experiência do usuário. Elas **não impedem** acesso não autorizado.

A fronteira de segurança real é o **backend**, que deve:

- Validar a assinatura do JWT em cada requisição
- Derivar a identidade do usuário (`authorId`) a partir das claims verificadas do token
- Verificar o papel do usuário para cada operação que exige autorização
- Verificar a propriedade do recurso antes de permitir edição/exclusão

### 2. Dados do JWT são hints visuais

O frontend decodifica o payload do JWT com `atob()` para extrair `id`, `email`, `role` e `name`. Esta decodificação:

- **NÃO valida a assinatura** do token
- Serve apenas para personalizar a interface (exibir nome, mostrar/esconder botões)
- Pode ser manipulada pelo usuário no navegador
- Inclui verificação de expiração (`exp`) como conveniência, não como segurança

### 3. `authorId` não é enviado pelo cliente

O frontend **não envia** `authorId` no corpo das requisições de criação/edição de posts. O backend deve derivar o autor a partir do JWT presente no header `Authorization`.

## Superfícies de Ataque Conhecidas

### Armazenamento de Token em `localStorage`

| Aspecto       | Detalhe                                                                 |
|---------------|-------------------------------------------------------------------------|
| **Risco**     | Tokens em `localStorage` são acessíveis via JavaScript (vulnerável a XSS) |
| **Mitigação** | CSP headers, sanitização de entrada, escape de saída                    |
| **Futuro**    | Avaliar migração para cookies `HttpOnly` + `SameSite=Strict`           |

> **Nota:** A migração para cookies `HttpOnly` requer alterações no backend (setar o cookie na resposta de login, aceitar credenciais via cookie, configurar CORS com `credentials: true`).

### Manipulação de `localStorage`

| Aspecto       | Detalhe                                                                 |
|---------------|-------------------------------------------------------------------------|
| **Risco**     | Usuário pode alterar dados no `localStorage` para mudar a UI           |
| **Mitigação** | Dados do usuário são derivados do token (não armazenados separadamente) |
| **Backend**   | Deve ignorar qualquer dado vindo do corpo da requisição que deveria ser derivado do JWT |

### Verificações Client-Side

| Componente          | Tipo de Verificação        | Finalidade      |
|---------------------|----------------------------|-----------------|
| `ProtectedRoute`    | Papel (`allowedRoles`)     | UX only         |
| `TeacherDashboard`  | Propriedade (`isOwnPost`)  | UX only         |
| `Header`            | Autenticação + papel       | UX only         |
| `PostForm`          | Rota protegida por papel   | UX only         |

## Recomendações Futuras

1. **Content Security Policy (CSP):** Configurar headers CSP para mitigar XSS
2. **Cookie HttpOnly:** Migrar armazenamento de token para cookies `HttpOnly` + `SameSite=Strict` (requer backend)
3. **Rate Limiting:** Implementar no backend para prevenir brute force
4. **Sanitização de Conteúdo:** Sanitizar HTML/markdown em posts para prevenir XSS persistente
5. **Audit Logging:** Registrar tentativas de acesso não autorizado no backend
6. **CORS Restritivo:** Configurar CORS no backend para aceitar apenas origens confiáveis

## Referência

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- CR-04: Autorização de papel e identidade são confiadas ao cliente
