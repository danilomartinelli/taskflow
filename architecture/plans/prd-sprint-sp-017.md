# 2.3 Sem Payloads de API

Não há endpoints, formulários ou requests HTTP nesta sprint. A página é 100% estática.

---

## 3. Histórias de Usuário & Matriz do Avaliador

### US-001: Configuração do Workspace Astro

**Descrição:** Como desenvolvedor do time, eu quero um workspace `apps/web` configurado com Astro + TailwindCSS + tipografia Inter dentro do monorepo Turborepo, para que o projeto compile e faça deploy como página estática no Cloudflare Pages.

**Matriz de Teste do Avaliador:**

- [ ] **Build:** `pnpm --filter web build` executa com sucesso e gera a pasta `apps/web/dist/` com arquivos estáticos.
- [ ] **Type-check:** `pnpm --filter web astro check` retorna zero erros TypeScript.
- [ ] **Fonte:** A fonte Inter é carregada via `@fontsource/inter` (import local, sem Google Fonts externos).
- [ ] **Tailwind:** Classes utilitárias do TailwindCSS são aplicadas corretamente no HTML final (verificar no `dist/index.html`).
- [ ] **Zero JS cliente:** O `dist/index.html` gerado não contém tags `<script>` (exceto scripts injetados pelo Cloudflare Pages Analytics, que são zero nesta sprint).

---

### US-002: Seção Hero

**Descrição:** Como visitante da landing page, eu quero ver uma seção hero com título, subtítulo e botão CTA ao carregar a página, para que eu entenda imediatamente o valor do TaskFlow e saiba onde clicar para saber mais.

**Matriz de Teste do Avaliador:**

- [ ] **UI — Conteúdo:** A seção contém: (1) heading `<h1>` com o nome/tagline do produto, (2) parágrafo `<p>` com subtítulo descritivo, (3) elemento `<a>` com texto de CTA.
- [ ] **UI — âncora:** O botão CTA usa `href=\"#features\"` e rola suavemente até a seção de features (via CSS `scroll-behavior: smooth` no `<html>`, sem JS).
- [ ] **UI — Design:** Fundo `#0a0a0a`, texto principal branco/off-white, botão CTA com background `#00fa62` e texto escuro. Verificar no browser em 1280px e 375px de largura.
- [ ] **Acessibilidade:** O `<h1>` existe uma única vez na página.

---

### US-003: Seção de Features

**Descrição:** Como visitante, eu quero ver três cards de features com ícone, título e descrição, para que eu entenda as capacidades principais do TaskFlow de forma rápida e visual.

**Matriz de Teste do Avaliador:**

- [ ] **UI — Quantidade:** Exatamente 3 cards de feature são renderizados.
- [ ] **UI — Estrutura do card:** Cada card contém: (1) ícone SVG inline (não `<img src>`), (2) título `<h3>`, (3) parágrafo de descrição.
- [ ] **UI — ID âncora:** A seção possui `id=\"features\"` para que o CTA da Hero funcione.
- [ ] **UI — Layout:** Em desktop (≥ 768px), os 3 cards estão em layout de 3 colunas. Em mobile (< 768px), em coluna única. Verificar via DevTools.
- [ ] **Build:** Nenhum SVG referencia arquivo externo — todos são inline no HTML gerado.

---

### US-004: Footer Minimalista

**Descrição:** Como visitante, eu quero ver um footer com informações básicas do produto, para que a página tenha uma conclusão visual limpa e profissional.

**Matriz de Teste do Avaliador:**

- [ ] **UI — Conteúdo:** Footer contém copyright com ano atual e nome \"TaskFlow\".
- [ ] **UI — Design:** Fundo consistente com o tema dark, texto em tom de cinza neutro (menor contraste que o conteúdo principal), sem bordas ou elementos visuais excessivos.
- [ ] **Build:** O `dist/index.html` final contém o elemento `<footer>` com o conteúdo esperado.

---

### US-005: Deploy no Cloudflare Pages

**Descrição:** Como time de produto, eu quero a landing page acessível via URL pública `*.pages.dev`, para que possamos validar o resultado com stakeholders sem configuração adicional.

**Matriz de Teste do Avaliador:**

- [ ] **Deploy:** O projeto `taskflow-web` (ou equivalente) existe no dashboard do Cloudflare Pages com último deploy bem-sucedido.
- [ ] **URL:** A URL `https://<projeto>.pages.dev` retorna HTTP 200 com o HTML da landing page.
- [ ] **Assets:** CSS e fontes carregam sem erros 404 no painel Network do browser.
- [ ] **Config `wrangler.toml` / `pages.toml`:** O `build.command` aponta para `pnpm --filter web build` e o `build.output_directory` aponta para `apps/web/dist`.

