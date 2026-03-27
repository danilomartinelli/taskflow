# Code Map

(vazio — nenhum componente mapeado ainda)
```
Monorepo limpo — nenhum componente existente. O usuário respondeu "4 — Outra" na pergunta de Non-Goals mas não descreveu o que quer excluir. Vou assumir o mais conservador (opção 3 da lista original: tudo além da página única + sem sistema de design compartilhado) e documentar isso explicitamente no PRD como decisão tomada.

Gerando o PRD completo agora.

---

**Resumo Executivo — sp-007:**
- **Escopo:** Landing page estática única (`apps/web`) em Astro + TailwindCSS com Hero, 3 Features e Footer; design dark + verde neon; zero JS no cliente.
- **Data Model:** Nenhum — página 100% estática, sem D1/R2/KV.
- **Integrações:** `@fontsource/inter` + TailwindCSS; sem variáveis de ambiente; deploy via Cloudflare Pages.
- **Non-Goals:** Sem páginas adicionais, analytics, animações JS, dark/light toggle, i18n, formulários, ou extração de componentes para `packages/ui`.
- **Done:** `astro check` + `astro build` passam sem erros e a página está acessível via URL do Cloudflare Pages.

']` para garantir purge correto. |
| REQ-004 | **MUST** | O arquivo `tailwind.config.mjs` deve estender o tema padrão com: `colors.background = '#0a0a0a'` e `colors.accent = '#00fa62'`. |
| REQ-005 | **MUST** | A fonte Inter deve ser carregada via `@fontsource/inter` (pacote npm), importada no layout base Astro. Proibido usar Google Fonts CDN (impacta privacidade e performance). |
| REQ-006 | **MUST** | Nenhuma diretiva `client:*` do Astro deve ser usada em nenhum componente (ex: `client:load`, `client:idle`). Zero JavaScript no bundle do cliente. |
| REQ-007 | **MUST** | A Hero section deve conter: `<h1>` com título, `<p>` com subtítulo e `<a href=\"#features\">` como botão CTA. |
| REQ-008 | **MUST** | O CSS global deve incluir `html { scroll-behavior: smooth; }` para habilitar scroll suave via CSS puro, sem JavaScript. |
| REQ-009 | **MUST** | A seção de features deve ter `id=\"features\"` no elemento raiz e renderizar exatamente 3 cards com ícone SVG inline, título e descrição. |
| REQ-010 | **MUST** | Os ícones SVG devem ser embutidos diretamente no HTML (inline), não referenciados via `<img>` ou `<use xlink:href>`. |
| REQ-011 | **MUST** | O layout responsivo da seção de features deve usar Tailwind Grid: `grid-cols-1 md:grid-cols-3`. |
| REQ-012 | **MUST** | O footer deve usar a tag semântica `<footer>` e exibir copyright. |
| REQ-013 | **MUST** | O arquivo `wrangler.toml` ou configuração de deploy deve apontar para `apps/web/dist` como diretório de saída do Cloudflare Pages. |
| REQ-014 | **SHOULD** | O `<head>` deve incluir meta tags básicas de SEO: `<title>`, `<meta name=\"description\">` e `<meta name=\"viewport\">`. |
| REQ-015 | **SHOULD** | O `turbo.json` deve registrar o pipeline `check` para o workspace `apps/web` mapeando para o script `astro check`. |
| REQ-016 | **COULD** | Adicionar `<link rel=\"icon\">` apontando para um favicon SVG minimalista em `/public/favicon.svg`. |

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo são **explicitamente proibidos** nesta sprint para proteger o escopo e o tempo de entrega:

| Item | Justificativa |
|------|---------------|
| Páginas adicionais (pricing, blog, sobre, login) | Escopo desta sprint é uma única rota `/` |
| Analytics (Google Analytics, Plausible, Cloudflare Analytics) | Adiciona complexidade de script e/ou cookies sem ROI imediato |
| Animações JavaScript (GSAP, Framer Motion, CSS-in-JS animado) | Viola REQ-006 (zero JS no cliente) |
| Dark/Light mode toggle | Exige JavaScript e estado no cliente |
| Internacionalização (i18n) | Fora de escopo para MVP de landing |
| Formulários de captura de e-mail ou integração com Mailchimp/Resend | Exige backend ou script externo |
| Extração de componentes para `packages/ui` | Prematura — componentes ficam locais em `apps/web/src/components/` |
| Testes unitários (Vitest) | Explicitamente excluído pelo Sprint Goal; validação via `astro check` + `astro build` |
| SSR / Server-side rendering | `output: 'static'` é obrigatório (REQ-002) |
| React, Vue ou qualquer framework de UI com hidratação | Zero JS no cliente; componentes Astro puros são suficientes |
| Configuração de domínio customizado | Deploy em URL padrão do Cloudflare Pages (*.pages.dev) é suficiente para o DoD |

---

## 6. Cloudflare Bindings & Integrações

### Bindings Cloudflare

**Nenhum.** Esta é uma aplicação estática pura. Não há Workers, D1, KV, R2 ou Queues envolvidos.

### Dependências de Build (npm)

