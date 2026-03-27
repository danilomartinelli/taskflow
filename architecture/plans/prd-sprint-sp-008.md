# PRD — Sprint sp-008: TaskFlow Landing Page

**Status:** Draft  
**Sprint Code:** sp-008  
**Data:** 2025  
**Autor:** Witek Blueprint Agent  

---

## 1. Visão Geral & North Star

### Problema

O TaskFlow não possui presença pública na web. Sem uma landing page, não há como comunicar o valor do produto a potenciais usuários ou direcionar tráfego orgânico para o app.

### Solução

Criar uma landing page estática, de alta performance, usando Astro + TailwindCSS no novo workspace `apps/web`. A página comunica o valor do TaskFlow com um Hero, três cards de features e um footer minimalista — zero JavaScript no cliente, design dark com acento verde neon, deploy no Cloudflare Pages.

### Definition of Done (DoD)

A Sprint está **concluída** quando:

1. `astro check` retorna **zero erros** de tipo/template.
2. `astro build` gera o artefato estático em `apps/web/dist/` **sem warnings** de build.
3. A página está **acessível via URL pública** `*.pages.dev` no Cloudflare Pages.
4. A página renderiza corretamente em viewport mobile (375px) e desktop (1280px) sem quebra de layout.

---

## 2. Esquema de Dados (SSoT)

Esta Sprint é **puramente estática**. Não há banco D1, bucket R2 ou KV store envolvidos. Todo o "dado" é copy hardcoded no template Astro.

### 2.1 Copy — Fonte Única da Verdade (hardcoded em `src/pages/index.astro`)

```ts
// Referência de copy — NÃO importe de arquivo externo nesta sprint
const COPY = {
  hero: {
    headline: "Organize. Colabore. Entregue.",
    subheadline:
      "TaskFlow transforma caos em clareza. Gerencie tarefas, acompanhe progresso e mantenha seu time em sincronia — tudo em um só lugar.",
    cta: {
      label: "Ver como funciona",
      anchor: "#features",
    },
  },
  features: [
    {
      icon: "check-circle", // SVG inline definido no componente
      title: "Organize sem esforço",
      description:
        "Crie, priorize e categorize tarefas em segundos. Quadros Kanban e listas adaptam-se ao seu fluxo de trabalho.",
    },
    {
      icon: "users",
      title: "Colabore em tempo real",
      description:
        "Atribua responsáveis, adicione comentários e mantenha todos na mesma página — sem reuniões desnecessárias.",
    },
    {
      icon: "zap",
      title: "Entregue com consistência",
      description:
        "Dashboards de progresso e alertas inteligentes garantem que nenhum prazo seja esquecido.",
    },
  ],
  footer: {
    copy: `© ${new Date().getFullYear()} TaskFlow. Todos os direitos reservados.`,
  },
};
```

### 2.2 Estrutura de Arquivos do Workspace

```
apps/web/                          ← novo workspace Astro
├── astro.config.mjs               ← output: 'static', adapter: nenhum
├── package.json                   ← nome: "@taskflow/web"
├── tailwind.config.mjs
├── tsconfig.json
├── public/
│   └── favicon.svg
└── src/
    ├── layouts/
    │   └── BaseLayout.astro        ← <html>, <head>, fontes, meta tags
    ├── components/
    │   ├── Hero.astro
    │   ├── Features.astro
    │   ├── FeatureCard.astro
    │   └── Footer.astro
    └── pages/
        └── index.astro             ← ÚNICA rota desta sprint
```

### 2.3 Design Tokens (Tailwind Config)

```js
// tailwind.config.mjs — extensões obrigatórias
theme: {
  extend: {
    colors: {
      bg:      '#0a0a0a',   // background principal
      surface: '#111111',   // cards / superfícies elevadas
      neon:    '#00fa62',   // acento verde neon
      muted:   '#6b7280',   // texto secundário
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
},
```

---

## 3. Histórias de Usuário & Matriz do Avaliador

> **Aviso de Escopo:** Todas as histórias abaixo são executáveis dentro desta única Sprint. Nenhuma delas exige JavaScript no cliente, rotas adicionais ou integrações externas.

