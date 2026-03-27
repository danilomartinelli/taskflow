# Code Map

_Mapeamento do código existente no monorepo. Atualizado ao final de cada Sprint pelo Trigger Agent._

## Monorepo Structure

```
/
├── apps/
│   ├── api/          # Hono API — Cloudflare Workers
│   ├── app/          # React SPA (TanStack Router + Query)
│   └── web/          # (reservado — landing page futura)
├── packages/
│   ├── db/           # Drizzle ORM schema + D1 migrations
│   ├── shared/       # Tipos compartilhados, Zod schemas, utilitários
│   └── email/        # Templates de e-mail (React Email)
└── tooling/
    ├── eslint/        # Config ESLint compartilhada
    ├── typescript/    # tsconfig base
    └── tailwind/      # Config Tailwind compartilhada
```

## apps/api

**Entry:** `src/index.ts`
**Runtime:** Cloudflare Workers (Hono)

| Componente | Caminho | Descrição |
|---|---|---|
| App Principal | `src/index.ts` | Entry point Hono, monta todas as rotas |
| Middleware Auth | `src/middleware/auth.ts` | Valida JWT via jose, injeta `c.var.user` |
| Rota: Auth | `src/routes/auth.ts` | Login, registro, refresh token |
| Rota: Projects | `src/routes/projects.ts` | CRUD de projetos |
| Rota: Tasks | `src/routes/tasks.ts` | CRUD de tarefas com filtros |
| Rota: Tags | `src/routes/tags.ts` | Gerenciamento de tags |
| Rota: Webhooks | `src/routes/webhooks.ts` | Processamento de eventos externos |

## apps/app

**Entry:** `src/main.tsx`
**Runtime:** Browser (SPA)

| Componente | Caminho | Descrição |
|---|---|---|
| App Root | `src/main.tsx` | Entry point React |
| Router | `src/router.tsx` | TanStack Router config |
| Layout | `src/components/layout/` | Shell, Sidebar, Header |
| Tela: Dashboard | `src/pages/dashboard.tsx` | Visão geral de projetos/tarefas |
| Tela: Projects | `src/pages/projects.tsx` | Listagem e criação de projetos |
| Tela: Tasks | `src/pages/tasks.tsx` | Board/lista de tarefas |

## packages/db

| Componente | Caminho | Descrição |
|---|---|---|
| Schema | `src/schema.ts` | Tabelas D1 via Drizzle ORM |
| Migrations | `migrations/` | SQL gerado pelo drizzle-kit |
| Client | `src/client.ts` | Instância do Drizzle para D1 |

## packages/shared

| Componente | Caminho | Descrição |
|---|---|---|
| Tipos | `src/types.ts` | Interfaces TypeScript compartilhadas |
| Schemas Zod | `src/schemas.ts` | Validação de payloads |
| Utilitários | `src/utils.ts` | Funções helper puras |

## packages/email

| Componente | Caminho | Descrição |
|---|---|---|
| Templates | `src/templates/` | Componentes React Email |
| Utilitários | `src/utils.ts` | Helper de renderização de e-mail |
O workspace `apps/web` já está reservado no code-map. Agora tenho tudo que preciso para gerar o PRD.

