# Code Map

## Overview

This document maps all components, services, utilities, and configurations across the TaskFlow monorepo.

## Monorepo Structure

```
taskflow/
├── apps/
│   └── api/                    # Hono API (Cloudflare Workers)
│       ├── src/
│       │   ├── index.ts        # Main entry point, mounts all routes
│       │   ├── auth.ts         # Better Auth configuration
│       │   ├── db.ts           # D1 database connection (Drizzle)
│       │   ├── middleware/
│       │   │   └── auth.ts     # Authentication middleware
│       │   └── routes/
│       │       ├── auth.ts     # Auth routes (/api/auth/*)
│       │       ├── tasks.ts    # Task CRUD routes (/api/tasks/*)
│       │       └── users.ts    # User routes (/api/users/*)
│       ├── wrangler.toml       # Cloudflare Workers config
│       └── package.json
├── packages/
│   ├── db/                     # Shared Drizzle schema + migrations
│   │   ├── src/
│   │   │   ├── schema.ts       # D1 schema (users, tasks, sessions)
│   │   │   └── index.ts        # Exports
│   │   └── package.json
│   └── shared/                 # Shared types and utilities
│       ├── src/
│       │   └── index.ts        # Shared types
│       └── package.json
└── tooling/
    └── typescript/             # Shared TS configs
```

## Components & Services

### API (`apps/api`)

| Component | Path | Description |
|-----------|------|-------------|
| Main App | `src/index.ts` | Hono app entry, mounts routes, CORS config |
| Auth Config | `src/auth.ts` | Better Auth with D1 adapter |
| DB Client | `src/db.ts` | Drizzle ORM client for D1 |
| Auth Middleware | `src/middleware/auth.ts` | Request authentication |
| Auth Routes | `src/routes/auth.ts` | Sign-up, sign-in, session endpoints |
| Task Routes | `src/routes/tasks.ts` | CRUD for tasks |
| User Routes | `src/routes/users.ts` | User profile operations |

### Database (`packages/db`)

| Table | Columns | Description |
|-------|---------|-------------|
| `users` | id, email, name, createdAt | User accounts |
| `sessions` | id, userId, expiresAt | Auth sessions |
| `tasks` | id, userId, title, description, status, priority, dueDate, createdAt, updatedAt | Task records |

### Shared (`packages/shared`)

| Export | Description |
|--------|-------------|
| `Task` type | TypeScript interface for tasks |
| `User` type | TypeScript interface for users |

## External Dependencies

| Package | Workspace | Purpose |
|---------|-----------|---------|
| `hono` | apps/api | HTTP framework |
| `drizzle-orm` | apps/api, packages/db | ORM |
| `better-auth` | apps/api | Authentication |
| `zod` | apps/api | Validation |

## Environment Variables

| Variable | Workspace | Description |
|----------|-----------|-------------|
| `DB` | apps/api | D1 database binding |
| `BETTER_AUTH_SECRET` | apps/api | Auth secret key |
| `BETTER_AUTH_URL` | apps/api | Auth base URL |
O projeto já tem `apps/api` mas não tem `apps/web`. Tudo certo — vou gerar o PRD completo agora.

,
};

export const features = [
  {
    id: \"organize\",
    title: \"Organize sem esforço\",
    description: \"Crie, priorize e acompanhe tarefas em um painel visual limpo e intuitivo.\",
  },
  {
    id: \"collaborate\",
    title: \"Colabore em tempo real\",
    description: \"Atribua tarefas, comente e mantenha toda a equipe sincronizada sem reuniões desnecessárias.\",
  },
  {
    id: \"focus\",
    title: \"Foco no que importa\",
    description: \"Filtros inteligentes e lembretes automáticos para você nunca perder um prazo.\",
  },
];

export const footer = {
  copyright: `© ${new Date().getFullYear()} TaskFlow. Todos os direitos reservados.`,
};
```

### 2.3 Tokens de Design

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-bg` | `#0a0a0a` | Background global |
| `--color-accent` | `#00fa62` | Verde neon — CTA, ícones, destaques |
| `--color-text-primary` | `#f5f5f5` | Títulos e corpo principal |
| `--color-text-muted` | `#888888` | Textos secundários, footer |
| `font-family` | Inter (via `@fontsource/inter`) | Toda a tipografia |