---

## 4. Requisitos Funcionais (FR)

| ID | Prioridade | Requisito |
|----|------------|-----------|
| **REQ-001** | MUST | O workspace `apps/web` DEVE ser criado como um pnpm workspace válido com `package.json` contendo `\"name\": \"web\"` e scripts `dev`, `build` e `check`. |
| **REQ-002** | MUST | O Astro DEVE ser configurado com `output: 'static'` em `astro.config.mjs`. NÃO usar adapter SSR — a página é puramente estática. |
| **REQ-003** | MUST | O TailwindCSS DEVE ser integrado via `@astrojs/tailwind`. A config `tailwind.config.mjs` DEVE definir a cor customizada `neon: '#00fa62'` dentro de `theme.extend.colors` e a cor de fundo `dark: '#0a0a0a'`. |
| **REQ-004** | MUST | A fonte Inter DEVE ser importada via pacote `@fontsource/inter` no `BaseLayout.astro` (import estático, ex: `import '@fontsource/inter/400.css'` e `import '@fontsource/inter/700.css'`). NÃO usar Google Fonts CDN externo. |
| **REQ-005** | MUST | O `<html>` root DEVE ter a propriedade CSS `scroll-behavior: smooth` definida no stylesheet global ou via classe Tailwind `scroll-smooth`. Isso habilita o scroll suave do CTA sem JS. |
| **REQ-006** | MUST | O botão CTA da Hero DEVE ser um elemento `<a href=\"#features\">` — NÃO um `<button>` com event listener JavaScript. |
| **REQ-007** | MUST | A seção de features DEVE ter o atributo `id=\"features\"` para ser alvo da âncora do CTA. |
| **REQ-008** | MUST | Todos os ícones da seção Features DEVEM ser SVGs inline (markup diretamente no HTML). NÃO usar `<img src=\"icon.svg\">` nem `<use href=\"sprite.svg\">`. |
| **REQ-009** | MUST | O build final (`astro build`) NÃO DEVE incluir nenhum bundle JavaScript no cliente. Verificar com: `ls apps/web/dist/_astro/*.js` — deve retornar vazio ou o comando não deve encontrar arquivos `.js`. |
| **REQ-010** | MUST | O arquivo `astro.config.mjs` DEVE usar `@astrojs/cloudflare` adapter OU omiti-lo completamente — pages estáticas do Cloudflare não requerem adapter quando `output: 'static'`. Confirmar que o build gera `dist/` com `index.html` na raiz. |
| **REQ-011** | MUST | O `turbo.json` na raiz do monorepo DEVE incluir o pipeline `build` para o workspace `web`, garantindo que `turbo build --filter=web` funcione corretamente. |
| **REQ-012** | SHOULD | O `BaseLayout.astro` DEVE incluir meta tags essenciais: `<meta charset=\"UTF-8\">`, `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">`, `<title>TaskFlow</title>` e `<meta name=\"description\" content=\"...\">`. |
| **REQ-013** | SHOULD | O layout responsivo dos cards de Feature DEVE usar classes Tailwind: grid de 1 coluna em mobile (`grid-cols-1`) e 3 colunas em desktop (`md:grid-cols-3`). |
| **REQ-014** | COULD | O `favicon.svg` DEVE ser referenciado no `<head>` via `<link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon.svg\">`. |

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo estão **explicitamente proibidos** nesta sprint. Qualquer implementação destes itens será considerada scope creep e deverá ser revertida.

| Item | Justificativa |
|------|---------------|
| Rotas adicionais (`/pricing`, `/blog`, `/docs`, `/app`) | Esta sprint entrega uma única página (`/`). Novas rotas são sprint separada. |
| Formulário de captura de e-mail / newsletter | Requer backend, integração com Resend/Mailchimp e validação — sprint separada. |
| Integração com analytics (Cloudflare Web Analytics, Plausible, GA) | Nenhuma variável de ambiente ou script externo nesta sprint. |
| Dark/Light mode toggle | Requer JS ou `localStorage`. Esta sprint é zero-JS no cliente. |
| Animações CSS complexas (keyframes, parallax, scroll-triggered) | Apenas `transition` e `hover:` utilities do Tailwind são permitidos para microinterações básicas. |
| Testes unitários (Vitest) | Validação exclusiva via `astro check` e `astro build` conforme Sprint Goal. |
| Testes E2E (Playwright, Cypress) | Fora do escopo desta sprint. |
| Meta tags de Open Graph / og:image | Conteúdo social sharing é sprint separada. |
| Lighthouse score gate (≥ 90) | O critério de aceite é build verde + deploy funcional, não score de auditoria. |
| Internacionalização (i18n) | Todo conteúdo em português ou inglês fixo — sem sistema de tradução. |
| Componentes React/JSX | Esta sprint usa apenas `.astro` components — sem ilhas React (zero JS). |
| Domínio customizado | O deploy usa `*.pages.dev`. Configuração de domínio próprio é sprint separada. |

