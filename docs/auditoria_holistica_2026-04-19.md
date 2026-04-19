# Auditoria Holística — talia.ai

> **Perspectiva:** Técnica + Visual + Produto  
> **Data:** 2026-04-19  
> **Hora:** 01:02 (BRT / UTC-3)  
> **Auditor:** Antigravity (Claude Sonnet 4.6 Thinking)  
> **Versão do Projeto:** `mvp_talia_rqp` — commit `a0c208a`

---

## 1. O Que É Este Produto

**Talia.ai** é um **estúdio multimodal de IA pessoal**, rodando 100% no browser, sem backend próprio. É uma tela de trabalho criativo onde o usuário coloca arquivos (imagens, vídeos, documentos, código), conversa com uma IA contextual em texto e voz, gera imagens e músicas, e tudo isso persiste localmente via IndexedDB (Dexie).

A melhor analogia de produto: **é um Figma/Notion com uma IA dentro que sabe tudo o que está na tela — e que fala com você.**

---

## 2. Análise de Produto

### ✅ O que está funcionando bem como produto

| Dimensão | Observação |
|---|---|
| **Proposta de Valor** | Clara e diferenciada: IA multimodal com consciência do Stage, controle pelo usuário, sem cloud |
| **Privacidade** | 100% local (IndexedDB + localStorage). API Key só no browser. É um diferencial real. |
| **Autonomy Mode** | Conceito excelente: `Co-Autor` vs `Talia Solo`. Dá ao usuário sensação de controle |
| **Voice + Context** | A "Onisciência" de voz é o elemento mais poderoso do produto — Talia sabe o que está no Stage durante uma call |
| **Naming e Linguagem** | O vocabulário interno é bem construído: "Stage", "Anchor", "Memória", "Architect", "Core Protocol" — cria uma identidade |
| **Seamless Restart** | A sessão de voz se auto-renova a cada 9 min silenciosamente. Isso é cuidado de produto. |

### ⚠️ Gaps de Produto Críticos

#### GP-1: Zero onboarding de contexto para o Stage
O usuário chega no app e vê uma tela quase vazia. Não existe nenhuma pista de **o que fazer primeiro**. Não há tutorial, template, projeto de exemplo, ou sugestão de fluxo. O onboarding termina em "insira sua API Key" e pronto — o usuário fica no vazio.

#### GP-2: Modo `Âncora` vs `Tradutora` — feature quebrada/fantasma
`types.ts` define `Mode = 'Âncora' | 'Tradutora'`. O `TranslatorView.tsx` existe. Mas a UI de criação de sessão sempre usa `'Âncora'` hardcodado:
```ts
onCreateSession={() => createSession('Âncora')}
```
O modo Tradutora parece nunca ser ativável — é uma feature invisível.

#### GP-3: Archives (Documentos Arquivados) — orphaned feature
`useArchives`, `ArchivedDocument`, `onDeleteArchive` existem em toda a prop chain, mas a UI do `MemorySidebar` **não renderiza os arquivos**. O componente aceita o dado (`archives`) mas não o exibe. Funcionalidade morta.

#### GP-4: Ausência de feedback de estado de erro do Gemini
Quando o `getChatResponse` falha, o erro retorna como texto no chat. Não existe tratamento visual diferenciado (erro vs resposta normal). O usuário pode não saber que houve falha.

#### GP-5: Sem limites ou feedback de uso da API Key
O usuário não sabe quantas chamadas fez, se está perto do limite do Gemini gratuito, ou se sua chave está com problema. Não há qualquer indicador de saúde da API.

---

## 3. Análise Técnica

### Stack

```
React 19 + Vite 8 + TypeScript 6
@google/genai ^1.46.0
Dexie 4 (IndexedDB)
Tailwind CSS
```

Stack extremamente moderna. Sem dependências de UI (tudo custom). Sem backend. Tudo client-side.

### ✅ Acertos Técnicos

#### T-1: Arquitetura de Contexto por Injeção Direta (pós-RAG post-mortem)
A decisão documentada no `journal.md` de reverter RAG/Embeddings e usar **injeção direta de contexto** no `systemInstruction` foi correta. É mais simples, mais confiável, e elimina a latência extra de um retrieval step.

