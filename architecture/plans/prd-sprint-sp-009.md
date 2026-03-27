# Code Map

> Auto-generated index of the monorepo. Updated by the Trigger Agent at the end of each sprint.

## apps/api

_No components registered yet._

## apps/web

_No components registered yet._

## packages/db

_No components registered yet._

## packages/shared

_No components registered yet.
O monorepo existe mas `apps/web` ainda não tem componentes registrados — caminho livre para criar o workspace do zero. Gerando o PRD agora.

**Resumo Executivo — sp-009:**
- **Escopo:** Landing page estática única (`/`) com Hero, 3 Features e Footer no workspace `apps/web`.
- **Data Model:** Zero — sem D1, R2, KV ou qualquer binding Cloudflare. Build estático puro.
- **Integrações:** Apenas `@fontsource/inter` via npm. Sem chaves de API ou variáveis de ambiente.
- **Non-Goals:** Sem rotas adicionais, sem formulário/captura de email, sem animações complexas.

}
```

**REQ-003** `[MUST]` Instalar as seguintes dependências no workspace `apps/web`:
```
astro                    (latest stable)
@astrojs/tailwind        (integration oficial)
tailwindcss              (latest)
@fontsource/inter        (fonte Inter via npm)
```
Sem dependências adicionais. Zero CDN externo no HTML gerado.

**REQ-004** `[MUST]` Configurar o `tailwind.config.mjs` para estender o tema com os design tokens definidos na seção 2.4:
```js
// apps/web/tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        base: '#0a0a0a',
        accent: '#00fa62',
        muted: '#a1a1aa',
        subtle: '#27272a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

**REQ-005** `[MUST]` Adicionar `apps/web` ao `pnpm-workspace.yaml` na raiz do monorepo (se o arquivo existir) e garantir que o workspace está registrado. Verificar se o arquivo existe antes de criar — nunca sobrescrever configurações existentes de outros workspaces.

**REQ-006** `[MUST]` O arquivo `apps/web/src/pages/index.astro` deve importar e compor os três componentes (`<Hero />`, `<Features />`, `<Footer />`) dentro do `<BaseLayout>`. Nenhuma lógica de negócio deve existir neste arquivo — apenas composição.

### Componentes

**REQ-007** `[MUST]` O componente `Hero.astro` deve implementar exatamente o conteúdo definido na seção 2.3. O botão CTA deve ser uma tag `<a>` (não `<button>`) com `href=\"#features\"`.

**REQ-008** `[MUST]` O componente `Features.astro` deve renderizar a seção com `id=\"features\"` e os 3 cards com SVGs inline. Os ícones SVG devem ser desenhados inline no `.astro` — NÃO use `<img src=\"icon.svg\">` nem sprites externos.

