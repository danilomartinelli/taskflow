# extends: astro/tsconfigs/strict
├── public/
│   └── favicon.svg
└── src/
    ├── layouts/
    │   └── BaseLayout.astro       # <html>, <head> com meta tags, <body>
    ├── components/
    │   ├── Hero.astro             # Título principal + CTA button
    │   ├── Features.astro         # Grid com 3 FeatureCard
    │   ├── FeatureCard.astro      # Ícone SVG inline + título + descrição
    │   └── Footer.astro           # Links e copyright
    └── pages/
        └── index.astro            # Composição: Hero + Features + Footer
```

### 2.3 Contratos de Componentes (Props)

#### `FeatureCard.astro`
```typescript
interface Props {
  title: string;       // Título da feature (ex: \"Gestão de Tarefas\")
  description: string; // Descrição curta, max 120 chars
  // Ícone SVG passado via slot padrão (<slot />)
}
```

#### `BaseLayout.astro`
```typescript
interface Props {
  title?: string;       // <title> da página, default: \"TaskFlow\"
  description?: string; // <meta name=\"description\">, default definido no layout
}
```

### 2.4 Conteúdo das Seções (Hardcoded)

**Hero Section:**
- Título principal: definido pelo CTO antes do build (placeholder: *\"Organize seu trabalho, amplifique seus resultados\"*)
- Subtítulo: definido pelo CTO (placeholder: *\"TaskFlow transforma caos em clareza — para times que entregam.\"*)
- CTA Button: texto *\"Começar agora\"*, href `#features` (âncora interna, zero JS)

**Features Section (3 cards):**
| # | Título | Descrição (placeholder) | Ícone |
|---|--------|------------------------|-------|
| 1 | Tarefas Inteligentes | Crie, priorize e acompanhe tarefas com clareza total. | SVG inline (checklist) |
| 2 | Colaboração em Tempo Real | Sua equipe sincronizada, sem ruído de comunicação. | SVG inline (equipe) |
| 3 | Relatórios Visuais | Métricas que revelam gargalos antes de virem problemas. | SVG inline (gráfico) |

**Footer:**
- Links: *Produto*, *Empresa*, *Termos de Uso*, *Privacidade* (hrefs `#` para esta sprint)
- Copyright: `© 2025 TaskFlow. Todos os direitos reservados.`

---

## 3. Histórias de Usuário & Matriz do Avaliador

> **Aviso de Escopo:** Todas as histórias abaixo são executáveis dentro desta única sprint. Nenhuma delas depende de outra sprint ou serviço externo.

---

### US-001: Setup do Workspace Astro em `apps/web`

**Descrição:** Como desenvolvedor, eu quero um workspace Astro isolado em `apps/web` com TailwindCSS configurado e integrado ao Turborepo para que o projeto compile com `pnpm build` a partir da raiz do monorepo.

**Matriz de Teste do Avaliador:**
- [ ] **Build:** `pnpm --filter web build` executa sem erros e gera a pasta `apps/web/dist/`
- [ ] **Zero JS Cliente:** O output `dist/` não contém nenhum arquivo `.js` referenciado via `<script src>` nas páginas geradas
- [ ] **TailwindCSS:** Classes Tailwind presentes no HTML de saída são resolvidas corretamente (inspecionar `dist/index.html`)
- [ ] **Turborepo:** `pnpm build` na raiz resolve o workspace `web` via pipeline do `turbo.json`

---

### US-002: Componente Hero com Título e CTA

**Descrição:** Como visitante da landing page, eu quero ver imediatamente um título impactante e um botão de call-to-action para que eu entenda a proposta de valor do TaskFlow e saiba qual ação tomar.

**Matriz de Teste do Avaliador:**
- [ ] **HTML:** O `<h1>` contém o título principal definido no componente `Hero.astro`
- [ ] **CTA:** Existe um elemento `<a>` com `href=\"#features\"` visível acima da dobra (above the fold)
- [ ] **Zero JS:** Nenhum event listener ou `<script>` client-side no componente Hero
- [ ] **Responsividade:** Layout não quebra em viewport mobile (375px) nem desktop (1280px)

---

### US-003: Seção de 3 Features com Ícones SVG Inline

**Descrição:** Como visitante, eu quero ver três cards de funcionalidade com ícone, título e descrição para que eu entenda rapidamente o que o TaskFlow oferece.

