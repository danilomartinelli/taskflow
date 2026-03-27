# Code Map

_Last updated: 2025-06-19T12:31:44.767Z_

## apps/api

### Entrypoints

- **`src/index.ts`** — Hono app principal. Monta todas as rotas via `app.route()`. Bindings: `DB` (D1), `KV`, `QUEUE` (Queue), `R2` (R2Bucket), `AI` (Ai).

### Middleware

- **`src/middleware/auth.ts`** — `bearerAuth()` do Hono. Valida token via `c.env.API_SECRET`. Retorna 401 com JSON `{error: "Unauthorized"}` se inválido.

### Services

- **`src/services/ai.ts`** — Serviço de geração de conteúdo com Cloudflare AI (modelo `@cf/meta/llama-3.1-8b-instruct`). Usa streaming via `ReadableStream`. Exporta `generateContent(env, prompt)`.
- **`src/services/documents.ts`** — CRUD completo de documentos no D1 com Drizzle ORM: `createDocument`, `getDocument`, `listDocuments`, `updateDocument`, `deleteDocument`.
- **`src/services/projects.ts`** — CRUD completo de projetos no D1: `createProject`, `getProject`, `listProjects`, `updateProject`, `deleteProject`. Inclui join com tabela `documents`.
- **`src/services/r2.ts`** — Operações no R2: `uploadFile(env, key, content, contentType)`, `getFile(env, key)`, `deleteFile(env, key)`. Chaves seguem padrão `projects/{code}/plans/{file}`.
- **`src/services/mcp.ts`** — Servidor MCP (Model Context Protocol) JSON-RPC 2.0. Tools: `list_projects`, `get_project`, `create_project`, `update_project`, `list_documents`, `get_document`, `read_file`, `write_file`, `list_directory`, `research`, `get_project_context`. Recebe POST em `/mcp` com `{jsonrpc, method, params, id}`.

### Routes

- **`src/routes/documents.ts`** — Rotas REST para documentos: `GET /documents`, `GET /documents/:id`, `POST /documents`, `PUT /documents/:id`, `DELETE /documents/:id`.
- **`src/routes/projects.ts`** — Rotas REST para projetos: `GET /projects`, `GET /projects/:id`, `POST /projects`, `PUT /projects/:id`, `DELETE /projects/:id`.

### Schema (D1 + Drizzle)

- **`packages/db/src/schema.ts`** — Tabelas: `projects` (id, code, name, description, urls, status, metadata, timestamps), `documents` (id, projectId, type, title, content, metadata, timestamps).

## apps/web (novo workspace — não existe ainda)

Não mapeado — workspace a ser criado nesta sprint (sp-018).

## packages/db

- **`src/schema.ts`** — Schema Drizzle para D1. Tabelas: `projects`, `documents`.
- **`src/index.ts`** — Re-exporta schema e tipos para consumo pelos apps.

## packages/shared

- **`src/index.ts`** — Exporta utilitários e tipos compartilhados entre apps.

## tooling/

- **`eslint/`** — Configuração ESLint compartilhada.
- **`typescript/`** — `tsconfig.json` base compartilhado.
O `code-map.md` confirma que `apps/web` ainda não existe — é o workspace a ser criado nesta sprint. Tenho tudo que preciso para gerar o PRD completo.

,
  \"dependencies\": {
    \"@fontsource/inter\": \"^5.0.0\",
    \"astro\": \"^4.0.0\",
    \"@astrojs/tailwind\": \"^5.0.0\",
    \"tailwindcss\": \"^3.4.0\"
  },
  \"devDependencies\": {
    \"@typescript-eslint/parser\": \"^7.0.0\",
    \"typescript\": \"^5.0.0\"
  }
}
```

> **Nota:** Verifique as últimas versões patch no npm antes de instalar. As versões acima são versões mínimas.

### REQ-002 — Configuração Astro [MUST]

O `astro.config.mjs` DEVE ter `output: 'static'` (modo SSG puro) e integração com Tailwind:

```js
// apps/web/astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
  site: 'https://taskflow.pages.dev', // atualizar com URL real após deploy
});
```

### REQ-003 — Configuração Tailwind [MUST]

O `tailwind.config.mjs` DEVE definir os tokens de design da paleta SSoT:

```js
// apps/web/tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0a',
        'accent-neon': '#00fa62',
        'text-muted': '#a1a1aa',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### REQ-004 — BaseLayout com Zero JavaScript [MUST]

