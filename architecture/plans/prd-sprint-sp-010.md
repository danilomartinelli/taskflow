# Code Map

## apps/web

**Tipo:** Astro + TailwindCSS (Static Site)
**Entrypoint:** `apps/web/src/pages/index.astro`
**Deploy:** Cloudflare Pages

### Páginas
| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/` | `src/pages/index.astro` | Página principal (a ser criada na sp-010) |

### Componentes (a criar na sp-010)
| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| `Hero` | `src/components/Hero.astro` | Seção hero com título, subtítulo e CTA |
| `Features` | `src/components/Features.astro` | Grid de 3 features com ícones SVG inline |
| `Footer` | `src/components/Footer.astro` | Footer minimalista |

### Assets & Estilos
| Arquivo | Descrição |
|---------|-----------|
| `src/styles/global.css` | Estilos globais + variáveis CSS + import @fontsource/inter |
| `public/favicon.svg` | Favicon SVG do TaskFlow |

### Config
| Arquivo | Descrição |
|---------|-----------|
| `astro.config.mjs` | Config Astro com adapter Cloudflare Pages |
| `tailwind.config.mjs` | Config TailwindCSS com tema customizado (cores neon) |
| `tsconfig.json` | TypeScript config para Astro |
| `wrangler.toml` | Config do Cloudflare Pages (sem bindings) |
O `code-map.md` já reflete a estrutura planejada para `sp-010` — sem duplicações. Gerando o PRD completo agora.

,
};
```

### 2.2 Conteúdo das Features

```ts
// Embutido em src/components/Features.astro
const features: Feature[] = [
  {
    id: \"f1\",
    icon: \"<svg>...</svg>\",  // SVG inline — sem arquivos externos
    title: \"Gestão Visual\",
    description: \"Arraste, solte e priorize tarefas em quadros Kanban intuitivos.\",
  },
  {
    id: \"f2\",
    icon: \"<svg>...</svg>\",
    title: \"Foco Total\",
    description: \"Bloqueio de distrações integrado e timer Pomodoro para máxima produtividade.\",
  },
  {
    id: \"f3\",
    icon: \"<svg>...</svg>\",
    title: \"Deploy Instantâneo\",
    description: \"Sincronize equipes em tempo real com zero configuração de infraestrutura.\",
  },
];

interface Feature {
  id: string;
  icon: string;      // SVG como string literal
  title: string;
  description: string;
}
```

### 2.3 Conteúdo do Footer

```ts
// Embutido em src/components/Footer.astro
const footer = {
  brand: \"TaskFlow\",
  tagline: \"Built for makers.\",
  year: new Date().getFullYear(),   // avaliado em build-time pelo Astro
  copyright: `© ${year} TaskFlow. Todos os direitos reservados.`,
};
```

### 2.4 Tokens de Design (Contrato CSS)

```css
/* src/styles/global.css — variáveis obrigatórias */
:root {
  --color-bg:       #0a0a0a;  /* background global */
  --color-surface:  #111111;  /* cards / seções elevadas */
  --color-accent:   #00fa62;  /* verde neon — cor de destaque */
  --color-text:     #f5f5f5;  /* texto primário */
  --color-muted:    #888888;  /* texto secundário */
  --font-sans:      'Inter', system-ui, sans-serif;
}
```

---

## 3. Histórias de Usuário & Matriz do Avaliador

> **Aviso de Escopo:** Todas as US abaixo são executáveis dentro desta única Sprint e produzem apenas arquivos estáticos.

---

### US-001: Estrutura do Projeto Astro

**Descrição:** Como desenvolvedor, eu quero um projeto Astro configurado corretamente no monorepo em `apps/web/` para que o pipeline de build e deploy funcione de ponta a ponta.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Build:** `pnpm --filter web build` executa `astro build` sem erros e gera `apps/web/dist/`.
- [ ] **Type-check:** `pnpm --filter web check` executa `astro check` sem erros de tipo.
- [ ] **Config:** `astro.config.mjs` usa `output: 'static'` e adapter `@astrojs/cloudflare` configurado para Pages.
- [ ] **Tailwind:** `tailwind.config.mjs` inclui as cores `accent: '#00fa62'` e `bg: '#0a0a0a'` no tema estendido.
- [ ] **Fonte:** `@fontsource/inter` está instalado e importado em `src/styles/global.css`.
- [ ] **Zero JS:** O HTML gerado no `dist/` não contém nenhuma tag `<script>` com código de aplicação.