**Matriz de Teste do Avaliador:**
- [ ] **HTML:** Existem exatamente 3 instâncias do componente `FeatureCard.astro` renderizados no DOM
- [ ] **SVG Inline:** Cada card contém um `<svg>` diretamente no HTML (sem `<img src=\"*.svg\">` e sem `<use href>`)
- [ ] **Conteúdo:** Cada card possui `title` e `description` não-vazios visíveis no HTML renderizado
- [ ] **Semântica:** A seção Features possui `id=\"features\"` para que o link do CTA funcione como âncora

---

### US-004: Footer com Links Institucionais

**Descrição:** Como visitante, eu quero ver um footer com links e informação de copyright para que a página pareça completa e profissional.

**Matriz de Teste do Avaliador:**
- [ ] **HTML:** O footer contém ao menos 4 links (`<a>`) com texto visível
- [ ] **Copyright:** Texto de copyright com ano `2025` presente no footer
- [ ] **Semântica:** Elemento `<footer>` usado (não `<div>`) para acessibilidade
- [ ] **Zero JS:** Nenhum script no componente Footer

---

### US-005: Deploy no Cloudflare Pages e URL Pública

**Descrição:** Como CTO, eu quero que a landing page esteja acessível via URL pública do Cloudflare Pages para que o Definition of Done desta sprint seja atendido.

**Matriz de Teste do Avaliador:**
- [ ] **HTTP 200:** A URL pública retorna status `200 OK` com `Content-Type: text/html`
- [ ] **Build Command:** O Cloudflare Pages está configurado com `build command: pnpm --filter web build` e `output directory: apps/web/dist`
- [ ] **Lighthouse:** Score de Performance ≥ 90 no Lighthouse CI rodado contra a URL pública
- [ ] **Zero JS:** DevTools → Network da URL pública não exibe nenhuma requisição de arquivo `.js` iniciada pela página

---

## 4. Requisitos Funcionais

| ID | Prioridade | Descrição |
|----|------------|----------|
| REQ-001 | **MUST** | O app `apps/web` deve ser um workspace pnpm isolado com `package.json` próprio, integrado ao Turborepo via `turbo.json` na raiz. |
| REQ-002 | **MUST** | O Astro deve ser configurado com `output: 'static'` no `astro.config.mjs`, garantindo geração de HTML puro sem runtime JS. |
| REQ-003 | **MUST** | TailwindCSS deve ser integrado via `@astrojs/tailwind` como integration no `astro.config.mjs`. |
| REQ-004 | **MUST** | Nenhum componente deve usar diretivas Astro client-side (`client:load`, `client:idle`, `client:visible`, `client:only`). |
| REQ-005 | **MUST** | Ícones SVG devem ser escritos inline nos componentes `.astro` — proibido uso de `<img src=\"*.svg\">` ou bibliotecas de ícones com bundle JS. |
| REQ-006 | **MUST** | O `wrangler.toml` em `apps/web` deve definir `pages_build_output_dir = \"dist\"` para integração correta com Cloudflare Pages. |
| REQ-007 | **MUST** | A seção Features deve ter `id=\"features\"` para servir como âncora do CTA do Hero. |
| REQ-008 | **MUST** | O layout `BaseLayout.astro` deve incluir as meta tags mínimas: `charset`, `viewport`, `description` e `<title>`. |
| REQ-009 | **SHOULD** | O HTML semântico deve ser utilizado: `<header>`, `<main>`, `<section>`, `<footer>`, `<h1>` único por página. |
| REQ-010 | **SHOULD** | A página deve ser responsiva com breakpoints Tailwind padrão (`sm`, `md`, `lg`) — layout mobile-first. |
| REQ-011 | **SHOULD** | O `turbo.json` na raiz do monorepo deve incluir o pipeline `build` com `dependsOn: [\"^build\"]` para o workspace `web`. |
| REQ-012 | **COULD** | Adicionar `<meta property=\"og:title\">` e `<meta property=\"og:description\">` básicos no `BaseLayout.astro` para compartilhamento social mínimo. |

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo são **explicitamente proibidos** nesta sprint para garantir foco e não estourar o orçamento de tokens e tempo:

| Item | Justificativa |
|------|---------------|
| Formulário de captura de leads | Exige integração com API externa (Resend/etc.) e variáveis de ambiente — reservado para sprint futura |
| Páginas adicionais (`/about`, `/pricing`, `/blog`) | Rota única (`/`) é suficiente para o DoD desta sprint |
| Animações CSS complexas e transições | Aumentam complexidade sem impacto no DoD; adicionáveis em sprint de polish |
| Dark mode toggle | Requer lógica de preferência do usuário e possivelmente JS; fora do escopo de zero-JS |
| Testes automatizados (Playwright, Vitest) | Sem setup de testing pipeline nesta sprint |
| SEO avançado (sitemap.xml, Open Graph dinâmico, schema.org) | REQ-012 cobre o mínimo necessário; SEO completo é sprint dedicada |
| Internacionalização (i18n) | Sem múltiplos idiomas nesta sprint |
| Biblioteca de componentes em `packages/ui` | Componentes ficam isolados em `apps/web/src/components/` — extração para pacote compartilhado é sprint futura |
| Autenticação ou área logada | Fora do escopo de uma landing page estática |

