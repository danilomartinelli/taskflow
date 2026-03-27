# US-003: Seção de Features

**Descrição:** Como visitante, eu quero visualizar as 3 principais funcionalidades do TaskFlow com ícones e descrições, para que eu entenda de forma rápida e visual o que o produto oferece.

**Matriz de Teste do Avaliador:**
- [ ] **UI:** A seção possui `id=\"features\"` e exibe exatamente 3 cards em layout responsivo (coluna única em mobile, 3 colunas em desktop ≥ 768px).
- [ ] **Conteúdo Feature 1:** Ícone SVG inline + título "Organize Tarefas" + descrição curta sobre organização de tarefas.
- [ ] **Conteúdo Feature 2:** Ícone SVG inline + título "Colabore em Equipe" + descrição curta sobre colaboração.
- [ ] **Conteúdo Feature 3:** Ícone SVG inline + título "Acompanhe o Progresso" + descrição curta sobre acompanhamento.
- [ ] **Ícones:** Cada ícone é um `<svg>` inline no HTML (sem `<img src>`, sem sprite externo, sem JS).
- [ ] **Acento:** Os ícones ou elementos de destaque dos cards utilizam a cor `#00fa62`.
- [ ] **Zero JS:** Nenhum script de interação nos cards.

---

### US-004: Footer Minimalista

**Descrição:** Como visitante, eu quero ver um rodapé limpo com informação de copyright, para que a página tenha encerramento visual adequado sem distrações.

**Matriz de Teste do Avaliador:**
- [ ] **UI:** O elemento `<footer>` está presente e é o último elemento da página.
- [ ] **Conteúdo:** Exibe exatamente o texto `© 2025 TaskFlow` (ou com o ano dinâmico via Astro em build time).
- [ ] **Visual:** Fundo consistente com o tema dark (`#0a0a0a` ou variação sutil), texto em cinza claro para hierarquia visual.
- [ ] **Links:** Nenhum link externo ou de navegação presente no footer (conforme decisão da entrevista).
- [ ] **Zero JS:** Footer é HTML/CSS puro.

---

### US-005: Build e Deploy no Cloudflare Pages

**Descrição:** Como DevOps/CTO, eu quero que o site faça deploy com sucesso no Cloudflare Pages via `wrangler.toml`, para que a landing page seja acessível publicamente.

**Matriz de Teste do Avaliador:**
- [ ] **Build Gate:** `pnpm --filter web build` gera o diretório `apps/web/dist/` com `index.html` e assets CSS.
- [ ] **Astro Check Gate:** `pnpm --filter web check` passa sem erros.
- [ ] **Zero JS emitido:** O diretório `dist/` não contém arquivos `.js` de client-side (apenas o CSS bundled e o HTML).
- [ ] **wrangler.toml válido:** O arquivo `apps/web/wrangler.toml` possui `name`, `pages_build_output_dir = \"dist\"` e `compatibility_date` válidos.
- [ ] **Turborepo integrado:** O `apps/web/package.json` possui scripts `build`, `check` e `dev` que o Turborepo consegue orquestrar via `turbo.json` na raiz.

---

## 4. Requisitos Funcionais (FR)

### Infraestrutura & Setup

**REQ-001** *(Must)* — Criar o workspace `apps/web` como um pacote pnpm independente, com `package.json` nomeado `\"name\": \"web\"` e scripts `dev`, `build` e `check`.

**REQ-002** *(Must)* — Configurar Astro com `output: 'static'` no `astro.config.mjs`. Esta flag garante geração de HTML estático puro sem adaptador de runtime.

**REQ-003** *(Must)* — Integrar TailwindCSS via integração oficial Astro (`@astrojs/tailwind`). O arquivo `tailwind.config.mjs` deve estender o tema com:
```js
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00fa62',
        'dark-bg': '#0a0a0a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**REQ-004** *(Must)* — Importar `@fontsource/inter` no arquivo de estilos globais `src/styles/global.css`:
```css
/* src/styles/global.css */
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/inter/700.css';