---

## 6. Cloudflare Bindings & Integrações

**Esta sprint não possui bindings nem integrações externas.**

| Tipo | Nome | Status |
|------|------|--------|
| D1 Database | — | ❌ Não utilizado |
| R2 Bucket | — | ❌ Não utilizado |
| KV Namespace | — | ❌ Não utilizado |
| Cloudflare Queue | — | ❌ Não utilizado |
| API Keys externas | — | ❌ Não utilizado |
| Variáveis de ambiente | — | ❌ Nenhuma necessária |

**Configuração de deploy (Cloudflare Pages Dashboard):**

```toml
# Configuração no dashboard do Cloudflare Pages (ou pages.toml na raiz do repo)
[build]
  command = \"pnpm --filter web build\"
  destination = \"apps/web/dist\"

[build.environment]
  NODE_VERSION = \"20\"
  PNPM_VERSION = \"9\"
```

---

## 7. Restrições & Casos Limite

### 7.1 Restrições Técnicas

| Restrição | Detalhe |
|-----------|---------|
| **Zero JS no cliente** | `astro.config.mjs` deve ter `output: 'static'`. Nenhum componente deve usar `client:load`, `client:idle`, `client:visible` ou qualquer diretiva de hidratação. |
| **Sem adapter SSR** | Para output estático no Cloudflare Pages, o adapter `@astrojs/cloudflare` NÃO é necessário e NÃO deve ser instalado. O Cloudflare Pages serve arquivos estáticos diretamente. |
| **Fonte via npm, não CDN** | `@fontsource/inter` garante que as fontes sejam inlined/servidas localmente, eliminando dependências de rede externas e melhorando performance. |
| **SVG inline obrigatório** | Ícones como `<img src>` criam requests de rede adicionais. SVGs inline eliminam requests e permitem coloração via CSS (`currentColor`). |
| **pnpm workspace** | O `package.json` raiz deve listar `apps/web` em `workspaces`. O `apps/web/package.json` deve ter `\"private\": true`. |
| **Node.js 20 no build** | Astro 4+ requer Node.js ≥ 18. Configurar `NODE_VERSION=20` no ambiente de build do Cloudflare Pages. |

### 7.2 Casos Limite & Fallbacks

| Cenário | Comportamento Esperado |
|---------|------------------------|
| JavaScript desabilitado no browser | A página funciona 100% — não há JS para ser desabilitado. O scroll suave degrada graciosamente (scroll instantâneo) em browsers que não suportam `scroll-behavior`. |
| Viewport muito pequeno (< 320px) | O layout deve ser usável mas não há breakpoint específico abaixo de `sm:` (375px). Não é caso de falha. |
| Build com warning de tipo TypeScript | `astro check` deve retornar zero **erros**. Warnings não bloqueiam o critério de aceite, mas devem ser corrigidos se possível. |
| Imagens ausentes | Esta sprint não usa imagens. Se adicionadas por engano, `astro build` lançará erro se os arquivos não existirem em `public/`. |

---

## 8. Checklist de Implementação (para o Specialist Agent)

Use esta lista como guia de execução. Cada item referencia o requisito funcional correspondente.