| Pacote | Versão Sugerida | Tipo | Motivo |
|--------|-----------------|------|--------|
| `astro` | `^4.x` | devDependency | Framework SSG |
| `@astrojs/tailwind` | `^5.x` | devDependency | Integração oficial Tailwind + Astro |
| `tailwindcss` | `^3.x` | devDependency | Framework CSS utilitário |
| `@fontsource/inter` | `^5.x` | dependency | Fonte Inter auto-hospedada (sem CDN externo) |

### Variáveis de Ambiente

**Nenhuma.** Zero secrets, tokens ou env vars são necessários.

### Plataforma de Deploy

- **Plataforma:** Cloudflare Pages (assets estáticos)
- **Build command:** `pnpm --filter @taskflow/web build` (ou `astro build` dentro de `apps/web`)
- **Output directory:** `apps/web/dist`
- **Node.js compatibility:** Não se aplica (build local, output estático)

---

## 7. Restrições & Casos Limite

### 7.1 Restrições Técnicas

| Restrição | Detalhe |
|-----------|--------|
| **Zero JS no cliente** | O Astro por padrão não gera JS a menos que `client:*` seja usado. O implementador DEVE verificar o `dist/` após o build para confirmar ausência de `.js` bundles. |
| **Fonte auto-hospedada** | `@fontsource/inter` serve os arquivos de fonte a partir do próprio domínio. Isso elimina requisições externas ao Google e evita flags de privacidade. O import deve ser feito no layout base: `import '@fontsource/inter';` ou variantes específicas (ex: `import '@fontsource/inter/400.css'`). |
| **TailwindCSS purge** | O `content` do Tailwind DEVE incluir `./src/**/*.{astro,html}`. Se omitir `.astro`, o purge removerá classes usadas nos componentes e o CSS gerado será incorreto. |
| **Scroll suave sem JS** | O `scroll-behavior: smooth` deve ser aplicado no seletor `html` via CSS global (ou via classe Tailwind `scroll-smooth` aplicada no `<html>`). NÃO usar `window.scrollTo()` ou `element.scrollIntoView()`. |
| **SVG inline** | Ícones devem ser copiados como markup SVG diretamente nos componentes `.astro`. Não usar `<Image>` do Astro nem `<img>` para ícones — isso geraria requests adicionais e quebraria o critério de zero dependências externas em runtime. |

### 7.2 Casos Limite & Fallbacks

| Cenário | Comportamento Esperado |
|---------|------------------------|
| Build falha por versão incompatível do Astro | Fixar versão exata no `package.json` (ex: `\"astro\": \"4.x.x\"`) em vez de usar `latest`. |
| TailwindCSS não aplica classes customizadas | Verificar se `tailwind.config.mjs` está no root de `apps/web` (não na raiz do monorepo). |
| Fonte Inter não carrega | Confirmar que o import de `@fontsource/inter` está no `<head>` do layout base, não em um componente filho. |
| Cloudflare Pages não encontra o diretório de output | Confirmar que o campo \"Build output directory\" no dashboard do Pages está configurado como `apps/web/dist` (caminho relativo à raiz do repositório). |
| `turbo build` não encontra o script do workspace | Confirmar que `apps/web/package.json` possui o script `\"build\": \"astro build\"` e `\"check\": \"astro check\"`. |

---

## 8. Estrutura de Arquivos Esperada

O implementador deve criar a seguinte estrutura em `apps/web`:

```
apps/web/
├── package.json                    # name: \"@taskflow/web\", scripts: build, check, dev
├── astro.config.mjs                # output: 'static', integrations: [tailwind()]
├── tailwind.config.mjs             # theme.extend.colors: { background, accent }
├── tsconfig.json                   # extends astro/tsconfigs/strict
├── public/
│   └── favicon.svg                 # [COULD] ícone minimalista
└── src/
    ├── layouts/
    │   └── Base.astro              # <html>, <head> (meta SEO, fontsource import), <body>
    ├── components/
    │   ├── Hero.astro              # <section> com h1, p, <a href=\"#features\">
    │   ├── Features.astro          # <section id=\"features\"> com 3 FeatureCard
    │   ├── FeatureCard.astro       # card individual com SVG inline, título, descrição
    │   └── Footer.astro            # <footer> com copyright
    └── pages/
        └── index.astro             # página raiz — importa e compõe os componentes
```

---

## 9. Referências Cruzadas

| Artefato | Caminho | Notas |
|----------|---------|-------|
| Este PRD | `architecture/plans/prd-sprint-sp-007.md` | SSoT desta sprint |
| System Rules | `system-rules.md` | Stack global e edge rules |
| Code Map | `architecture/code-map.md` | Vazio no início desta sprint — o Trigger Agent deve atualizá-lo ao final |
| Findings | `architecture/findings.md` | Consultar se erros de build Astro/Tailwind aparecerem |
"}}
File written successfully
{"name": "complete_phase", "parameters": {"summary": "Blueprint sp-007 concluído: landing page estática Astro + Tailwind em apps/web, zero JS no cliente, 6 histórias de usuário, 16 requisitos funcionais, deploy Cloudflare Pages via dist/, nenhum binding ou env var necessário."}}
Phase completed successfully
PRD salvo em `architecture/plans/prd-sprint-sp-007.md` e fase Blueprint encerrada. ✅