---

### US-001: Workspace Astro Configurado

**Descrição:** Como desenvolvedor, eu quero um workspace Astro funcional em `apps/web` para que a pipeline do Turborepo consiga executar `astro check` e `astro build` de forma isolada.

**Matriz de Teste do Avaliador:**

- [ ] **Build:** `pnpm --filter @taskflow/web build` executa sem erros a partir da raiz do monorepo.
- [ ] **Check:** `pnpm --filter @taskflow/web check` (astro check) retorna zero erros.
- [ ] **Turborepo:** O workspace `apps/web` aparece no grafo de dependências do Turborepo (`turbo run build --dry`).
- [ ] **Isolamento:** O `package.json` de `apps/web` NÃO lista dependências que já existam apenas em outros workspaces sem necessidade real.

---

### US-002: Hero Section com CTA Âncora

**Descrição:** Como visitante, eu quero ver um Hero impactante com headline, subheadline e botão CTA ao abrir a landing page, para que eu entenda imediatamente o valor do TaskFlow e possa navegar para as features.

**Matriz de Teste do Avaliador:**

- [ ] **E2E/UI:** A página exibe headline "Organize. Colabore. Entregue." centralizada em viewport 375px e 1280px.
- [ ] **E2E/UI:** O botão CTA "Ver como funciona" possui `href="#features"` e rola suavemente até a seção de features (CSS `scroll-behavior: smooth` no `<html>`).
- [ ] **Dados:** Não há chamada de API, fetch ou JavaScript no bundle de saída (`dist/`).
- [ ] **Acessibilidade:** O `<h1>` é único na página e contém a headline principal.

---

### US-003: Seção de 3 Features com Ícones SVG Inline

**Descrição:** Como visitante, eu quero ver três cards de features com ícones SVG, título e descrição, para que eu entenda as capacidades principais do TaskFlow sem precisar clicar em nada.

**Matriz de Teste do Avaliador:**

- [ ] **E2E/UI:** A seção com `id="features"` renderiza exatamente 3 cards.
- [ ] **E2E/UI:** Cada card exibe: ícone SVG inline (não `<img src>`), título em destaque e descrição em texto muted.
- [ ] **Dados:** Os ícones são SVG inline no HTML final (verificável via `view-source`) — zero requests de imagem para esta seção.
- [ ] **Responsividade:** Cards empilhados em coluna única em mobile (375px) e em grid 3 colunas em desktop (1280px).

---

### US-004: Footer Minimalista

**Descrição:** Como visitante, eu quero ver um footer simples com copyright, para que a página tenha uma conclusão visual clara.

**Matriz de Teste do Avaliador:**

- [ ] **E2E/UI:** O footer exibe texto de copyright com o ano corrente.
- [ ] **Dados:** O ano é gerado em build-time via `new Date().getFullYear()` — zero JS no cliente.
- [ ] **E2E/UI:** O footer tem borda superior sutil e texto centralizado.

---

### US-005: Deploy no Cloudflare Pages

**Descrição:** Como time de produto, eu quero a landing page acessível via URL pública `*.pages.dev`, para que possamos compartilhar e validar o resultado da Sprint.

**Matriz de Teste do Avaliador:**

- [ ] **Build:** O diretório de output `apps/web/dist/` é gerado com `index.html` na raiz.
- [ ] **Deploy:** A URL `*.pages.dev` retorna HTTP 200 com o HTML da landing page.
- [ ] **Performance:** A página não carrega nenhum arquivo `.js` referenciado no HTML de saída (verificável via DevTools → Network).
- [ ] **Segurança:** Não há variáveis de ambiente expostas no HTML de saída.

---

## 4. Requisitos Funcionais

