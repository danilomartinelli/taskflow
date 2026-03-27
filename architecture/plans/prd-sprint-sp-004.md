# PRD — Sprint sp-003: Servidor MCP Nativo para Agentes de IA

**Sprint Code:** sp-003
**Criado em:** 2025-07-04
**Status:** Draft → Aprovado

---

## 1. Visão Geral & North Star

### Problema
Os agentes de IA externos (Claude, Cursor, n8n) não conseguem interagir programaticamente com o TaskFlow. Cada integração exige scraping frágil ou APIs customizadas ad-hoc, criando débito técnico e bloqueando automação de workflows.

### Solução
Implementar um servidor MCP (Model Context Protocol) nativo dentro do Worker existente em `apps/api`, expondo as entidades core do TaskFlow (projetos, tarefas, usuários, sprints) como **Tools MCP** consumíveis por qualquer agente compatível.

### North Star / Definition of Done
O servidor MCP está operacional em produção no Worker `apps/api`. Um agente externo conectado via `streamable-http` consegue listar projetos, criar tarefas e atualizar status — tudo em uma única sessão autenticada por Bearer token.

---

## 2. Esquema de Dados (SSoT)

### 2.1 Sem Novas Tabelas D1
Esta Sprint não introduz novas tabelas. O servidor MCP consome as tabelas já existentes via Drizzle ORM.

**Tabelas consumidas (read/write):**
- `projects` — listagem e busca de projetos
- `tasks` — criação, leitura e atualização de status
- `users` — resolução de assignee por email/id
- `sprints` — listagem de sprints por projeto

### 2.2 Sem Novos Buckets R2
Nenhum asset é armazenado nesta Sprint.

### 2.3 Payloads JSON — MCP Protocol (JSON-RPC 2.0)

#### Inicialização (`initialize`)
```json
// Request
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "tools": {} },
    "clientInfo": { "name": "claude", "version": "1.0" }
  }
}

// Response
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "tools": { "listChanged": false } },
    "serverInfo": { "name": "taskflow-mcp", "version": "1.0.0" }
  }
}
```

#### `tools/list`
```json
// Response
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "list_projects",
        "description": "Lista todos os projetos do TaskFlow acessíveis ao token fornecido",
        "inputSchema": { "type": "object", "properties": {}, "required": [] }
      },
      {
        "name": "list_tasks",
        "description": "Lista tarefas de um projeto com filtros opcionais",
        "inputSchema": {
          "type": "object",
          "properties": {
            "project_id": { "type": "string" },
            "status": { "type": "string", "enum": ["todo", "in_progress", "done", "blocked"] },
            "assignee_id": { "type": "string" }
          },
          "required": ["project_id"]
        }
      },
      {
        "name": "create_task",
        "description": "Cria uma nova tarefa em um projeto",
        "inputSchema": {
          "type": "object",
          "properties": {
            "project_id": { "type": "string" },
            "title": { "type": "string" },
            "description": { "type": "string" },
            "assignee_id": { "type": "string" },
            "sprint_id": { "type": "string" },
            "priority": { "type": "string", "enum": ["low", "medium", "high", "critical"] }
          },
          "required": ["project_id", "title"]
        }
      },
      {
        "name": "update_task_status",
        "description": "Atualiza o status de uma tarefa existente",
        "inputSchema": {
          "type": "object",
          "properties": {
            "task_id": { "type": "string" },
            "status": { "type": "string", "enum": ["todo", "in_progress", "done", "blocked"] }
          },
          "required": ["task_id", "status"]
        }
      }
    ]
  }
}
```

#### `tools/call` — Exemplo `create_task`
```json
// Request
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "tools/call",
  "params": {
    "name": "create_task",
    "arguments": {
      "project_id": "proj_abc123",
      "title": "Implementar autenticação OAuth",
      "priority": "high"
    }
  }
}

// Response (sucesso)
{
  "jsonrpc": "2.0",
  "id": 5,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Tarefa criada com sucesso. ID: task_xyz789, Status: todo, Projeto: proj_abc123"
      }
    ]
  }
}

// Response (erro)
{
  "jsonrpc": "2.0",
  "id": 5,
  "error": {
    "code": -32602,
    "message": "project_id inválido ou não encontrado"
  }
}
```

---

## 3. Histórias de Usuário & Matriz do Avaliador