#### T-2: Audio Guard (`isAudioActiveRef`)
O guard implementado evita o loop de erro WebSocket → AudioWorklet → envio de chunk para socket fechado. É a solução certa: `isAudioActiveRef.current = false` nos callbacks `onclose`/`onerror` **antes** do `stopRecording`.

#### T-3: AudioWorklet como Blob URL
Ao invés de servir `pcm-processor.js` como arquivo estático (quebraria em alguns ambientes Vite), o código do worklet é embutido como string e carregado via `Blob URL`. Solução elegante e robusta.

#### T-4: Separação de contextos de áudio
16kHz para input (mic → Gemini) e 24kHz para output (Gemini → speaker). Correto e necessário. Dois `AudioContext` separados.

#### T-5: Gapless playback
A lógica de `nextStartTimeRef` para sequenciar chunks de áudio sem gaps é sólida.

#### T-6: Multi-model routing
```ts
gemini-3.1-pro-preview          // Chat principal (raciocínio)
gemini-3.1-flash-image-preview  // Geração de imagem
gemini-3.1-flash-lite-preview   // Títulos (custo baixo)
gemini-3.1-flash-preview        // JSON estruturado
gemini-3.1-flash-live-preview   // Voz em tempo real
lyria-3-clip/pro-preview        // Música
```
Roteamento inteligente por tarefa. Custo otimizado.

### 🔴 Problemas Técnicos Críticos

#### TC-1: Search e Function Calling são mutuamente exclusivos — sem aviso ao usuário
```ts
// geminiService.ts, linha ~153
const currentTools: Tool[] = useSearch 
    ? [{ googleSearch: {} }] 
    : chatTools;
```
Quando `isSearchMode` está ativo, **TODAS as ferramentas de Stage, Imagem e Música são desativadas**. Um usuário pode ativar a pesquisa e pedir para salvar um arquivo, e a Talia irá ignorar silenciosamente a ferramenta. É uma armadilha silenciosa.

#### TC-2: `functionResponses` usa `sessionPromise` capturado no fechamento — race condition latente
No handler de tool calls do Live (linha ~394, `useGeminiLive.ts`):
```ts
sessionPromise.then(session => session.sendToolResponse(...))
```
A `sessionPromise` é a variável da closure criada em `connect()`. Se `performSeamlessRestart` acontecer durante um tool call longo (como `gerar_imagem_imediata`), a promise pode apontar para uma sessão já fechada.

#### TC-3: `limit(15).reverse().sortBy()` — anti-pattern Dexie
```ts
// useGeminiLive.ts, linha ~158
db.messages.where({ sessionId }).limit(15).reverse().sortBy('timestamp');
```
O `.limit()` é aplicado **antes** do `.reverse()` no Dexie. Isso busca as primeiras 15 mensagens (não as últimas) e então tenta ordenar. Para buscar as 15 mais recentes, a query deveria usar `.orderBy('timestamp').reverse().limit(15)`.

> **Impacto direto:** O contexto injetado na sessão de voz pode estar usando as mensagens mais antigas da conversa, não as mais recentes.

#### TC-4: `useEffect` em `App.tsx` com dependência `[userName]` pode re-exibir o onboarding
```ts
useEffect(() => {
    checkStatus();
}, [userName]);
```
Se o userName mudar em algum momento futuro, `checkStatus` roda de novo, e o timer de 1.2s pode exibir o onboarding novamente. Deveria usar `[]` na inicialização.

#### TC-5: `any[]` para `customBgs` em localStorage
```ts
const [customBgs, setCustomBgs] = useLocalStorage<any[]>('talia_bg_custom', []);
```
Tipo `any[]` em dado persistido. Sem schema de validação. Se a estrutura mudar, dados corrompidos entram silenciosamente.

#### TC-6: `generateMusicWithConfig` — sem fallback para áudio muito grande
Para músicas longas (`lyria-3-pro`), o áudio pode ser muito grande para ser retornado como `inlineData`. Sem fallback ou check de tamanho.