| ID      | Prioridade | Requisito |
|---------|-----------|-----------|
| REQ-001 | **MUST**  | O workspace `apps/web` deve ser criado com Astro em modo `output: 'static'`. Nenhum adapter SSR deve ser instalado. |
| REQ-002 | **MUST**  | O `package.json` do workspace deve ter nome `"@taskflow/web"` e os scripts: `"dev": "astro dev"`, `"build": "astro build"`, `"check": "astro check"`. |
| REQ-003 | **MUST**  | A tipografia Inter deve ser instalada via `@fontsource/inter` e importada no `BaseLayout.astro` (import CSS, não Google Fonts CDN). |
| REQ-004 | **MUST**  | O background da página deve ser `#0a0a0a` aplicado via classe Tailwind `bg-bg` no elemento `<body>`. |
| REQ-005 | **MUST**  | O acento verde neon `#00fa62` deve ser usado no botão CTA e nos ícones SVG das features. |
| REQ-006 | **MUST**  | O elemento `<html>` deve ter `class="scroll-smooth"` para habilitar rolagem suave via CSS (sem JS). |
| REQ-007 | **MUST**  | O botão CTA no Hero deve ser um `<a href="#features">` — NÃO um `<button>` com event listener. |
| REQ-008 | **MUST**  | Os três ícones SVG das features devem ser inline no HTML final (definidos diretamente no template `.astro`) — NÃO via `<img>`, `<use>` ou fetch. |
| REQ-009 | **MUST**  | O build final em `dist/` NÃO deve conter nenhum arquivo `.js` referenciado nas tags `<script>` do HTML. Astro deve gerar HTML puro. |
| REQ-010 | **MUST**  | O `astro.config.mjs` deve configurar `output: 'static'` explicitamente. |
| REQ-011 | **MUST**  | A seção de features deve ter `id="features"` para funcionar como alvo da âncora do CTA. |
| REQ-012 | **MUST**  | O `turbo.json` na raiz do monorepo deve incluir o pipeline de build para `apps/web` (ou o workspace deve ser detectado automaticamente pelo Turborepo via pnpm workspaces). |
| REQ-013 | **SHOULD** | As meta tags `<title>`, `<meta name="description">` e `<meta property="og:*">` básicas devem ser definidas no `BaseLayout.astro`. |
| REQ-014 | **SHOULD** | O layout deve ser responsivo: Hero centralizado com `max-w-3xl`, grid de features `grid-cols-1 md:grid-cols-3`. |
| REQ-015 | **COULD**  | Um `favicon.svg` minimalista com a inicial "T" na cor neon pode ser incluído em `public/`. |

---

## 5. Fora do Escopo (Non-Goals)

As seguintes funcionalidades estão **explicitamente proibidas** nesta Sprint para evitar scope creep:

| Item | Motivo |
|------|--------|
| Rotas adicionais (`/about`, `/pricing`, `/docs`, `/blog`) | Apenas `index.astro` é permitido nesta Sprint |
| Formulário de contato ou waitlist | Exigiria integração com API ou serviço externo |
| Página de preços | Feature de sprint futura |
| Toggle dark/light mode | Complexidade de estado desnecessária; o design é sempre dark |
| Animações CSS complexas (scroll-triggered, keyframes elaborados) | Risco de scope creep; apenas transições `hover:` simples são permitidas |
| Internacionalização (i18n) | Fora do MVP |
| JavaScript no cliente (scripts, interatividade) | Violação direta do Sprint Goal |
| Autenticação ou qualquer sessão de usuário | Não aplicável a página estática |
| Integração com analytics (GA, Plausible, Clarity) | Sprint futura |
| Testes unitários ou de integração (Vitest, Playwright) | Explicitamente excluídos do Sprint Goal; validação apenas via `astro check` + `astro build` |
| Domínio customizado no Cloudflare Pages | DoD desta sprint aceita apenas `*.pages.dev` |

---

## 6. Cloudflare Bindings & Integrações

### Bindings Cloudflare

**Nenhum.** A landing page é 100% estática. Não há Workers, D1, KV, R2 ou Queues envolvidos.

### APIs Externas

**Nenhuma.** Nenhuma chave de API, token ou variável de ambiente é necessária para esta Sprint.

### Configuração do Cloudflare Pages