html {
  scroll-behavior: smooth;
  background-color: #0a0a0a;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
}

body {
  margin: 0;
  padding: 0;
}
```

**REQ-005** *(Must)* — Criar `apps/web/wrangler.toml` com configuração mínima para Cloudflare Pages:
```toml
name = \"taskflow-web\"
pages_build_output_dir = \"dist\"
compatibility_date = \"2025-01-01\"
```

**REQ-006** *(Must)* — Registrar `apps/web` no `pnpm-workspace.yaml` da raiz (se ainda não usar glob `apps/*`) e garantir que o `turbo.json` da raiz inclua os pipelines `build`, `check` e `dev` que o workspace `web` requer.

---

### Estrutura de Arquivos

**REQ-007** *(Must)* — A estrutura de arquivos obrigatória do workspace é:
```
apps/web/
├── package.json
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── wrangler.toml
└── src/
    ├── styles/
    │   └── global.css
    ├── layouts/
    │   └── BaseLayout.astro
    ├── components/
    │   ├── Hero.astro
    │   ├── Features.astro
    │   └── Footer.astro
    └── pages/
        └── index.astro
```

**REQ-008** *(Must)* — O arquivo `src/layouts/BaseLayout.astro` deve incluir: `<html lang=\"pt-BR\">`, meta charset, meta viewport, título da página, import do `global.css` e slot para conteúdo. **Nenhuma tag `<script>` de runtime deve ser injetada pelo layout.**

---

### Seção Hero

**REQ-009** *(Must)* — O componente `src/components/Hero.astro` deve renderizar:
- Um elemento `<section id=\"hero\">` como container raiz.
- Título principal `<h1>` com o texto **\"TaskFlow\"**.
- Subtítulo `<p>` com o texto **\"Gerencie tarefas, colabore com sua equipe e acompanhe resultados — tudo em um só lugar.\"** (copy hardcoded, editável diretamente no arquivo).
- Botão CTA implementado como `<a href=\"#features\" class=\"...\">Ver Funcionalidades</a>` — tag `<a>`, não `<button>`, para garantir navegação sem JS.

**REQ-010** *(Must)* — Estilos do Hero via classes Tailwind:
- Container: `min-h-screen flex flex-col items-center justify-center text-center px-6`.
- `<h1>`: `text-5xl md:text-7xl font-bold text-white`.
- `<p>`: `text-lg md:text-xl text-gray-400 mt-4 max-w-2xl`.
- Link CTA: `mt-8 inline-block bg-[#00fa62] text-[#0a0a0a] font-semibold px-8 py-4 rounded-lg text-lg hover:opacity-90 transition-opacity`.

---

### Seção Features

**REQ-011** *(Must)* — O componente `src/components/Features.astro` deve renderizar uma `<section id=\"features\">` com grid de 3 cards. Cada card contém: ícone SVG inline, título `<h3>` e parágrafo `<p>` de descrição.

**REQ-012** *(Must)* — Conteúdo hardcoded dos 3 cards:

| Card | Título | Descrição |
|------|--------|-----------|
| 1 | Organize Tarefas | Crie, priorize e gerencie todas as suas tarefas em um único painel intuitivo. Nunca perca o fio do que é importante. |
| 2 | Colabore em Equipe | Atribua tarefas, mencione colegas e acompanhe o trabalho de todos em tempo real, sem reuniões desnecessárias. |
| 3 | Acompanhe o Progresso | Visualize o avanço de projetos com dashboards claros. Saiba exatamente onde cada tarefa está no seu ciclo de vida. |

**REQ-013** *(Must)* — Ícones SVG inline para cada card (usar ícones minimalistas de 24x24, stroke `#00fa62`):
- **Card 1 (Organização):** Ícone de lista/checklist.
- **Card 2 (Colaboração):** Ícone de pessoas/grupo.
- **Card 3 (Progresso):** Ícone de gráfico/tendência de alta.

Os SVGs devem ser embutidos diretamente no HTML do componente (inline), com atributos `width=\"32\" height=\"32\" fill=\"none\" stroke=\"#00fa62\" stroke-width=\"2\"`.

**REQ-014** *(Must)* — Layout do grid via Tailwind: `grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6 py-24`. Cada card: `bg-[#111111] rounded-xl p-8 flex flex-col items-start gap-4`.

---

### Footer

**REQ-015** *(Must)* — O componente `src/components/Footer.astro` deve renderizar um `<footer>` com:
- Texto: `© 2025 TaskFlow` (ano pode ser gerado em build time via `new Date().getFullYear()` dentro de `{/* */}` Astro — isso ocorre em build time, não em runtime).
- Nenhum link, nenhum ícone de rede social, nenhum formulário.
- Estilos: `text-center py-8 text-gray-600 text-sm border-t border-[#1a1a1a]`.

---

### Gates de Qualidade

**REQ-016** *(Must)* — O comando `pnpm --filter web check` (astro check) deve passar com **zero erros e zero warnings** antes de considerar a sprint concluída. [Ref: CI Gate]

**REQ-017** *(Must)* — O comando `pnpm --filter web build` deve gerar o diretório `dist/` sem erros. O diretório gerado **não deve conter nenhum arquivo `.js`** de client-side. [Ref: REQ-002]

**REQ-018** *(Should)* — O HTML gerado deve ser válido segundo os critérios semânticos básicos: uso correto de `<h1>` único por página, alt text em imagens (se houver), lang no html, meta description.

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo são **explicitamente proibidos** nesta sprint. Qualquer implementação destes itens deve ser recusada e movida para backlog:

| # | Item Proibido | Justificativa |
|---|---------------|--------------|
| NG-001 | Formulários de qualquer tipo (contato, waitlist, newsletter) | Requer validação e backend — fora do escopo de landing estática |
| NG-002 | Analytics (Google Analytics, Plausible, Cloudflare Web Analytics, Umami) | Zero scripts de rastreamento nesta sprint |
| NG-003 | Internacionalização (i18n) — múltiplos idiomas ou rotas `/en`, `/es` | Complexidade de roteamento desnecessária agora |
| NG-004 | Páginas adicionais (`/about`, `/pricing`, `/blog`, `/login`) | Single-page apenas |
| NG-005 | Animações JavaScript (Framer Motion, GSAP, AOS, Motion One) | Zero JS no cliente é requisito hard |
| NG-006 | CMS headless (Contentful, Sanity, Storyblok, Notion API) | Conteúdo é hardcoded nesta sprint |
| NG-007 | Testes unitários ou E2E (Vitest, Playwright, Cypress) | Validação via `astro check` + `astro build` apenas |
| NG-008 | Componentes React/Vue/Svelte hidratados (ilhas Astro) | `client:*` directives são proibidas — output 100% estático |
| NG-009 | Dark/Light mode toggle | Tema dark fixo, sem seleção do usuário |
| NG-010 | Variáveis de ambiente ou secrets | Zero `import.meta.env` além de variáveis built-in do Astro |
| NG-011 | Bindings Cloudflare (D1, KV, R2, Queues) | Não há dados dinâmicos nesta sprint |

---

## 6. Cloudflare Bindings & Integrações

**Bindings Cloudflare:** Nenhum.

**APIs Externas:** Nenhuma.

**Variáveis de Ambiente:** Nenhuma.

**Configuração de Deploy:**

```toml
# apps/web/wrangler.toml
name = \"taskflow-web\"
pages_build_output_dir = \"dist\"
compatibility_date = \"2025-01-01\"
```

O deploy é acionado apontando o Cloudflare Pages para o diretório `apps/web`, com build command `pnpm --filter web build` e output directory `apps/web/dist`.

---

## 7. Restrições & Casos Limite

### RT-001: Zero JavaScript no Cliente (Hard Constraint)
O Astro com `output: 'static'` não emite JS por padrão — mas **qualquer uso de `client:load`, `client:idle`, `client:visible` ou `client:only` é proibido** nesta sprint, pois injetaria hydration scripts. O agente executor deve verificar que nenhum componente importado usa essas diretivas.

### RT-002: Scroll Suave via CSS (Não via JS)
O comportamento de scroll suave ao clicar no botão CTA deve ser implementado exclusivamente via:
```css
html {
  scroll-behavior: smooth;
}
```
**Nunca** via `window.scrollTo()`, `element.scrollIntoView()` ou qualquer listener JavaScript.

### RT-003: Ícones SVG Inline (Não via Biblioteca)
Ícones devem ser SVGs embutidos diretamente no HTML — **não use** `astro-icon`, `heroicons` via pacote npm, `lucide-astro` ou qualquer biblioteca de ícones que possa introduzir JS ou processos de build complexos. SVGs inline garantem zero dependências e zero requests extras.

### RT-004: @fontsource/inter (Não via Google Fonts)
A tipografia Inter deve ser servida via pacote npm `@fontsource/inter`, não via `<link>` para `fonts.googleapis.com`. Isso elimina a dependência de DNS externo e melhora performance/privacidade.

### RT-005: Compatibilidade com pnpm Workspaces
O `package.json` de `apps/web` deve declarar a versão do Node como engine `>=18` e não deve usar `\"workspaces\"` próprio (isso é gerenciado pelo `pnpm-workspace.yaml` na raiz). O campo `\"private\": true` deve estar presente.

### RT-006: Ano do Copyright em Build Time
O footer pode usar `{new Date().getFullYear()}` na sintaxe de template Astro. Isso é avaliado **em build time** (no servidor de CI), não em runtime no browser — portanto não viola a regra de zero JS cliente.

### RT-007: Dependências Permitidas
Dependências permitidas para `apps/web`:
```json
{
  \"dependencies\": {
    \"@fontsource/inter\": \"latest\"
  },
  \"devDependencies\": {
    \"astro\": \"latest\",
    \"@astrojs/tailwind\": \"latest\",
    \"tailwindcss\": \"latest\",
    \"typescript\": \"latest\"
  }
}
```
Não adicionar nenhuma outra dependência sem aprovação explícita.

---

## 8. Sequência de Execução Recomendada

Para minimizar retrabalho, o agente executor deve seguir esta ordem:

1. **[REQ-001, REQ-005, REQ-006]** — Criar `apps/web/package.json`, `wrangler.toml` e registrar no workspace pnpm.
2. **[REQ-002, REQ-003]** — Configurar `astro.config.mjs` e `tailwind.config.mjs`.
3. **[REQ-004, REQ-008]** — Criar `src/styles/global.css` e `src/layouts/BaseLayout.astro`.
4. **[REQ-009, REQ-010]** — Implementar `src/components/Hero.astro`.
5. **[REQ-011, REQ-012, REQ-013, REQ-014]** — Implementar `src/components/Features.astro`.
6. **[REQ-015]** — Implementar `src/components/Footer.astro`.
7. **[REQ-007]** — Montar `src/pages/index.astro` compondo os 3 componentes no layout.
8. **[REQ-016, REQ-017]** — Executar `pnpm --filter web check` e `pnpm --filter web build`. Corrigir erros antes de considerar concluído.

---

## Metadados

| Campo | Valor |
|-------|-------|
| Sprint Code | `sp-015` |
| Criado em | 2025 |
| Autor | Witek Blueprint Agent |
| Status | Aprovado para Execução |
| Arquivo SSoT | `architecture/plans/prd-sprint-sp-015.md` |
| Workspace alvo | `apps/web` |
| Comando de validação | `pnpm --filter web check && pnpm --filter web build` |
"}}
File written successfully
{"name": "complete_phase", "parameters": {"summary": "Blueprint sp-015 concluído: PRD da landing page estática TaskFlow (apps/web) gerado com 5 histórias de usuário, 18 requisitos funcionais, 11 non-goals explícitos e zero bindings Cloudflare."}}
Phase marked as complete