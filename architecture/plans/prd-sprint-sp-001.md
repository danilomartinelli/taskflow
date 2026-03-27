# 2.3 Meta / SEO Tags (Conteúdo Estático)

Definidos no layout `Base.astro`:

```html
<title>TaskFlow — Organize suas tarefas, simplifique sua vida</title>
<meta name=\"description\" content=\"TaskFlow é a plataforma de produtividade com Kanban Boards, Deadline Alerts e Team Sync para times que entregam mais.\" />
<meta property=\"og:title\" content=\"TaskFlow\" />
<meta property=\"og:description\" content=\"Organize suas tarefas, simplifique sua vida.\" />
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />
<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />
<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap\" rel=\"stylesheet\" />
```

---

## 3. Histórias de Usuário & Matriz do Avaliador

> **Aviso de Escopo:** Todas as US abaixo são passíveis de execução dentro desta única sprint.

---

### US-001: Visualizar Hero Section

**Descrição:** Como visitante, eu quero ver um hero section impactante com o título do produto e um CTA claro, para que eu entenda imediatamente a proposta de valor e saiba o que fazer a seguir.

**Conteúdo do Hero:**
- **Título (H1):** `Organize suas tarefas, simplifique sua vida`
- **Subtítulo:** `TaskFlow é a plataforma de produtividade que transforma caos em clareza — para você e para o seu time.`
- **CTA Button:** `Conhecer Features` → âncora `#features` (scroll CSS, zero JS)

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Visual:** O H1 está renderizado com `font-size` ≥ 48px em desktop e ≥ 32px em mobile, usando a fonte Inter.
- [ ] **CTA:** O botão \"Conhecer Features\" é um `<a href=\"#features\">` nativo — inspecionar o DOM não deve revelar nenhum event listener JS.
- [ ] **Scroll:** Clicar no CTA rola a página até a seção `id=\"features\"` usando `scroll-behavior: smooth` definido no CSS global (sem JS).
- [ ] **Zero JS:** `astro build` gera HTML sem nenhuma tag `<script>` de código de aplicação no bundle final.
- [ ] **Responsivo:** Em viewport 375px, o título não está truncado e o botão está totalmente visível e clicável.
- [ ] **Acento:** O botão CTA usa `background-color: #00fa62` e `color: #0a0a0a` (contraste WCAG AA).

---

### US-002: Visualizar Seção de Features

**Descrição:** Como visitante, eu quero ver as três principais funcionalidades do TaskFlow apresentadas com ícone, título e descrição, para que eu possa avaliar se o produto atende às minhas necessidades.

**Conteúdo das Features:**

| # | Título | Descrição | Conceito do Ícone |
|---|--------|-----------|-------------------|
| 1 | Kanban Boards | Visualize e mova suas tarefas com uma interface de arrastar e soltar intuitiva. Cada card avança no fluxo no seu ritmo. | Colunas com cards empilhados (layout kanban) |
| 2 | Deadline Alerts | Nunca perca um prazo novamente. Configure alertas inteligentes e receba notificações antes que seja tarde. | Sino com badge de urgência ou relógio com alerta |
| 3 | Team Sync | Colabore com seu time em tempo real. Todos veem as mesmas atualizações, instantaneamente. | Dois avatares conectados por linha / nuvem de sync |

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Âncora:** A seção possui `id=\"features\"` no elemento container raiz.
- [ ] **Layout:** Os 3 cards estão dispostos em grid: 1 coluna em mobile (< 768px) e 3 colunas em desktop (≥ 1024px).
- [ ] **SVG Inline:** Cada card contém um ícone SVG embutido diretamente no HTML (não `<img src>`, não `<use>`) — verificável no inspetor do navegador.
- [ ] **Conteúdo:** Título e descrição de cada feature batem exatamente com a tabela de conteúdo acima.
- [ ] **Estilo dos Cards:** Cards com `background: #111111`, borda sutil `#1f1f1f`, border-radius de 12px e padding interno de 24px.
- [ ] **Ícone:** Cada ícone SVG usa `stroke=\"#00fa62\"` ou `fill=\"#00fa62\"` como cor de destaque.

---

### US-003: Visualizar Footer

**Descrição:** Como visitante, eu quero ver um footer com o nome da marca, links institucionais e informação de copyright, para que eu possa acessar políticas legais e entrar em contato com a empresa.

**Conteúdo do Footer:**
- **Logo/Nome:** `TaskFlow` (texto, estilizado com a fonte Inter Bold + acento `#00fa62`)
- **Links:**
  - `Privacidade` → `/privacidade` (página futura, link estático presente)
  - `Termos de Uso` → `/termos` (página futura, link estático presente)
  - `Contato` → `mailto:contato@taskflow.sh`