O `BaseLayout.astro` DEVE:

1. Importar a fonte Inter: `import '@fontsource/inter/400.css'; import '@fontsource/inter/600.css'; import '@fontsource/inter/700.css';`
2. Importar o CSS global: `import '../styles/global.css';`
3. Definir `<html lang=\"pt-BR\">` com `<meta charset=\"UTF-8\">` e `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">`
4. **NÃO incluir** nenhuma tag `<script>` no layout — zero JavaScript no cliente [Ref: REQ-007].
5. Incluir meta tags básicas: `<title>`, `<meta name=\"description\">`.

```astro
---
// apps/web/src/layouts/BaseLayout.astro
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang=\"pt-BR\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <meta name=\"description\" content={description} />
    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon.svg\" />
    <title>{title}</title>
  </head>
  <body class=\"bg-bg-primary text-white font-sans antialiased\">
    <slot />
  </body>
</html>
```

### REQ-005 — Componente Hero [MUST]

O `Hero.astro` DEVE:

1. Renderizar `<section>` com `min-height: 100vh` e layout flexbox centralizado.
2. Conter um `<h1>` com tagline principal do TaskFlow.
3. Conter um `<p>` com subtítulo/descrição em `text-muted`.
4. Conter um `<a href=\"#features\">` estilizado como botão CTA com `background-color: #00fa62` e `color: #0a0a0a`.
5. O link CTA DEVE ser `<a>` nativo — **NÃO usar** `<button onclick>` ou qualquer event handler JavaScript.

### REQ-006 — Componente Features com SVG Inline [MUST]

O `Features.astro` DEVE:

1. Ter `id=\"features\"` para que a âncora do CTA funcione.
2. Renderizar exatamente 3 instâncias do componente `FeatureCard.astro`.
3. Usar grid do Tailwind: `grid grid-cols-1 md:grid-cols-3 gap-6`.

O `FeatureCard.astro` DEVE:

1. Aceitar props: `title: string`, `description: string`, `icon: string` (SVG como string HTML).
2. Renderizar o SVG via `<Fragment set:html={icon} />` para garantir SVG inline no HTML final.
3. Aplicar hover com borda neon via CSS puro: classe Tailwind `hover:border-accent-neon transition-colors duration-200`.