Configure no `tailwind.config.mjs`:

```javascript
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        accent: '#00fa62',
        'text-primary': '#f5f5f5',
        'text-muted': '#888888',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

---

## 3. Histórias de Usuário & Matriz do Avaliador

> **Nota de Escopo:** Todas as histórias abaixo são executáveis dentro desta única sprint. Não há história de tamanho > 1 ciclo de execução.

---

### US-001: Workspace Astro configurado no monorepo

**Descrição:** Como desenvolvedor, eu quero que `apps/web` seja um workspace Astro válido integrado ao Turborepo para que a landing possa ser buildada e servida de forma isolada.

**Matriz de Teste do Avaliador:**

- [ ] **Build:** `pnpm --filter @taskflow/web build` executa sem erros e gera a pasta `apps/web/dist/`
- [ ] **Type-check:** `astro check` dentro de `apps/web` retorna zero erros
- [ ] **Turborepo:** O workspace aparece listado em `pnpm list -r` com o nome `@taskflow/web`
- [ ] **Isolamento:** Nenhum arquivo de `apps/api` é importado ou referenciado em `apps/web`

---

### US-002: Seção Hero com CTA funcional

**Descrição:** Como visitante, eu quero ver um headline impactante com um botão CTA que me leve à seção de funcionalidades para entender o valor do produto imediatamente.

**Matriz de Teste do Avaliador:**

- [ ] **UI:** O headline, subtítulo e botão estão visíveis acima da dobra em viewport 1280×800
- [ ] **CTA:** Clicar em \"Ver funcionalidades\" rola a página até o elemento com `id=\"features\"` sem JavaScript (CSS `scroll-behavior: smooth`)
- [ ] **Design:** Background `#0a0a0a`, botão com `background: #00fa62`, texto do botão em `#0a0a0a` (contraste legível)
- [ ] **Zero JS:** O HTML renderizado da página não contém tags `<script>` de runtime (exceto scripts de build do Astro, que são eliminados em `output: 'static'`)
- [ ] **Responsivo:** Em viewport 375px (mobile), o texto não transborda e o botão é clicável sem zoom

---

### US-003: Seção de 3 Features com ícones SVG inline

**Descrição:** Como visitante, eu quero ver três cards com ícones, título e descrição das principais funcionalidades do TaskFlow para avaliar se a ferramenta resolve meu problema.

**Matriz de Teste do Avaliador:**

- [ ] **UI:** Três cards exibidos em grid (1 coluna no mobile, 3 colunas no desktop ≥ 1024px)
- [ ] **Conteúdo:** Cada card contém: ícone SVG inline com `fill` ou `stroke` em `#00fa62`, título em `#f5f5f5`, descrição em `#888888`
- [ ] **SVG inline:** Os ícones são SVGs embutidos no HTML (não `<img src=\"*.svg\">`), eliminando requests adicionais
- [ ] **Acessibilidade:** Cada SVG tem `aria-hidden=\"true\"` e o card tem texto legível independente do ícone
- [ ] **ID de âncora:** A seção possui `id=\"features\"` para receber o scroll do CTA da Hero

---

### US-004: Footer minimalista

**Descrição:** Como visitante, eu quero ver um footer discreto com informações básicas de copyright para que a página pareça completa e profissional.

**Matriz de Teste do Avaliador:**

- [ ] **UI:** Footer exibe o texto de copyright com o ano atual calculado em build-time (sem JS)
- [ ] **Design:** Texto em `#888888`, separado do conteúdo principal por uma linha divisória sutil (ex: `border-top: 1px solid #1a1a1a`)
- [ ] **Build-time:** O ano é gerado via `new Date().getFullYear()` durante o build do Astro — não em runtime no browser

---

### US-005: Deploy funcional no Cloudflare Pages