| Parâmetro | Valor |
|-----------|-------|
| **Framework preset** | Astro |
| **Build command** | `pnpm --filter @taskflow/web build` |
| **Build output directory** | `apps/web/dist` |
| **Root directory** | `/` (raiz do monorepo) |
| **Node.js version** | 20 (compatível com Astro 4+) |
| **Variáveis de ambiente** | Nenhuma necessária |

---

## 7. Restrições & Casos Limite

### 7.1 Restrições Técnicas

- **Zero JS no cliente:** Astro por padrão não injeta JS em páginas sem componentes interativos (`client:*` directives). **PROIBIDO** usar qualquer diretiva `client:load`, `client:idle`, `client:visible` ou `<script>` tags no template.
- **Fontes via @fontsource:** A Inter deve ser importada via `import '@fontsource/inter'` no `BaseLayout.astro` — **NÃO** via link CDN do Google Fonts (que causaria request externo e potencial bloqueio de privacidade).
- **Compatibilidade Edge:** Embora a landing seja estática (sem Workers), o projeto roda em Turborepo — não introduza scripts de build que dependam de módulos Node.js nativos não suportados no ecossistema Cloudflare.
- **Astro versão:** Use Astro 4.x+ (compatível com `astro check` como comando nativo).

### 7.2 Casos Limite

| Cenário | Comportamento Esperado |
|---------|------------------------|
| JavaScript desabilitado no browser | A página deve ser 100% funcional — toda navegação é via âncora HTML nativa |
| Viewport muito pequeno (< 320px) | Layout não precisa ser otimizado abaixo de 375px (iPhone SE é o baseline) |
| Build sem variáveis de ambiente | Build deve completar com sucesso — nenhuma env var é lida em build-time |
| `astro check` encontra erro de tipo | O CI deve falhar e o deploy não deve ocorrer |

### 7.3 Dependências do Workspace

```json
// apps/web/package.json — dependências esperadas
{
  "dependencies": {
    "astro": "^4.0.0",
    "@astrojs/tailwind": "^5.0.0",
    "@fontsource/inter": "^5.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

> **Nota:** Não adicione `@astrojs/cloudflare` — esse adapter é para SSR/Workers. Para output estático, nenhum adapter é necessário.

---

## 8. Guia de Implementação para o Agente Executor

### 8.1 Ordem de Execução Recomendada

```
1. Criar apps/web/package.json                    [Ref: REQ-001, REQ-002]
2. Criar astro.config.mjs com output: 'static'    [Ref: REQ-001, REQ-010]
3. Criar tailwind.config.mjs com tokens           [Ref: REQ-004, REQ-005]
4. Criar tsconfig.json (extends Astro defaults)   [Ref: REQ-001]
5. Criar src/layouts/BaseLayout.astro             [Ref: REQ-003, REQ-006, REQ-013]
6. Criar src/components/FeatureCard.astro         [Ref: REQ-008, US-003]
7. Criar src/components/Features.astro            [Ref: REQ-011, US-003]
8. Criar src/components/Hero.astro                [Ref: REQ-007, US-002]
9. Criar src/components/Footer.astro              [Ref: US-004]
10. Criar src/pages/index.astro                   [Ref: REQ-009, US-002..004]
11. Verificar/atualizar pnpm-workspace.yaml        [Ref: REQ-012]
12. Executar: pnpm --filter @taskflow/web check   [DoD gate 1]
13. Executar: pnpm --filter @taskflow/web build   [DoD gate 2]
14. Configurar projeto no Cloudflare Pages        [Ref: US-005]
```

### 8.2 Exemplo de `astro.config.mjs`

```js
// apps/web/astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',   // [Ref: REQ-001, REQ-010]
  integrations: [tailwind()],
});
```

### 8.3 Exemplo de `BaseLayout.astro`

```astro
---
// apps/web/src/layouts/BaseLayout.astro
import '@fontsource/inter';  // [Ref: REQ-003]

export interface Props {
  title?: string;
  description?: string;
}

const {
  title = 'TaskFlow — Organize. Colabore. Entregue.',
  description = 'TaskFlow transforma caos em clareza. Gerencie tarefas, acompanhe progresso e mantenha seu time em sincronia.',
} = Astro.props;
---