#### TC-7: Sem `try/catch` em `handleStudioGenerate` e `handleMusicStudioGenerate`
```ts
// App.tsx
const blob = await generateImageWithConfig(config);  // pode lançar, sem try/catch
```
Se a API retornar erro, a exceção vai borbulhar sem tratamento visual para o usuário.

### ⚠️ Problemas Técnicos Moderados

| ID | Problema | Localização |
|---|---|---|
| TM-1 | `AssetCategory` tem duplicatas: `'image'` e `'imagem'`, `'text'` e `'documento'`. Normalização manual espalhada por vários componentes. | `types.ts` |
| TM-2 | `source` também tem duplicatas: `'generated'` e `'gerado'`, `'user_upload'` e `'usuario'`. | `types.ts` |
| TM-3 | `getYouTubeTranscript` e `generateTranslation` são stubs que retornam valores vazios. Dead code. | `geminiService.ts` |
| TM-4 | `YOUTUBE_PROXY_URL` é uma string vazia — feature YouTube completamente não-funcional. | `geminiService.ts` |
| TM-5 | `FormatsPanel.tsx` existe (15KB) mas não é importado em `App.tsx` — componente órfão ou em desenvolvimento. | `components/` |
| TM-6 | A API key é validada apenas por `startsWith('AIza')` e comprimento. Não há teste de validade real via chamada à API. | `OnboardingModal.tsx` |

---

## 4. Análise Visual / UX

### ✅ Acertos Visuais

| Elemento | Avaliação |
|---|---|
| **Paleta e identidade** | `#050506` base + `talia-red` como accent. Coerente, premium, dark-first |
| **Tipografia** | Serif para marca (`talia.ai`), mono para dados de sistema, sans para conteúdo. Hierarquia clara. |
| **Splash screen** | O radial gradient pulsante com `talia.ai` em serif é impactante |
| **Microanimações** | `animate-fade-in`, `animate-pulse`, bounce no loading indicator — bem calibradas |
| **Glassmorphism** | `backdrop-blur-xl`, `bg-black/20`, `border-white/5` — consistente em toda a UI |
| **Densidade de informação** | Alta densidade com tipografia micro (8-10px) para metadados. Funciona bem no dark theme. |

### ⚠️ Gaps Visuais / UX

#### UV-1: Stage vazio = experiência morta
Quando a sessão não tem ativos, o Stage mostra apenas um ícone fantasma e texto. Não existe **call to action visual** para arrastar arquivos, não tem um drop zone visível, não tem sugestão do que fazer.

#### UV-2: Volume do microfone não tem indicador visual
`useLiveAudio` exporta `volume` (0–100). O `TaliaCorePanel` captura o valor mas **nunca o renderiza na JSX**. O usuário não sabe se o microfone está realmente capturando áudio.

```ts
// TaliaCorePanel.tsx, linha 33 — volume desestruturado mas nunca usado
const { connect, disconnect, isConnected, error: liveError, transcription, volume } = useGeminiLive(...)
```

#### UV-3: Botão de voz não tem estado intermediário "conectando"
Entre clicar no Phone e `isConnected = true`, não há feedback visual. O usuário pode clicar múltiplas vezes achando que não funcionou.

#### UV-4: Modo pesquisa web não informa o trade-off ao usuário
Quando `isSearchMode` está ativo (ícone Globe ativo), as ferramentas de Stage são silenciosamente desativadas. A UI deveria mostrar um aviso contextual.

#### UV-5: Transcrição sem altura máxima
O painel de transcrição de voz (`absolute bottom-full`) não tem `max-h` ou scroll. Transcrições longas podem empurrar o input para fora da viewport.

#### UV-6: Mobile é inviável
O layout é `flex h-screen` com sidebar + canvas + panel fixos. Sem nenhum breakpoint responsivo. Em telas < 1024px, a experiência quebra completamente.

---

## 5. Análise de Arquitetura de Negócio

### Modelo de Monetização Atual
**Nenhum.** O produto é BYOK (Bring Your Own Key) — o usuário usa e paga a própria API Key do Google. Não há assinatura, não há backend, não há conta.