- **Copyright:** `© 2026 TaskFlow. Todos os direitos reservados.`

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Links:** Os três links (`Privacidade`, `Termos`, `Contato`) estão presentes no DOM como elementos `<a>` com os hrefs corretos.
- [ ] **Contato:** O link de contato usa `href=\"mailto:contato@taskflow.sh\"` — não uma URL HTTP.
- [ ] **Copyright:** O texto de copyright está visível e contém o ano `2026`.
- [ ] **Responsivo:** Em mobile, os links do footer estão empilhados em coluna (não transbordando horizontalmente).
- [ ] **Zero JS:** O footer é HTML/CSS puro — sem componentes React ou scripts.

---

### US-004: Performance e Ausência de JavaScript

**Descrição:** Como engenheiro de plataforma, eu quero garantir que a landing page não envie nenhum byte de JavaScript ao navegador e carregue em menos de 1 segundo, para que o Cloudflare Pages sirva o conteúdo no edge com máxima eficiência.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Build:** `pnpm --filter web build` conclui sem erros.
- [ ] **Zero JS:** O diretório `dist/` gerado não contém nenhum arquivo `.js` de aplicação (apenas o HTML e CSS).
- [ ] **Astro Config:** `astro.config.mjs` define `output: 'static'` — modo SSG puro.
- [ ] **Lighthouse:** Score de Performance ≥ 95 rodando `lighthouse` contra a URL do Cloudflare Pages.
- [ ] **CSS Scroll:** `html { scroll-behavior: smooth; }` está presente no CSS global — o único mecanismo de scroll da página.

---

## 4. Requisitos Funcionais (FR)

### REQ-001 — Workspace Astro no Monorepo *(MUST)*

Criar o workspace `apps/web` dentro do monorepo pnpm/Turborepo com as seguintes dependências:

```jsonc
// apps/web/package.json
{
  \"name\": \"@taskflow/web\",
  \"version\": \"0.1.0\",
  \"scripts\": {
    \"dev\": \"astro dev\",
    \"build\": \"astro build\",
    \"preview\": \"astro preview\",
    \"check\": \"astro check\"
  },
  \"dependencies\": {
    \"astro\": \"^4.x\"
  },
  \"devDependencies\": {
    \"@astrojs/tailwind\": \"^5.x\",
    \"tailwindcss\": \"^3.x\",
    \"typescript\": \"^5.x\"
  }
}
```

O `turbo.json` na raiz deve incluir `\"@taskflow/web#build\"` no pipeline.

---

### REQ-002 — Configuração Astro: Modo Estático Puro *(MUST)*

O arquivo `astro.config.mjs` deve garantir **zero JavaScript no cliente**:

```js
// apps/web/astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',      // SSG puro — gera HTML estático
  integrations: [tailwind()],
  // NÃO adicionar @astrojs/react ou qualquer integração JS de framework
});
```

**Proibido:** Importar `client:load`, `client:visible` ou qualquer diretiva de hidratação Astro nesta sprint.

---

### REQ-003 — Layout Base com Tokens de Design *(MUST)*

O arquivo `src/layouts/Base.astro` é o único ponto de injeção de estilos globais. Deve:

1. Importar a fonte Inter via Google Fonts (tag `<link>` no `<head>`).
2. Definir `scroll-behavior: smooth` no seletor `html`.
3. Definir `background-color: #0a0a0a` e `color: #f5f5f5` no seletor `body`.
4. Aplicar `font-family: 'Inter', system-ui, sans-serif` globalmente.

```astro
---
// src/layouts/Base.astro
const { title = 'TaskFlow', description = 'Organize suas tarefas, simplifique sua vida.' } = Astro.props;
---
<!DOCTYPE html>
<html lang=\"pt-BR\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
    <title>{title}</title>
    <meta name=\"description\" content={description} />
    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />
    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />
    <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap\" rel=\"stylesheet\" />
  </head>
  <body class=\"bg-bg text-text font-sans\">
    <slot />
  </body>
</html>

<style is:global>
  html {
    scroll-behavior: smooth;
  }
</style>
```

---

### REQ-004 — Componente Hero *(MUST)*

Arquivo: `src/components/Hero.astro`

**Especificação:**
- Container: `min-h-screen`, centralizado verticalmente e horizontalmente (`flex items-center justify-center`).
- H1: Texto `Organize suas tarefas, simplifique sua vida` — `text-4xl md:text-6xl font-bold`.
- Subtítulo: `text-muted text-lg md:text-xl max-w-xl text-center`.
- CTA: `<a href=\"#features\">` com classes `bg-neon text-bg font-semibold px-8 py-3 rounded-lg hover:bg-neon-dim transition-colors`.

**Restrição crítica [Ref: REQ-002]:** O componente é `.astro` puro — nenhuma importação de componente React ou diretiva `client:*`.

