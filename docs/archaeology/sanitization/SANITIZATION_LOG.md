# Sanitization Log — talia.ai Root Directory

> **Data:** 2026-04-19  
> **Hora:** 01:36 BRT  
> **Motivo:** Conformação do projeto ao padrão open source MIT  
> **Operação:** Arquivamento (sem deleção). Os originais permanecem na raiz até remoção manual confirmada pelo Lead Architect.

---

## Inventário de Arquivos Sanitizados

### 1. `metadata.json`

| Campo | Valor |
|---|---|
| **Tamanho original** | 317 bytes |
| **Localização original** | `/metadata.json` (raiz) |
| **Arquivado em** | `/docs/archaeology/sanitization/metadata.json` |
| **Motivo** | Arquivo de configuração do **Google AI Studio** (plataforma de prototipagem). Contém o nome da aplicação para a plataforma, descrição e lista de permissões de hardware (`microphone`, `camera`, `geolocation`). Este arquivo é um artefato da fase de desenvolvimento no AI Studio — não pertence à raiz de um projeto open source autônomo e pode causar confusão sobre o runtime real do projeto (Vite). |
| **Referências** | [Documentação AI Studio App Metadata](https://ai.google.dev/aistudio) |
| **Status** | ✅ Arquivado — seguro para remoção da raiz |

---

### 2. `migrated_prompt_history/`

| Campo | Valor |
|---|---|
| **Tamanho original** | ~97 KB (2 arquivos JSON) |
| **Localização original** | `/migrated_prompt_history/` (raiz) |
| **Arquivado em** | `/docs/archaeology/sanitization/migrated_prompt_history/` |
| **Arquivos internos** | `prompt_2026-02-04T19:01:29.491Z.json` (76KB), `prompt_2026-02-04T19:02:46.170Z.json` (21KB) |
| **Motivo** | Snapshots de histórico de prompts da fase de migração inicial do projeto (Fevereiro 2026). São dados de desenvolvimento histórico, não código nem documentação de produto. Não têm valor para contribuidores externos e expõem detalhes de processo interno. Arquivados para preservação histórica. |
| **Status** | ✅ Arquivado — seguro para remoção da raiz |

---

### 3. `youtube-proxy-backend/`

| Campo | Valor |
|---|---|
| **Tamanho original** | ~4 KB (3 arquivos: `index.js`, `instructions.txt`, `package.json`) |
| **Localização original** | `/youtube-proxy-backend/` (raiz) |
| **Arquivado em** | `/docs/archaeology/sanitization/youtube-proxy-backend/` |
| **Motivo** | Backend Node.js/Express que servia como proxy para transcrição de vídeos do YouTube. **Feature completamente inativa:** em `geminiService.ts`, `getYouTubeTranscript()` retorna `""` vazio (stub) e `YOUTUBE_PROXY_URL` é uma string vazia. O componente `TranslatorView.tsx` que consumia essa feature está em modo orfão. A presença deste diretório na raiz causa confusão sobre a arquitetura do projeto (que é 100% client-side). |
| **Evidência no código** | `geminiService.ts:414 — export const getYouTubeTranscript = async (id: string) => "";` |
| **Status** | ✅ Arquivado — seguro para remoção da raiz |

---

### 4. `dist/` (snapshot de build)

| Campo | Valor |
|---|---|
| **Localização original** | `/dist/` (raiz) |
| **Arquivado em** | `/docs/archaeology/sanitization/dist_build_snapshot/` |
| **Motivo** | Artefatos de build do Vite. Já consta no `.gitignore` (linha 11: `dist`), portanto não deveria estar rastreado pelo Git. A presença física é resíduo de um build local. Arquivado como snapshot histórico do estado de build nesta data. |
| **Conteúdo** | `index.html`, `audio-processor.js`, `assets/` (bundle compilado) |
| **Status** | ✅ Arquivado — o `.gitignore` já previne re-comissão. Seguro para remoção da raiz. |

---

## Raiz Resultante Após Sanitização

```
talia-rabelus-lab/          ← apenas arquivos essenciais
├── .git/
├── .gitignore
├── App.tsx                 ← entry component
├── CODE_OF_CONDUCT.md      ← [NOVO] Open Source
├── CONTRIBUTING.md         ← [NOVO] Open Source
├── LICENSE                 ← [NOVO] MIT
├── README.md               ← [REESCRITO] Professional OSS
├── SECURITY.md             ← [NOVO] Open Source
├── components/
├── docs/
│   ├── archaeology/
│   │   ├── sanitization/   ← este diretório
│   │   └── post_mortem_rag_v1.md
│   ├── auditoria_holistica_2026-04-19.md
│   ├── brainstorm_embeddings_mrl.md
│   └── journal.md
├── hooks/
├── index.html
├── index.tsx
├── package.json
├── package-lock.json
├── services/
├── tsconfig.json
├── types.ts
└── vite.config.ts
```

---

## Procedimento de Remoção (quando aprovado)

Quando o Lead Architect confirmar, executar:

```bash
# Remove os artefatos originais da raiz
rm /metadata.json
rm -rf /migrated_prompt_history
rm -rf /youtube-proxy-backend
rm -rf /dist
```

**Esses arquivos estarão preservados neste diretório de arqueologia.**

---

*Documento gerado pelo processo de conformação open source MIT — talia.ai v0.0.0*
