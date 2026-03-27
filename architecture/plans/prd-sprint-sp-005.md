# Code Map

> Auto-generated index of the monorepo. Update after each Sprint.

## Workspaces

_No workspaces registered yet._

## Shared Packages

_No packages registered yet._

## Key Files

_No key files registered yet._
{"name": "read_file", "parameters": {"path": "package.json"}}
{"name":"taskflow","version":"0.0.1","private":true,"scripts":{"build":"turbo build","dev":"turbo dev","lint":"turbo lint","format":"prettier --write \"**/*.{ts,tsx,md}\""},"devDependencies":{"prettier":"^3.5.3","turbo":"^2.5.4","typescript":"^5.8.3"}}{"name": "read_file", "parameters": {"path": "turbo.json"}}
{"$schema":"https://turborepo.com/schema.json","ui":"tui","tasks":{"build":{"dependsOn":["^build"],"inputs":["$TURBO_DEFAULT$",".env*"],"outputs":[".next/**","!.next/cache/**","dist/**"]},"lint":{"dependsOn":["^lint"]},"dev":{"cache":false,"persistent":true}}}Monorepo está limpo — nenhum workspace registrado ainda. Tenho tudo o que preciso. Gerando o PRD completo.

from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
});
```

**REQ-002 — [MUST] BaseLayout com tipografia Inter**  
Crie `src/layouts/BaseLayout.astro`. Ele deve:
- Importar `@fontsource/inter/400.css` e `@fontsource/inter/600.css` no `<head>`
- Definir `background-color: #0a0a0a` e `color: #e5e7eb` no `<body>` via classe Tailwind ou estilo global
- Incluir `<meta charset=\"UTF-8\">`, `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">` e `<title>TaskFlow</title>`
- Aplicar `scroll-behavior: smooth` ao elemento `<html>` via CSS global (no `<style is:global>` do layout ou em `src/styles/global.css`)

**REQ-003 — [MUST] Componente Hero**  
Crie `src/components/Hero.astro`. Deve renderizar:
- Um `<h1>` com o texto `\"TaskFlow\"`
- Um parágrafo com o subtítulo `\"Gerencie tarefas com velocidade máxima.\"`
- Um `<a href=\"#features\">` com label `\"Ver Funcionalidades\"`, estilizado como botão com `background-color: #00fa62` e texto escuro (`#0a0a0a`) para contraste

**REQ-004 — [MUST] Tokens de Design via Tailwind Config**  
Configure `tailwind.config.ts` para estender o tema com os design tokens canônicos:
```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        accent: '#00fa62',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
} satisfies Config;
```
Use as classes `bg-background`, `text-accent` etc. nos componentes para garantir consistência.

**REQ-005 — [MUST] Scroll suave via CSS**  
O scroll-behavior deve ser aplicado exclusivamente via CSS. O elemento `<html>` deve receber `scroll-behavior: smooth`. A seção de features na `index.astro` ou `Features.astro` deve possuir `id=\"features\"` exatamente. **Proibido** qualquer JavaScript para controlar o scroll.

**REQ-006 — [MUST] Componente Features com 3 cards e SVGs inline**  
Crie `src/components/Features.astro`. Deve renderizar:
- Uma seção com `id=\"features\"`
- Exatamente 3 cards, cada um com: SVG inline, título e parágrafo de descrição
- Os dados dos cards são hardcoded no template (ver Seção 2.2 para valores canônicos)
- Os SVGs devem ser inline no HTML (sem `<img>`) para permitir estilização via CSS

Layout do grid (via Tailwind):
```html
<div class=\"grid grid-cols-1 lg:grid-cols-3 gap-8\">
  <!-- 3 cards aqui -->
</div>
```

**REQ-007 — [MUST] Zero JavaScript no cliente**  
O arquivo `dist/index.html` final NÃO deve conter nenhuma tag `<script>` com código de comportamento. O Astro, por padrão, não injeta JS em páginas sem componentes de framework. Não adicione diretivas `client:*` em nenhum componente. Se o `astro build` gerar um `_astro/` com arquivos `.js`, isso é um sinal de violação desta regra — investigue e remova a causa.

**REQ-008 — [MUST] Layout responsivo**  
A página deve ser utilizável em mobile (≥ 320px) e desktop (≥ 1024px). Requisitos mínimos:
- Hero: texto centralizado, botão CTA com padding generoso
- Features: 1 coluna em mobile, 3 colunas em `lg:` (Tailwind breakpoint)
- Footer: texto centralizado