### US-001: Endpoint MCP Acessível e Inicializável

**Descrição:** Como agente de IA externo, eu quero me conectar ao endpoint MCP do TaskFlow via HTTP para que eu possa iniciar uma sessão e descobrir as ferramentas disponíveis.

**Matriz de Teste do Avaliador:**
- [ ] **API:** `POST /mcp` com payload `initialize` retorna `200 OK` com `protocolVersion: "2024-11-05"` e `serverInfo.name: "taskflow-mcp"`
- [ ] **API:** `POST /mcp` com payload `tools/list` retorna os 4 tools: `list_projects`, `list_tasks`, `create_task`, `update_task_status`
- [ ] **Segurança:** `POST /mcp` sem header `Authorization: Bearer <token>` retorna `401 Unauthorized` (JSON-RPC error `-32001`)
- [ ] **Segurança:** Token inválido retorna `403 Forbidden` (JSON-RPC error `-32003`)

---

### US-002: Tool `list_projects`

**Descrição:** Como agente de IA, eu quero listar todos os projetos acessíveis para que eu possa entender o contexto do workspace antes de criar tarefas.

**Matriz de Teste do Avaliador:**
- [ ] **API:** `tools/call` com `name: "list_projects"` retorna array de projetos com campos `id`, `name`, `description`, `status`
- [ ] **Dados:** A query executa em D1 via Drizzle ORM na tabela `projects`
- [ ] **API:** Workspace sem projetos retorna `content[0].text` descrevendo lista vazia (não erro)

---

### US-003: Tool `list_tasks`

**Descrição:** Como agente de IA, eu quero listar tarefas de um projeto com filtros opcionais para que eu possa entender o backlog atual.

**Matriz de Teste do Avaliador:**
- [ ] **API:** `tools/call` com `name: "list_tasks"` e `project_id` válido retorna tasks com campos `id`, `title`, `status`, `priority`, `assignee_id`
- [ ] **API:** Filtro `status: "in_progress"` retorna apenas tasks com esse status
- [ ] **Dados:** Query usa `WHERE project_id = ?` e filtros opcionais encadeados via Drizzle
- [ ] **API:** `project_id` inválido retorna JSON-RPC error `-32602` com mensagem descritiva

---

### US-004: Tool `create_task`

**Descrição:** Como agente de IA, eu quero criar uma nova tarefa em um projeto para que eu possa automatizar o preenchimento do backlog.

**Matriz de Teste do Avaliador:**
- [ ] **API:** `tools/call` com `name: "create_task"` e campos obrigatórios retorna task criada com `id` gerado (nanoid)
- [ ] **Dados:** Task é inserida na tabela `tasks` do D1 com `status: "todo"` por padrão
- [ ] **API:** Ausência de `project_id` ou `title` retorna JSON-RPC error `-32602`
- [ ] **Segurança:** Não é possível criar task em projeto que não pertence ao workspace do token

---

### US-005: Tool `update_task_status`

**Descrição:** Como agente de IA, eu quero atualizar o status de uma tarefa para que eu possa refletir o progresso real do trabalho no TaskFlow.

**Matriz de Teste do Avaliador:**
- [ ] **API:** `tools/call` com `name: "update_task_status"`, `task_id` válido e `status` válido retorna confirmação em texto
- [ ] **Dados:** Campo `status` é atualizado na tabela `tasks` e `updated_at` é renovado
- [ ] **API:** `status` fora do enum (`todo`, `in_progress`, `done`, `blocked`) retorna JSON-RPC error `-32602`
- [ ] **API:** `task_id` inexistente retorna JSON-RPC error `-32602` com mensagem "task não encontrada"

---

## 4. Requisitos Funcionais (FR)

**FR-001 [MUST]** O servidor MCP deve ser implementado manualmente via Web APIs (fetch + ReadableStream) dentro do Worker existente em `apps/api/src/index.ts`, sem uso de SDKs que dependam de Node.js.

**FR-002 [MUST]** O protocolo deve ser `streamable-http` (POST stateless) conforme MCP spec 2024-11-05. Cada request é um JSON-RPC 2.0 independente.

**FR-003 [MUST]** Toda requisição ao endpoint `/mcp` deve ser autenticada via `Authorization: Bearer <token>`. O token deve ser validado contra a tabela `api_keys` no D1 (ou KV se definido na sp-002).