### Cenários Possíveis

| Cenário | Análise |
|---|---|
| **Manter BYOK (produto aberto)** | Zero barreira de entrada. Ideal para devs e early adopters. Limitado como negócio escalável. |
| **Modelo SaaS (Talia Cloud)** | Requer backend (auth, billing, armazenamento de conversas). Mudança arquitetural grande mas viável. |
| **Plugin/Extension** | A arquitetura local-first se encaixa bem em extensão de browser ou app Electron |
| **White-label / Studio Tool** | O conceito de "Stage" + Talia poderia ser licenciado para agências criativas |

### Diferenciais Competitivos Reais

1. **Onisciência contextual bidirecional** — o Stage fala com o chat e o chat fala com o Stage
2. **Voice com memória de contexto visual** — falar sobre uma imagem que está no Stage, em tempo real
3. **Sem lock-in de cloud** — tudo local, tudo controlável
4. **Multi-model routing inteligente** — usa o modelo certo para cada tarefa

### Fraquezas Competitivas

1. **Zero colaboração** — tudo persiste apenas localmente, não é possível compartilhar projetos
2. **Sem exportação estruturada** — não há forma de exportar um projeto completo com todos os assets
3. **Dependência total do Google** — Gemini em tudo. Um outage ou mudança de preço da API afeta 100% da funcionalidade

---

## 6. Mapa de Prioridades

### 🔴 Urgente — Tech debt / bugs que afetam confiabilidade

| # | Item | Arquivo | Impacto |
|---|---|---|---|
| 1 | **TC-3:** Corrigir query Dexie para buscar as 15 últimas mensagens | `useGeminiLive.ts` | Contexto de voz incorreto |
| 2 | **TC-1:** Avisar usuário quando Search Mode desativa ferramentas de Stage | `geminiService.ts` + UI | Comportamento silenciosamente errado |
| 3 | **TC-7:** Adicionar `try/catch` nos handlers de Studio | `App.tsx` | Crashes silenciosos |
| 4 | **UV-2:** Renderizar o `volume` como indicador de microfone | `TaliaCorePanel.tsx` | Feedback de input ausente |

### 🟡 Alta Prioridade — Produto e UX

| # | Item | Arquivo | Impacto |
|---|---|---|---|
| 5 | **UV-3:** Estado "conectando..." no botão de voz | `TaliaCorePanel.tsx` | Clareza de UX |
| 6 | **GP-1:** Empty state do Stage com drop zone e call to action | `StageCanvas.tsx` | First-run experience |
| 7 | **GP-2:** Ativar o Modo Tradutora na criação de sessão | `App.tsx` + sidebar | Feature invisível |
| 8 | **TM-1/2:** Normalizar `AssetCategory` e `source` (remover duplicatas) | `types.ts` | Debt acumulado |

### 🟢 Backlog Estratégico

| # | Item | Impacto |
|---|---|---|
| 9 | **GP-3:** Implementar Archives na sidebar | Feature completa mas oculta |
| 10 | **UV-6:** Layout responsivo mínimo (tablet) | Alcance de público |
| 11 | **GP-5:** Indicador de saúde da API Key | Confiança do usuário |
| 12 | Exportação de projeto (ZIP com assets + histórico) | Valor de produto |

---

## 7. Síntese Final

**Talia.ai é um produto com alma e visão clara, construído com rigor técnico acima da média — mas ainda em modo "laboratório".**

O que existe aqui é um **núcleo funcional muito sólido**: a integração Live de voz com contexto de Stage, o roteamento multi-modelo, a persistência local elegante e a identidade visual coesa são genuinamente impressionantes.

Os problemas existentes são de **maturação**, não de conceito:
- Alguns dead code e features incompletas
- Alguns bugs silenciosos que não explodem mas degradam a experiência
- Ausência de onboarding e estado vazio tratado

**O produto está pronto para o próximo nível.** A próxima fase deveria focar em **fechar os loops abertos** (Tradutora, Archives, Stage empty state) e **polir a confiabilidade silenciosa** (try/catches, query correta, feedback de microfone).