**Descrição:** Como time, eu quero que a landing seja acessível via URL do Cloudflare Pages para que possamos compartilhar e validar o resultado publicamente.

**Matriz de Teste do Avaliador:**

- [ ] **Build:** `astro build` gera artefatos em `dist/` compatíveis com Cloudflare Pages (arquivos HTML estáticos)
- [ ] **Deploy:** A URL `taskflow-landing.pages.dev` (ou conforme configurado) retorna HTTP 200 com a landing
- [ ] **Performance:** Lighthouse score ≥ 90 em Performance, Acessibilidade e Best Practices
- [ ] **Headers:** Content-Type `text/html; charset=utf-8` correto na resposta

---

## 4. Requisitos Funcionais (FR)

### Must Have (P0)

**REQ-001** — O workspace `apps/web` deve ser criado como um novo pacote pnpm com nome `@taskflow/web`, listado em `pnpm-workspace.yaml` e integrado ao pipeline do Turborepo via `turbo.json`.

**REQ-002** — O `astro.config.mjs` deve configurar `output: 'static'` (geração de HTML puro, zero SSR) e o adapter `@astrojs/cloudflare` para compatibilidade com Cloudflare Pages.

**REQ-003** — A tipografia Inter deve ser instalada via `@fontsource/inter` e importada no layout base (`Base.astro`) — NÃO via CDN Google Fonts (garante zero requests externos para fonte e funciona offline).

```astro
---
// src/layouts/Base.astro
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
---
```

**REQ-004** — A integração TailwindCSS deve ser instalada via `@astrojs/tailwind` e configurada no `astro.config.mjs`. O arquivo `tailwind.config.mjs` deve extender o tema com as cores e fonte definidas nos Tokens de Design (seção 2.3).

**REQ-005** — O componente `Hero.astro` deve renderizar: um `<h1>` com o headline principal, um `<p>` com o subtítulo, e um `<a href=\"#features\">` estilizado como botão primário com cor de acento `#00fa62`. O CSS `scroll-behavior: smooth` deve ser aplicado no `html { }` via TailwindCSS (`scroll-smooth` na tag `<html>`).

**REQ-006** — O componente `Features.astro` deve renderizar a seção com `id=\"features\"` contendo exatamente 3 cards. Cada card deve conter um SVG inline único por feature (ícones distintos e semanticamente relacionados ao conteúdo), título `<h3>` e parágrafo `<p>`. O layout deve usar CSS Grid com `grid-cols-1 md:grid-cols-3`.

**REQ-007** — Os ícones SVG devem ser embutidos diretamente no HTML (inline), com `aria-hidden=\"true\"` e dimensões explícitas (`width=\"24\" height=\"24\"` ou equivalente). A cor de `stroke` ou `fill` deve ser `#00fa62` (classe Tailwind: `text-accent stroke-accent`).

**REQ-008** — O componente `Footer.astro` deve exibir o texto de copyright com o ano calculado em **build-time** via `new Date().getFullYear()` no frontmatter do Astro — nunca em um script client-side.

**REQ-009** — A página final (`index.astro`) não deve conter nenhuma tag `<script>` de runtime no HTML entregue ao browser. Valide com `astro build` seguido de `grep -r '<script' dist/` — o resultado deve estar vazio ou conter apenas scripts de preload de fonte gerados pelo Astro (sem lógica de negócio).

**REQ-010** — O `package.json` de `apps/web` deve definir os scripts:
```json
{
  \"scripts\": {
    \"dev\": \"astro dev\",
    \"build\": \"astro check && astro build\",
    \"preview\": \"astro preview\",
    \"check\": \"astro check\"
  }
}
```
O script `build` encadeia `astro check` antes de `astro build` para garantir que erros de tipo bloqueiem o pipeline.

### Should Have (P1)

**REQ-011** — A página deve ter meta tags SEO básicas no `<head>` do `Base.astro`: `<title>`, `<meta name=\"description\">`, `<meta property=\"og:title\">`, `<meta property=\"og:description\">`, `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`.

