# Code Map — TaskFlow

> Última atualização: Sprint sp-002
> Gerado pelo Trigger Agent ao final de cada sprint.

## Estrutura do Monorepo

```
taskflow/
├── apps/
│   └── (nenhuma app criada ainda)
├── packages/
│   └── (nenhum pacote criado ainda)
├── tooling/
│   └── (nenhuma config criada ainda)
├── package.json          # workspace root
├── pnpm-workspace.yaml
└── turbo.json
```

## Registro de Componentes

> Nenhum componente registrado ainda. Esta seção será populada após a Sprint sp-001.

## Serviços e Utilitários

> Nenhum serviço registrado ainda.

## Schemas de Dados

> Nenhum schema registrado ainda.

## Rotas e Endpoints

> Nenhuma rota registrada ainda.

## Notas de Arquitetura

> Repositório inicializado na Sprint sp-000 (configuração do monorepo). Primeira feature sprint começa em sp-001.
```
{"name": "read_file", "parameters": {"path": "architecture/findings.md"}}
File: architecture/findings.md
```md
# Findings — TaskFlow

> Base de conhecimento acumulada de erros, soluções e decisões técnicas.

## Nenhum finding registrado ainda.

> Esta seção será populada conforme os agentes encontrarem e resolverem problemas técnicos durante as sprints.
```
Tudo confirmado. O monorepo está limpo — `apps/web` não existe ainda, nenhum componente duplicado possível. Gerando o PRD agora.

}
```

---

## 3. Histórias de Usuário & Matriz do Avaliador

### US-001: Estrutura do Workspace Astro

**Descrição:** Como desenvolvedor, eu quero um workspace `apps/web` configurado no Turborepo com Astro, TailwindCSS e `@fontsource/inter`, para que o ambiente de desenvolvimento e build esteja pronto.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Build:** `pnpm --filter web build` executa sem erros a partir da raiz do monorepo
- [ ] **Typecheck:** `pnpm --filter web typecheck` (`tsc --noEmit`) retorna zero erros
- [ ] **Workspace:** `pnpm-workspace.yaml` inclui `apps/*` e o pacote `web` aparece em `pnpm list -r`
- [ ] **Turborepo:** `turbo.json` na raiz define a task `build` para propagar para `apps/web`

---

### US-002: Seção Hero

**Descrição:** Como visitante da landing page, eu quero ver uma seção Hero com título, subtítulo e botão CTA, para que eu entenda imediatamente o valor do TaskFlow e saiba como agir.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **UI:** O `<h1>` com o nome/tagline do TaskFlow está visível acima da dobra em viewport 1280px
- [ ] **UI:** O botão CTA usa `href=\"#features\"` como âncora interna (sem JavaScript, sem scroll programático)
- [ ] **UI:** O botão CTA tem background `#00fa62`, texto escuro (`#0a0a0a`), e estado hover com `#00d452`
- [ ] **Zero JS:** O Network tab do DevTools não mostra nenhum arquivo `.js` carregado na página
- [ ] **Fonte:** Inter é carregada via `@fontsource/inter` (import no `BaseLayout.astro`), sem requisições a fonts.googleapis.com

---

### US-003: Seção Features (3 cards)

**Descrição:** Como visitante, eu quero ver três features destacadas do TaskFlow com ícones e descrições, para que eu compreenda as capacidades principais do produto.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **UI:** Exatamente 3 cards de feature são renderizados no HTML com `id=\"features\"` no container pai
- [ ] **UI:** Cada card contém: um ícone SVG inline (sem `<img src>`), um título (`<h3>`) e um parágrafo descritivo
- [ ] **Responsividade:** Layout em coluna única em mobile (`< 768px`), grid de 3 colunas em desktop (`≥ 1024px`)
- [ ] **Acessibilidade:** Cada SVG tem `aria-hidden=\"true\"` pois é decorativo (o texto do card já descreve a feature)
- [ ] **Zero JS:** Nenhum script é necessário para renderizar ou animar os cards

---

### US-004: Footer Minimalista

**Descrição:** Como visitante, eu quero ver um footer com informações básicas do TaskFlow, para que a página tenha um fechamento visual adequado.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **UI:** Footer renderizado na base da página com copyright e/ou nome do produto
- [ ] **UI:** Cor de texto usa `text-secondary` (`#a1a1aa`) — sem branco puro no footer
- [ ] **UI:** Nenhum link de navegação, formulário ou componente interativo presente no footer
- [ ] **Build:** Nenhum warning de acessibilidade relacionado ao footer no output do `astro build`

---

