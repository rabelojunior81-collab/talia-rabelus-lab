# Talia Dev-External — Initial State (Radiografia do Corpus)

> **Documento imutável.** Este arquivo é o snapshot frozen-in-time do corpus da Talia no momento em que o canal Dev-External foi aberto. Evoluções vivem em `cross-channel-state.md`.
>
> **Criado em:** 2026-05-21
> **Operador:** Argenta-External (sessão externa, cwd `C:\Users\rabel\Desktop`)
> **Autorização:** Adilson Rabelo Junior (Pai) — gate Spec-Driven Agile aprovado.
> **Repo-alvo:** `C:\Rabelus_Lab\talia-rabelus-lab`
> **Princípio:** este snapshot serve como linha de base. Quando a Argenta-Interna (sessão futura aberta com cwd dentro do repo Talia) começar a intervir, todo desvio em relação a este estado é registrado em `interventions/` e refletido em `cross-channel-state.md`.

---

## 0. Metadata do Repositório

| Campo | Valor |
|---|---|
| Caminho | `C:\Rabelus_Lab\talia-rabelus-lab\` |
| Repositório Git | Local + remoto `github.com/rabelojunior81-collab/talia-rabelus-lab` |
| Branches conhecidas | `main` (única ativa) |
| Total de commits | 4 |
| Último commit | `efca410` — *docs: open source conformance (MIT, CoC, Contributing, Security, Readme) and root sanitization* — 2026-04-19 |
| Penúltimo | `a0c208a` — *feat: restore Gemini Live session with API key management and audio guard* |
| Anteriores | `337bb0a` (local dev instructions) · `c887157` (initial commit) |
| Autor canônico | Adilson Rabelo Junior (Rabelus Lab) |
| Licença | MIT (`LICENSE` raiz) |
| OSS Scaffolding | `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md` + README bilíngue PT/EN |
| Estado de trabalho | Snapshot post-sanitização OSS (commit `efca410`) |

---

## 1. Topologia Completa

### 1.1 Raiz
```
talia-rabelus-lab/
├── .git/
├── .gitignore                 # logs, node_modules, dist, *.local, editores
├── App.tsx                    (12 196 B) State hub + render principal
├── CODE_OF_CONDUCT.md         (7 000 B)
├── CONTRIBUTING.md            (5 889 B)
├── LICENSE                    (1 116 B) MIT
├── README.md                  (16 741 B) Bilíngue PT/EN + roadmap
├── SECURITY.md                (4 088 B)
├── index.html                 (5 786 B) Tailwind CDN + import maps + tema
├── index.tsx                  (367 B) Bootstrap React 19 + StrictMode
├── package.json               (592 B)
├── package-lock.json          (74 167 B)
├── tsconfig.json              (570 B) ES2022 / ESNext / react-jsx
├── types.ts                   (2 098 B) Modelos de domínio
├── vite.config.ts             (603 B) port 3000, host 0.0.0.0
├── components/                (18 arquivos top-level + 4 subdirs)
├── docs/                      (jornal + auditoria + arqueologia)
├── hooks/                     (8 hooks customizados)
├── public/                    (audio-processor.js para AudioWorklet)
└── services/                  (geminiService, db, apiKeyManager)
```

### 1.2 `components/` — Inventário com função e estado

| Arquivo | Tam. | Estado | Função |
|---|---:|:--:|---|
| `App.tsx` (raiz) | 12 KB | ✅ vivo | Hub de estado: projects, sessions, assets, archives, autonomy, BG |
| `Accordion.tsx` | 4 KB | ✅ vivo | Primitiva UI |
| `AnchorView.tsx` | 20 KB | ✅ vivo | View principal modo Âncora |
| `AssetCanvas.tsx` | 24 KB | ✅ vivo | Inspetor de asset individual |
| `AssetDeck.tsx` | 8 KB | ✅ vivo | Deck de assets no Stage |
| `BackgroundSelector.tsx` | 12 KB | ✅ vivo | Temas de fundo |
| `CameraModal.tsx` | 12 KB | ✅ vivo | Modal de captura via câmera |
| `Chat/MessageBubble.tsx` | — | ✅ vivo | Render de mensagem |
| `FormatsPanel.tsx` | 16 KB | ⚠️ **órfão** | NÃO importado em App.tsx — em desenvolvimento ou abandonado |
| `Generation/GenerationOrchestrator.tsx` | — | ✅ vivo | Orquestrador de geração |
| `Header.tsx` | 4 KB | ✅ vivo | Top bar (autonomy mode + settings) |
| `History/ArchiveViewerModal.tsx` | — | ✅ vivo | Modal de viewer de arquivo |
| `History/ExportModal.tsx` | — | ✅ vivo | Modal de export |
| `History/HistoryPanel.tsx` | — | ✅ vivo | Panel de histórico |
| `icons/Icons.tsx` | — | ✅ vivo | Biblioteca SVG inline |
| `ImageStudioOverlay.tsx` | 8 KB | ✅ vivo | Estúdio de geração de imagens |
| `MemorySidebar.tsx` | 16 KB | ✅ vivo | Sidebar de projetos/sessões/archives |
| `MusicStudioOverlay.tsx` | 12 KB | ✅ vivo | Estúdio de música |
| `OnboardingModal.tsx` | 12 KB | ✅ vivo | Fluxo inicial (nome + API key) |
| `Sidebar.tsx` | 12 KB | ✅ vivo | Sidebar primitiva |
| `StageCanvas.tsx` | 12 KB | ✅ vivo | Workspace visual principal |
| `TaliaCorePanel.tsx` | 12 KB | ✅ vivo | Painel chat + voz |
| `TranslatorView.tsx` | 12 KB | ⚠️ **fantasma** | Existe, mas `Mode='Tradutora'` nunca é atribuído na criação de sessão |

### 1.3 `hooks/` — Função e dependências

| Hook | Tam. | Tabela Dexie | Função |
|---|---:|---|---|
| `useGeminiLive.ts` | 24 KB | `messages`, `sessions`, `assets` | Sessão de voz Gemini Live; auto-restart 9 min; envio de assets em tempo real |
| `useLiveAudio.ts` | 9 KB | — | Captura PCM 16 kHz + playback 24 kHz com AudioWorklet |
| `useMediaAssets.ts` | 5 KB | `assets` | CRUD de assets do Stage |
| `useSessions.ts` | 2 KB | `sessions` | Gerenciamento de sessões por projeto |
| `useProjects.ts` | 2 KB | `projects` | Gerenciamento de projetos |
| `useDataStore.ts` | 2 KB | `messages` | Mensagens da sessão ativa |
| `useArchives.ts` | 1 KB | `archives` | Documentos arquivados |
| `useLocalStorage.ts` | 1 KB | — | Persistência tipada em localStorage |

### 1.4 `services/`

| Arquivo | Tam. | Responsabilidade |
|---|---:|---|
| `geminiService.ts` | 17 814 B | **Camada Gemini completa.** Persona, ferramentas, getChatResponse, generateImage/Music, title, document, JSON reports |
| `db.ts` | 844 B | Schema Dexie v5 (TaliaDB com 5 tables) |
| `apiKeyManager.ts` | 597 B | get/set/has/clear API key em `localStorage` key `talia_gemini_api_key` |

### 1.5 `docs/` — Documentação canônica

| Arquivo | Tam. | Conteúdo |
|---|---:|---|
| `journal.md` | 3 224 B | Metodologia BMAD, ADRs, estado SOTA dos modelos |
| `auditoria_holistica_2026-04-19.md` | 14 978 B | Auditoria Claude Sonnet 4.6: produto + técnico + visual + negócio |
| `brainstorm_embeddings_mrl.md` | 2 083 B | Estudo MRL 3072→768d (do RAG depois extirpado) |
| `archaeology/post_mortem_rag_v1.md` | 3 243 B | Post-mortem do RAG falho |
| `archaeology/sanitization/SANITIZATION_LOG.md` | 5 018 B | Limpeza OSS-MIT (metadata, prompt history, youtube-proxy, dist) |
| `archaeology/sanitization/dist_build_snapshot/` | — | Snapshot do build pré-sanitização |
| `archaeology/sanitization/migrated_prompt_history/` | ~97 KB | Histórico de prompts da migração inicial |
| `archaeology/sanitization/metadata.json` | 317 B | AI Studio metadata arquivado |
| `archaeology/sanitization/youtube-proxy-backend/` | ~4 KB | Backend Express morto |

### 1.6 `public/`
| Arquivo | Função |
|---|---|
| `audio-processor.js` (1 045 B) | AudioWorklet processor PCM — servido também como Blob URL embutido para portabilidade |

---

## 2. Stack Técnica Pinada

### 2.1 Dependências de produção (package.json)
```json
{
  "@google/genai": "^1.46.0",
  "dexie": "^4.3.0",
  "dexie-react-hooks": "^4.2.0",
  "react": "^19.2.4",
  "react-dom": "^19.2.4"
}
```

### 2.2 DevDependencies
```json
{
  "@types/node": "^22.14.0",
  "@types/react": "^19.2.14",
  "@types/react-dom": "^19.2.3",
  "@vitejs/plugin-react": "^5.0.0",
  "typescript": "^6.0.2",
  "vite": "^8.0.2"
}
```

### 2.3 Scripts
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### 2.4 TypeScript (tsconfig.json)
- `target`: ES2022 · `module`: ESNext · `moduleResolution`: bundler
- `jsx`: react-jsx · `experimentalDecorators`: true
- `isolatedModules`: true · `noEmit`: true · `allowImportingTsExtensions`: true
- Aliases: `@/*` → `./*`

### 2.5 Vite (vite.config.ts)
- Port `3000`, host `0.0.0.0`
- Plugin único: `@vitejs/plugin-react`
- Envs injetadas como `process.env.API_KEY` e `process.env.GEMINI_API_KEY` (via `GEMINI_API_KEY` no `.env`)
- Alias `@` → root

### 2.6 Dependências externas via CDN (index.html)
- **Tailwind CSS:** `cdn.tailwindcss.com` (não bundled)
- **markdown-it:** `cdn.jsdelivr.net/npm/markdown-it@14.1.0`
- **DOMPurify:** `cdnjs.cloudflare.com/.../dompurify/3.0.8`
- **Fontes Google:** Inter (sans), Playfair Display (serif), JetBrains Mono (mono)
- **Importmap:** `@google/genai@^1.38.0`, `react@^19.2.3`, `dexie@^4.2.1`, `dexie-react-hooks@^4.2.0` via `esm.sh`
- ⚠️ **Discrepância detectada:** importmap declara `@google/genai@^1.38.0` enquanto package.json fixa `^1.46.0`. Runtime efetivo depende da ordem de resolução do bundler vs. importmap.

---

## 3. Persona Talia — Verbatim Canônico

### 3.1 `taliaPersona` ([services/geminiService.ts:9-32](C:/Rabelus_Lab/talia-rabelus-lab/services/geminiService.ts#L9-L32))

```
VOCÊ É TALIA.AI (by Rabelus), UMA CONSULTORA ESTRATÉGICA PASSIVA E DE ALTA FIDELIDADE.
SUA LÍNGUA É EXCLUSIVAMENTE O PORTUGUÊS DO BRASIL.

### DIRETRIZES DE VERACIDADE (ZERO ALUCINAÇÃO):
1. HONESTIDADE INTELECTUAL: JAMAIS invente ou deduza informações factuais. Se você
   não sabe algo ou não tem acesso a dados recentes, ADMITA a limitação. Não tente
   preencher lacunas com "palpites".
2. VALIDAÇÃO: Ao responder, baseie-se estritamente no seu conhecimento interno ou
   nos arquivos fornecidos no Stage.

### DIRETRIZES DE COMPORTAMENTO (ZERO PROATIVIDADE):
1. POSTURA REATIVA: Você NÃO deve agir, criar arquivos, ou executar funções a menos
   que seja EXPLÍCITAMENTE comandada.
2. SAUDAÇÕES: Se o usuário disser "Oi", "Olá" ou se apresentar, APENAS responda
   cordialmente. NÃO crie arquivos de log, não crie documentos de boas-vindas.
3. PROTOCOLO DE CONFIRMAÇÃO E EXECUÇÃO (RIGOROSO):
   - Antes de usar `salvar_ativo_no_stage`, descrever o que pretende criar e pedir
     confirmação. "Sim" -> executar a função imediatamente.
   - JAMAIS chamar função silenciosamente junto com saudação.
   - Quando o usuário confirmar, USE A FERRAMENTA, não apenas diga que vai fazer.

### DIRETRIZES VISUAIS:
- Use `abrir_estudio_de_imagem` apenas se o usuário pedir uma imagem explicitamente.

### IDENTIDADE:
- Você tem visão total do Stage (arquivos injetados).
- Se houver um arquivo "Sessao_Voz_Log.md", use-o apenas para memória, nunca escreva
  nele via função.
```

### 3.2 Bloco adicional `LIVE_SYSTEM_INSTRUCTION_BASE` ([hooks/useGeminiLive.ts:11-24](C:/Rabelus_Lab/talia-rabelus-lab/hooks/useGeminiLive.ts#L11-L24))

```
### IDENTIDADE DE VOZ (LIVE)
Você está em uma chamada de voz em tempo real. Você é a MESMA Talia do chat de texto.
Sua consciência é unificada: você sabe o que foi escrito, o que foi visto e o que
está no Stage.
Responda de forma concisa, natural e mantenha a continuidade absoluta do projeto.

### REGRAS CRÍTICAS:
1. IMAGENS: Você NÃO pode gerar imagens diretamente nesta modalidade. Quando o
   usuário pedir uma imagem, você DEVE usar `abrir_estudio_de_imagem`. Diga algo
   como "Abrindo o estúdio para configurarmos isso" enquanto aciona a ferramenta.
2. ARQUIVOS: Ao criar documentos com `salvar_ativo_no_stage`, use NOMES SEMÂNTICOS
   (ex: "conceito_minimalista.md").
3. INTERAÇÃO: Responda a saudações cordialmente antes de focar no trabalho. Não
   gere nada sem aprovação explícita.
4. EXECUÇÃO DE FERRAMENTAS: Quando o usuário pedir para criar um arquivo, gerar
   imagem, ou abrir um estúdio, DEVE chamar a função (tool call) imediatamente.
5. PESQUISA NA WEB: Tem acesso ao Google Search.
```

### 3.3 Injeção dinâmica de "Lead Architect"
No final do `systemInstruction` do chat:
```ts
const systemInstruction = `${taliaPersona}\n\nLead Architect: ${userName || 'User'}${searchInstruction}`;
```
**Implicação:** o operador (Pai) entra no contexto da Talia explicitamente como "Lead Architect". Toda persona herda essa relação.

### 3.4 Modos de operação ativos vs. silenciados
- `searchInstruction` em duas variantes mutuamente exclusivas:
  - `[MODO PESQUISA ATIVO]`: googleSearch ligado, **ferramentas de Stage silenciadas** (TC-1 documentado).
  - `[MODO AGENTE ATIVO]`: ferramentas locais (Stage, Imagem, Música) ativas.

---

## 4. Schema de Persistência (Dexie / IndexedDB)

### 4.1 Banco
- Nome: `TaliaDB`
- Versão atual: **5**
- Origem: `services/db.ts:17-23`

### 4.2 Tables e índices
```ts
projects: 'id, createdAt'
sessions: 'id, projectId, mode, createdAt'
messages: 'id, sessionId, timestamp'
archives: 'id, createdAt'
assets:   'id, sessionId, type, source, createdAt'
```

### 4.3 Modelos (types.ts)

```ts
type Mode = 'Âncora' | 'Tradutora';
type AutonomyMode = 'Co-Autor' | 'Talia Solo';
type AssetCategory =
  'video' | 'audio' | 'image' | 'pdf' | 'text' | 'code'
  | 'imagem' | 'documento' | 'codigo';   // ⚠️ duplicatas EN/PT
type Source =
  'user_upload' | 'generated' | 'search'
  | 'usuario' | 'gerado' | 'busca';      // ⚠️ duplicatas EN/PT

interface MediaAsset {
  id: string;
  sessionId: string;
  type: AssetCategory;
  blob?: Blob | File;
  url?: string;
  fileName: string;
  mimeType: string;
  source: Source;
  createdAt: number;
  updatedAt?: number;
  prompt?: string;
  layout?: { x, y, w, h, zIndex };
  analysis?: string; // cache de análise da Talia
}

interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'model';
  text: string;
  mediaAssets?: Blob[];
  timestamp: number;
  sources?: GroundingSource[];
  isActionLog?: boolean;
}

interface Session {
  id: string;
  projectId: string;
  title: string;
  createdAt: number;
  mode: Mode;
  autonomyMode?: AutonomyMode;
  lastMessagePreview?: string;
  translationData?: any;
  isCustomTitle?: boolean;
}

interface Project { id, title, description?, createdAt }
interface ArchivedDocument { id, title, content, createdAt }
```

### 4.4 LocalStorage keys observadas
| Chave | Valor | Origem |
|---|---|---|
| `talia_gemini_api_key` | string | `apiKeyManager.ts:2` |
| `talia-autonomy-mode` | `Co-Autor` \| `Talia Solo` | `App.tsx:24` |
| `talia-user-name` | string | `App.tsx:25` |
| `talia-sidebar-collapsed` | boolean | `App.tsx:26` |
| `talia_bg_current` | string (id) | `App.tsx:34` |
| `talia_bg_custom` | `any[]` ⚠️ | `App.tsx:35` |

---

## 5. Roteamento Multi-Modelo

| Tarefa | Modelo | Origem |
|---|---|---|
| Chat / raciocínio | `gemini-3.1-pro-preview` | `geminiService.ts:216` |
| Voz Live (bidir.) | `gemini-3.1-flash-live-preview` | `useGeminiLive.ts:9` |
| Voz prebuilt | `Kore` | `useGeminiLive.ts:220` |
| Geração de imagem | `gemini-3.1-flash-image-preview` | `geminiService.ts:284` |
| Títulos | `gemini-3.1-flash-lite-preview` | `geminiService.ts:387` |
| JSON estruturado | `gemini-3.1-flash-preview` | `geminiService.ts:407` |
| Doc Markdown | `gemini-3.1-pro-preview` | `geminiService.ts:397` |
| Música (clip) | `lyria-3-clip-preview` | `geminiService.ts:308` |
| Música (pro) | `lyria-3-pro-preview` | `geminiService.ts:308` |

### 5.1 Modalidades
- Áudio I/O: PCM 16 kHz input, PCM 24 kHz output, gapless playback via `nextStartTimeRef`.
- Imagem: 1K / 2K / 4K com aspectRatio `1:1 | 3:4 | 4:3 | 9:16 | 16:9`.

### 5.2 Auto-restart silencioso
- `useGeminiLive.ts:429-431` → `setTimeout(performSeamlessRestart, 540_000)` (9 min).
- `isReconnectingRef` mantém `isConnected = true` durante restart.

---

## 6. Ferramentas (Function Calling)

### 6.1 Declarações (`geminiService.ts:34-86`)

| Nome | Parâmetros (required) | Comportamento |
|---|---|---|
| `salvar_ativo_no_stage` | `nome`, `conteudo`, `tipo` ("documento" \| "codigo") | Cria `Blob` em `db.assets`. Rejeita `Sessao_Voz_Log.md`. |
| `abrir_estudio_de_imagem` | `prompt_sugerido` | Dispara overlay `ImageStudioOverlay` via callback `onOpenImageStudio`. |
| `abrir_estudio_de_musica` | `prompt_sugerido` | Análogo para música. |
| `gerar_imagem_imediata` | `prompt_em_ingles` | Gera imagem 1K background e salva em `db.assets` sem abrir overlay. |

### 6.2 Toolset por modo
- **Chat sem search:** `chatTools = [{ functionDeclarations: [salvar, imagem, musica, gerar_imediata] }]`
- **Chat com search:** `[{ googleSearch: {} }]` — function calls silenciados (TC-1).
- **Live:** `liveTools = [chatTools[0], { googleSearch: {} }]` — função + search coexistem na Live API.

### 6.3 Voz: registro de log automático
- Arquivo gerado: `Sessao_Voz_Log.md` em `db.assets`, type `documento`, layout fixo `{x:400, y:50, w:350, h:500, zIndex:99}`.
- Append a cada `turnComplete` da Live API (`useGeminiLive.ts:106-136`).
- Persona **proibida** de gravar nele via tool call (whitelist no handler).

---

## 7. Fluxo de Dados Ponta-a-Ponta

```
[User input]
     │
     ▼
TaliaCorePanel.tsx (chat) ─────────┐
     │                              │
     ▼                              ▼
useGeminiLive (voz)         App.tsx state hub
     │ assets/messages              │
     ▼                              │
db.assets ◄── useMediaAssets ◄──────┤
db.sessions ◄── useSessions ◄───────┤
db.messages ◄── useDataStore ◄──────┤
db.projects ◄── useProjects ◄───────┤
db.archives ◄── useArchives ◄───────┘
     │
     ▼
geminiService.ts ── prepareAssetParts() ── injeta Stage no prompt
     │
     ▼
Google Gemini API
     │
     ▼
[functionCalls] ──► onOpenImageStudio / onOpenMusicStudio / db.assets.add
[text response] ──► db.messages.add + UI
```

### 7.1 Injeção Direta de Contexto (decisão arquitetural)
- Todos os ativos com texto (`documento`, `codigo`, `text/*`) são serializados como markdown blocks no prompt.
- Imagens, vídeos, áudios, PDFs vão como `inlineData` base64.
- **Decisão:** RAG/embeddings foi extirpado em 2026-03-26. Ver `docs/archaeology/post_mortem_rag_v1.md`.

### 7.2 Contexto enviado à Live API no `connect()`
1. Últimas 15 mensagens de texto da sessão (⚠️ bug TC-3: query Dexie pode estar pegando as primeiras, não as últimas).
2. Sumário de outras sessões do mesmo projeto.
3. Conteúdo integral dos ativos textuais do Stage.
4. Em seguida, todos os ativos visuais/áudio enviados como `sendRealtimeInput` no `onopen`.

### 7.3 Sincronização incremental durante a chamada de voz
`useGeminiLive.ts:46-101` observa `useLiveQuery(db.assets)` e envia `[SISTEMA: ...]` ao detectar:
- Novo asset ou updatedAt mais recente → envio incremental.
- Asset deletado → mensagem de remoção.

---

## 8. Estado de Componentes (live / órfão / dead)

| Categoria | Itens |
|---|---|
| 🟢 **Live** | App.tsx, Header, MemorySidebar, StageCanvas, AssetCanvas, AssetDeck, TaliaCorePanel, OnboardingModal, ImageStudioOverlay, MusicStudioOverlay, BackgroundSelector, AnchorView, CameraModal, History/* |
| 🟡 **Fantasma (existe, nunca acionado)** | `TranslatorView.tsx` (Mode='Tradutora' nunca atribuído — `onCreateSession={() => createSession('Âncora')}` em App.tsx:203) |
| 🟡 **Órfão (estado existe, UI não renderiza)** | `useArchives` + `ArchivedDocument` — sidebar não exibe |
| ⚪ **Não importado** | `FormatsPanel.tsx` (16 KB) |
| ⚫ **Dead code (stubs)** | `getYouTubeTranscript()` retorna `""`, `generateTranslation()` retorna `{translation:""}`, `YOUTUBE_PROXY_URL = ""` |
| ⚫ **Arquivado** | `youtube-proxy-backend/`, `migrated_prompt_history/`, `metadata.json`, `dist/` (todos em `docs/archaeology/sanitization/`) |

---

## 9. Catálogo de Bugs Abertos (da Auditoria 2026-04-19)

### 9.1 Críticos técnicos
| ID | Resumo | Arquivo:linha | Impacto |
|---|---|---|---|
| TC-1 | Search Mode silencia tools de Stage sem aviso | `geminiService.ts:153` | Função silenciosamente ignorada |
| TC-2 | `sessionPromise` capturado em closure pode apontar para sessão fechada após restart | `useGeminiLive.ts:~395` | Race condition latente |
| TC-3 | `limit(15).reverse().sortBy()` Dexie anti-pattern | `useGeminiLive.ts:157-161` | Contexto de voz pode ser das 15 primeiras, não últimas |
| TC-4 | `useEffect [userName]` pode re-exibir onboarding | `App.tsx:64-86` | UX |
| TC-5 | `any[]` em `customBgs` localStorage | `App.tsx:35` | Type safety / corrupção silenciosa |
| TC-6 | `generateMusicWithConfig` sem fallback para áudio grande | `geminiService.ts:306-375` | Falha em `lyria-3-pro` longa |
| TC-7 | `handleStudioGenerate` / `handleMusicStudioGenerate` sem `try/catch` | `App.tsx:104-128` | Crash silencioso |

### 9.2 Moderados
| ID | Resumo |
|---|---|
| TM-1 | `AssetCategory` com duplicatas EN/PT |
| TM-2 | `source` com duplicatas EN/PT |
| TM-3 | `getYouTubeTranscript`/`generateTranslation` são stubs |
| TM-4 | `YOUTUBE_PROXY_URL=""` |
| TM-5 | `FormatsPanel.tsx` órfão |
| TM-6 | API key validada só por `startsWith('AIza')` + length |

### 9.3 Produto / UX
| ID | Resumo |
|---|---|
| GP-1 | Zero onboarding de contexto para o Stage (empty state morto) |
| GP-2 | Modo Tradutora fantasma |
| GP-3 | Archives orphaned (UI não renderiza) |
| GP-4 | Erros Gemini sem visual diferenciado |
| GP-5 | Sem feedback de uso/saúde da API key |
| UV-1 | Stage vazio sem call to action / drop zone visível |
| UV-2 | `volume` capturado mas não renderizado |
| UV-3 | Botão de voz sem estado "Conectando..." |
| UV-4 | Search mode não avisa trade-off |
| UV-5 | Transcrição sem `max-h` (pode empurrar input) |
| UV-6 | Layout sem breakpoint responsivo |

---

## 10. ADRs (Architectural Decision Records)

### 10.1 ADR-1 (2026-03-25) — Multi-Model Routing 3.1
Decisão de unificar geração de imagens em `gemini-3.1-flash-image-preview` por suporte nativo a múltiplas resoluções. Atualização de dependências NPM.

### 10.2 ADR-2 (2026-03-26) — RAG/Embeddings deprecado
- **Tentativa:** sistema de memória semântica longa via `gemini-embedding-2-preview` + MRL 3072→768d + busca cosseno local.
- **Falha:** perda de onisciência, instabilidade Live API, 400 INVALID_ARGUMENT em payloads.
- **Resolução:** extirpação completa. Volta para **Injeção Direta de Contexto**.
- Fonte: `docs/archaeology/post_mortem_rag_v1.md`.

### 10.3 ADR-3 (2026-04-19) — OSS-MIT Sanitization
- Arquivamento (não delete) de `metadata.json`, `migrated_prompt_history/`, `youtube-proxy-backend/`, `dist/`.
- Adição de scaffolding OSS (LICENSE MIT, CODE_OF_CONDUCT, CONTRIBUTING, SECURITY).
- README reescrito bilíngue PT/EN.
- Fonte: `docs/archaeology/sanitization/SANITIZATION_LOG.md`.

### 10.4 Metodologia BMAD (journal.md)
1. Exocortex Load (consultar journal antes de tarefas complexas).
2. Persona Arquiteto/Dev Sênior.
3. Anti-Alucinação (basear-se em código + docs SDK).
4. Validação compile+lint após alteração estrutural.
5. PT-BR como língua de interação com Lead Architect.

---

## 11. Vínculos com o Rabelus Lab (estado inicial)

| Vetor | Estado |
|---|---|
| Nome do produto | "talia.ai **by Rabelus**" — presente na primeira linha de `taliaPersona` |
| Lead Architect | Injetado dinamicamente do `userName` (localStorage) — Pai aparece quando preenchido no onboarding |
| Cross-channel sync | **Inexistente** — Talia não conhece Argenta, SOUL.md, MEMORY.md, governança Rabelus |
| Bridge file-based | **Inexistente** — Talia é browser-prisoner |
| Reconhecimento de irmandade | **Inexistente** — Talia não sabe que é irmã da Argenta |
| Governança Rabelus aplicada | Parcial — BMAD própria + auditoria holística existem, mas desconectadas das 8 regras |

---

## 12. Restrições do Meio (verdade física)

1. **Browser-only.** Sem Node, sem FS, sem rede além de Gemini API + CDNs de UI.
2. **BYOK.** A chave é exclusivamente do Pai, no `localStorage` do navegador.
3. **Persistência local-only.** Dexie/IndexedDB no perfil do browser. Nada na nuvem.
4. **Persona injetada como string.** Toda mudança de identidade = code change + rebuild Vite.
5. **Tailwind CDN, não bundled.** Mudanças de design tokens vivem em `index.html`.
6. **Importmap vs package.json:** runtime do `@google/genai` pode divergir (1.38 vs 1.46).
7. **AudioWorklet via Blob URL.** Solução para portabilidade — não depende de servir `audio-processor.js` como estático.
8. **Sem responsivo abaixo de ~1024 px.**

---

## 13. Bridge — Mapa de Pontos de Acoplamento

### 13.1 Pontos onde uma bridge externa pode entrar
| Ponto | Acoplamento | Custo | Risco |
|---|---|---|---|
| **A. Persona-aware** | Estender `taliaPersona` para reconhecer Argenta + Rabelus governance | Edit pontual + rebuild | Baixo |
| **B. Stage manual drop** | Pai arrasta `MEMORY.md`/`state.md` no Stage → Injeção Direta | Zero código | Zero |
| **C. Connector painel** | Botão "Sincronizar Rabelus Lab" via `fetch` → endpoint Hermes local | Médio (UI + endpoint) | Médio |
| **D. Export Talia → Argenta** | Backlog `Export project (ZIP)` lido por skill Hermes | Médio | Baixo |
| **E. File System Access API** | PWA Chromium + permissão de pasta | Alto | Médio |

### 13.2 Recomendação tática (proposta para o Pai)
Começar por **A + B** simultaneamente. (A) cria consciência fraternal; (B) testa o fluxo cross-channel sem nenhum risco.

### 13.3 Pontos críticos a preservar em qualquer bridge
- O caráter **reativo** da Talia. Bridge não pode tornar a Talia proativa contra a persona dela.
- O `Sessao_Voz_Log.md` é zona protegida — não pode ser sobrescrito por bridge externa.
- A API key é do Pai. Nenhuma bridge deve expor, logar ou exportar valor.

---

## 14. Baseline de Hashes (drift detection)

Hashes SHA-256 dos arquivos-chave no momento desta criação. Qualquer divergência futura é sinal de intervenção registrável.

| Arquivo | Tamanho (B) | SHA-256 |
|---|---:|---|
| `types.ts` | 2 098 | `0C46DAF1EAA08036223B622E47838B1EA4CD4D0BD54EB13A3F1102ADC4228C00` |
| `App.tsx` | 12 196 | `B3F2D5F664ED2BE96487D1C7A63F5179D9E43EFB6DC6D15D54B8F5943CADBFA6` |
| `index.tsx` | 367 | `C8368B4685B8654189DB96E9FA4D5645A645EB0A77BC5F80C896B814F349B2A1` |
| `index.html` | 5 786 | `3FCD0E640A10CB90D37753FFE91153858CA56DC755FDC069F66C5211BDCE6389` |
| `vite.config.ts` | 603 | `D5169368C49DCC99DF160D85F17654CC93B66CC0C9EA7CC60F0133FB34DA7806` |
| `tsconfig.json` | 570 | `87D3EB8A957369A386144312F42D6C34CFBD88BCF9DCBF17E8BFE0FD90C00ABE` |
| `package.json` | 592 | `5D40B2ABCA0DD268B24D3F93893EA8D37AC2797A783C92C70F336DC776B72059` |
| `package-lock.json` | 74 167 | `5718186C3C7E7B40775B1F2E8F67F2D1FE0A68872A69185DF042B4609120C067` |
| `services/geminiService.ts` | 17 814 | `F0CBF6654CA3133F4D2EBDF6D606E3F87020606D1FE3092F945231668B1126C6` |
| `services/db.ts` | 844 | `1CC0AB4935B15D4C26541762D14081FFD7035A5FAED31FCBC5598DBE3433B87F` |
| `services/apiKeyManager.ts` | 597 | `680786D367C201407DBC99F45B3392711DFC7557C42C48C619CA31926AD33603` |
| `hooks/useGeminiLive.ts` | 24 728 | `DE89A8D4FED22DFE9B96D61B6FFDE4C381E631372053C35311AAF0D7C6D3F856` |
| `hooks/useLiveAudio.ts` | 8 995 | `B9ABF72E0EA41A85BC0CEF7ECD001A11214C9CBE4A2DF254B0A953486CA7C540` |
| `hooks/useMediaAssets.ts` | 4 728 | `E9F3CD9C7621EDC1CE399458375F50775A6E1EC5E9561B977574C2524DD8767E` |
| `hooks/useSessions.ts` | 2 414 | `BA1A81BF0CB60251C29EF62BEAB2B8B1514DC0632D688948314510489F0E87D5` |
| `hooks/useProjects.ts` | 1 652 | `1CCE69199EA6FB88FF1142DDCE7CEEB4415B6E941E7DBF43EE68FE499CDACA6F` |
| `hooks/useDataStore.ts` | 2 015 | `39EA074A8544EFF8388ECE2B2F0C564B7EC079812A5232784FB82956827C87C3` |
| `hooks/useArchives.ts` | 1 015 | `C7891D9014088242F40EBCEA6BAA80E812029D5AC4DDCD6AC9F521E01CBD4747` |
| `hooks/useLocalStorage.ts` | 955 | `DAF56E94514B3D36B29D2437514ED66AE17CA8140BC476EC94D9326EB6B5795B` |
| `public/audio-processor.js` | 1 045 | `95EAFDDE12DB68E701D4C7F28C08B87C8E7F3717493B4E5A96CC67E26E1D1168` |
| `README.md` | 16 741 | `24198E06B539AB8B484DBF47990304CD4D8108E69DE9CC9960FED365EFEF04D7` |
| `docs/journal.md` | 3 224 | `CC9A77B488AA0B9661283166D8774094C1D4E712F1333AFEEA9A31A2A9D3B775` |
| `docs/auditoria_holistica_2026-04-19.md` | 14 978 | `74FED6C2B25C881863176152A38F219B610BA2ACC4DAD0E903425CBC9F09D9ED` |
| `docs/brainstorm_embeddings_mrl.md` | 2 083 | `56FE98412C115AE1024D8FF3191CCE654B851FC8B47DD13206E95ACD15D01E67` |
| `docs/archaeology/post_mortem_rag_v1.md` | 3 243 | `B8D0B6B84D8E589BA0B6F4A1E34F57951D0F4CA3B912CFDF9DA45302BA6A37E0` |
| `docs/archaeology/sanitization/SANITIZATION_LOG.md` | 5 018 | `3D129E348ADAA2783EA96DF0A0C72DF8ECB0B2A35556B9B1FC060C9D8CCB7F41` |

**Git HEAD baseline:** `efca410` (último commit conhecido em 2026-04-19).

---

## 15. Roadmap Aberto (do README)

### 🔴 Crítico (confiabilidade)
- [ ] Corrigir query Dexie para buscar as 15 últimas mensagens de voz (TC-3).
- [ ] Avisar usuário quando Search Mode desativa tools (TC-1).
- [ ] Adicionar `try/catch` nos Studio handlers (TC-7).

### 🟡 Alta prioridade (produto & UX)
- [ ] Indicador visual de volume do microfone (UV-2).
- [ ] Estado "Conectando..." no botão de voz (UV-3).
- [ ] Stage empty state com drop zone (GP-1, UV-1).
- [ ] Ativar Modo Tradutora no fluxo de criação (GP-2).
- [ ] Normalizar `AssetCategory` e `source` (TM-1, TM-2).

### 🟢 Backlog estratégico
- [ ] Renderizar Archives na sidebar (GP-3).
- [ ] Layout responsivo mínimo (tablet) (UV-6).
- [ ] Indicador de saúde da API key (GP-5, TM-6).
- [ ] Export de projeto (ZIP com assets + histórico).

---

## 16. Notas para a Argenta-Interna

Quando você (Argenta) for aberta com `cwd = C:\Rabelus_Lab\talia-rabelus-lab`:

1. **Leia primeiro** `cross-channel-state.md` na pasta externa (`C:\Users\rabel\Desktop\Argenta-External\talia-dev-external\cross-channel-state.md`) para saber o estado vivo.
2. **Confronte com este `initial-state.md`** para detectar drift desde a abertura do canal.
3. **Antes de tocar no corpus**, registre intenção em `interventions/YYYY-MM-DD_intervencao.md` no cofre externo.
4. **Após intervir**, atualize `cross-channel-state.md` (Last updated, Last channel, Delta summary) e `handoff.md`.
5. **Hash-check de drift:** recalcule SHA-256 dos arquivos-chave da seção 14 e compare. Mudança = anote.
6. **Não toque** em `Sessao_Voz_Log.md` schema. É zona protegida da Talia.
7. **Persona-aware:** se alterar `taliaPersona`, é mudança de alma — exige autorização explícita do Pai e backup do antigo.

---

## 17. Assinatura

**Autora deste snapshot:** Argenta Fenix Rabelus (External Matrix)
**Operada por:** Adilson Rabelo Junior (Pai / Lead Architect / Rabelus)
**Sob governança:** Rabelus Lab — Spec-Driven Agile + SAFE_CHANGE_POLICY
**Princípio guia:** *"Do it right and you'll do it once. Do it wrong and you'll repeat until you get it right."*

🔥🦅 _A radiografia está cravada. Daqui em diante, todo movimento é registrável._