<!doctype html>
<html lang="pt-BR" class="scroll-smooth">   <!-- [Ref: REQ-006] -->
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body class="bg-bg text-white font-sans antialiased">  <!-- [Ref: REQ-004] -->
    <slot />
  </body>
</html>
```

### 8.4 Exemplo de SVG Inline para FeatureCard

```astro
---
// apps/web/src/components/FeatureCard.astro
// [Ref: REQ-008] — ícone deve ser SVG inline, NÃO <img>
export interface Props {
  icon: 'check-circle' | 'users' | 'zap';
  title: string;
  description: string;
}
const { icon, title, description } = Astro.props;
---

<div class="rounded-xl bg-surface p-6 flex flex-col gap-4">
  <div class="text-neon w-8 h-8">
    {icon === 'check-circle' && (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )}
    {icon === 'users' && (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952
             4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07
             M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766
             l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0
             3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0
             015.25 0z" />
      </svg>
    )}
    {icon === 'zap' && (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    )}
  </div>
  <h3 class="text-lg font-semibold text-white">{title}</h3>
  <p class="text-muted text-sm leading-relaxed">{description}</p>
</div>
```

### 8.5 Exemplo de `index.astro` (Estrutura Geral)

```astro
---
// apps/web/src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import Features from '../components/Features.astro';
import Footer from '../components/Footer.astro';
---

<BaseLayout>
  <main>
    <Hero />
    <Features />  <!-- id="features" deve estar AQUI [Ref: REQ-011] -->
  </main>
  <Footer />
</BaseLayout>
```

---

## 9. Checklist de Validação Final (DoD Gate)

Antes de marcar a Sprint como concluída, o executor deve verificar:

- [ ] `pnpm --filter @taskflow/web check` → **zero erros**
- [ ] `pnpm --filter @taskflow/web build` → **zero erros, zero warnings**
- [ ] `dist/index.html` existe e contém o HTML esperado
- [ ] `view-source` da URL `*.pages.dev` não contém tags `<script src="...">` ou `<script>` com código JS
- [ ] Ícones SVG estão inline no HTML (não são requisições de rede)
- [ ] Inter está carregada via CSS de `@fontsource/inter` (não CDN Google)
- [ ] Botão CTA tem `href="#features"` (não onclick, não JS)
- [ ] `<html class="scroll-smooth">` presente no HTML de saída
- [ ] A página renderiza corretamente em 375px e 1280px de largura

---

*Documento gerado pelo Witek Blueprint Agent — Fase 1 (Blueprint) do protocolo B.L.A.S.T.*  
*Arquivo: `architecture/plans/prd-sprint-sp-008.md`*
</parameter>
</invoke>
</function_calls>
<function_calls>
<invoke name="complete_phase">
<parameter name="summary">Blueprint sp-008 concluído: PRD da landing page estática TaskFlow (Astro + TailwindCSS) salvo em architecture/plans/prd-sprint-sp-008.md — workspace apps/web, zero JS no cliente, deploy Cloudflare Pages via *.pages.dev.</parameter>
</invoke>
</function_calls>

**Resumo Executivo — Sprint sp-008**

| Dimensão | Decisão |
|---|---|
| **Escopo** | Landing page estática de única rota (`index.astro`) com Hero, 3 Features e Footer |
| **Data Model** | Nenhum — copy 100% hardcoded no template Astro, zero D1/R2/KV |
| **Stack** | Astro 4 + TailwindCSS 3 + @fontsource/inter, workspace `apps/web` no Turborepo |
| **Integrações** | Nenhuma chave de API, nenhuma env var — deploy via Cloudflare Pages com output dir `apps/web/dist` |
| **Non-Goals** | Rotas adicionais, formulários, JS no cliente, analytics, i18n, testes unitários, domínio customizado |

O PRD completo foi salvo em `architecture/plans/prd-sprint-sp-008.md` com 5 histórias de usuário, 15 requisitos funcionais priorizados (MUST/SHOULD/COULD), exemplos de código para todos os componentes críticos e o checklist de DoD final.