---

### US-002: Seção Hero

**Descrição:** Como visitante, eu quero ver imediatamente o título, subtítulo e botão de call-to-action da landing page para que eu entenda o propósito do TaskFlow e possa navegar para mais detalhes.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **UI:** A seção Hero ocupa no mínimo `100vh` e está centralizada verticalmente (flexbox).
- [ ] **Conteúdo:** O `<h1>` exibe o headline definido no contrato de dados (§2.1).
- [ ] **CTA:** O botão âncora possui `href=\"#features\"` e rola suavemente até a seção Features (`scroll-behavior: smooth` via CSS global).
- [ ] **Tipografia:** O `<h1>` usa a classe Tailwind correspondente a `font-size: clamp(2.5rem, 6vw, 4.5rem)` (responsivo) e `font-weight: 700`.
- [ ] **Acento:** O texto do botão CTA ou sua borda usa a cor `#00fa62`.
- [ ] **Acessibilidade:** O `<h1>` é o único heading de nível 1 na página.

---

### US-003: Seção de Features

**Descrição:** Como visitante, eu quero ver três cartões de funcionalidades com ícone, título e descrição para que eu compreenda rapidamente o valor diferencial do TaskFlow.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Âncora:** A seção possui `id=\"features\"` para receber o scroll do CTA do Hero.
- [ ] **Layout:** Os três cartões são exibidos em grid: 1 coluna em mobile, 3 colunas em `md:` (≥768px).
- [ ] **Ícones:** Cada cartão contém um ícone SVG inline válido (sem src externo, sem `<img>`, sem `<use href>`).
- [ ] **Conteúdo:** Os títulos e descrições das 3 features correspondem ao contrato de dados (§2.2).
- [ ] **Superfície:** O fundo de cada cartão usa `--color-surface` (`#111111`) para contraste com o background global.
- [ ] **Build:** `astro build` não gera warnings de `<img>` sem `alt` ou SVGs malformados.

---

### US-004: Footer Minimalista

**Descrição:** Como visitante, eu quero ver um footer com o nome da marca e copyright para que a página tenha fechamento visual profissional.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Conteúdo:** Exibe \"TaskFlow\", tagline e copyright com ano dinâmico (avaliado em build-time).
- [ ] **Layout:** Footer usa `text-align: center` e padding vertical adequado (`py-8` ou equivalente).
- [ ] **Cor:** Texto usa `--color-muted` (`#888888`) para hierarquia visual.
- [ ] **Sem links externos:** O footer desta Sprint não contém links de navegação, redes sociais ou âncoras externas.

---

### US-005: Deploy no Cloudflare Pages

**Descrição:** Como time de produto, eu quero o site publicado no Cloudflare Pages via subdomínio automático para que a landing page seja acessível publicamente sem configuração de DNS.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Projeto Pages:** Um projeto Cloudflare Pages está criado e vinculado ao repositório (branch `main`).
- [ ] **Build Command:** O Cloudflare Pages executa `pnpm --filter web build` (ou `cd apps/web && pnpm build`) com sucesso.
- [ ] **Output Dir:** O diretório de output configurado no Pages é `apps/web/dist`.
- [ ] **Acesso público:** A URL `https://<projeto>.pages.dev` retorna HTTP 200 com o HTML da landing page.
- [ ] **Assets:** CSS e fontes carregam corretamente (sem 404 em assets estáticos).

---

## 4. Requisitos Funcionais (FR)

### Prioridade: MUST (Obrigatório para DoD)

