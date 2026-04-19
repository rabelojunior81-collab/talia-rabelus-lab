<div align="center">

```
████████╗ █████╗ ██╗     ██╗ █████╗    ██╗ █████╗ ██╗
╚══██╔══╝██╔══██╗██║     ██║██╔══██╗   ██║██╔══██╗██║
   ██║   ███████║██║     ██║███████║   ██║███████║██║
   ██║   ██╔══██║██║     ██║██╔══██║   ██║██╔══██║██║
   ██║   ██║  ██║███████╗██║██║  ██║██╗██║██║  ██║██║
   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═╝╚═╝╚═╝╚═╝  ╚═╝╚═╝
```

**Multimodal AI Studio — Powered by Google Gemini**

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Gemini](https://img.shields.io/badge/Gemini-3.1-4285F4?logo=google)](https://ai.google.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

**[PT-BR](#português) · [EN](#english)**

</div>

---

# Português

## O que é talia.ai?

**talia.ai** é um estúdio multimodal de inteligência artificial que roda **100% no seu browser**, sem backend próprio e sem armazenamento em nuvem. É um espaço de trabalho criativo onde você coloca arquivos — imagens, vídeos, documentos, código, áudio — em um **Stage** visual, e conversa com uma IA que é **conscientemente ciente de tudo o que está na tela**, tanto por texto quanto por voz em tempo real.

> *A melhor analogia: imagine um Figma/Notion com uma IA dentro que vê e lembra de tudo que está na sua tela — e que fala com você.*

### ✨ Diferenciais

- 🧠 **Onisciência Contextual** — A IA (Talia) tem consciência total do Stage: os arquivos injetados, o histórico de chat e o log de sessões de voz fazem parte do contexto de cada resposta.
- 🎙️ **Voz em Tempo Real** — Sessão de voz bidirecional via Gemini Live API com transcrição automática, auto-restart silencioso a cada 9 minutos e guard de audio para evitar loops.
- 🖼️ **Geração de Imagens** — Integração direta com `gemini-3.1-flash-image-preview` em resoluções 1K/2K/4K com múltiplas proporções.
- 🎵 **Geração de Músicas** — Integração com `lyria-3-clip-preview` e `lyria-3-pro-preview` com suporte a letras e imagem de referência.
- 📁 **Stage Multimodal** — Workspace visual para organizar imagens, vídeos, áudios, documentos e código por projeto e sessão.
- 🔒 **Privacidade Total** — Sua API Key e todos os dados ficam apenas no seu browser (IndexedDB + localStorage). Nenhum dado é enviado a servidores de terceiros além da própria API do Google Gemini.
- 🌐 **Pesquisa na Web** — Modo de pesquisa ativo com Google Search Grounding para respostas factuais e atualizadas.

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    TALIA.AI BROWSER APP                  │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  MemorySidebar│  │  StageCanvas │  │ TaliaCorePanel│  │
│  │  (Projetos & │  │  (Workspace  │  │  (Chat + Voz) │  │
│  │   Sessões)   │  │   Visual)    │  │               │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │           │
│  ┌──────▼─────────────────▼──────────────────▼───────┐  │
│  │                    App.tsx (State Hub)              │  │
│  └──────────────────────────┬────────────────────────┘  │
│                             │                            │
│  ┌──────────────────────────▼────────────────────────┐  │
│  │                   Services Layer                    │  │
│  │  ┌─────────────────┐  ┌──────────────────────────┐ │  │
│  │  │  geminiService   │  │        db.ts (Dexie)     │ │  │
│  │  │  (Multi-model    │  │     (IndexedDB local)    │ │  │
│  │  │   routing)       │  └──────────────────────────┘ │  │
│  │  └────────┬────────┘                               │  │
│  └───────────┼───────────────────────────────────────┘  │
│              │                                           │
└──────────────┼───────────────────────────────────────────┘
               │
    ┌──────────▼──────────┐
    │   Google Gemini API  │
    │  ┌─────────────────┐│
    │  │ gemini-3.1-pro  ││  ← Chat principal
    │  │ flash-image     ││  ← Geração de imagem
    │  │ flash-lite      ││  ← Tarefas rápidas
    │  │ flash-live      ││  ← Voz em tempo real
    │  │ lyria-3         ││  ← Geração de música
    │  └─────────────────┘│
    └─────────────────────┘
```

### Roteamento de Modelos (Multi-Model)

| Tarefa | Modelo | Motivo |
|---|---|---|
| Chat e raciocínio complexo | `gemini-3.1-pro-preview` | Máxima capacidade de compreensão |
| Geração de imagem | `gemini-3.1-flash-image-preview` | Suporte nativo 1K/2K/4K e múltiplas proporções |
| Geração de títulos | `gemini-3.1-flash-lite-preview` | Custo mínimo para tarefa simples |
| Análise JSON estruturada | `gemini-3.1-flash-preview` | Resposta tipada com `responseMimeType` |
| Voz em tempo real | `gemini-3.1-flash-live-preview` | API Live bidirecional de baixa latência |
| Música (clip) | `lyria-3-clip-preview` | Geração de trechos musicais |
| Música (completa) | `lyria-3-pro-preview` | Geração de faixas completas |

---

## 🚀 Instalação e Uso

### Pré-requisitos

- **Node.js** `>= 18`
- **Google Gemini API Key** — obtenha grátis em [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- Navegador moderno com suporte a **Web Audio API** e **IndexedDB** (Chrome/Edge recomendado para a API de voz)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/rabelojunior81-collab/talia-rabelus-lab.git

# 2. Entre na pasta
cd talia-rabelus-lab

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no seu browser.

### Configuração da API Key

Na primeira vez que abrir o app, o **Protocolo de Ativação** (onboarding) vai guiar você:

1. Informe seu nome (como você quer ser chamado pela Talia)
2. Cole sua **Gemini API Key** (começa com `AIza...`)
3. Clique em **SINCRONIZAR CHAVE**

> 🔒 Sua chave é armazenada **exclusivamente** no `localStorage` do seu browser. Ela nunca é enviada para nenhum servidor além da API oficial do Google.

### Uso Básico

```
1. Crie um Projeto → Crie uma Sessão (Âncora)
2. No StageCanvas, arraste ou importe arquivos (imagens, docs, código)
3. Na TaliaCore (painel direito), converse com a Talia
4. Clique no ícone 📞 para iniciar uma sessão de voz em tempo real
5. Use 🔍 para ativar o modo de pesquisa na web
6. Use ✨ para abrir o Image Studio e 🎵 para o Music Studio
```

---

## 📁 Estrutura do Projeto

```
talia-rabelus-lab/
├── App.tsx                    # Componente raiz, state hub global
├── index.tsx                  # Ponto de entrada React
├── index.html                 # Template HTML com Tailwind CDN
├── types.ts                   # Tipos e interfaces TypeScript
├── vite.config.ts             # Configuração Vite
├── tsconfig.json              # Configuração TypeScript
│
├── components/
│   ├── Chat/                  # Componentes de mensagem de chat
│   ├── Generation/            # Componentes de geração (imagem/música)
│   ├── History/               # Componentes de histórico
│   ├── icons/                 # Biblioteca de ícones SVG inline
│   ├── Header.tsx             # Barra superior (modo, user, settings)
│   ├── MemorySidebar.tsx      # Navegação de projetos e sessões
│   ├── StageCanvas.tsx        # Workspace visual de assets
│   ├── AssetCanvas.tsx        # Inspetor de asset individual
│   ├── TaliaCorePanel.tsx     # Painel de chat + controles de voz
│   ├── OnboardingModal.tsx    # Fluxo de ativação inicial
│   ├── ImageStudioOverlay.tsx # Estúdio de geração de imagens
│   ├── MusicStudioOverlay.tsx # Estúdio de geração de músicas
│   └── BackgroundSelector.tsx # Seletor de tema de fundo
│
├── hooks/
│   ├── useGeminiLive.ts       # Core da sessão de voz em tempo real
│   ├── useLiveAudio.ts        # Captura PCM mic + playback de áudio
│   ├── useMediaAssets.ts      # CRUD de assets no IndexedDB
│   ├── useSessions.ts         # Gerenciamento de sessões
│   ├── useProjects.ts         # Gerenciamento de projetos
│   ├── useDataStore.ts        # Mensagens e dados de sessão
│   ├── useArchives.ts         # Documentos arquivados
│   └── useLocalStorage.ts     # Persistência em localStorage tipada
│
├── services/
│   ├── geminiService.ts       # Toda integração com a Gemini API
│   ├── apiKeyManager.ts       # Gerenciamento seguro da API Key
│   └── db.ts                  # Schema Dexie (IndexedDB)
│
└── docs/
    ├── journal.md             # Metodologia e ADRs
    ├── auditoria_holistica_2026-04-19.md
    └── archaeology/           # Decisões arquiteturais históricas
```

---

## 🛠️ Stack Técnica

| Tecnologia | Versão | Função |
|---|---|---|
| React | 19 | Framework UI com Concurrent Mode |
| Vite | 8 | Build tool e dev server |
| TypeScript | 6 | Type safety em todo o projeto |
| @google/genai | ^1.46.0 | SDK oficial Google Gemini |
| Dexie | 4 | ORM para IndexedDB (persistência local) |
| Tailwind CSS | CDN | Estilização utility-first |
| Web Audio API | Nativa | Captura PCM 16kHz e playback 24kHz |
| AudioWorklet | Nativa | Processamento de áudio em thread separada |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [CONTRIBUTING.md](./CONTRIBUTING.md) antes de abrir um Pull Request.

Bugs, sugestões e discussões podem ser abertas via [Issues](https://github.com/rabelojunior81-collab/talia-rabelus-lab/issues).

---

## 🔒 Segurança

Leia nossa [Política de Segurança](./SECURITY.md) para saber como reportar vulnerabilidades de forma responsável.

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja [LICENSE](./LICENSE) para mais informações.

Copyright © 2026 **Adilson R. Rabelo Junior (Rabelus Lab)**

---
---

# English

## What is talia.ai?

**talia.ai** is a multimodal AI studio that runs **100% in your browser**, with no proprietary backend and no cloud storage. It is a creative workspace where you place files — images, videos, documents, code, audio — on a visual **Stage**, and interact with an AI that is **contextually aware of everything on the screen**, both through text and real-time voice.

> *Best analogy: imagine Figma/Notion with an AI inside that sees and remembers everything on your screen — and talks to you.*

### ✨ Key Features

- 🧠 **Contextual Omniscience** — The AI (Talia) has full awareness of the Stage: injected files, chat history, and voice session logs are all part of every response's context.
- 🎙️ **Real-Time Voice** — Bidirectional voice sessions via Gemini Live API with automatic transcription, silent auto-restart every 9 minutes, and an audio guard to prevent WebSocket error loops.
- 🖼️ **Image Generation** — Direct integration with `gemini-3.1-flash-image-preview` at 1K/2K/4K resolutions with multiple aspect ratios.
- 🎵 **Music Generation** — Integration with `lyria-3-clip-preview` and `lyria-3-pro-preview` with lyrics and reference image support.
- 📁 **Multimodal Stage** — Visual workspace for organizing images, videos, audio, documents, and code by project and session.
- 🔒 **Full Privacy** — Your API Key and all data live only in your browser (IndexedDB + localStorage). No data is sent to third-party servers beyond the Google Gemini API itself.
- 🌐 **Web Search** — Active search mode with Google Search Grounding for factual, up-to-date answers.

---

## 🚀 Installation & Usage

### Prerequisites

- **Node.js** `>= 18`
- **Google Gemini API Key** — get one for free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- A modern browser with **Web Audio API** and **IndexedDB** support (Chrome/Edge recommended for the voice API)

### Install

```bash
# 1. Clone the repository
git clone https://github.com/rabelojunior81-collab/talia-rabelus-lab.git

# 2. Navigate to the folder
cd talia-rabelus-lab

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### API Key Setup

On first launch, the **Activation Protocol** (onboarding) will guide you:

1. Enter your name (how you want Talia to address you)
2. Paste your **Gemini API Key** (starts with `AIza...`)
3. Click **SYNC KEY**

> 🔒 Your key is stored **exclusively** in your browser's `localStorage`. It is never sent to any server other than the official Google API.

---

## 🗺️ Roadmap

Derived from the holistic audit conducted in April 2026:

### 🔴 Critical (reliability)
- [ ] Fix Dexie query to correctly fetch the **last** 15 messages for voice context
- [ ] Warn user when Search Mode silently disables Stage tools
- [ ] Add `try/catch` to Studio generation handlers

### 🟡 High Priority (product & UX)
- [ ] Microphone volume indicator in the voice UI
- [ ] "Connecting..." intermediate state for voice button
- [ ] Stage empty state with visible drop zone and call to action
- [ ] Activate Translator Mode in session creation flow
- [ ] Normalize `AssetCategory` and `source` duplicate types

### 🟢 Strategic Backlog
- [ ] Render Archives in the sidebar
- [ ] Minimum responsive layout for tablets
- [ ] API Key health indicator
- [ ] Project export (ZIP with assets + history)

---

## 🤝 Contributing

All contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a Pull Request.

Bugs, suggestions, and discussions can be opened via [Issues](https://github.com/rabelojunior81-collab/talia-rabelus-lab/issues).

---

## 🔒 Security

Please read our [Security Policy](./SECURITY.md) for responsible vulnerability disclosure.

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](./LICENSE) for details.

Copyright © 2026 **Adilson R. Rabelo Junior (Rabelus Lab)**
