# 3. Histórias de Usuário & Matriz do Avaliador

> **Aviso de Escopo:** Todas as histórias abaixo são executáveis dentro desta única sprint. Qualquer funcionalidade não listada aqui deve ser tratada como fora do escopo.

---

### US-001: Setup do Workspace Astro

**Descrição:** Como desenvolvedor, eu quero um workspace Astro funcional em `apps/web` integrado ao Turborepo para que o projeto possa ser buildado com `pnpm build` a partir da raiz do monorepo.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Build:** `pnpm --filter web build` executa sem erros a partir da raiz do monorepo.
- [ ] **Check de Tipos:** `pnpm --filter web exec astro check` retorna zero erros.
- [ ] **Integração Turborepo:** O script `build` em `apps/web/package.json` está registrado e o `turbo.json` raiz inclui o pipeline `build` que contempla `apps/web`.
- [ ] **Output:** O diretório `apps/web/dist/` é gerado após o build com arquivos HTML estáticos.

---

### US-002: Hero Section

**Descrição:** Como visitante da landing page, eu quero ver uma seção hero com headline, subheadline e botão CTA para que eu entenda imediatamente o que é o TaskFlow e seja direcionado à próxima ação.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **UI:** A seção exibe exatamente o texto `\"Organize. Colabore. Entregue.\"` como headline principal (`<h1>`).
- [ ] **UI:** O subtítulo exibe `\"TaskFlow é a plataforma de gestão de tarefas que sua equipe vai realmente usar.\"`
- [ ] **UI:** O botão CTA exibe o label `\"Conheça os Recursos\"` e possui `href=\"#features\"` (âncora interna).
- [ ] **Design:** O background da seção é `#0a0a0a`. O texto do botão CTA usa o acento `#00fa62`. O botão NÃO possui JavaScript — é um `<a>` HTML nativo.
- [ ] **E2E:** Clicar no botão CTA rola a página suavemente até a seção `#features` (via CSS `scroll-behavior: smooth` no `html`).
- [ ] **Zero JS:** O HTML gerado pelo build não contém atributos `data-astro-*` de hidratação nem scripts de cliente na seção hero.

---

### US-003: Seção de Features (3 Cards)

**Descrição:** Como visitante, eu quero ver três cards de features do TaskFlow para que eu entenda rapidamente os benefícios principais do produto.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **UI:** A seção possui o atributo `id=\"features\"` para funcionar como alvo da âncora do CTA.
- [ ] **Conteúdo:** Os três cards exibem exatamente os títulos e descrições definidos no Contrato de Conteúdo (seção 2.1): \"Organize Tarefas\", \"Colabore em Tempo Real\", \"Meça o Progresso\".
- [ ] **Ícones:** Cada card possui um ícone SVG inline único e semanticamente relacionado ao feature (NÃO o mesmo SVG para os três). Os SVGs são embutidos diretamente no HTML (não são `<img src=\"...\">`), sem dependência de bibliotecas de ícones externas.
- [ ] **Design:** Os cards respeitam o design system: background de card em tom escuro (`#111111` ou similar), borda sutil, ícone colorido com `#00fa62`.
- [ ] **Responsividade:** Em mobile (< 768px), os cards empilham verticalmente. Em desktop (≥ 768px), exibem em grid de 3 colunas (via TailwindCSS).
- [ ] **Zero JS:** Nenhum script de cliente é necessário para renderizar ou interagir com os cards.

---

### US-004: Footer Minimalista

**Descrição:** Como visitante, eu quero ver um footer com copyright para que a página tenha uma conclusão visual adequada.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Conteúdo:** O footer exibe `© [ano atual] TaskFlow. Todos os direitos reservados.` — o ano deve ser gerado em build-time pelo Astro (ex: `new Date().getFullYear()` no frontmatter do componente), não hardcoded.
- [ ] **Design:** O footer é minimalista — apenas texto de copyright, sem links de navegação, sem colunas extras.
- [ ] **Separação Visual:** Há uma linha ou espaçamento que separa visualmente o footer do restante do conteúdo.

---

### US-005: Design System & Tipografia

