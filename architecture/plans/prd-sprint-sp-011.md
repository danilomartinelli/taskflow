# Code Map

_Última atualização: Sprint sp-010_

## Monorepo Structure

```
taskflow/
├── apps/
│   └── api/                          # Cloudflare Worker (Hono)
│       ├── src/
│       │   ├── index.ts              # Entrypoint principal — monta todas as rotas
│       │   ├── middleware/
│       │   │   └── auth.ts           # Middleware de autenticação JWT (Bearer token)
│       │   ├── routes/
│       │   │   ├── tasks.ts          # CRUD de tarefas — GET /tasks, POST /tasks, PATCH /tasks/:id, DELETE /tasks/:id
│       │   │   ├── users.ts          # Gestão de usuários — GET /users/me, PATCH /users/me
│       │   │   ├── projects.ts       # CRUD de projetos — GET /projects, POST /projects, PATCH /projects/:id, DELETE /projects/:id
│       │   │   └── auth.ts           # Autenticação — POST /auth/login, POST /auth/register, POST /auth/refresh
│       │   └── services/
│       │       └── auth.ts           # Lógica de JWT: sign, verify, refresh
│       ├── wrangler.toml             # Config do Worker: bindings D1 (DB), KV (CACHE), R2 (FILES)
│       └── package.json
├── packages/
│   ├── db/                           # Drizzle ORM + D1
│   │   ├── src/
│   │   │   ├── schema.ts             # Tabelas: users, tasks, projects, sessions
│   │   │   └── index.ts             # Cliente Drizzle exportado
│   │   └── package.json
│   ├── shared/                       # Tipos e schemas Zod compartilhados
│   │   ├── src/
│   │   │   ├── types.ts              # Tipos TypeScript globais
│   │   │   └── validators.ts        # Schemas Zod reutilizáveis
│   │   └── package.json
│   └── email/                        # Templates de e-mail (Resend)
│       ├── src/
│       │   └── templates/
│       │       └── welcome.tsx       # Template de boas-vindas (React Email)
│       └── package.json
├── tooling/
│   └── typescript/                   # tsconfig base compartilhado
├── turbo.json                        # Pipeline Turborepo
├── pnpm-workspace.yaml               # Workspaces pnpm
└── package.json                      # Root package.json
```

## Componentes Existentes

| ID | Componente | Localização | Descrição |
|----|------------|-------------|-----------|
| C-001 | Auth Middleware | `apps/api/src/middleware/auth.ts` | Valida Bearer tokens JWT em rotas protegidas |
| C-002 | Tasks Routes | `apps/api/src/routes/tasks.ts` | CRUD completo de tarefas com validação Zod |
| C-003 | Users Routes | `apps/api/src/routes/users.ts` | Perfil de usuário — leitura e atualização |
| C-004 | Projects Routes | `apps/api/src/routes/projects.ts` | CRUD completo de projetos |
| C-005 | Auth Routes | `apps/api/src/routes/auth.ts` | Login, registro e refresh de sessão |
| C-006 | Auth Service | `apps/api/src/services/auth.ts` | Lógica de assinatura e verificação JWT |
| C-007 | DB Schema | `packages/db/src/schema.ts` | Schema Drizzle: users, tasks, projects, sessions |
| C-008 | Shared Types | `packages/shared/src/types.ts` | Tipos TypeScript globais do projeto |
| C-009 | Shared Validators | `packages/shared/src/validators.ts` | Schemas Zod reutilizáveis |
| C-010 | Email Templates | `packages/email/src/templates/welcome.tsx` | Template React Email de boas-vindas |
O monorepo está bem mapeado. `apps/web` não existe ainda — será criado do zero. Gerando o PRD agora.

from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',   // SSG puro
});
```

**REQ-005** `[MUST]` O `tailwind.config.mjs` deve definir as cores e tipografia do design system:
```js
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        neon: '#00fa62',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

### Layout & Página

