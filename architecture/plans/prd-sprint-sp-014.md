# Layout e Tipografia

**REQ-006** _(must)_ — Criar um layout base `apps/web/src/layouts/Layout.astro` que:
  - Importe `@fontsource/inter/400.css` e `@fontsource/inter/700.css` no `<head>`
  - Defina `font-family: 'Inter', sans-serif` via CSS global
  - Configure `<html lang=\"pt-BR\" class=\"dark\">`
  - Aplique `background-color: #0a0a0a` e `color: #ffffff` no `<body>`
  - Inclua `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`
  - Inclua `<meta name=\"description\">` com o subtítulo do Hero como valor padrão
  - Defina `scroll-behavior: smooth` no seletor `html` via CSS

**REQ-007** _(must)_ — A página principal `apps/web/src/pages/index.astro` deve usar `Layout.astro` e compor os três componentes de seção na ordem: Hero → Features → Footer.

### Hero Section

**REQ-008** _(must)_ — Criar `apps/web/src/components/Hero.astro` implementando:
  - `<section>` com padding vertical mínimo de `py-32` (128px) e `min-height: 100vh`
  - `<h1>` com o texto exato: **\"Organize. Foque. Entregue.\"** — fonte Inter 700, cor `#00fa62`, tamanho mínimo `text-5xl` em desktop
  - `<p>` com o subtítulo exato da seção 2.5 — cor `#a1a1aa`, tamanho `text-lg` ou `text-xl`
  - `<a href=\"#features\">` estilizado como botão primário (border `#00fa62`, text `#00fa62`, hover com background `#00fa62` e texto `#0a0a0a`)
  - Conteúdo centralizado horizontalmente (text-center) com max-width de `max-w-3xl mx-auto`

**REQ-009** _(must)_ — O botão CTA do Hero deve ser implementado como tag `<a>` (âncora HTML nativa), NÃO como `<button>`. Isso garante a navegação sem JavaScript.

### Features Section

**REQ-010** _(must)_ — Criar `apps/web/src/components/Features.astro` implementando:
  - `<section id=\"features\">` para ser o alvo da âncora do Hero
  - Título da seção: **\"Tudo que você precisa. Nada que você não precisa.\"** em `<h2>`
  - Grid responsivo: `grid grid-cols-1 md:grid-cols-3 gap-8`
  - Exatamente 3 items com conteúdo conforme definido na seção 2.5 deste PRD

**REQ-011** _(must)_ — Cada item de feature deve conter:
  - Um ícone SVG inline (não `<img>`) com `width=\"32\" height=\"32\"` e `fill` ou `stroke` em `#00fa62`
  - Um `<h3>` com o título da feature
  - Um `<p>` com a descrição da feature
  - Nenhum JavaScript — sem hover effects via JS, sem intersection observers

**REQ-012** _(must)_ — Os três ícones SVG devem ser semanticamente coerentes com as features:
  - Feature 1 (Organização): ícone de lista com checkmarks (`<path>` de checkbox ou lista)
  - Feature 2 (Colaboração): ícone de pessoas/grupo (`<path>` de user-group)
  - Feature 3 (Foco): ícone de alvo/crosshair (`<circle>` e `<path>` de target)
  - Todos os SVGs devem ser inline no `.astro` file, sem dependência de biblioteca de ícones

### Footer

**REQ-013** _(must)_ — Criar `apps/web/src/components/Footer.astro` implementando:
  - Tag semântica `<footer>` com `border-top: 1px solid #27272a` (zinc-800)
  - Texto exato: **\"© 2025 TaskFlow. Todos os direitos reservados.\"**
  - Cor do texto: `#52525b` (zinc-600)
  - Alinhamento: centralizado (`text-center`)
  - Padding: `py-8`

### Deploy

**REQ-014** _(must)_ — Configurar o projeto no Cloudflare Pages com:
  - **Build command:** `pnpm --filter @taskflow/web build`
  - **Build output directory:** `apps/web/dist`
  - **Root directory:** `/` (raiz do monorepo)
  - **Node.js version:** 20.x (necessário para pnpm e Astro)