**REQ-009 — [MUST] Componente Footer**  
Crie `src/components/Footer.astro`. Deve renderizar:
- Um `<footer>` com o texto `\"© 2025 TaskFlow. Todos os direitos reservados.\"`
- Cor de texto muted (classe Tailwind `text-gray-500` ou equivalente)
- Alinhamento centralizado

**REQ-010 — [MUST] Deploy via wrangler**  
O comando de deploy é `wrangler pages deploy dist/` executado a partir de `apps/web/`. O agente de deploy detecta automaticamente projetos Astro. **Não crie `wrangler.toml`** nesta sprint — o deploy é imperativo via CLI. Zero variáveis de ambiente são necessárias.

**REQ-011 — [MUST] Integração com Turborepo**  
O `package.json` de `apps/web/` deve declarar os scripts:
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
O `turbo.json` da raiz já possui a task `build` com outputs `[\"dist/**\"]` — o novo workspace será detectado automaticamente pelo Turborepo via pnpm workspaces.

**REQ-012 — [MUST] Registro do workspace em `pnpm-workspace.yaml`**  
Verifique o conteúdo atual de `pnpm-workspace.yaml`. Se ele não incluir `apps/*`, adicione:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```
Isso garante que o `apps/web` seja reconhecido como workspace pnpm.

**REQ-013 — [SHOULD] Favicon SVG simples**  
Crie `public/favicon.svg` com um ícone minimalista (pode ser um quadrado sólido na cor `#00fa62` com a letra \"T\"). Referencie no `<head>` do BaseLayout:
```html
<link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon.svg\" />
```

---

## 5. Fora do Escopo (Non-Goals)

As funcionalidades abaixo são **explicitamente proibidas** nesta sprint. O executor deve recusar qualquer instrução que as inclua sem uma aprovação formal do CTO via novo sprint goal.

| # | Item Proibido | Motivo |
|---|---|---|
| NG-01 | Formulário de waitlist / captura de e-mail | Requer backend ou integração Resend — sprint futura |
| NG-02 | Rotas adicionais (`/blog`, `/pricing`, `/docs`, `/about`) | Apenas `index.astro` nesta sprint |
| NG-03 | Animações com JavaScript (Framer Motion, GSAP, AOS) | Viola REQ-007 (zero JS no cliente) |
| NG-04 | Dark/Light mode toggle | Viola REQ-007; design é exclusivamente dark |
| NG-05 | Internacionalização (i18n) | Complexidade desnecessária nesta fase |
| NG-06 | Analytics (GA4, Plausible, Cloudflare Web Analytics) | Sprint futura |
| NG-07 | SEO avançado (Open Graph, Twitter Cards, sitemap, robots.txt) | Sprint futura |
| NG-08 | Testes unitários ou E2E (Vitest, Playwright, Cypress) | Validação apenas por `astro check` + `astro build` |
| NG-09 | Componentes React, Vue, Svelte ou qualquer framework JS | Astro puro com zero hidratação |
| NG-10 | Adapter `@astrojs/cloudflare` | Não necessário para output estático puro |
| NG-11 | Variáveis de ambiente ou secrets | Zero configuração de infraestrutura nesta sprint |
| NG-12 | `wrangler.toml` ou configuração declarativa de Pages | Deploy é imperativo via CLI |
| NG-13 | CSS animations/transitions via JavaScript | CSS puro apenas (keyframes e transitions via Tailwind são permitidos) |

---

## 6. Cloudflare Bindings & Integrações

**Bindings Cloudflare:** Nenhum. Esta sprint não utiliza D1, KV, R2, Queues ou Workers.

**APIs Externas:** Nenhuma. Zero dependências de serviços externos.

**Variáveis de Ambiente:** Nenhuma. O build é completamente determinístico e sem segredos.

**Cloudflare Pages:** O projeto será deployado na plataforma Cloudflare Pages via `wrangler pages deploy dist/`. O nome do projeto Pages deve ser `taskflow` (ou conforme configurado pelo agente de deploy).

---

## 7. Restrições & Casos Limite

**R-01 — Compatibilidade de fonte com Astro:**  
O `@fontsource/inter` deve ser importado no componente `BaseLayout.astro` via import CSS padrão (`import '@fontsource/inter/400.css'`). Se o Astro não resolver o import, use o caminho relativo do `node_modules` ou configure o Vite. **Não use CDN Google Fonts** — viola o princípio de zero dependências externas em runtime.