### US-005: Deploy no Cloudflare Pages

**Descrição:** Como responsável pelo produto, eu quero que a landing page esteja acessível via URL pública no Cloudflare Pages, para que o critério de Done esteja oficialmente cumprido.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Deploy:** `wrangler pages deploy dist/` retorna sucesso sem erros (executado dentro de `apps/web/`)
- [ ] **Acesso:** A URL pública fornecida pelo Cloudflare Pages retorna HTTP 200
- [ ] **Conteúdo:** O HTML retornado contém as strings `TaskFlow` no `<title>` e nas seções Hero/Features
- [ ] **Assets:** O CSS está carregado (página não aparece sem estilo)

---

## 4. Requisitos Funcionais (FR)

### REQ-001 — Workspace Astro isolado [MUST]
Crie o workspace `apps/web` com os seguintes arquivos de configuração:

**`apps/web/package.json`** — dependências obrigatórias:
```json
{
  \"name\": \"web\",
  \"version\": \"0.0.1\",
  \"private\": true,
  \"scripts\": {
    \"dev\": \"astro dev\",
    \"build\": \"astro build\",
    \"preview\": \"astro preview\",
    \"typecheck\": \"tsc --noEmit\"
  },
  \"dependencies\": {
    \"@astrojs/tailwind\": \"^5.x\",
    \"@fontsource/inter\": \"^5.x\",
    \"astro\": \"^4.x\",
    \"tailwindcss\": \"^3.x\"
  },
  \"devDependencies\": {
    \"typescript\": \"^5.x\"
  }
}
```

**`apps/web/astro.config.ts`**:
```typescript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
});
```

**`apps/web/tsconfig.json`**:
```json
{
  \"extends\": \"astro/tsconfigs/strict\",
  \"compilerOptions\": {
    \"baseUrl\": \".\",
    \"paths\": {
      \"@/*\": [\"src/*\"]
    }
  }
}
```

**`apps/web/wrangler.toml`**:
```toml
name = \"taskflow-web\"
pages_build_output_dir = \"dist\"
```

---

### REQ-002 — Turborepo: task `build` propagada [MUST]
O `turbo.json` na raiz do monorepo deve incluir a task `build` de forma que `turbo build` execute `astro build` em `apps/web`. Se o `turbo.json` já existir, adicione `\"build\"` ao pipeline sem remover tasks existentes.

```json
{
  \"$schema\": \"https://turbo.build/schema.json\",
  \"tasks\": {
    \"build\": {
      \"outputs\": [\"dist/**\"]
    },
    \"typecheck\": {
      \"outputs\": []
    },
    \"dev\": {
      \"cache\": false,
      \"persistent\": true
    }
  }
}
```

---

### REQ-003 — Design Tokens via TailwindCSS [MUST]
O `tailwind.config.ts` DEVE estender (não substituir) o tema padrão com os design tokens definidos na seção 2.5. Use `theme.extend` para não perder utilitários base do Tailwind.

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#111111',
        accent: '#00fa62',
        'accent-hover': '#00d452',
        'text-primary': '#ffffff',
        'text-secondary': '#a1a1aa',
        'text-muted': '#52525b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

---

### REQ-004 — BaseLayout com `@fontsource/inter` [MUST]
O `BaseLayout.astro` DEVE importar a fonte Inter via pacote npm (NÃO via Google Fonts CDN) e definir o `<html>` com `lang=\"en\"`, `class=\"bg-background text-text-primary\"`. Meta tags obrigatórias: `charset`, `viewport`, `title`, `description`.

```astro
---
// src/layouts/BaseLayout.astro
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

interface Props {
  title?: string;
  description?: string;
}

const {
  title = 'TaskFlow — Gerenciamento de tarefas simples e poderoso',
  description = 'TaskFlow transforma a forma como você organiza seu trabalho. Simples, rápido e focado no que importa.',
} = Astro.props;
---

<!doctype html>
<html lang=\"en\" class=\"bg-background text-text-primary\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <meta name=\"description\" content={description} />
    <title>{title}</title>
    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon.svg\" />
  </head>
  <body class=\"font-sans antialiased\">
    <slot />
  </body>
</html>
```

---

### REQ-005 — Componente Hero [MUST]
O `Hero.astro` DEVE conter:
- `<h1>` com a tagline principal do TaskFlow
- `<p>` com subtítulo descritivo
- `<a href=\"#features\">` estilizado como botão CTA (âncora interna, sem JavaScript)
- Background `bg-background`, texto `text-text-primary`, botão `bg-accent text-background`