---

## 6. Cloudflare Bindings & Integrações

### 6.1 Bindings Cloudflare

**Nenhum.** Esta sprint não utiliza Workers, D1, R2, KV ou Queues.

### 6.2 Configuração do Cloudflare Pages

```toml
# apps/web/wrangler.toml
name = \"taskflow-web\"
pages_build_output_dir = \"dist\"
```

**Deploy via Cloudflare Pages Dashboard ou CLI:**
```bash
# Build command configurado no Cloudflare Pages:
pnpm --filter web build

# Output directory:
apps/web/dist
```

### 6.3 APIs Externas

**Nenhuma.** Zero variáveis de ambiente necessárias.

---

## 7. Restrições & Casos Limite

| # | Restrição | Detalhe |
|---|-----------|--------|
| R-1 | **Zero JS no cliente é inegociável** | O link do CTA (`href=\"#features\"`) usa scroll nativo do browser — não implementar smooth scroll via JS mesmo que pareça tentador |
| R-2 | **SVGs devem ser inline, não externos** | `<img src=\"icon.svg\">` ou `<use href=\"sprite.svg#icon\">` são proibidos — o SVG completo deve estar no markup do componente |
| R-3 | **Sem `client:*` directives** | Qualquer componente importado no Astro que use `client:load` ou similar viola REQ-004 e deve ser rejeitado no code review |
| R-4 | **Turborepo pipeline** | Se o `turbo.json` não existir na raiz, ele deve ser criado com a pipeline mínima antes de rodar `pnpm build` |
| R-5 | **Compatibilidade Edge** | Embora esta sprint não use Workers, o `wrangler.toml` deve estar correto para não bloquear sprints futuras que adicionem Pages Functions |
| R-6 | **pnpm como package manager** | Proibido usar `npm install` ou `yarn add` — todo gerenciamento de dependências via `pnpm` conforme doutrina do monorepo |

**Comportamento de Fallback:** Não aplicável — página 100% estática sem chamadas externas em runtime.

---

## 8. Guia de Implementação para Agentes

> Esta seção existe para que agentes de execução (IAs júnior ou desenvolvedores) não precisem interpretar — apenas executar.

### 8.1 Sequência de Criação de Arquivos

**Passo 1 — Scaffold do workspace** `[Ref: REQ-001, REQ-002, REQ-003]`

Crie `apps/web/package.json`:
```json
{
  \"name\": \"web\",
  \"version\": \"0.1.0\",
  \"private\": true,
  \"scripts\": {
    \"dev\": \"astro dev\",
    \"build\": \"astro build\",
    \"preview\": \"astro preview\"
  },
  \"dependencies\": {
    \"astro\": \"^4.0.0\",
    \"@astrojs/tailwind\": \"^5.0.0\",
    \"tailwindcss\": \"^3.4.0\"
  }
}
```

Crie `apps/web/astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
});
```

Crie `apps/web/tailwind.config.mjs`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**Passo 2 — Verificar/criar `turbo.json` na raiz** `[Ref: REQ-011]`

Se `turbo.json` não existir, crie com:
```json
{
  \"$schema\": \"https://turbo.build/schema.json\",
  \"tasks\": {
    \"build\": {
      \"dependsOn\": [\"^build\"],
      \"outputs\": [\"dist/**\"]
    },
    \"dev\": {
      \"cache\": false,
      \"persistent\": true
    }
  }
}
```

Se já existir, adicione o workspace `web` ao pipeline existente sem remover entradas.

**Passo 3 — Layout base** `[Ref: REQ-008, REQ-009]`

Crie `apps/web/src/layouts/BaseLayout.astro`:
```astro
---
interface Props {
  title?: string;
  description?: string;
}
const {
  title = 'TaskFlow',
  description = 'TaskFlow transforma caos em clareza — para times que entregam.'
} = Astro.props;
---
<!doctype html>
<html lang=\"pt-BR\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <meta name=\"description\" content={description} />
    <title>{title}</title>
    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon.svg\" />
  </head>
  <body class=\"bg-white text-gray-900 antialiased\">
    <slot />
  </body>
</html>
```

**Passo 4 — Componente Hero** `[Ref: REQ-004, REQ-007, US-002]`