**REQ-006** `[MUST]` Criar o layout base em `apps/web/src/layouts/BaseLayout.astro` que:
- Importa a fonte Inter via `@fontsource/inter` (import no `<head>`).
- Define o `background-color: #0a0a0a` no `<body>` via classe Tailwind `bg-background`.
- Aplica `scroll-behavior: smooth` globalmente via CSS (`html { scroll-behavior: smooth; }`).
- Inclui as meta tags mínimas: `<meta charset=\"UTF-8\">`, `<meta name=\"viewport\" ...>` e `<title>TaskFlow</title>`.

**REQ-007** `[MUST]` A página principal deve residir em `apps/web/src/pages/index.astro` e importar `BaseLayout` e os três componentes de seção.

### Componentes de Seção

**REQ-008** `[MUST]` Criar `apps/web/src/components/Hero.astro` com:
- Tag `<section>` cobrindo 100vh (`min-h-screen`) com flex e centralização.
- `<h1>` com texto \"TaskFlow\" e cor `text-neon` (classe Tailwind customizada `#00fa62`).
- `<p>` com subtítulo em cor branca/cinza claro.
- `<a href=\"#features\">` estilizado como botão primário (background `#00fa62`, texto `#0a0a0a`, padding, border-radius). **PROIBIDO** usar tag `<button>` ou atributo `onclick`.

**REQ-009** `[MUST]` Criar `apps/web/src/components/Features.astro` com:
- `id=\"features\"` no elemento `<section>` raiz (destino da âncora do CTA).
- Grid responsivo: `grid-cols-1 md:grid-cols-3`.
- Três cards, cada um com: ícone SVG inline (`aria-hidden=\"true\"`), `<h3>` com título, `<p>` com descrição.
- Os três ícones SVG devem ser embutidos diretamente no arquivo (inline) — não referenciar arquivos externos.

**REQ-010** `[MUST]` Criar `apps/web/src/components/Footer.astro` com:
- Tag `<footer>` com texto de copyright centrado.
- Background `#111111` ou borda superior `border-t border-white/10`.

### Qualidade & Build

**REQ-011** `[MUST]` `pnpm --filter web run check` (`astro check`) deve completar com **zero erros** de diagnóstico.

**REQ-012** `[MUST]` `pnpm --filter web run build` (`astro build`) deve completar com **zero erros** e gerar o diretório `apps/web/dist/`.

**REQ-013** `[MUST]` O output de build **não deve conter nenhum arquivo `.js`** referenciado no `<head>` ou `<body>` da `index.html` gerada. Astro deve emitir apenas HTML e CSS.

**REQ-014** `[SHOULD]` Adicionar `apps/web/dist` ao `.gitignore` da raiz do monorepo (se ainda não estiver).

### Deploy

**REQ-015** `[MUST]` Configurar o projeto no Cloudflare Pages com:
- **Build command:** `pnpm --filter web build`
- **Build output directory:** `apps/web/dist`
- **Root directory:** `/` (raiz do monorepo)
- **Node.js version:** 20 (variável de ambiente de build `NODE_VERSION=20`)

**REQ-016** `[SHOULD]` Adicionar arquivo `apps/web/public/robots.txt` com conteúdo mínimo:
```
User-agent: *
Allow: /
```

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo são **explicitamente proibidos** nesta sprint. Qualquer implementação destes será considerada scope creep e deve ser rejeitada na revisão.