---

### REQ-005 — Componente FeatureCard *(MUST)*

Arquivo: `src/components/FeatureCard.astro`

Aceita as seguintes props:

```typescript
interface Props {
  title: string;
  description: string;
  // O ícone SVG é passado via <slot /> para manter o SVG inline no HTML final
}
```

Estrutura esperada:

```astro
---
const { title, description } = Astro.props;
---
<article class=\"bg-surface border border-border rounded-xl p-6 flex flex-col gap-4\">
  <div class=\"w-12 h-12 text-neon\">
    <slot name=\"icon\" />
  </div>
  <h3 class=\"text-text font-semibold text-xl\">{title}</h3>
  <p class=\"text-muted text-sm leading-relaxed\">{description}</p>
</article>
```

---

### REQ-006 — Componente Features (Seção com Grid) *(MUST)*

Arquivo: `src/components/Features.astro`

**Especificação:**
- Container raiz: `<section id=\"features\">`  — **o `id=\"features\"` é obrigatório** para o scroll anchor funcionar.
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-6`.
- Cada `<FeatureCard />` recebe seu ícone SVG via `<slot name=\"icon\">`.

**SVGs Inline obrigatórios** (24×24, stroke `currentColor`, stroke-width 1.5):

**Kanban Boards:**
```svg
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\">
  <rect x=\"3\" y=\"3\" width=\"5\" height=\"18\" rx=\"1\"/>
  <rect x=\"10\" y=\"3\" width=\"5\" height=\"12\" rx=\"1\"/>
  <rect x=\"17\" y=\"3\" width=\"5\" height=\"15\" rx=\"1\"/>
</svg>
```

**Deadline Alerts:**
```svg
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\">
  <path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/>
  <path d=\"M13.73 21a2 2 0 0 1-3.46 0\"/>
  <circle cx=\"18\" cy=\"5\" r=\"3\" fill=\"#00fa62\" stroke=\"none\"/>
</svg>
```

**Team Sync:**
```svg
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\">
  <path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"/>
  <circle cx=\"9\" cy=\"7\" r=\"4\"/>
  <path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"/>
  <path d=\"M16 3.13a4 4 0 0 1 0 7.75\"/>
</svg>
```

---

### REQ-007 — Componente Footer *(MUST)*

Arquivo: `src/components/Footer.astro`

**Especificação:**

```astro
<footer class=\"border-t border-border py-8 px-6\">
  <div class=\"max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4\">
    <span class=\"font-bold text-lg\">
      Task<span class=\"text-neon\">Flow</span>
    </span>
    <nav class=\"flex flex-col md:flex-row items-center gap-4 text-sm text-muted\">
      <a href=\"/privacidade\" class=\"hover:text-text transition-colors\">Privacidade</a>
      <a href=\"/termos\" class=\"hover:text-text transition-colors\">Termos de Uso</a>
      <a href=\"mailto:contato@taskflow.sh\" class=\"hover:text-text transition-colors\">Contato</a>
    </nav>
    <p class=\"text-muted text-sm\">© 2026 TaskFlow. Todos os direitos reservados.</p>
  </div>
</footer>
```

---

### REQ-008 — Página Index *(MUST)*

Arquivo: `src/pages/index.astro`

Composição final da página — importa todos os componentes e os monta em ordem:

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import Features from '../components/Features.astro';
import Footer from '../components/Footer.astro';
---
<Base>
  <main>
    <Hero />
    <Features />
  </main>
  <Footer />