| ID | Requisito |
|----|-----------|
| **REQ-001** | O projeto Astro DEVE estar localizado em `apps/web/` dentro do monorepo Turborepo, com `package.json` declarando `\"name\": \"web\"` para filtragem via `pnpm --filter web`. |
| **REQ-002** | O `astro.config.mjs` DEVE configurar `output: 'static'` e usar o adapter `@astrojs/cloudflare`. PROIBIDO usar `output: 'server'` ou `output: 'hybrid'` nesta Sprint. |
| **REQ-003** | A fonte Inter DEVE ser importada via `@fontsource/inter` em `src/styles/global.css` (ex: `@import '@fontsource/inter/400.css'; @import '@fontsource/inter/700.css';`). PROIBIDO usar `<link>` do Google Fonts — zero dependência de CDN externo. |
| **REQ-004** | Todos os ícones das Features DEVEM ser SVGs inline hardcoded nos componentes Astro. PROIBIDO usar `<img src>`, `<use href>`, sprites externos ou bibliotecas de ícones com runtime JS. |
| **REQ-005** | O HTML final gerado pelo `astro build` NÃO DEVE conter nenhuma tag `<script>` com código de aplicação. O atributo `is:inline` e scripts de terceiros são explicitamente proibidos nesta Sprint. |
| **REQ-006** | O arquivo `wrangler.toml` em `apps/web/` DEVE existir e declarar `name` e `compatibility_date`, mas NÃO DEVE declarar nenhum binding (D1, KV, R2, Queues) — a página é 100% estática. |
| **REQ-007** | O `tailwind.config.mjs` DEVE estender o tema padrão com as cores customizadas: `accent: '#00fa62'`, `bg-base: '#0a0a0a'`, `surface: '#111111'`, `muted: '#888888'`. As classes devem ser utilizadas nos componentes (ex: `text-accent`, `bg-base`). |
| **REQ-008** | A propriedade CSS `scroll-behavior: smooth` DEVE ser definida em `html { scroll-behavior: smooth; }` no `global.css` para que a âncora `#features` do CTA funcione sem JavaScript. |
| **REQ-009** | O `turbo.json` na raiz do monorepo DEVE incluir `web#build` no pipeline para que `turbo build` processe `apps/web` corretamente. |

### Prioridade: SHOULD (Fortemente Recomendado)

| ID | Requisito |
|----|-----------|
| **REQ-010** | O layout base DEVE ser extraído para `src/layouts/BaseLayout.astro` com as tags `<html>`, `<head>` (meta charset, viewport, title, description) e `<body>`. A página `index.astro` DEVE importar e usar `BaseLayout`. |
| **REQ-011** | O `<head>` DEVE incluir `<meta name=\"description\">` com descrição do TaskFlow (mín. 120 caracteres) e `<meta property=\"og:title\">` para mínimo de SEO estático. |
| **REQ-012** | O `public/favicon.svg` DEVE existir com um ícone SVG representativo do TaskFlow (pode ser um ícone simples de checkmark ou lightning bolt em verde neon `#00fa62`). |

### Prioridade: COULD (Opcional / Nice-to-have — NÃO comprometido para esta Sprint)

| ID | Requisito |
|----|-----------|
| **REQ-013** | *(Opcional)* Adicionar `<link rel=\"preload\">` para as fontes Inter como otimização de performance. |

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo são **explicitamente proibidos** nesta Sprint. Qualquer implementação destes itens constitui violação do escopo e deve ser rejeitada no code review.

| # | Item Proibido | Justificativa |
|---|---------------|---------------|
| NG-01 | Animações CSS complexas (keyframes, transitions sofisticadas) | Aumenta complexidade sem valor para o DoD desta Sprint |
| NG-02 | Toggle de dark/light mode | Requer JavaScript no cliente — viola REQ-005 |
| NG-03 | Internacionalização (i18n) | Fora do escopo; conteúdo em PT-BR é suficiente |
| NG-04 | Seção de Pricing | Produto ainda não tem pricing definido |
| NG-05 | Seção de FAQ | Conteúdo não definido; sprint subsequente |
| NG-06 | Seção de Testimonials/Social Proof | Sem depoimentos disponíveis |
| NG-07 | Páginas adicionais (`/terms`, `/privacy`, `/about`) | Single-page é o escopo desta Sprint |
| NG-08 | Formulário de captura de email / Waitlist | Exigiria Worker + D1 — fora do escopo |
| NG-09 | Integração com CMS (Contentful, Sanity, etc.) | Conteúdo é estático e hardcoded nesta Sprint |
| NG-10 | Testes unitários (Vitest) | Validação feita exclusivamente via `astro check` + `astro build` |
| NG-11 | CI/CD pipeline customizado (GitHub Actions, etc.) | Deploy via Cloudflare Pages nativo é suficiente |
| NG-12 | Domínio customizado / DNS | Subdomínio `*.pages.dev` é o DoD desta Sprint |
| NG-13 | Analytics ou tracking scripts | Zero scripts de terceiros nesta Sprint |
| NG-14 | Biblioteca de ícones com runtime JS (Lucide React, Heroicons React) | Viola REQ-005; use SVG inline |