```astro
---
// src/components/Hero.astro
---

<section class=\"flex min-h-screen flex-col items-center justify-center px-6 text-center\">
  <h1 class=\"max-w-3xl text-5xl font-bold leading-tight text-text-primary md:text-6xl lg:text-7xl\">
    Organize seu trabalho.<br />
    <span class=\"text-accent\">Sem ruído.</span>
  </h1>
  <p class=\"mt-6 max-w-xl text-lg text-text-secondary\">
    TaskFlow transforma a forma como você gerencia tarefas — simples o suficiente para começar hoje, poderoso o suficiente para escalar com seu time.
  </p>
  <a
    href=\"#features\"
    class=\"mt-10 inline-block rounded-lg bg-accent px-8 py-4 text-base font-semibold text-background transition-colors hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background\"
  >
    Ver funcionalidades
  </a>
</section>
```

---

### REQ-006 — Componente Features (3 cards com SVG inline) [MUST]
O `Features.astro` DEVE conter exatamente 3 cards. Cada card deve ter:
- SVG inline com `aria-hidden=\"true\"` e `class` de cor accent
- `<h3>` com nome da feature
- `<p>` com descrição curta
- `id=\"features\"` no container pai (necessário para a âncora do CTA funcionar)

Grid: `grid-cols-1` no mobile, `lg:grid-cols-3` no desktop.

```astro
---
// src/components/Features.astro
const features = [
  {
    title: 'Foco no que importa',
    description: 'Priorize tarefas com clareza. Sem abas infinitas, sem notificações desnecessárias.',
    icon: `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"12\" r=\"6\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/></svg>`,
  },
  {
    title: 'Colaboração real',
    description: 'Compartilhe projetos e acompanhe o progresso do time em tempo real, sem atrito.',
    icon: `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"/><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"/></svg>`,
  },
  {
    title: 'Velocidade edge',
    description: 'Infraestrutura no edge global. Suas tarefas carregam instantaneamente, de qualquer lugar.',
    icon: `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\"/></svg>`,
  },
];
---