```
[ ] Criar apps/web/package.json com name=\"web\", scripts dev/build/check [Ref: REQ-001]
[ ] Adicionar apps/web ao campo workspaces do package.json raiz [Ref: REQ-001]
[ ] Instalar dependências: astro, @astrojs/tailwind, tailwindcss, @fontsource/inter [Ref: REQ-002, REQ-003, REQ-004]
[ ] Criar astro.config.mjs com output: 'static' e integração tailwind [Ref: REQ-002]
[ ] Criar tailwind.config.mjs com cores neon (#00fa62) e dark (#0a0a0a) [Ref: REQ-003]
[ ] Criar src/layouts/BaseLayout.astro com <head> completo, import de fontes, scroll-smooth [Ref: REQ-004, REQ-005, REQ-012]
[ ] Criar src/components/Hero.astro com h1, parágrafo, e <a href=\"#features\"> [Ref: REQ-006]
[ ] Criar src/components/FeatureCard.astro aceitando props { icon, title, description } [Ref: REQ-008]
[ ] Criar src/components/Features.astro com id=\"features\" e grid responsivo [Ref: REQ-007, REQ-008, REQ-013]
[ ] Criar src/components/Footer.astro com copyright [Ref: US-004]
[ ] Criar src/pages/index.astro compondo todos os componentes [Ref: US-001]
[ ] Criar public/favicon.svg e referenciar no BaseLayout [Ref: REQ-014]
[ ] Atualizar turbo.json para incluir pipeline do workspace web [Ref: REQ-011]
[ ] Validar: pnpm --filter web run check (zero erros) [Ref: REQ-001]
[ ] Validar: pnpm --filter web run build (dist/ gerado sem arquivos .js) [Ref: REQ-009]
[ ] Configurar projeto no Cloudflare Pages Dashboard [Ref: REQ-010, US-005]
[ ] Validar: URL *.pages.dev retorna HTTP 200 [Ref: US-005]
```

---

## Apêndice A: Referências de Design

### Paleta de Cores

```css
--color-bg:       #0a0a0a;  /* Fundo principal */
--color-surface:  #111111;  /* Cards / superfícies elevadas */
--color-border:   #1f1f1f;  /* Bordas sutis */
--color-text:     #f5f5f5;  /* Texto principal */
--color-muted:    #888888;  /* Texto secundário / footer */
--color-neon:     #00fa62;  /* Acento verde neon (CTA, destaques) */
```

### Tipografia

```css
font-family: 'Inter', sans-serif;

/* h1 Hero */    font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700;
/* h3 Feature */ font-size: 1.25rem; font-weight: 600;
/* p body */     font-size: 1rem; font-weight: 400; color: #888888;
/* footer */     font-size: 0.875rem; color: #888888;
```

### Estrutura Visual da Página

```
┌─────────────────────────────────────────┐
│              HERO SECTION               │
│  [H1] Tagline do TaskFlow               │
│  [p]  Subtítulo descritivo              │
│  [CTA Button → #features]              │
├─────────────────────────────────────────┤
│           FEATURES SECTION             │
│  id=\"features\"                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ [icon]  │ │ [icon]  │ │ [icon]  │   │
│  │ Title   │ │ Title   │ │ Title   │   │
│  │ Desc    │ │ Desc    │ │ Desc    │   │
│  └─────────┘ └─────────┘ └─────────┘   │
├─────────────────────────────────────────┤
│              FOOTER                     │
│  © 2025 TaskFlow                        │
└─────────────────────────────────────────┘
```

---

*PRD gerado pelo Witek Blueprint Agent — Sprint sp-017*  
*Fase 1 (Blueprint) concluída. Próxima fase: Link → Architect → Execution.*
"}}
File written successfully
**Resumo Executivo — Sprint sp-017**

**Escopo:** Landing page estática de página única (`/`) para o TaskFlow com três seções: Hero (h1 + subtítulo + CTA âncora `#features`), Features (3 cards com SVG inline, grid responsivo) e Footer. Novo workspace `apps/web` no monorepo Turborepo.

**Data Model:** Zero — nenhuma tabela D1, bucket R2 ou KV. Todo conteúdo é hardcoded em componentes `.astro`, compilados em HTML/CSS estático em `apps/web/dist/`.

**Stack:** Astro 4 (`output: 'static'`), TailwindCSS via `@astrojs/tailwind`, fonte Inter via `@fontsource/inter`. Sem adapter SSR, sem JS no cliente, sem hidratação de componentes React.

**Integrações:** Nenhuma. Sem variáveis de ambiente, sem API keys, sem bindings Cloudflare. Deploy configurado no dashboard do Cloudflare Pages com `build.command = "pnpm --filter web build"` e `destination = "apps/web/dist"`.

**Non-Goals explícitos:** Formulários, analytics, i18n, dark/light toggle, rotas adicionais, componentes React, Open Graph tags, Lighthouse gate, testes unitários/E2E, domínio customizado.

{"name": "complete_phase", "parameters": {"summary": "Blueprint sp-017 concluído: PRD da landing page estática TaskFlow gerado e salvo em architecture/plans/prd-sprint-sp-017.md — workspace apps/web, Astro static output, TailwindCSS, zero JS cliente, deploy Cloudflare Pages."}}
Phase marked as complete