**Ícones sugeridos (SVG inline — Heroicons outline):**
- Feature 1 (ex: \"Organize\"): ícone de lista/checklist
- Feature 2 (ex: \"Colabore\"): ícone de usuários/equipe
- Feature 3 (ex: \"Entregue\"): ícone de foguete/lançamento

> Os SVGs devem ser extraídos de [heroicons.com](https://heroicons.com) (licença MIT) e colados inline — **sem importar biblioteca npm de ícones**.

### REQ-007 — Zero JavaScript no Cliente [MUST — Bloqueante]

Após `astro build`, o diretório `dist/` **NÃO DEVE** conter nenhum arquivo `.js` referenciado via `<script src>` ou `<script type=\"module\">` no `index.html` gerado.

Validação obrigatória:
```bash
# Após astro build, verificar ausência de scripts no HTML:
grep -i '<script' apps/web/dist/index.html
# Resultado esperado: nenhuma linha retornada (exit code 1 do grep = PASS)
```

Regras para garantir este requisito:
- Nenhum componente `.astro` deve ter bloco `<script>` (nem inline, nem `src`).
- `astro.config.mjs` DEVE ter `output: 'static'` [Ref: REQ-002].
- **PROIBIDO** usar diretivas Astro que injetam JS: `client:load`, `client:idle`, `client:visible`, `client:media`, `client:only`.
- **PROIBIDO** importar componentes React, Vue ou Svelte — apenas componentes `.astro`.

### REQ-008 — Turborepo Pipeline [MUST]

O `turbo.json` na raiz do monorepo DEVE incluir o workspace `@taskflow/web` na pipeline `build`. Se o arquivo já existir, adicione a entrada; não sobrescreva configurações existentes:

```json
{
  \"$schema\": \"https://turbo.build/schema.json\",
  \"tasks\": {
    \"build\": {
      \"outputs\": [\"dist/**\", \".astro/**\"]
    },
    \"check\": {
      \"outputs\": []
    }
  }
}
```

### REQ-009 — Configuração Cloudflare Pages [MUST]

O deploy no Cloudflare Pages deve ser configurado com:

| Parâmetro | Valor |
|---|---|
| Framework preset | `Astro` |
| Build command | `pnpm --filter @taskflow/web build` |
| Build output directory | `apps/web/dist` |
| Root directory | `/` (raiz do monorepo) |
| Node.js version | `20.x` |
| Environment variables | *(nenhuma)* |

> Configure via painel do Cloudflare Pages ou via `wrangler pages project create`. **NÃO** crie um Worker — apenas Pages estático.

### REQ-010 — CSS Global [SHOULD]

O `global.css` DEVE aplicar reset mínimo e configuração base:

```css
/* apps/web/src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: #0a0a0a;
  }
}
```

O `scroll-behavior: smooth` permite navegação suave para `#features` via CSS puro — sem JavaScript.

### REQ-011 — Footer Semântico [MUST]

O `Footer.astro` DEVE:

1. Usar a tag semântica `<footer>` — não `<div>`.
2. Exibir `© {new Date().getFullYear()} TaskFlow` — o ano é calculado em **build time** pelo Astro (sem JS no cliente).
3. Aplicar `border-top: 1px solid` com cor muted e texto centralizado.

```astro
---
// apps/web/src/components/Footer.astro
const year = new Date().getFullYear();
---

<footer class=\"border-t border-zinc-800 py-8 text-center\">
  <p class=\"text-sm text-text-muted\">© {year} TaskFlow. Todos os direitos reservados.</p>
</footer>
```

### REQ-012 — pnpm Workspace [MUST]

O arquivo `pnpm-workspace.yaml` na raiz DEVE incluir `apps/web`. Se já existir com `apps/*`, nenhuma alteração é necessária. Verificar antes de modificar:

```yaml
# pnpm-workspace.yaml (verificar se já existe)
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tooling/*'
```

---

## 5. Fora do Escopo (Non-Goals)

Estas funcionalidades estão **explicitamente PROIBIDAS** nesta sprint. Qualquer PR que as inclua deve ser rejeitado.

| # | Item | Justificativa |
|---|---|---|
| NG-01 | Página 404 customizada | Escopo restrito a `index.astro` único |
| NG-02 | Formulário de waitlist / captura de e-mail | Exigiria D1, Workers ou integração externa |
| NG-03 | Analytics (Google Analytics, Plausible, etc.) | Injetaria JavaScript no cliente |
| NG-04 | Domínio customizado (taskflow.app, etc.) | DNS/domínio é configuração pós-deploy, fora desta sprint |
| NG-05 | Blog ou rotas adicionais | Apenas `index.astro` — sem subpáginas |
| NG-06 | Animações CSS complexas / scroll animations | Apenas CSS estático — sem `@keyframes` elaborados ou Intersection Observer |
| NG-07 | Componentes React, Vue ou Svelte | Apenas componentes `.astro` — zero hidratação |
| NG-08 | Testes unitários (Vitest) | Validação exclusivamente via `astro check` + `astro build` |
| NG-09 | Open Graph / meta tags avançadas | Apenas meta tags básicas (`title`, `description`) |
| NG-10 | Dark/light mode toggle | Design exclusivamente dark — sem JavaScript de tema |
| NG-11 | Assets no R2 | Zero dependência de infraestrutura Cloudflare nesta sprint |

---

## 6. Cloudflare Bindings & Integrações

**Bindings Cloudflare:** Nenhum.

**APIs Externas:** Nenhuma.

**Variáveis de Ambiente:** Nenhuma.

**Plataforma de Deploy:** Cloudflare Pages (serve assets estáticos do `dist/` — sem Workers, sem Functions).

---

## 7. Restrições & Casos Limite

### Restrição 1 — Compatibilidade com Monorepo Existente

O monorepo já possui `apps/api` (Hono + Cloudflare Workers). O workspace `apps/web` DEVE ser completamente isolado:
- Não compartilha dependências de runtime com `apps/api`.
- Não importa de `packages/db` (Drizzle ORM — não aplicável para página estática).
- Pode compartilhar configurações de `tooling/` (ESLint, TypeScript) se já configuradas.

### Restrição 2 — `astro check` Obrigatório

O comando `astro check` valida TypeScript nos arquivos `.astro`. Todos os componentes devem ser tipados corretamente. Props de componentes DEVEM usar `interface Props` (padrão Astro) — não `export interface`.

### Restrição 3 — SVG Inline vs. Imagem

Os ícones de features DEVEM ser SVG inline (não `<img src=\"icon.svg\">`). Isso garante:
1. Zero request HTTP adicional para carregar ícones.
2. Capacidade de estilizar o SVG via CSS (ex: `fill: currentColor` para herdar cor do texto).

### Restrição 4 — Scroll Smooth sem JavaScript

O comportamento de scroll suave ao clicar no CTA (`href=\"#features\"`) é implementado exclusivamente via `scroll-behavior: smooth` no CSS [Ref: REQ-010]. Se o browser não suportar, o comportamento fallback é o scroll instantâneo nativo — aceitável.

### Restrição 5 — Ano Dinâmico em Build Time

O `new Date().getFullYear()` no `Footer.astro` é executado durante o **build** do Astro, não no browser. O HTML gerado conterá o ano hardcoded (ex: `2025`). Isso é correto e intencional — zero JavaScript no cliente [Ref: REQ-011].

### Restrição 6 — tsconfig Herdado

O `tsconfig.json` do `apps/web` deve estender o base do tooling:

```json
{
  \"extends\": \"../../tooling/typescript/base.json\",
  \"include\": [\"src\"],
  \"compilerOptions\": {
    \"baseUrl\": \".\",
    \"strictNullChecks\": true
  }
}
```

Se o arquivo `tooling/typescript/base.json` não existir, criar um `tsconfig.json` standalone com `strict: true`.

---

## 8. Checklist de Validação Final (DoD)

Antes de considerar a sprint concluída, verificar **todos** os itens:

- [ ] `pnpm --filter @taskflow/web astro check` — zero erros, zero warnings
- [ ] `pnpm --filter @taskflow/web build` — build concluído com sucesso, diretório `apps/web/dist/` gerado
- [ ] `grep -i '<script' apps/web/dist/index.html` — retorna zero resultados (zero JS no cliente)
- [ ] URL pública `*.pages.dev` responde HTTP 200
- [ ] Hero section visível com CTA linkando para `#features`
- [ ] 3 feature cards com SVG inline visíveis abaixo do Hero
- [ ] Footer com copyright visível no final da página
- [ ] Design: background `#0a0a0a`, acento `#00fa62`, tipografia Inter carregando corretamente
- [ ] Responsividade: 1 coluna em mobile, 3 colunas no grid de features em desktop
- [ ] Nenhuma importação de `packages/db`, `apps/api` ou dependências de runtime do Cloudflare Workers
"}}
File written successfully
**Resumo Executivo — Sprint sp-018:**

- **Escopo:** Workspace `apps/web` (novo) com Astro + TailwindCSS — página única `index.astro` com Hero, 3 Feature Cards e Footer.
- **Data Model:** Zero. 100% estático — sem D1, R2, KV ou qualquer binding Cloudflare.
- **Integrações:** Zero — nenhuma chave de API, nenhuma variável de ambiente.
- **Non-Goals explícitos:** Sem 404 customizado, sem formulário de waitlist, sem analytics, sem domínio customizado, sem React/Vue/Svelte, sem JavaScript no cliente, sem testes unitários.
- **DoD:** `astro check` + `astro build` verdes **e** HTTP 200 no Cloudflare Pages.

{"name": "complete_phase",