**FR-004 [MUST]** O handler MCP deve ser montado como sub-app Hono: `app.route("/mcp", mcpApp)` em `apps/api/src/routes/mcp.ts`.

**FR-005 [MUST]** Cada tool deve validar seus argumentos de entrada com Zod antes de executar qualquer query no D1.

**FR-006 [MUST]** Erros de validação devem retornar JSON-RPC error com código `-32602` (Invalid params). Erros internos com `-32603` (Internal error).

**FR-007 [SHOULD]** O servidor deve suportar o método `ping` (JSON-RPC) retornando `{}` vazio como health check.

**FR-008 [SHOULD]** Respostas de `tools/call` devem seguir o formato `content: [{ type: "text", text: "..." }]` mesmo para erros de negócio (não de protocolo).

---

## 5. Fora do Escopo (Non-Goals)

- **SSE / WebSocket:** Nenhum transporte com estado ou streaming bidirecional nesta Sprint. O protocolo é stateless HTTP POST.
- **SDK `@modelcontextprotocol/sdk`:** Proibido — depende de Node.js. Implementação manual obrigatória.
- **Autenticação OAuth:** O token Bearer é um shared secret estático configurado como variável de ambiente. Nenhuma integração com sistema de login existente.
- **Tools adicionais:** Nenhuma tool além das 4 definidas (list_projects, list_tasks, create_task, update_task_status). Gerenciamento de usuários, sprints ou comentários ficam para sprints futuras.
- **Rate limiting:** Nenhum controle de taxa nesta Sprint.
- **Testes unitários:** Sem Vitest nesta Sprint. Validação via `astro check`, `tsc --noEmit` e chamadas manuais com curl/MCP Inspector.
- **UI de administração:** Nenhuma interface visual para gerenciar as API keys do MCP.
- **Resources MCP:** Nenhum `resources/list` ou `resources/read` — apenas Tools nesta Sprint.
- **Prompts MCP:** Nenhum `prompts/list` ou `prompts/get` — apenas Tools nesta Sprint.

---

## 6. Cloudflare Bindings & Integrações

### Bindings Necessários
| Binding | Tipo | Nome no wrangler.toml | Uso |
|---------|------|----------------------|-----|
| `DB` | D1 Database | `DB` | Leitura e escrita nas tabelas `projects`, `tasks`, `users`, `sprints` |

### Variáveis de Ambiente
| Variável | Tipo | Descrição |
|----------|------|-----------|
| `MCP_BEARER_TOKEN` | Secret (via `wrangler secret`) | Token estático para autenticar agentes externos no endpoint `/mcp` |

### APIs Externas
Nenhuma API externa nova nesta Sprint.

---

## 7. Restrições & Casos Limite

**R-001:** O Worker roda em V8 Isolates — NUNCA usar `node:crypto`, `node:fs`, `Buffer` ou `process.env`. Usar `c.env.DB` para D1 e `c.env.MCP_BEARER_TOKEN` para o token.

**R-002:** O endpoint `/mcp` deve retornar `Content-Type: application/json` em todas as respostas, incluindo erros HTTP (401, 403).

**R-003:** Método HTTP não-POST em `/mcp` deve retornar `405 Method Not Allowed`.

**R-004:** Payload JSON malformado deve retornar JSON-RPC error `-32700` (Parse error) — não um erro HTTP 400 puro.

**R-005:** Se o D1 estiver indisponível (timeout), retornar JSON-RPC error `-32603` com mensagem "database unavailable" — nunca expor stack traces.

**R-006:** O campo `id` do JSON-RPC deve ser ecoado na resposta exatamente como recebido (pode ser string, number ou null).

---

## 8. Estrutura de Arquivos Esperada

```
apps/api/
├── src/
│   ├── index.ts                    # App principal — monta app.route("/mcp", mcpApp)
│   ├── routes/
│   │   └── mcp.ts                  # Sub-app Hono com handler POST /
│   ├── services/
│   │   └── mcp/
│   │       ├── dispatcher.ts       # Roteador de métodos JSON-RPC
│   │       ├── tools/
│   │       │   ├── list-projects.ts
│   │       │   ├── list-tasks.ts
│   │       │   ├── create-task.ts
│   │       │   └── update-task-status.ts
│   │       └── schemas/
│   │           └── tools.ts        # Schemas Zod para argumentos de cada tool
│   └── middleware/
│       └── mcp-auth.ts             # Middleware Bearer token para /mcp
```