| Item | Motivo da Exclusão |
|------|-------------------|
| Animações JavaScript (GSAP, Framer Motion, etc.) | Zero JS no cliente é requisito inegociável |
| Dark/Light mode toggle | Fora do escopo — tema dark fixo |
| Internacionalização (i18n) | Sprint futura |
| Página de Signup / Login | Sprint futura (app separado) |
| Seção de Pricing | Sprint futura |
| Seção de FAQ | Sprint futura |
| Seção de Testimonials | Sprint futura |
| Blog ou Documentação | Sprint futura |
| Formulário de contato ou waitlist | Zero forms nesta sprint |
| CMS (Contentlayer, Sanity, etc.) | Conteúdo hardcoded é suficiente |
| Domínio customizado | Subdomínio `.pages.dev` é suficiente |
| Meta tags Open Graph / SEO avançado | Sprint futura |
| Sitemap automático | Sprint futura |
| Google Analytics / Plausible | Sprint futura |
| PWA / Service Worker | Sprint futura |
| Testes unitários ou E2E (Vitest, Playwright) | Validação via `astro check` + `astro build` é suficiente |
| CI/CD customizado (GitHub Actions) | Deploy manual via Cloudflare Pages dashboard |
| Favicon customizado | Sprint futura (usar padrão do browser) |
| Imagens ou assets externos (Sharp, Imagetools) | Sem imagens nesta sprint — apenas SVG inline |

---

## 6. Cloudflare Bindings & Integrações

**Bindings:** Nenhum. Esta sprint não utiliza D1, KV, R2, Queues ou qualquer binding do Cloudflare Workers.

**APIs Externas:** Nenhuma.

**Variáveis de Ambiente:** Nenhuma variável de ambiente de runtime. A única configuração necessária é a variável de build `NODE_VERSION=20` no dashboard do Cloudflare Pages (padrão da plataforma).

**Tipo de Deploy:** Cloudflare Pages (SSG estático), **não** Cloudflare Workers. O output é HTML/CSS puro servido pela CDN global.

---

## 7. Restrições & Casos Limite

### Restrições Técnicas

- **RT-01:** O projeto é Astro com output `static`. A diretiva `client:*` (ex: `client:load`, `client:idle`) é **proibida** em todos os componentes. Qualquer uso emitirá JavaScript e violará o REQ-013.
- **RT-02:** Não importar pacotes do monorepo (`packages/db`, `packages/shared`, `packages/email`) — a landing page é totalmente independente da API.
- **RT-03:** A fonte Inter deve ser carregada via `@fontsource/inter` (self-hosted no bundle), **não** via Google Fonts CDN. Isso evita dependências externas de rede e requisições third-party.
- **RT-04:** Ícones SVG devem ser inline no HTML (copiados diretamente no `.astro`), não importados como componentes de biblioteca (ex: sem `lucide-react`, sem `heroicons/react`). Isso mantém zero dependências de runtime.
- **RT-05:** O workspace `apps/web` não deve ter dependências dos outros workspaces do monorepo. O `package.json` deve listar apenas `astro`, `@astrojs/tailwind`, `tailwindcss` e `@fontsource/inter`.

### Casos Limite

- **CL-01:** Se `pnpm --filter web build` falhar por conflito de versão do Astro com a versão do Node.js, definir `NODE_VERSION=20` nas variáveis de ambiente de build do Cloudflare Pages resolve o problema.
- **CL-02:** Se o `turbo.json` não reconhecer o novo workspace `web`, verificar se `pnpm-workspace.yaml` inclui `apps/*` no campo `packages`.
- **CL-03:** Se a fonte Inter não carregar (404 nos assets), verificar se o import de `@fontsource/inter` está no `<head>` do `BaseLayout.astro` e se o pacote foi instalado no workspace correto (`apps/web`, não na raiz).
- **CL-04:** O scroll suave da âncora `#features` depende de `scroll-behavior: smooth` aplicado ao elemento `html`. Se o CSS global não for injetado via `BaseLayout`, o scroll será instantâneo (comportamento não-crítico, mas deve ser corrigido).

---

## 8. Estrutura de Arquivos Esperada (Referência)

Ao final da sprint, a estrutura do workspace `apps/web` deve ser:

```
apps/web/
├── public/
│   └── robots.txt
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro       # [REQ-006] Layout base com font + meta tags
│   ├── components/
│   │   ├── Hero.astro             # [REQ-008] Seção Hero
│   │   ├── Features.astro         # [REQ-009] Grid de 3 features
│   │   └── Footer.astro           # [REQ-010] Footer de copyright
│   └── pages/
│       └── index.astro            # [REQ-007] Página principal
├── astro.config.mjs               # [REQ-004] Config Astro + integração Tailwind
├── tailwind.config.mjs            # [REQ-005] Cores e tipografia
└── package.json                   # [REQ-001] name: \"web\", scripts: dev/build/check
```

Alterações no monorepo raiz:
```
/
├── turbo.json                     # [REQ-002] Pipeline atualizado com web#build
├── pnpm-workspace.yaml            # Já inclui apps/* — nenhuma alteração necessária
└── .gitignore                     # [REQ-014] apps/web/dist adicionado
```

---

## 9. Referências de Implementação

### Exemplo: `BaseLayout.astro`

```astro
---
// apps/web/src/layouts/BaseLayout.astro
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
---
<!DOCTYPE html>
<html lang=\"pt-BR\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <title>TaskFlow</title>
  </head>
  <body class=\"bg-background text-white font-sans\">
    <slot />
  </body>
</html>

<style is:global>
  html {
    scroll-behavior: smooth;
  }
</style>
```

### Exemplo: `index.astro`

```astro
---
// apps/web/src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import Features from '../components/Features.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout>
  <Hero />
  <Features />
  <Footer />
</BaseLayout>
```

### Exemplo: Botão CTA (Hero) — CORRETO vs ERRADO

```astro
<!-- CORRETO: âncora pura, zero JS [REF: REQ-008] -->
<a href=\"#features\" class=\"inline-block bg-neon text-background font-bold px-8 py-3 rounded-lg\">
  Ver Funcionalidades
</a>

<!-- ERRADO: onclick emite JavaScript [VIOLA: REQ-013, RT-01] -->
<button onclick=\"document.getElementById('features').scrollIntoView()\">
  Ver Funcionalidades
</button>
```

### Exemplo: Ícone SVG Inline — CORRETO vs ERRADO

```astro
<!-- CORRETO: SVG inline, zero dependências [REF: REQ-009, RT-04] -->
<svg aria-hidden=\"true\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"none\"
     stroke=\"#00fa62\" stroke-width=\"2\">
  <polyline points=\"20 6 9 17 4 12\" />
</svg>

<!-- ERRADO: importa biblioteca com runtime JS [VIOLA: RT-04] -->
import { CheckCircle } from 'lucide-react';
<CheckCircle client:load />
```

---

*Fim do PRD — Sprint sp-011*
"}}
File written successfully
{"name": "complete_phase", "parameters": {"summary": "Blueprint sp-011 concluído: landing page estática TaskFlow (Astro + TailwindCSS) com Hero, Features e Footer, zero JS no cliente, deploy no Cloudflare Pages via subdomínio automático, sem bindings, sem variáveis de ambiente, sem testes unitários."}}
Phase completed successfully
**Resumo Executivo — Sprint sp-011**

| Dimensão | Decisão |
|---|---|
| **Escopo** | Único arquivo `apps/web` criado do zero — Hero + Features (3 cards) + Footer |
| **Data Model** | Zero — página 100% estática, sem D1/R2/KV/API |
| **Integrações** | Nenhuma — apenas `astro`, `@astrojs/tailwind`, `tailwindcss`, `@fontsource/inter` |
| **DoD** | `astro check` + `astro build` sem erros + site acessível em `*.pages.dev` |
| **Non-Goals** | Animações JS, i18n, pricing, FAQ, forms, CMS, domínio customizado, testes unitários, CI/CD |

PRD salvo em `architecture/plans/prd-sprint-sp-011.md` com 9 seções, 16 requisitos funcionais (REQ-001 a REQ-016), 4 histórias de usuário com critérios de aceite, restrições técnicas e exemplos de código inline para guiar a execução.