'],
  theme: {
    extend: {
      colors: {
        accent: '#00fa62',
        surface: '#111111',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
}
```

**REQ-003 — Fonte Inter via npm** `MUST`  
Instale `@fontsource/inter` como dependência de `apps/web`. Importe no `BaseLayout.astro` via import CSS:
```astro
---
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
---
```
Não use Google Fonts CDN. Não use `<link rel=\"preconnect\">` para fonts.googleapis.com.

---

### Estrutura de Componentes

**REQ-004 — Layout base** `MUST`  
Crie `src/layouts/BaseLayout.astro`. Ele deve:
- Declarar `<!DOCTYPE html>`, `<html lang=\"pt-BR\">`, `<head>` e `<body>`
- Incluir `<meta charset=\"UTF-8\">`, `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">`
- Incluir `<title>TaskFlow — Organize. Priorize. Execute.</title>`
- Aplicar `class=\"bg-[#0a0a0a] text-white font-sans\"` no `<body>`
- Renderizar um `<slot />` para o conteúdo da página
- Importar os estilos do TailwindCSS via `@astrojs/tailwind` (automático)

**REQ-005 — Componente Hero** `MUST`  
Crie `src/components/Hero.astro`. Requisitos:
- Texto do título hardcoded: `Organize. Priorize. Execute.`
- Texto do subtítulo hardcoded conforme Seção 2.2
- CTA implementado como `<a href=\"#features\">` com classes TailwindCSS (cor `#00fa62`, borda, padding)
- **PROIBIDO:** qualquer tag `<script>` neste componente
- Layout: centralizado, padding vertical generoso (`py-24` ou equivalente)

**REQ-006 — Componente Features** `MUST`  
Crie `src/components/Features.astro`. Requisitos:
- Elemento raiz com `id=\"features\"` para que a âncora do Hero funcione
- Exatamente 3 cards, cada um com: ícone SVG inline, título e descrição (valores da Seção 2.2)
- Grid responsivo: `grid-cols-1 md:grid-cols-3` com gap adequado
- Ícones SVG inline (código `<svg>` diretamente no HTML, não como arquivo externo nem `<img>`)
- Cores dos ícones: `stroke` ou `fill` com `text-[#00fa62]` via TailwindCSS
- Cards com `bg-[#111111]`, border sutil, padding interno (`p-6` ou equivalente)
- **PROIBIDO:** qualquer tag `<script>` neste componente

Sugestão de ícones SVG inline para cada feature (Heroicons outline, 24x24):

```html
<!-- Feature 1: Tarefas sem atrito — ícone de checkmark/task -->
<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\"
     stroke-width=\"1.5\" stroke=\"currentColor\" class=\"w-8 h-8 text-[#00fa62]\">
  <path stroke-linecap=\"round\" stroke-linejoin=\"round\"
        d=\"M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z\" />
</svg>

<!-- Feature 2: Visibilidade total — ícone de chart/bar -->
<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\"
     stroke-width=\"1.5\" stroke=\"currentColor\" class=\"w-8 h-8 text-[#00fa62]\">
  <path stroke-linecap=\"round\" stroke-linejoin=\"round\"
        d=\"M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z\" />
</svg>

<!-- Feature 3: Integração nativa — ícone de plug/connection -->
<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\"
     stroke-width=\"1.5\" stroke=\"currentColor\" class=\"w-8 h-8 text-[#00fa62]\">
  <path stroke-linecap=\"round\" stroke-linejoin=\"round\"
        d=\"M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244\" />
</svg>
```

**REQ-007 — Componente Footer** `MUST`  
Crie `src/components/Footer.astro`. Requisitos:
- Exibe exatamente: `© 2025 TaskFlow. Todos os direitos reservados.`
- Texto centralizado, cor `text-[#a3a3a3]`
- Sem links, sem colunas, sem redes sociais
- **PROIBIDO:** qualquer tag `<script>` neste componente

**REQ-008 — Página index** `MUST`  
Crie `src/pages/index.astro`. Deve:
- Importar e usar `BaseLayout`
- Compor `<Hero />`, `<Features />` e `<Footer />` nessa ordem
- Não conter lógica de negócio ou JavaScript

---

### Build & Deploy

**REQ-009 — Configuração Astro para Cloudflare Pages** `MUST`  
O arquivo `astro.config.mjs` deve usar `output: 'static'` (modo estático puro, sem adaptador de Workers):
```js
// apps/web/astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
});
```
Não use `@astrojs/cloudflare` — esse adaptador é para SSR/Workers. Cloudflare Pages serve estáticos nativamente sem adaptador.

**REQ-010 — Zero JavaScript no cliente** `MUST`  
O HTML final gerado pelo `astro build` não deve conter nenhuma tag `<script>` além de possíveis scripts de hidratação do próprio Astro (que não são emitidos quando não há componentes de framework interativos). Valide com:
```bash
grep -r '<script' apps/web/dist/index.html
# Deve retornar vazio ou apenas comentários
```

**REQ-011 — Comandos de validação** `MUST`  
Os seguintes comandos devem passar sem erros antes do deploy:
```bash
# A partir da raiz do monorepo:
pnpm --filter web exec astro check
pnpm --filter web build
```
Não são exigidos testes unitários nesta sprint.

**REQ-012 — Turborepo pipeline** `SHOULD`  
Adicione `\"web\"` explicitamente na pipeline `build` do `turbo.json` raiz se ainda não estiver coberto pelo wildcard. O output de build deve estar em `apps/web/dist/**`.

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo estão **explicitamente proibidos** nesta sprint. Qualquer implementação que extrapole esta lista é considerada scope creep e deve ser revertida.

| Item | Motivo da Exclusão |
|---|---|
| Domínio customizado (ex: taskflow.app) | Sprint futura dedicada a DNS/SSL |
| Animações JavaScript (GSAP, Motion, etc.) | Viola REQ-010 (zero JS no cliente) |
| Dark/Light mode toggle | Scope creep — apenas dark mode nesta sprint |
| i18n / internacionalização | Sem demanda definida ainda |
| Página de Pricing | Conteúdo não definido |
| Seção FAQ | Conteúdo não definido |
| Seção Testimonials | Social proof não disponível |
| Formulário de contato ou waitlist | Exigiria backend ou serviço externo |
| Blog ou páginas adicionais | Além do escopo de landing única |
| CMS (Contentful, Sanity, etc.) | Sem justificativa de escala nesta sprint |
| Testes unitários (Vitest) | Explicitamente excluído pelo CTO |
| CI/CD customizado (GitHub Actions, etc.) | Deploy manual via Cloudflare Pages dashboard |
| SEO avançado (sitemap.xml, Open Graph, structured data) | Sprint futura |
| Favicon customizado | Usar favicon padrão do scaffold Astro |
| Otimização de imagens (Sharp, astro:assets) | Não há imagens nesta sprint |
| Analytics (Cloudflare Web Analytics, etc.) | Sem configuração nesta sprint |
| React, Vue ou qualquer framework JS de UI | Componentes são 100% `.astro` estáticos |

---

## 6. Cloudflare Bindings & Integrações

**Bindings Cloudflare:** Nenhum. Esta sprint não usa D1, KV, R2, Queues ou Workers.

**APIs Externas:** Nenhuma. Não há chaves de API, tokens ou segredos.

**Variáveis de Ambiente:** Nenhuma. O build é 100% determinístico sem variáveis de runtime.

**Plataforma de Deploy:** Cloudflare Pages (modo estático). Configuração via dashboard:
- **Build command:** `pnpm --filter web build`
- **Build output directory:** `apps/web/dist`
- **Root directory:** `/` (raiz do monorepo)
- **Node.js version:** 18+ (para compatibilidade com pnpm e Astro)

---

## 7. Restrições & Casos Limite

### Restrições Técnicas

**R-01 — Edge Compatibility (Não Aplicável)**  
Esta sprint não executa código no Cloudflare Workers. O output é estático (HTML/CSS/assets). As regras de edge compatibility do `system-rules.md` não se aplicam ao `apps/web`.

**R-02 — Monorepo pnpm workspaces**  
`apps/web/package.json` deve ter `\"name\": \"web\"` para ser reconhecido pelo Turborepo. A instalação de dependências deve ser feita via `pnpm --filter web add <pacote>` a partir da raiz.

**R-03 — @fontsource/inter bundling**  
O `@fontsource/inter` copia os arquivos de fonte para o diretório de build. Verifique que o `tailwind.config.mjs` referencia `Inter` exatamente como a fonte `sans` para que o TailwindCSS aplique `font-family: 'Inter', sans-serif` corretamente.

**R-04 — TailwindCSS + Astro purge**  
O `content` do `tailwind.config.mjs` deve incluir `'./src/**/*.{astro,html}'` para que o Tailwind faça o purge correto das classes não utilizadas em produção.

**R-05 — Scroll suave no CTA**  
O scroll suave para a âncora `#features` pode ser habilitado via CSS puro, sem JavaScript:
```css
/* No BaseLayout.astro ou global CSS */
html {
  scroll-behavior: smooth;
}
```
Não use `window.scrollTo()` ou `scrollIntoView()` — isso violaria REQ-010.

### Casos Limite

**CE-01 — Build em monorepo sem `turbo.json` atualizado**  
Se o `turbo.json` raiz não incluir `apps/web` no pipeline de build, o comando `turbo run build` ignorará o workspace. Verifique e adicione se necessário (REQ-012).

**CE-02 — Conflito de versões TailwindCSS**  
Se `tooling/tailwind/` já define uma versão de TailwindCSS e `apps/web` instala uma versão diferente, pode haver conflito. Use a mesma versão major definida no `tooling/`.

**CE-03 — Output directory no Cloudflare Pages**  
O Cloudflare Pages precisa do output directory configurado como `apps/web/dist` (relativo à raiz do repositório). Se configurado apenas como `dist`, o deploy falhará em monorepo.

---

## 8. Referência Cruzada de Requisitos × Histórias

| Requisito | US Relacionada | Prioridade |
|---|---|---|
| REQ-001 | US-001 | MUST |
| REQ-002 | US-001 | MUST |
|