**REQ-012** — Um arquivo `public/favicon.svg` deve ser criado com um ícone simples (ex: as iniciais \"TF\" em verde neon sobre fundo escuro, como SVG textual).

**REQ-013** — O layout deve ser responsivo e testado nos breakpoints: 375px (mobile), 768px (tablet), 1280px (desktop). Use exclusivamente as classes responsivas do Tailwind (`sm:`, `md:`, `lg:`).

### Could Have (P2)

**REQ-014** — Adicionar um arquivo `_headers` na pasta `public/` com headers de segurança para o Cloudflare Pages:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

---

## 5. Fora do Escopo (Non-Goals)

Itens **explicitamente proibidos** nesta sprint para evitar scope creep:

| Item | Motivo da Exclusão |
|------|--------------------|
| Formulário de contato ou captura de e-mail | Exigiria integração (Resend, KV) — sprint dedicada |
| Página de login ou cadastro | Pertence a `apps/app` — fora do escopo da landing |
| Blog ou seção de artigos | Escopo de conteúdo separado |
| Animações com JavaScript (GSAP, Framer Motion) | Contradiz o requisito de zero JS no cliente |
| Testes unitários ou de integração (Vitest, Playwright) | Explicitamente excluído pelo Sprint Goal — validação apenas via `astro check` + `astro build` |
| Internacionalização (i18n) | Complexidade desnecessária para MVP |
| Dark/light mode toggle | Contradiz o design dark fixo definido no Sprint Goal |
| Integração com a API (`apps/api`) | A landing é puramente estática, sem chamadas HTTP |
| Domínio customizado | O usuário indicou configuração customizada de deploy fora das opções padrão — deve ser configurado manualmente via Dashboard do Cloudflare Pages após o deploy inicial |
| Seção de preços (Pricing) | Não definida no Sprint Goal |
| Seção de depoimentos (Testimonials) | Não definida no Sprint Goal |

---

## 6. Cloudflare Bindings & Integrações

### Bindings Cloudflare

**Nenhum.** A landing é 100% estática. Não utiliza D1, R2, KV, Queues ou Workers.

### Serviços Externos

**Nenhum.** A landing não faz chamadas HTTP externas em runtime.

### Variáveis de Ambiente

**Nenhuma.** Todo o conteúdo é estático e hardcoded em build-time.

### Dependências de Pacotes (apps/web)

| Pacote | Tipo | Propósito |
|--------|------|-----------|
| `astro` | dependency | Framework principal |
| `@astrojs/tailwind` | dependency | Integração TailwindCSS no Astro |
| `@astrojs/cloudflare` | dependency | Adapter para Cloudflare Pages |
| `tailwindcss` | dependency | CSS utility framework |
| `@fontsource/inter` | dependency | Fonte Inter auto-hospedada |

> **Nota Edge Compatibility:** Nenhum desses pacotes usa Node.js nativo. `@astrojs/cloudflare` no modo `output: 'static'` gera HTML puro — sem Workers runtime — portanto não há restrições de edge compatibility a verificar [Ref: SOP-02].

---

## 7. Restrições & Casos Limite

### Restrições Técnicas

**REST-001** — O Astro DEVE ser configurado com `output: 'static'`. Qualquer uso acidental de `output: 'server'` ou `output: 'hybrid'` viola o requisito de zero SSR e deve ser tratado como erro de build.

**REST-002** — É PROIBIDO importar qualquer módulo de `apps/api`, `packages/db` ou `packages/shared` em `apps/web`. A landing não compartilha código com o backend.

**REST-003** — É PROIBIDO usar `client:load`, `client:idle`, `client:visible` ou qualquer diretiva client-side do Astro nos componentes desta landing. Todo componente deve ser puramente Astro (sem hidratação).

**REST-004** — A fonte Inter deve ser servida via `@fontsource/inter` (assets locais no build), não via URL externa. Isso garante performance máxima e elimina dependência de CDN externo.

**REST-005** — O `astro check` DEVE passar com zero erros antes de qualquer deploy. Se `astro check` falhar, o pipeline de CI está quebrado e o deploy não deve ocorrer.

### Casos Limite

**EDGE-001 — Build em Turborepo:** O `turbo.json` deve incluir `apps/web` no pipeline. Adicione a entrada:
```json
{
  \"pipeline\": {
    \"build\": {
      \"dependsOn\": [\"^build\"],
      \"outputs\": [\"dist/**\"]
    }
  }
}
```
Se o `turbo.json` existente já tiver entradas, adicione `\"dist/**\"` aos outputs do pipeline global.

**EDGE-002 — Conflito de porta no dev:** `apps/api` pode rodar em `localhost:8787`. O `astro dev` de `apps/web` deve usar porta diferente (padrão: `4321`). Não há conflito esperado, mas documente nos README.

**EDGE-003 — Ano no footer:** O `new Date().getFullYear()` é executado no **momento do build** pelo Astro. O HTML gerado terá o ano hardcoded (ex: `2025`). Isso é intencional e correto — não é um bug. O site precisará de rebuild para atualizar o ano.

**EDGE-004 — SVGs inline e tamanho do HTML:** Com 3 ícones SVG inline, o HTML da página será ligeiramente maior do que usando `<img>`. Para ícones simples (< 500 bytes cada), o tradeoff é positivo: elimina 3 requests HTTP adicionais.

---

## 8. Referências & Dependências de Sprint

| Item | Referência |
|------|------------|
| Monorepo base | Sprint sp-001 a sp-005 (ver `architecture/changelog.md`) |
| Stack global | `system-rules.md` — `<global_stack>` |
| Estrutura do monorepo | `architecture/code-map.md` |
| Blocklist de pacotes | `architecture/SOPs/SOP-02-edge-compatibility.md` |
| PRD desta sprint | `architecture/plans/prd-sprint-sp-006.md` |

---

## Apêndice: Estrutura Final Esperada de `apps/web/dist/`

Após `astro build`, a pasta `dist/` deve conter:

```
apps/web/dist/
├── index.html          # Página completa com Hero + Features + Footer
├── favicon.svg         # Copiado de public/
├── _astro/
│   └── *.css           # CSS Tailwind purgado e minificado
└── _fonts/             # Arquivos de fonte Inter (gerados por @fontsource/inter)
```

O `index.html` gerado deve ser um arquivo HTML completo e autocontido — qualquer link externo além dos arquivos em `dist/` é uma violação dos requisitos desta sprint.
"}}
File written successfully
{"name": "complete_phase", "parameters": {"summary": "Blueprint sp-006 concluído: landing page estática Astro + TailwindCSS em apps/web, design dark #0a0a0a + acento #00fa62, 3 seções (Hero, Features, Footer), zero JS no cliente, deploy Cloudflare Pages — PRD salvo em architecture/plans/prd-sprint-sp-006.md."}}
Phase complete
---

**Resumo Executivo — Sprint sp-006**

| Dimensão | Decisão |
|----------|---------|
| **Escopo** | Landing page estática de página única: Hero (CTA → `#features`), 3 Feature Cards, Footer com copyright em build-time |
| **Workspace** | `apps/web` (`@taskflow/web`) — isolado de `apps/api`, sem imports cruzados |
| **Data Model** | Zero — sem D1, R2, KV ou qualquer mutação de estado. Conteúdo hardcoded em `src/data/content.ts` |
| **Integrações** | Zero APIs externas. Fonte Inter via `@fontsource/inter` (local, no bundle) |
| **Stack** | Astro `output: 'static'` + `@astrojs/cloudflare` + TailwindCSS + zero diretivas `client:*` |
| **Validação** | `astro check` + `astro build` (sem Vitest, por definição do Sprint Goal) |
| **Non-Goals** | Formulários, auth, blog, animações JS, i18n, pricing, domínio customizado (config manual no Dashboard CF Pages) |

PRD completo salvo em `architecture/plans/prd-sprint-sp-006.md` com 5 histórias de usuário, 14 requisitos funcionais priorizados (P0/P1/P2), restrições técnicas e casos limite documentados.