**REQ-009** `[MUST]` Cada ícone SVG deve ser semanticamente relacionado ao conteúdo da feature:
- Feature 1 (\"Foco\"): ícone de alvo ou mira (`target`/`crosshair`)
- Feature 2 (\"Tudo em um lugar\"): ícone de grid ou layers (`grid`/`layers`)
- Feature 3 (\"Progresso\"): ícone de gráfico de barras ou tendência (`bar-chart`/`trending-up`)

**REQ-010** `[MUST]` O componente `Footer.astro` deve conter apenas o texto de copyright definido na seção 2.3. Sem links, sem ícones de redes sociais, sem navegação.

**REQ-011** `[MUST]` O `BaseLayout.astro` deve incluir no `<head>`:
```html
<meta charset=\"UTF-8\" />
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
<meta name=\"description\" content=\"TaskFlow — Organize suas tarefas com simplicidade\" />
<title>TaskFlow</title>
```
A importação de `@fontsource/inter` deve ocorrer no `BaseLayout.astro`:
```js
import '@fontsource/inter';
```

### Qualidade e Deploy

**REQ-012** `[MUST]` Nenhum JavaScript deve ser emitido no bundle de saída. Verificar via inspeção do `dist/index.html` — ausência de tags `<script>` é mandatória. Componentes Astro não devem usar diretivas de cliente (`client:load`, `client:idle`, etc.).

**REQ-013** `[MUST]` O `astro check` deve passar sem erros de tipo ou de template antes de considerar a sprint concluída.

**REQ-014** `[MUST]` Criar o arquivo `apps/web/wrangler.toml` com a configuração mínima para Cloudflare Pages:
```toml
name = \"taskflow-web\"
compatibility_date = \"2025-01-01\"

[pages_build_output_dir]
dir = \"dist\"
```
> **Nota:** Nenhum binding (`[[d1_databases]]`, `[[kv_namespaces]]`, `[[r2_buckets]]`) deve constar neste arquivo — a página é estática e não requer Workers runtime.

**REQ-015** `[SHOULD]` Criar o arquivo `apps/web/.gitignore` com:
```
dist/
.astro/
node_modules/
```

### Responsividade

**REQ-016** `[MUST]` O layout deve ser responsivo com breakpoints Tailwind padrão:
- Mobile (< `lg:`): Seções empilhadas, grid de features em 1 coluna.
- Desktop (≥ `lg:`): Grid de features em 3 colunas lado a lado.

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo estão **explicitamente proibidos** nesta sprint. Qualquer agente executor que tentar implementar os itens abaixo está violando o escopo aprovado.

| # | Item Proibido | Justificativa |
|---|---|---|
| NG-01 | Páginas adicionais (`/pricing`, `/about`, `/blog`, `/app`) | Escopo é uma única rota `/`. |
| NG-02 | Formulário de waitlist, captura de email ou qualquer `<form>` | Aumentaria complexidade e adicionaria dependências externas. |
| NG-03 | Integração com Resend, ConvertKit ou qualquer serviço de email | Sem formulário, sem necessidade de email. |
| NG-04 | Animações complexas (Framer Motion, GSAP, AOS) | Apenas `transition` e `hover:` via Tailwind são permitidos. |
| NG-05 | JavaScript no cliente (React, Alpine.js, componentes com `client:*`) | Zero JS é requisito não negociável desta sprint. |
| NG-06 | Autenticação, sessões ou qualquer lógica de usuário | Página pública e estática. |
| NG-07 | Bindings Cloudflare (D1, R2, KV, Queues) | Zero infraestrutura de dados. |
| NG-08 | CDN externo para fontes (Google Fonts, etc.) | Apenas `@fontsource/inter` via npm. |
| NG-09 | Testes unitários (Vitest) | Validação apenas por `astro check` e `astro build`. |
| NG-10 | Internacionalização (i18n) | Apenas português brasileiro nesta sprint. |

---

## 6. Cloudflare Bindings & Integrações

### Bindings Cloudflare
**Nenhum.** Esta sprint não requer bindings de runtime.

### Dependências npm (Completas)
```
astro                  — framework estático
@astrojs/tailwind       — integração oficial Astro + Tailwind
tailwindcss             — utilitários CSS
@fontsource/inter       — fonte Inter via npm (zero CDN)
```

### Variáveis de Ambiente
**Nenhuma.** Zero variáveis de ambiente são necessárias.

### Deploy Target
- **Plataforma:** Cloudflare Pages
- **Método:** Git integration ou `wrangler pages deploy dist/`
- **Output dir:** `apps/web/dist/`
- **Build command (no painel Cloudflare Pages):** `cd apps/web && pnpm run build`

---

## 7. Restrições & Casos Limite

### Restrições Técnicas

**R-01 — Zero JavaScript no bundle:** Qualquer componente Astro com diretiva `client:*` viola esta restrição. O Avaliador deve inspecionar o HTML final e rejeitar a entrega se encontrar tags `<script>`.

**R-02 — Fontes self-hosted:** A fonte Inter DEVE ser importada via `@fontsource/inter` no `BaseLayout.astro`. Qualquer link para `fonts.googleapis.com` ou qualquer CDN externo é proibido e quebraria a política de privacidade e performance offline.

**R-03 — SVGs inline:** Ícones das features DEVEM ser inline no HTML — não arquivos `.svg` separados em `public/` referenciados via `<img>`. Isso garante que os ícones recebam a cor de acento via CSS (classes Tailwind) sem injeção de JS.

**R-04 — Âncora CTA:** O botão CTA NO Hero aponta para `#features`. Esta é uma navegação nativa do browser, sem scroll suave via JavaScript. Se smooth scroll for desejado no futuro, deve ser implementado via `scroll-behavior: smooth` no CSS global — nunca via JS.

**R-05 — Turborepo filter:** O workspace `apps/web` deve ter `\"name\": \"web\"` no `package.json` para ser selecionável via `pnpm turbo build --filter=web`.

**R-06 — TypeScript strict:** O `tsconfig.json` de `apps/web` deve estender a config base do Astro (`astro/tsconfigs/strict`) para garantir type-checking correto nos templates `.astro`.

### Comportamentos de Fallback

| Cenário | Comportamento Esperado |
|---|---|
| Font loading falha | Browser usa `sans-serif` como fallback (definido no `fontFamily.sans`) |
| CSS não carrega | O HTML semântico ainda é legível (ordem de heading H1 → H2 → p está correta) |
| Build falha no CI | Pipeline bloqueia o deploy — nenhum artefato parcial é publicado |

---

## 8. Referências Cruzadas

| Documento | Localização |
|---|---|
| Project Doctrine | `system-rules.md` |
| Code Map | `architecture/code-map.md` |
| Este PRD | `architecture/plans/prd-sprint-sp-009.md` |

---

*PRD gerado pelo Witek Blueprint Agent — Fase 1 (Blueprint) do protocolo B.L.A.S.T.*
"}}
{"success":true,"path":"architecture/plans/prd-sprint-sp-009.md"}
{"name": "complete_phase", "parameters": {"summary": "PRD sp-009 gerado: landing page estática TaskFlow em apps/web com Astro + TailwindCSS, zero JS no cliente, zero bindings Cloudflare, 4 user stories, 16 requisitos funcionais e 10 non-goals explícitos."}}
{"success":true}