**R-02 — Purge do TailwindCSS:**  
O `tailwind.config.ts` deve incluir `'./src/**/*.{astro,html,ts,tsx}'` no campo `content` para garantir que classes usadas nos `.astro` não sejam purgadas no build de produção. Classes usadas dinamicamente (ex: via template literals) podem ser removidas — prefira classes estáticas.

**R-03 — SVGs inline vs external:**  
Os ícones SVG dos feature cards devem ser inline no HTML. Não use `<img src=\"icon.svg\">` pois impede estilização via CSS. Escreva o SVG diretamente no template `.astro`. Tamanho recomendado: `width=\"24\" height=\"24\"` com `viewBox=\"0 0 24 24\"`.

**R-04 — `astro check` como gate de qualidade:**  
O script `build` em `apps/web/package.json` executa `astro check && astro build` em sequência. Se `astro check` falhar (erro de tipo), o build não ocorre. Isso é intencional — é o único gate de qualidade desta sprint (substitui testes unitários).

**R-05 — Scroll behavior em browsers antigos:**  
`scroll-behavior: smooth` não é suportado em browsers muito antigos (IE 11). Este é um trade-off aceito explicitamente — sem polyfill JS. Em browsers não suportados, o scroll será instantâneo (comportamento de fallback nativo do browser).

**R-06 — Output `dist/` como artefato de deploy:**  
O Turborepo está configurado com `outputs: [\"dist/**\"]` no `turbo.json` raiz. O cache do Turborepo usará o conteúdo do `dist/` para invalidação. Isso significa que builds idênticos serão cacheados. O agente de deploy deve sempre executar `astro build` antes de `wrangler pages deploy dist/`.

**R-07 — Sem `node_modules` compartilhados para UI:**  
Como o `code-map.md` não registra nenhum `packages/ui` compartilhado, todos os componentes Astro devem viver localmente em `apps/web/src/components/`. Não crie um `packages/ui` nesta sprint — isso é escopo futuro.

---

## 8. Checklist de Entrega (Definition of Done)

A sprint SP-005 está **CONCLUÍDA** quando todos os itens abaixo forem verdadeiros:

- [ ] `apps/web/` existe como workspace pnpm (`\"name\": \"@taskflow/web\"` no `package.json`)
- [ ] `pnpm-workspace.yaml` inclui `apps/*`
- [ ] `astro check` retorna código 0 (zero erros de tipo)
- [ ] `astro build` retorna código 0 e gera `apps/web/dist/index.html`
- [ ] `dist/index.html` contém: Hero com `<h1>TaskFlow</h1>`, botão com `href=\"#features\"`, seção `id=\"features\"` com 3 cards, `<footer>`
- [ ] Nenhuma tag `<script>` com código de comportamento no HTML final
- [ ] `wrangler pages deploy dist/` executa sem erro
- [ ] A página é visualmente correta em Chrome/Firefox: dark background, acento verde, tipografia Inter
- [ ] Clicar no CTA rola suavemente até `#features` (CSS smooth scroll)

---

*Documento gerado pelo Witek Blueprint Agent para a Sprint SP-005. Próximo artefato: `plan-sprint-sp-005.json` (Fase Architect).*
"}}
{"success":true,"path":"architecture/plans/prd-sprint-sp-005.md"}**Resumo Executivo — SP-005**

**Escopo:** Uma única página estática (`apps/web/index.astro`) com Hero, Features (3 cards hardcoded com SVGs inline) e Footer minimalista — sem rotas adicionais, sem JS no cliente.

**Data Model:** Zero. Nenhum D1, R2, KV ou variável de ambiente. Build 100% determinístico.

**Stack:** Astro `output: 'static'` + TailwindCSS + `@fontsource/inter`, dentro de `apps/web/` como workspace pnpm no Turborepo existente.

**Integrações:** Nenhuma. Deploy via `wrangler pages deploy dist/` (CLI imperativo, sem `wrangler.toml`).

**Non-Goals explícitos:** Formulário de waitlist, rotas `/blog`/`/pricing`/`/docs`, animações JS, dark/light toggle, i18n, analytics, Open Graph, testes unitários/E2E, adapters de framework, React/Vue/Svelte.

{"name": "complete_phase", "parameters": {"summary": "PRD da Sprint SP-005 gerado e salvo — landing page estática TaskFlow com Hero + Features + Footer, Astro output:static + TailwindCSS, zero JS no cliente, deploy via wrangler pages deploy."}}
{"success":true}