Crie `apps/web/src/components/Hero.astro`:
```astro
---
// Sem props — conteúdo hardcoded nesta sprint
---
<header class=\"bg-white\">
  <div class=\"mx-auto max-w-7xl px-6 py-24 text-center lg:py-40\">
    <h1 class=\"text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl\">
      Organize seu trabalho,<br />
      <span class=\"text-indigo-600\">amplifique seus resultados</span>
    </h1>
    <p class=\"mt-6 text-lg leading-8 text-gray-600\">
      TaskFlow transforma caos em clareza — para times que entregam.
    </p>
    <div class=\"mt-10\">
      <a
        href=\"#features\"
        class=\"rounded-md bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600\"
      >
        Começar agora
      </a>
    </div>
  </div>
</header>
```

**Passo 5 — Componente FeatureCard** `[Ref: REQ-005, US-003]`

Crie `apps/web/src/components/FeatureCard.astro`:
```astro
---
interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
---
<div class=\"flex flex-col items-start p-6 bg-gray-50 rounded-2xl\">
  <div class=\"mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white\">
    <slot />
  </div>
  <h3 class=\"text-lg font-semibold text-gray-900\">{title}</h3>
  <p class=\"mt-2 text-sm leading-6 text-gray-600\">{description}</p>
</div>
```

**Passo 6 — Componente Features** `[Ref: REQ-005, REQ-007, US-003]`

Crie `apps/web/src/components/Features.astro`:
```astro
---
import FeatureCard from './FeatureCard.astro';
---
<section id=\"features\" class=\"bg-white py-24\">
  <div class=\"mx-auto max-w-7xl px-6\">
    <div class=\"mx-auto max-w-2xl text-center mb-16\">
      <h2 class=\"text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl\">
        Tudo que sua equipe precisa
      </h2>
    </div>
    <div class=\"grid grid-cols-1 gap-8 sm:grid-cols-3\">
      <FeatureCard
        title=\"Tarefas Inteligentes\"
        description=\"Crie, priorize e acompanhe tarefas com clareza total. Sem ruído, sem esquecimentos.\"
      >
        <!-- Ícone: checklist SVG inline -->
        <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"h-6 w-6\" aria-hidden=\"true\">
          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z\" />
        </svg>
      </FeatureCard>

      <FeatureCard
        title=\"Colaboração em Tempo Real\"
        description=\"Sua equipe sincronizada, sem ruído de comunicação. Todos sabem o que fazer e quando.\"
      >
        <!-- Ícone: equipe/users SVG inline -->
        <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"h-6 w-6\" aria-hidden=\"true\">
          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z\" />
        </svg>
      </FeatureCard>

      <FeatureCard
        title=\"Relatórios Visuais\"
        description=\"Métricas que revelam gargalos antes de virem problemas. Decisões baseadas em dados.\"
      >
        <!-- Ícone: gráfico/chart SVG inline -->
        <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"h-6 w-6\" aria-hidden=\"true\">
          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z\" />
        </svg>
      </FeatureCard>
    </div>
  </div>
</section>
```

**Passo 7 — Componente Footer** `[Ref: REQ-009, US-004]`

Crie `apps/web/src/components/Footer.astro`:
```astro
---
const links = [
  { label: 'Produto', href: '#' },
  { label: 'Empresa', href: '#' },
  { label: 'Termos de Uso', href: '#' },
  { label: 'Privacidade', href: '#' },
];
---
<footer class=\"bg-gray-50 border-t border-gray-200\">
  <div class=\"mx-auto max-w-7xl px-6 py-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-between\">
    <nav class=\"flex flex-wrap justify-center gap-x-8 gap-y-2\">
      {links.map((link) => (
        <a
          href={link.href}
          class=\"text-sm text-gray-500 hover:text-gray-900 transition-colors\"
        >
          {link.label}
        </a>
      ))}
    </nav>
    <p class=\"text-sm text-gray-400\">
      &copy; 2025 TaskFlow. Todos os direitos reservados.
    </p>
  </div>
</footer>
```

**Passo 8 — Página index** `[Ref: REQ-009, US-001]`

Crie `apps/web/src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import Features from '../components/Features.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout
  title=\"TaskFlow — Organize seu trabalho\"
  description=\"TaskFlow transforma caos em clareza — para times que entregam.\"
>
  <main>
    <Hero />
    <Features />
  </main>
  <Footer />
</BaseLayout>
```

**Passo 9 — `wrangler.toml`** `[Ref: REQ-006, US-005]`

Crie `apps/web/wrangler.toml`:
```toml
name = \"taskflow-web\"
pages_build_output_dir = \"dist\"
```

**Passo 10 —