---

## 6. Cloudflare Bindings & Integrações

### Bindings

**Nenhum.** Esta Sprint não utiliza nenhum Cloudflare Binding.

```toml
# apps/web/wrangler.toml — configuração mínima
name = \"taskflow-web\"
compatibility_date = \"2025-01-01\"

# Sem [d1_databases], [kv_namespaces], [r2_buckets] ou [queues]
```

### APIs Externas

**Nenhuma.** Zero chamadas a APIs externas, zero variáveis de ambiente necessárias.

### Dependências de Desenvolvimento (pnpm)

```json
// apps/web/package.json — dependências obrigatórias
{
  \"name\": \"web\",
  \"type\": \"module\",
  \"scripts\": {
    \"dev\": \"astro dev\",
    \"build\": \"astro build\",
    \"check\": \"astro check\",
    \"preview\": \"astro preview\"
  },
  \"dependencies\": {
    \"@fontsource/inter\": \"^5.0.0\"
  },
  \"devDependencies\": {
    \"astro\": \"^4.0.0\",
    \"@astrojs/cloudflare\": \"^10.0.0\",
    \"@astrojs/tailwind\": \"^5.0.0\",
    \"tailwindcss\": \"^3.4.0\",
    \"typescript\": \"^5.0.0\"
  }
}
```

> **Nota:** Versões são aproximadas. O executor deve usar as versões estáveis mais recentes compatíveis entre si no momento da Sprint.

---

## 7. Restrições & Casos Limite

### 7.1 Restrições Técnicas

| Restrição | Detalhe |
|-----------|---------|
| **Runtime Edge** | `@astrojs/cloudflare` com `output: 'static'` — nenhum código roda no Worker em runtime; tudo é gerado em build-time. |
| **Zero Node.js APIs** | Mesmo em build-time do Astro, não usar `fs`, `path` ou `process.env` em componentes — o Astro compila para V8 Isolate. |
| **Fontes locais** | `@fontsource/inter` serve os arquivos de fonte a partir do bundle estático. O Cloudflare Pages servirá os `.woff2` diretamente do `dist/`. |
| **SVG Inline** | SVGs devem ser válidos (tag fechada, sem atributos inválidos) — `astro check` validará o template. |
| **Monorepo path** | O executor DEVE confirmar a estrutura de `apps/web/` com `list_directory` antes de criar arquivos. |

### 7.2 Casos Limite & Comportamentos Esperados

| Cenário | Comportamento Esperado |
|---------|------------------------|
| Usuário acessa `/#features` diretamente | O browser rola para a seção automaticamente via âncora HTML nativa — sem JS necessário. |
| JavaScript desabilitado no browser | A página renderiza 100% funcionalmente — sem degradação, sem elementos ocultos. |
| Build em CI com pnpm workspace | `pnpm --filter web build` deve funcionar a partir da raiz do monorepo. |
| Cloudflare Pages não encontra `dist/` | O Output Directory no painel do Pages DEVE ser configurado como `apps/web/dist` (path relativo à raiz do repo). |
| Fonte Inter não carrega | Fallback via `font-family: system-ui, sans-serif` declarado no CSS — página permanece legível. |

---

## 8. Estrutura de Arquivos Esperada

O executor DEVE criar exatamente esta estrutura em `apps/web/`:

```
apps/web/
├── public/
│   └── favicon.svg                    # Ícone SVG do TaskFlow
├── src/
│   ├── components/
│   │   ├── Hero.astro                 # Seção hero — [Ref: US-002, REQ-004]
│   │   ├── Features.astro             # Grid de 3 features — [Ref: US-003, REQ-004]
│   │   └── Footer.astro               # Footer minimalista — [Ref: US-004]
│   ├── layouts/
│   │   └── BaseLayout.astro           # Layout base com <html>, <head>, <body> — [Ref: REQ-010]
│   ├── pages/
│   │   └── index.astro                # Página principal — orquestra os 3 componentes
│   └── styles/
│       └── global.css                 # Variáveis CSS + @fontsource/inter — [Ref: REQ-003, REQ-007, REQ-008]
├── astro.config.mjs                   # Config Astro — [Ref: REQ-002]
├── tailwind.config.mjs                # Config TailwindCSS — [Ref: REQ-007]
├── tsconfig.json                      # TypeScript config para Astro
├── wrangler.toml                      # Config mínima Cloudflare Pages — [Ref: REQ-006]
└── package.json                       # Dependências — [Ref: §6]
```

---

## 9. Exemplos de Código de Referência

### 9.1 `astro.config.mjs`

```js
// apps/web/astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',          // REQ-002: NUNCA usar 'server' nesta Sprint
  adapter: cloudflare(),
  integrations: [tailwind()],
});
```

### 9.2 `tailwind.config.mjs`

```js
// apps/web/tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,ts}'],
  theme: {
    extend: {
      colors: {
        accent:  '#00fa62',   // REQ-007: verde neon
        'bg-base': '#0a0a0a', // REQ-007: background global
        surface: '#111111',   // REQ-007: cards elevados
        muted:   '#888888',   // REQ-007: texto secundário
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### 9.3 `src/styles/global.css`

```css
/* apps/web/src/styles/global.css */
@import '@fontsource/inter/400.css';   /* REQ-003 */
@import '@fontsource/inter/700.css';   /* REQ-003 */

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-bg:      #0a0a0a;
  --color-surface: #111111;
  --color-accent:  #00fa62;
  --color-text:    #f5f5f5;
  --color-muted:   #888888;
  --font-sans:     'Inter', system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;  /* REQ-008: ancora #features sem JS */
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

### 9.4 `src/layouts/BaseLayout.astro`

```astro
---
// apps/web/src/layouts/BaseLayout.astro
import '../styles/global.css';  // REQ-003, REQ-008

interface Props {
  title?: string;
  description?: string;
}

const {
  title = 'TaskFlow — Organize. Priorize. Entregue.',
  description = 'TaskFlow é a ferramenta de gestão de tarefas built for makers — simples, rápida e sem distrações. Organize projetos, priorize tarefas e entregue resultados com foco total.',
} = Astro.props;
---
<!doctype html>
<html lang=\"pt-BR\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <meta name=\"description\" content={description} />          <!-- REQ-011 -->
    <meta property=\"og:title\" content={title} />               <!-- REQ-011 -->
    <meta property=\"og:description\" content={description} />
    <title>{title}</title>
    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon.svg\" /> <!-- REQ-012 -->
  </head>
  <body class=\"bg-bg-base text-white min-h-screen\">
    <slot />
  </body>
</html>
```

### 9.5 `src/pages/index.astro`

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
    <Features />
  </main>
  <Footer />
</BaseLayout>
```

### 9.6 `src/components/Hero.astro`

```astro
---
// apps/web/src/components/Hero.astro
// REQ-004: Zero JS no cliente | US-002
const cta = { label: 'Ver Funcionalidades', href: '#features' };
---
<section class=\"min-h-screen flex flex-col items-center justify-center px-6 text-center\">
  <h1 class=\"font-bold text-white mb-6 leading-tight\"
      style=\"font-size: clamp(2.5rem, 6vw, 4.5rem);\">
    Organize. Priorize. Entregue.
  </h1>
  <p class=\"text-muted max-w-xl mb-10 text-lg leading-relaxed\">
    TaskFlow é a ferramenta de gestão de tarefas built for makers —
    simples, rápida e sem distrações.
  </p>
  <a
    href={cta.href}
    class=\"border border-accent text-accent font-semibold px-8 py-3 rounded-lg
           hover:bg-accent hover:text-bg-base transition-colors duration-200\"
  >
    {cta.label}
  </a>
</section>
```

### 9.7 `src/components/Features.astro`

```astro
---
// apps/web/src/components/Features.astro
// REQ-004: SVG inline obrigatório | US-003
interface Feature { id: string; title: string; description: string; }

const features: Feature[] = [
  {
    id: 'f1',
    title: 'Gestão Visual',
    description: 'Arraste