**Descrição:** Como produto, eu quero que toda a landing page aplique o design system definido (dark + verde neon + Inter) de forma consistente para que a marca TaskFlow seja comunicada com coerência visual.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Tipografia:** A fonte Inter é carregada via `@fontsource/inter` (instalada como dependência do workspace `apps/web`). A fonte é importada no layout base do Astro.
- [ ] **Background global:** A cor de fundo global da página é `#0a0a0a` (configurada no `tailwind.config.mjs` e aplicada no `<body>`).
- [ ] **Acento:** A cor `#00fa62` está definida como cor customizada no `tailwind.config.mjs` (ex: `colors.neon`) e é usada nos elementos de destaque (botão CTA, ícones dos cards, elementos interativos).
- [ ] **Zero JS no cliente:** O arquivo HTML final (`dist/index.html`) não contém `<script>` tags de hidratação de framework. `output: 'static'` está configurado no `astro.config.mjs`.
- [ ] **Scroll suave:** O CSS global inclui `html { scroll-behavior: smooth; }`.

---

### US-006: Deploy no Cloudflare Pages

**Descrição:** Como time, eu quero que a landing page esteja publicada no Cloudflare Pages via Wrangler para que a URL pública esteja acessível.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Wrangler config:** O arquivo `apps/web/wrangler.toml` existe e contém `name = \"taskflow-web\"` e `pages_build_output_dir = \"dist\"`.
- [ ] **Comando de deploy:** `wrangler pages deploy apps/web/dist --project-name=taskflow-web` executa sem erros.
- [ ] **URL pública:** A URL gerada pelo Cloudflare Pages (`*.pages.dev`) está acessível e carrega a landing page.
- [ ] **Assets estáticos:** Fontes, CSS e qualquer asset são servidos corretamente (sem 404 em recursos).

---

## 4. Requisitos Funcionais (FR)

### Prioridade: MUST (Obrigatório)

| ID | Requisito |
|---|---|
| **REQ-001** | O workspace `apps/web` DEVE ser criado com Astro (versão mais recente estável) configurado com `output: 'static'` no `astro.config.mjs`. |
| **REQ-002** | O `apps/web/package.json` DEVE conter o nome `\"@taskflow/web\"` e os scripts: `\"dev\": \"astro dev\"`, `\"build\": \"astro build\"`, `\"check\": \"astro check\"`. |
| **REQ-003** | TailwindCSS DEVE ser integrado ao Astro via `@astrojs/tailwind`. O `tailwind.config.mjs` DEVE definir a cor customizada `neon: '#00fa62'` e a cor de background `base: '#0a0a0a'` no objeto `theme.extend.colors`. |
| **REQ-004** | A fonte Inter DEVE ser instalada via `@fontsource/inter` e importada no arquivo de layout base (`src/layouts/Layout.astro`) para ser aplicada globalmente. |
| **REQ-005** | A página principal DEVE estar em `apps/web/src/pages/index.astro`. |
| **REQ-006** | A seção Hero DEVE usar um elemento `<h1>` para o headline e um `<a>` (não `<button>`) para o CTA com `href=\"#features\"`. |
| **REQ-007** | A seção de Features DEVE possuir `id=\"features\"` no elemento container e exibir exatamente 3 cards com os textos do Contrato de Conteúdo (seção 2.1). |
| **REQ-008** | Cada card de feature DEVE conter um SVG inline único. Os SVGs DEVEM ser escritos diretamente no markup Astro, sem uso de bibliotecas externas de ícones (ex: lucide-react, heroicons package). |
| **REQ-009** | O Footer DEVE exibir o ano atual gerado em build-time via `new Date().getFullYear()` no frontmatter do componente Astro. |
| **REQ-010** | O CSS global DEVE incluir `html { scroll-behavior: smooth; }`. |
| **REQ-011** | O arquivo `apps/web/wrangler.toml` DEVE existir com `name = \"taskflow-web\"` e `pages_build_output_dir = \"dist\"`. |
| **REQ-012** | O `turbo.json` na raiz do monorepo DEVE incluir o pipeline `build` com `dependsOn: [\"^build\"]` e `outputs: [\"dist/**\"]` para que o build de `apps/web` funcione via `pnpm build`. |
| **REQ-013** | Zero JavaScript de cliente no output final. O HTML gerado em `dist/` NÃO deve conter `<script>` tags de hidratação de framework. Confirmar com inspeção do `dist/index.html`. |

### Prioridade: SHOULD (Recomendado)