**REQ-015** _(must)_ — O arquivo `apps/web/public/favicon.svg` deve existir com um ícone SVG simples representando o TaskFlow (pode ser a letra \"T\" estilizada em verde neon sobre fundo transparente).

### Qualidade e CI

**REQ-016** _(must)_ — O script `check` em `apps/web/package.json` deve ser `astro check`. Este script será executado pelo Turborepo via `turbo run check`.

**REQ-017** _(must)_ — O script `build` em `apps/web/package.json` deve ser `astro build`. O output gerado em `dist/` não deve conter nenhum arquivo com extensão `.js`.

**REQ-018** _(should)_ — Adicionar um `tsconfig.json` em `apps/web/` estendendo `tsconfig.json` base do Astro (`astro/tsconfigs/strict`) para garantir type checking rigoroso.

---

## 5. Fora do Escopo (Non-Goals)

Estes itens são **explicitamente proibidos** nesta sprint. Qualquer PR que inclua os itens abaixo deve ser rejeitado:

| Item | Motivo |  
|------|--------|
| Páginas adicionais (`/pricing`, `/docs`, `/blog`, etc.) | Fora do escopo desta sprint — single page apenas |
| Sistema de autenticação (login, signup, OAuth) | Feature de produto, não de landing page |
| Formulários (contato, captura de email, newsletter) | Requer backend ou serviço externo — próxima sprint |
| Internacionalização (i18n, múltiplos idiomas) | Complexidade desnecessária neste momento |
| Animações com JavaScript (GSAP, Framer Motion, etc.) | Violaria o requisito de zero JS no cliente |
| Testes unitários ou de integração (Vitest, Playwright) | Validação via `astro check` + `astro build` é suficiente nesta sprint |
| Componentes React/Vue/Svelte via Astro Islands | Zero JS no cliente — sem hidratação de componentes |
| Integração com analytics (GA4, Plausible, CF Analytics) | Próxima sprint, após validação do deploy |
| Bindings Cloudflare (D1, R2, KV, Queues) | Página estática não requer infraestrutura dinâmica |
| Variáveis de ambiente (`.env`, `wrangler.toml`) | Zero configuração nesta sprint |
| Dark/light mode toggle | Página sempre em dark mode — sem toggle JS |
| Biblioteca de ícones externa (Lucide, Heroicons npm) | SVGs inline eliminam dependência e garantem zero JS |

---

## 6. Cloudflare Bindings & Integrações

### Bindings Cloudflare

**Nenhum binding necessário nesta sprint.**

| Binding | Status |
|---------|--------|
| D1 (banco relacional) | ❌ Não utilizado |
| R2 (object storage) | ❌ Não utilizado |
| KV (cache) | ❌ Não utilizado |
| Queues (mensageria) | ❌ Não utilizado |
| Workers (compute) | ❌ Não utilizado — Cloudflare Pages serve os estáticos |

### APIs Externas

**Nenhuma API externa necessária nesta sprint.**

| Serviço | Status |
|---------|--------|
| Stripe | ❌ Não utilizado |
| Resend (email) | ❌ Não utilizado |
| OpenAI | ❌ Não utilizado |

### Serviços de Hospedagem

| Serviço | Uso |
|---------|-----|
| Cloudflare Pages | ✅ Hospedagem dos artefatos estáticos gerados por `astro build` |

---

## 7. Restrições & Casos Limite

### Restrições Técnicas

**R-001 — Zero JavaScript no cliente:**  
O `astro.config.mjs` deve ser configurado com `output: 'static'`. Nenhum componente deve usar as diretivas `client:load`, `client:idle`, `client:visible`, `client:only` ou similares. Violação desta regra quebra o REQ-017.

**R-002 — Compatibilidade Edge:**  
Embora a landing seja estática (sem Workers), o padrão do monorepo proíbe módulos Node.js nativos. Nenhuma dependência de build deve importar `fs`, `path`, `crypto` nativo ou similares — o Astro e o Tailwind já são seguros neste contexto.

**R-003 — Fonte sem CDN externo:**  
A fonte Inter DEVE ser instalada via `@fontsource/inter` (npm package). É **proibido** usar `<link>` para Google Fonts ou qualquer CDN externo — isso impactaria o tempo de carregamento e a privacidade do usuário.

**R-004 — SVGs inline obrigatórios:**  
Nenhum ícone deve ser carregado via `<img src=\"icon.svg\">` ou biblioteca npm (ex: `lucide-react`). Todos os SVGs devem ser escritos inline no `.astro` component. Isso elimina requests adicionais e dependência de hidratação React.

**R-005 — Âncora via CSS, não JS:**  
O scroll suave do CTA para `#features` deve ser implementado via CSS (`scroll-behavior: smooth` no seletor `html`), não via `window.scrollTo()` ou `element.scrollIntoView()` em JavaScript.

### Casos Limite e Fallbacks

**CE-001 — Build falha por versão de Node.js:**  
Se o `astro build` falhar no ambiente de CI do Cloudflare Pages, verificar se a versão de Node.js está configurada para `20.x` no painel do Cloudflare Pages (Environment Variables: `NODE_VERSION=20`).

**CE-002 — CSS não carregado em produção:**  
Se os estilos Tailwind não aparecerem em produção mas funcionarem localmente, verificar se o `content` no `tailwind.config.mjs` está correto e se o `@astrojs/tailwind` está listado nas `integrations` do `astro.config.mjs`.

**CE-003 — Fonte Inter não renderizada:**  
Se a fonte Inter não carregar, verificar se os arquivos CSS do `@fontsource/inter` estão sendo importados no `<head>` do `Layout.astro` e se o pacote está no `dependencies` (não `devDependencies`) do `apps/web/package.json`.

**CE-004 — Âncora `#features` não funciona:**  
Se o scroll não ocorrer ao clicar no CTA, verificar: (1) o `id=\"features\"` existe na `<section>` do `Features.astro`, (2) `scroll-behavior: smooth` está aplicado no `html` do `Layout.astro`, (3) nenhum `overflow: hidden` em elementos pai está bloqueando o scroll.

**CE-005 — pnpm workspace filter não resolve `@taskflow/web`:**  
Se `pnpm --filter @taskflow/web build` retornar \"No packages found\", verificar se o `name` em `apps/web/package.json` é exatamente `@taskflow/web` e se `pnpm-workspace.yaml` inclui `apps/*`.

---

## 8. Estrutura de Arquivos Esperada

Ao final desta sprint, o monorepo deve conter a seguinte estrutura em `apps/web/`:

```
apps/web/
├── package.json                    # name: \"@taskflow/web\", scripts: build/dev/check
├── astro.config.mjs                # output: 'static', integrations: [tailwind()]
├── tailwind.config.mjs             # content, extend com cores neon/page
├── tsconfig.json                   # Extende astro/tsconfigs/strict
├── public/
│   └── favicon.svg                 # Ícone SVG inline do TaskFlow
└── src/
    ├── layouts/
    │   └── Layout.astro            # Layout base com @fontsource/inter, meta tags
    ├── pages/
    │   └── index.astro             # Página única: Hero + Features + Footer
    └── components/
        ├── Hero.astro              # Hero section (h1, subtítulo, CTA âncora)
        ├── Features.astro          # Grid 3 features com SVG inline
        └── Footer.astro           # Footer com copyright
```

**Arquivos raiz que devem ser ATUALIZADOS (não criados do zero):**

```
turbo.json      # Verificar/adicionar pipeline 'check' se não existir
```

---

## 9. Checklist de Validação Final (DoD Gate)

Antes de considerar a sprint encerrada, o agente executor deve verificar cada item:

### Gate 1 — Build Local
- [ ] `pnpm install` na raiz executa sem erros
- [ ] `pnpm --filter @taskflow/web exec astro check` → zero erros
- [ ] `pnpm --filter @taskflow/web build` → zero erros, gera `apps/web/dist/`
- [ ] `ls apps/web/dist/_astro/*.js` → comando retorna vazio (zero JS files)

### Gate 2 — Visual (Browser Local)
- [ ] `pnpm --filter @taskflow/web dev` → abre servidor local
- [ ] Hero renderiza com título verde neon `#00fa62` em fundo `#0a0a0a`
- [ ] Clique no CTA rola até a seção Features sem JavaScript
- [ ] 3 features exibidas com ícones SVG coloridos em `#00fa62`
- [ ] Footer exibe copyright com cor zinc-600
- [ ] Em 375px (DevTools mobile): sem overflow horizontal em nenhuma seção

### Gate 3 — Deploy (Cloudflare Pages)
- [ ] Projeto configurado no painel Cloudflare Pages
- [ ] Deploy triggered e finalizado com status \"Success\"
- [ ] URL de preview acessível via HTTPS
- [ ] DevTools Network → zero arquivos `.js` carregados
- [ ] DevTools Network → CSS carregado com status 200

---

*Este PRD é a Fonte Única de Verdade (SSoT) para a execução da Sprint sp-014. Qualquer desvio deve ser