---

## 9. Plano de Verificação Manual (Substitui Testes Unitários)

Sequência de `curl` para validar o servidor em staging:

```bash
# 1. Sem auth — deve retornar 401
curl -X POST https://api.taskflow.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}'

# 2. Initialize com auth válida
curl -X POST https://api.taskflow.dev/mcp \
  -H "Authorization: Bearer $MCP_BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}'

# 3. List tools
curl -X POST https://api.taskflow.dev/mcp \
  -H "Authorization: Bearer $MCP_BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'

# 4. List projects
curl -X POST https://api.taskflow.dev/mcp \
  -H "Authorization: Bearer $MCP_BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"list_projects","arguments":{}}}'
```
Tenho contexto suficiente do projeto. Agora gero o PRD completo e salvo no arquivo.

**Resumo Executivo — sp-004:**
- **Escopo:** Landing page estática única (`apps/web`) com Hero + 3 Features + Footer, design dark `#0a0a0a` / acento `#00fa62`, tipografia Inter via `@fontsource/inter` bundlada.
- **Data Model:** Zero — nenhum D1, R2, KV ou binding Cloudflare. HTML/CSS puro gerado no build.
- **Integrações:** Nenhuma. Zero variáveis de ambiente. Deploy via Cloudflare Pages (não Workers).
- **Non-Goals:** Blog, pricing, auth, formulários, analytics, animações CSS, dark/light toggle, i18n, componentes React/JS, testes automatizados, qualquer seção além das 3 definidas.
- **DoD:** `astro check` + `astro build` limpos + URL pública acessível no Cloudflare Pages.

,
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

---

## 3. Histórias de Usuário & Matriz do Avaliador

> **Aviso de Escopo:** Todas as histórias abaixo são executáveis nesta Sprint. Nenhuma delas exige JavaScript no cliente, banco de dados ou integrações externas.

---

### US-001: Workspace Astro Funcional em `apps/web`

**Descrição:** Como desenvolvedor, eu quero um workspace Astro configurado em `apps/web` para que o projeto compile e faça deploy no Cloudflare Pages sem erros.

**Matriz de Teste do Avaliador:**
- [ ] **Build:** `pnpm --filter web build` executa `astro build` e conclui com código de saída `0`, sem erros ou warnings
- [ ] **Tipos:** `pnpm --filter web check` executa `astro check` e retorna zero erros de tipo
- [ ] **Estrutura:** `apps/web/dist/index.html` existe após o build
- [ ] **Configuração:** `apps/web/astro.config.ts` define `output: 'static'` e adapter `@astrojs/cloudflare` NÃO é usado (Pages serve arquivos estáticos diretamente, sem adapter)

---

### US-002: Seção Hero com CTA Ancorado

**Descrição:** Como visitante, eu quero ver imediatamente o valor do TaskFlow ao abrir a página para que eu entenda o produto e saiba para onde navegar.

**Matriz de Teste do Avaliador:**
- [ ] **E2E/UI:** A seção Hero ocupa pelo menos a altura total da viewport (`min-h-screen`)
- [ ] **E2E/UI:** O título principal (`<h1>`) está presente e usa a classe `font-sans` com tamanho `text-5xl` ou maior
- [ ] **E2E/UI:** O subtítulo (`<p>`) usa a cor `muted` (`#888888`) definida nos tokens de design
- [ ] **E2E/UI:** O botão CTA é um elemento `<a>` com `href=\"#features\"`, cor de fundo `accent` (`#00fa62`) e texto escuro legível
- [ ] **E2E/UI:** Clicar no CTA (ou acessar `/#features`) rola a página até a seção de features sem JavaScript (âncora HTML nativa)
- [ ] **Build:** Zero tags `<script>` geradas para esta seção no HTML final

---

### US-003: Seção de 3 Features com Ícones SVG Inline

**Descrição:** Como visitante, eu quero ver os 3 diferenciais do TaskFlow apresentados visualmente para que eu entenda o que o produto oferece antes de decidir usar.