| ID | Requisito |
|---|---|
| **REQ-014** | Os componentes Astro DEVEM ser organizados em `apps/web/src/components/`: `Hero.astro`, `Features.astro`, `FeatureCard.astro`, `Footer.astro`. O `index.astro` apenas os importa e compõe. |
| **REQ-015** | O grid de features DEVE usar classes TailwindCSS responsivas: `grid grid-cols-1 md:grid-cols-3 gap-8`. |
| **REQ-016** | O `<head>` da página DEVE incluir `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">` e `<meta name=\"description\">` com descrição do produto. |

### Prioridade: COULD (Opcional, se o tempo permitir)

| ID | Requisito |
|---|---|
| **REQ-017** | O `apps/web/.gitignore` PODE incluir `dist/`, `.astro/` e `node_modules/`. |
| **REQ-018** | O botão CTA PODE ter uma transição CSS suave de cor no `hover` (ex: `transition-colors duration-200`) sem nenhum JavaScript. |

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo estão **explicitamente proibidos** nesta sprint. Qualquer agente de execução que tentar implementar os itens abaixo DEVE ser interrompido.

| Item | Justificativa |
|---|---|
| Página de Blog | Escopo futuro — requer CMS ou Markdown pipeline. |
| Página de Pricing | Conteúdo de negócio não definido. |
| Página de Login / Signup | Requer autenticação — sprint dedicada. |
| Animações com JavaScript | Contradiz o requisito Zero JS no cliente. |
| Dark / Light Mode Toggle | Adiciona complexidade de estado e JS. |
| Formulário de captura de e-mail / leads | Requer integração de API externa — sprint separada. |
| Internacionalização (i18n) | Complexidade desnecessária para o MVP. |
| Testes unitários (Vitest, Playwright) | Explicitamente excluídos pelo CTO. Validação é somente `astro check` + `astro build`. |
| Componentes React / Preact hidratados | Viola o requisito de Zero JS no cliente. |
| Múltiplas páginas Astro | Esta sprint entrega apenas `index.astro`. |
| Analytics (Cloudflare Web Analytics ou terceiros) | Sem integrações externas nesta sprint. |
| Imagens externas / CDN de assets | Todos os assets devem ser inline ou bundled. |

---

## 6. Cloudflare Bindings & Integrações

### Bindings

**Nenhum.** Esta sprint não utiliza Workers, D1, KV, R2 ou Queues. O deploy é via **Cloudflare Pages** (hospedagem de site estático), não via Cloudflare Workers.

### Variáveis de Ambiente

**Nenhuma.** Zero variáveis de ambiente são necessárias.

### APIs Externas

**Nenhuma.**

### Wrangler (Pages)

```toml
# apps/web/wrangler.toml
name = \"taskflow-web\"
pages_build_output_dir = \"dist\"
```

**Comando de deploy:**
```bash
wrangler pages deploy apps/web/dist --project-name=taskflow-web
```

---

## 7. Restrições & Casos Limite

### 7.1 Restrições Técnicas

| Restrição | Detalhe |
|---|---|
| **Runtime** | O output é HTML/CSS/assets estáticos. Não há runtime de Worker — sem `c.env`, sem Hono, sem Drizzle. |
| **Astro output mode** | DEVE ser `output: 'static'` (SSG). Nunca `output: 'server'` ou `output: 'hybrid'` para esta sprint. |
| **Fontes** | `@fontsource/inter` carrega os arquivos de fonte localmente no bundle. NÃO usar Google Fonts (requer request externo, afeta privacidade e performance). |
| **Ícones** | SVGs DEVEM ser inline no markup. NÃO instalar `lucide-react`, `@heroicons/react` ou qualquer pacote de ícones que introduza dependências React. |
| **TailwindCSS** | Usar `@astrojs/tailwind` (integração oficial). NÃO configurar PostCSS manualmente. |
| **pnpm** | Todas as instalações de dependências DEVEM usar `pnpm add` com o flag `--filter web` para instalar no workspace correto. Ex: `pnpm add --filter web @fontsource/inter`. |

### 7.2 Casos Limite & Fallbacks