<section id=\"features\" class=\"px-6 py-24\">
  <div class=\"mx-auto max-w-5xl\">
    <h2 class=\"mb-16 text-center text-3xl font-bold text-text-primary md:text-4xl\">
      Por que TaskFlow?
    </h2>
    <div class=\"grid grid-cols-1 gap-8 lg:grid-cols-3\">
      {features.map((feature) => (
        <div class=\"rounded-xl border border-surface bg-surface p-8\">
          <div class=\"mb-4 text-accent\" set:html={feature.icon} />
          <h3 class=\"mb-3 text-xl font-semibold text-text-primary\">{feature.title}</h3>
          <p class=\"text-text-secondary leading-relaxed\">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

### REQ-007 — Componente Footer Minimalista [MUST]
O `Footer.astro` DEVE conter apenas copyright. Sem links de navegação, formulários ou componentes interativos.

```astro
---
// src/components/Footer.astro
const year = new Date().getFullYear();
---

<footer class=\"border-t border-surface px-6 py-8\">
  <div class=\"mx-auto max-w-5xl text-center\">
    <p class=\"text-sm text-text-secondary\">
      © {year} TaskFlow. Todos os direitos reservados.
    </p>
  </div>
</footer>
```

---

### REQ-008 — Página `index.astro` composição final [MUST]
A página raiz DEVE compor os três componentes na ordem correta: Hero → Features → Footer.

```astro
---
// src/pages/index.astro
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

---

### REQ-009 — Zero JavaScript no cliente [MUST]
O `astro.config.ts` usa `output: 'static'`. PROIBIDO:
- Usar diretivas `client:*` (`client:load`, `client:idle`, etc.) em qualquer componente
- Importar frameworks JS (React, Vue, Svelte) nesta sprint
- Adicionar `<script>` tags no HTML final

Verificação: O output de `astro build` não deve conter arquivos `.js` em `dist/_astro/`.

---

### REQ-010 — Typecheck e Build como gates de CI [MUST]
Nenhum código é considerado pronto até que ambos passem:

```bash
# Executar a partir de apps/web/
pnpm typecheck   # tsc --noEmit — zero erros
pnpm build       # astro build — zero warnings críticos
```

Sem testes automatizados (vitest, Playwright, etc.) nesta sprint.

---

### REQ-011 — Deploy via Wrangler Pages [MUST]
Após o build, o deploy é feito com:

```bash
# Executar a partir de apps/web/
npx wrangler pages deploy dist/
```

O `wrangler.toml` com `pages_build_output_dir = \"dist\"` é suficiente. Nenhuma autenticação via variável de ambiente é necessária além do login padrão do Wrangler CLI.

---

## 5. Fora do Escopo (Non-Goals)

As seguintes funcionalidades são **explicitamente PROIBIDAS** nesta sprint. Qualquer agente executor que tentar implementar itens desta lista está violando o escopo.

| Item | Motivo da Exclusão |
|---|---|
| Página de preços (`/pricing`) | Fora do sprint — apenas rota `/` |
| Página de blog (`/blog`) | Fora do sprint — apenas rota `/` |
| Sistema de autenticação | Nenhum usuário logado na landing |
| Formulário de contato ou waitlist | Exigiria backend, fora do escopo |
| Analytics (Plausible, GA, etc.) | Adiciona scripts externos, viola zero-JS |
| Testes automatizados (vitest, Playwright) | Explicitamente excluído pelo CTO |
| Animações CSS complexas (keyframes elaborados) | Scope creep de visual |
| Dark/Light mode toggle | Componente interativo, requer JS |
| Internacionalização (i18n) | Complexidade fora do sprint |
| Componentes React, Vue ou Svelte | Landing é zero-JS — Astro puro |
| Responsividade tablet (breakpoint `md` como foco) | Apenas mobile e desktop são obrigatórios |
| Meta tags avançadas de SEO (OG, Twitter Cards, Schema.org) | Apenas `title` e `description` nesta sprint |
| Imagens raster (.png, .jpg, .webp) | Apenas SVG inline e CSS |
| Sitemap ou robots.txt | Infraestrutura de SEO para sprint futura |

---

## 6. Cloudflare Bindings & Integrações

### 6.1 Bindings Cloudflare

**Nenhum binding necessário.** Esta é uma aplicação 100% estática.

### 6.2 Variáveis de Ambiente

**Nenhuma variável de ambiente.** Zero secrets, zero tokens, zero API keys.

### 6.3 Dependências npm (não-dev)

| Pacote | Versão | Propósito |
|---|---|---|
| `astro` | `^4.x` | Framework estático SSG |
| `@astrojs/tailwind` | `^5.x` | Integração oficial TailwindCSS |
| `tailwindcss` | `^3.x` | Utilitários CSS |
| `@fontsource/inter` | `^5.x` | Fonte Inter self-hosted (zero CDN externo) |

### 6.4 Compatibilidade Edge

Não aplicável — Astro com `output: 'static'` gera HTML/CSS puro. Não há runtime Cloudflare Workers envolvido. O Cloudflare Pages serve os assets estáticos diretamente.

---

## 7. Restrições & Casos Limite

### 7.1 Restrições Técnicas

- **`output: 'static'`** é obrigatório no `astro.config.ts`. Qualquer mudança para `'server'` ou `'hybrid'` invalida o requisito de zero-JS e altera o modelo de deploy.
- **`set:html`** (usado em REQ-006 para SVG inline) é uma diretiva Astro nativa e segura para conteúdo trusted. O conteúdo SVG é definido em tempo de build, não em runtime — não há risco de XSS.
- **`@fontsource/inter`** instala múltiplos arquivos de peso. Importe apenas os pesos utilizados (`400`, `500`, `600`, `700`) para evitar CSS desnecessário no bundle.
- **`new Date().getFullYear()`** no `Footer.astro` é executado em build time pelo Astro (não no browser), portanto não viola a regra de zero-JS no cliente.

### 7.2 Casos Limite

| Cenário | Comportamento Esperado |
|---|---|
| Usuário com JavaScript desabilitado | Página funciona 100% — nenhuma funcionalidade depende de JS |
| CTA clicado em browser antigo | `<a href=\"#features\">` é HTML nativo — funciona em qualquer browser |
| Build em ambiente sem Wrangler autenticado | `astro build` passa; apenas `wrangler pages deploy` falha — são etapas independentes |
| `turbo.json` já existente na raiz | Adicione apenas as tasks `build` e `typecheck` sem sobrescrever o arquivo completo |
| Viewport mobile com 3 cards em coluna | Grid `grid-cols-1` garante empilhamento vertical sem overflow |

---

## 8. Resumo Executivo de Handoff

| Dimensão | Decisão |
|---|---|
| **Escopo** | 1 rota (`/`), 3 seções (Hero + Features + Footer), zero rotas adicionais |
| **Stack** | Astro 4 + TailwindCSS 3 + `@fontsource/inter` — zero React, zero JS cliente |
| **Data Model** | Inexistente — aplicação 100% estática |
| **Integrações** | Nenhuma — zero API keys, zero