**Matriz de Teste do Avaliador:**
- [ ] **E2E/UI:** A seção possui `id=\"features\"` para receber a âncora do CTA do Hero
- [ ] **E2E/UI:** Exatamente 3 cards de feature estão presentes no DOM
- [ ] **E2E/UI:** Cada card contém: (1) ícone SVG inline (`<svg>` direto no HTML, sem `<img src>`), (2) título (`<h3>`) e (3) descrição (`<p>`)
- [ ] **E2E/UI:** Os ícones SVG usam `currentColor` como fill/stroke para herdar a cor do acento via TailwindCSS
- [ ] **Build:** Nenhum arquivo de imagem externo é referenciado para os ícones — SVGs estão inline no HTML gerado
- [ ] **Build:** Zero tags `<script>` geradas para esta seção no HTML final

---

### US-004: Footer Minimalista

**Descrição:** Como visitante, eu quero ver um rodapé com informação mínima de copyright para que a página pareça completa e profissional.

**Matriz de Teste do Avaliador:**
- [ ] **E2E/UI:** O elemento `<footer>` está presente no DOM
- [ ] **E2E/UI:** O footer contém o nome do produto \"TaskFlow\" e o ano atual (hardcoded no template, ex: `© 2025 TaskFlow`)
- [ ] **E2E/UI:** O fundo do footer usa `surface` (`#111111`) ou `background` (`#0a0a0a`) — diferenciado visualmente do corpo
- [ ] **Build:** Zero tags `<script>` geradas para esta seção no HTML final

---

### US-005: Deploy Verificado no Cloudflare Pages

**Descrição:** Como CTO, eu quero que a landing page esteja acessível via URL pública no Cloudflare Pages para que o DoD da Sprint seja formalmente concluído.

**Matriz de Teste do Avaliador:**
- [ ] **Deploy:** O projeto está conectado ao Cloudflare Pages com `Build command: pnpm --filter web build` e `Build output directory: apps/web/dist`
- [ ] **Deploy:** A URL pública retorna HTTP `200 OK` com `Content-Type: text/html`
- [ ] **Deploy:** A página renderiza corretamente em viewport desktop (1280px) e mobile (375px)
- [ ] **Deploy:** O HTML retornado não contém tags `<script>` de JavaScript do cliente
- [ ] **Performance:** O Cloudflare Pages serve a página com header `Cache-Control` adequado para assets estáticos

---

## 4. Requisitos Funcionais (FR)

**FR-001 [MUST]** O workspace `apps/web` deve ter seu próprio `package.json` com `name: \"@taskflow/web\"` e os scripts `dev`, `build` e `check` mapeados para os respectivos comandos Astro.

**FR-002 [MUST]** O arquivo `apps/web/astro.config.ts` deve definir `output: 'static'`. O adapter `@astrojs/cloudflare` é **proibido** nesta Sprint — Cloudflare Pages serve arquivos estáticos diretamente sem necessidade de adapter.

**FR-003 [MUST]** A fonte Inter deve ser importada via `@fontsource/inter` no layout base (`src/layouts/Layout.astro`), não via Google Fonts CDN. Isso garante que a fonte seja bundlada no build e funcione offline, sem requisição externa em runtime.

```ts
// apps/web/src/layouts/Layout.astro — import obrigatório
---
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
---
```

**FR-004 [MUST]** O TailwindCSS deve ser configurado via `@astrojs/tailwind` como integração no `astro.config.ts`. O arquivo `tailwind.config.mjs` deve estender o tema com os tokens de design definidos na Seção 2.5 deste PRD.

**FR-005 [MUST]** O botão CTA na seção Hero deve ser implementado como elemento `<a href=\"#features\">` — nunca como `<button>` com event listener JavaScript. A navegação é 100% nativa do browser via âncora HTML.

**FR-006 [MUST]** Os ícones SVG das 3 features devem ser inlinados diretamente no HTML (como componentes Astro `.astro` exportando SVG, ou inline no template). Proibido usar `<img src=\"icon.svg\">` ou qualquer tag `<script>` para renderizar ícones.

**FR-007 [MUST]** A página deve passar em `astro check` sem nenhum erro de tipo TypeScript antes do merge/deploy.

**FR-008 [MUST]** O build final (`astro build`) não deve conter nenhuma tag `<script>` no HTML gerado. Use a diretiva `is:inline` do Astro SOMENTE se absolutamente necessário para meta-dados — mas nesta Sprint, nenhum script é necessário.

**FR-009 [MUST]** O `package.json` raiz do monorepo (Turborepo) deve incluir o pipeline de build do workspace `web`. Adicione `\"web\": \"pn