</Base>
```

---

### REQ-009 — Deploy no Cloudflare Pages *(MUST)*

O projeto deve conter um arquivo `wrangler.toml` (ou configuração equivalente no dashboard Cloudflare Pages) com:

```toml
# apps/web/wrangler.toml
name = \"taskflow-web\"
pages_build_output_dir = \"dist\"
```

Comando de build para o Cloudflare Pages:
- **Build command:** `pnpm --filter @taskflow/web build`
- **Build output directory:** `apps/web/dist`
- **Node.js version:** 20.x

---

### REQ-010 — Integração Turborepo *(SHOULD)*

O `turbo.json` na raiz do monorepo deve incluir o pipeline do workspace `web`:

```json
{
  \"$schema\": \"https://turbo.build/schema.json\",
  \"tasks\": {
    \"build\": {
      \"outputs\": [\"dist/**\", \".astro/**\"]
    },
    \"dev\": {
      \"cache\": false,
      \"persistent\": true
    },
    \"check\": {
      \"dependsOn\": [\"^build\"]
    }
  }
}
```

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo são **explicitamente proibidos** nesta sprint. Qualquer pull request que introduza estes itens deve ser rejeitado:

| # | Item | Justificativa |
|---|------|---------------|
| NG-1 | Página `/signup` ou `/waitlist` | Não foi solicitado. Link do CTA já está definido como âncora interna. |
| NG-2 | Formulário de captura de e-mail | Requer integração de backend (Resend/KV). Fora do escopo desta sprint estática. |
| NG-3 | Qualquer JavaScript de aplicação no cliente | O requisito central é Zero JS. Nenhuma exceção. |
| NG-4 | Componentes React (`@astrojs/react`) | Desnecessário. Astro puro é suficiente. Adicionaria JS ao bundle. |
| NG-5 | Animações com JS (GSAP, Framer Motion, etc.) | Comprometeria o Zero JS. Usar CSS transitions/animations se necessário. |
| NG-6 | Analytics (GA4, Plausible, PostHog) | Requer `<script>`. Definir em sprint futura dedicada. |
| NG-7 | Blog ou páginas de conteúdo dinâmico | Fora do escopo. Esta sprint é single-page. |
| NG-8 | Página de Privacidade e Termos de Uso | Os links existem no footer, mas as páginas em si são sprint futura. |
| NG-9 | Dark/Light mode toggle | Requer JS ou lógica adicional. A identidade visual é Dark fixo. |
| NG-10 | Testes E2E com Playwright/Cypress | Infraestrutura de CI não está no escopo desta sprint de landing page. |

---

## 6. Cloudflare Bindings & Integrações

### Bindings Cloudflare

**Nenhum.** Esta sprint é um site estático puro. Não requer Workers, D1, KV, R2 ou Queues.

### Plataforma de Deploy

| Serviço | Propósito | Configuração |
|---------|-----------|-------------|
| **Cloudflare Pages** | Hosting estático com edge CDN global | Build command: `pnpm --filter @taskflow/web build` · Output: `apps/web/dist` |

### APIs Externas

| Serviço | Propósito | Configuração |
|---------|-----------|-------------|
| **Google Fonts (CDN)** | Fonte Inter via `<link>` no `<head>` | Nenhuma chave de API — requisição pública |

### Variáveis de Ambiente

**Nenhuma variável de ambiente necessária.** O projeto é completamente estático.

---

## 7. Restrições & Casos Limite

### RC-1: Google Fonts e CSP

- **Cenário:** Ambientes com Content Security Policy restritiva podem bloquear Google Fonts.
- **Fallback:** A declaração `font-family` já inclui `system-ui, sans-serif` como fallback. A página continua legível sem a fonte remota.
- **Nota para sprint futura:** Considerar auto-hospedar a fonte Inter no R2 para eliminar dependência externa.

### RC-2: Scroll Anchor em Safari iOS

- **Cenário:** `scroll-behavior: smooth` via CSS pode não funcionar em versões antigas do Safari iOS (< 15.4).
- **Comportamento esperado:** Scroll instantâneo para a âncora — aceitável, pois a funcionalidade (navegar até `#features`) ainda funciona.
- **Proibido:** Adicionar polyfill JS para compensar. Zero JS é inegociável.

### RC-3: Largura de Viewport Edge Cases

- **Cenário:** Viewports entre 768px e 1024px (tablets em portrait).
- **Solução:** O grid de features usa `md:grid-cols-3` (breakpoint `md` = 768px no Tailwind). Em tablets, os 3 cards já aparecem em linha.
- **Verificação obrigatória:** Testar em 768px, 1024px e 1440px.

### RC-4: Links para Páginas Não Existentes

- **Cenário:** `/privacidade` e `/termos` no footer apontam para páginas que não existem nesta sprint.
- **Comportamento:** O Cloudflare Pages retorna 404 padrão — aceitável.
- **Proibido:** Criar páginas placeholder apenas para evitar 404. Isso está em NG-8.

### RC-5: Build em Monorepo com Turborepo

- **Cenário:** `pnpm --filter @taskflow/web build` pode falhar se `turbo.json` não incluir o workspace.
- **Solução [Ref: REQ-010]:** O `turbo.json` deve ser configurado antes do primeiro deploy.
- **Verificação:** Rodar `pnpm turbo build --filter=@taskflow/web` localmente antes do push.

---

## 8. Checklist de Handoff para o Architect

Antes de iniciar a fase de execução (geração do `plan-sprint-sp-001.json`), o Architect deve confirmar:

- [ ] `apps/web/` não existe ainda no monorepo (não há código duplicado).
- [ ] Nenhuma dependência listada em REQ-001 está no blocklist de `SOP-02-edge-compatibility.md` (note: Astro roda em build-time, não no edge — as restrições de edge não se aplicam ao build tooling).
- [ ] Os tokens de design em REQ-003 foram aplicados no `tailwind.config.mjs` antes de qualquer componente ser criado.
- [ ] A ordem de desenvolvimento res