| Cenário | Comportamento Esperado |
|---|---|
| **Fonte Inter não carrega** | O CSS deve declarar fallback: `font-family: 'Inter', system-ui, -apple-system, sans-serif`. |
| **JavaScript desabilitado no browser** | A página DEVE funcionar 100% sem JS — incluindo o scroll suave (via CSS `scroll-behavior: smooth`). |
| **Build falha no Turborepo** | Verificar se o `apps/web/package.json` tem o script `build` definido e se o `turbo.json` inclui o workspace `web` no pipeline. |
| **`astro check` reporta erros de tipo** | O agente NÃO deve prosseguir para o `astro build` ou deploy sem resolver todos os erros de tipo primeiro. |
| **Deploy do Wrangler falha** | Verificar se o projeto `taskflow-web` foi criado previamente no Cloudflare Pages Dashboard OU usar o flag `--project-name` que cria automaticamente na primeira vez. |

---

## 8. Estrutura de Arquivos Esperada

Após a execução desta sprint, a estrutura do monorepo deve ser:

```
/                                    ← raiz do monorepo
├── turbo.json                       ← atualizado com pipeline build/dev
├── pnpm-workspace.yaml              ← já existente, inclui apps/*
├── package.json                     ← já existente
└── apps/
    └── web/                         ← NOVO workspace desta sprint
        ├── package.json             ← name: \"@taskflow/web\"
        ├── astro.config.mjs         ← output: 'static', @astrojs/tailwind
        ├── tailwind.config.mjs      ← cores: neon #00fa62, base #0a0a0a
        ├── tsconfig.json            ← extends astro/tsconfigs/strict
        ├── wrangler.toml            ← Cloudflare Pages config
        ├── .gitignore               ← dist/, .astro/, node_modules/
        └── src/
            ├── layouts/
            │   └── Layout.astro     ← layout base com <head> e import Inter
            ├── pages/
            │   └── index.astro      ← página única, compõe os componentes
            ├── components/
            │   ├── Hero.astro       ← headline + subheadline + botão CTA
            │   ├── Features.astro   ← grid id=\"features\" com 3 FeatureCard
            │   ├── FeatureCard.astro← card com SVG inline + title + description
            │   └── Footer.astro     ← copyright com ano em build-time
            └── styles/
                └── global.css       ← @fontsource/inter import + html scroll-behavior
```

---

## 9. Referências de Implementação

### 9.1 `astro.config.mjs` (referência)

```javascript
// apps/web/astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
});
```

### 9.2 `tailwind.config.mjs` (referência)

```javascript
// apps/web/tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        neon: '#00fa62',
        base: '#0a0a0a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### 9.3 `Layout.astro` (referência)

```astro
---
// apps/web/src/layouts/Layout.astro
interface Props {
  title: string;
  description?: string;
}
const { title, description = 'TaskFlow é a plataforma de gestão de tarefas que sua equipe vai realmente usar.' } = Astro.props;
---
<!doctype html>
<html lang=\"pt-BR\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
    <meta name=\"description\" content={description} />
    <title>{title}</title>
    <link rel=\"stylesheet\" href=\"/styles/global.css\" />
  </head>
  <body class=\"bg-base text-white font-sans\">
    <slot />
  </body>
</html>
```

### 9.4 `global.css` (referência)

```css
/* apps/web/src/styles/global.css */
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/inter/700.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}
```

### 9.5 SVGs inline sugeridos para os Feature Cards

Cada card deve ter um SVG diferente. Exemplos semanticamente relacionados:

**Feature 1 — Organize Tarefas (checklist icon):**
```svg
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">
  <path d=\"M9 11l3 3L22 4\"/>
  <path d=\"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11\"/>
</svg>
```

**Feature 2 — Colabore em Tempo Real (users icon):**
```svg
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">
  <path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"/>
  <circle cx=\"9\" cy=\"7\" r=\"4\"/>
  <path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"/>
  <path d=\"M16 3.13a4 4 0 0 1 0 7.75\"/>
</svg>
```

**Feature 3 — Meça o Progresso (bar chart icon):**
```svg
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">
  <line x1=\"18\" y1=\"20\" x2=\"18\" y2=\"10\"/>
  <line x1=\"12\" y1=\"20\" x2=\"12\" y2=\"4\"/>
  <line x1=\"6\" y1=\"20\" x2=\"6\" y2=\"14\"/>
</svg>
```

### 9.6 Comandos de execução (ordem correta)

```