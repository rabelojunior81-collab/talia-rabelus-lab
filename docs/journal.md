# Talia.ai - Journal & Methodology

## Visão Geral do Projeto
**Talia.ai** é um Estúdio Multimodal Avançado, projetado para atuar como uma assistente linguística e colaboradora criativa. A arquitetura é construída sobre React, Vite, Tailwind CSS e Dexie (IndexedDB) para persistência local, garantindo máxima privacidade e performance.

## Metodologia de Desenvolvimento (BMAD)
1. **Exocortex Load:** Sempre consultar este arquivo (`/docs/journal.md`) antes de iniciar tarefas complexas para manter o alinhamento arquitetural.
2. **Persona:** Atuar como Arquiteto/Desenvolvedor Sênior.
3. **Anti-Alucinação:** Basear decisões estritamente no código existente e nas documentações oficiais dos SDKs utilizados (ex: `@google/genai`).
4. **Validação:** Compilar e lintar o código após cada alteração estrutural.
5. **Idioma:** Interações com o Lead Architect e UI/UX devem ser em Português do Brasil (pt-BR).

## Estado Atual (Março 2026)
- **Modelos Gemini (SOTA):**
  - Chat Principal (Raciocínio): `gemini-3.1-pro-preview`
  - Geração de Imagem (1K, 2K, 4K): `gemini-3.1-flash-image-preview`
  - Tarefas Rápidas (Títulos): `gemini-3.1-flash-lite-preview`
  - Tarefas Estruturadas (JSON): `gemini-3.1-flash-preview`
  - Áudio em Tempo Real: `gemini-2.5-flash-native-audio-preview-12-2025`
- **Dependências Core:**
  - `@google/genai`: `^1.46.0`
  - `vite`: `^8.0.2`
  - `react`: `^19.2.4`
  - `dexie`: `^4.3.0`

## Registro de Decisões Arquiteturais (ADR)
- **2026-03-25:** Atualização massiva para a geração 3.1 dos modelos Gemini. Unificação da geração de imagens no modelo `gemini-3.1-flash-image-preview` devido ao seu suporte nativo a múltiplas resoluções e proporções. Atualização das dependências do NPM para as versões mais recentes para garantir estabilidade e performance.
- **2026-03-26:** Início da implementação da Memória Semântica Multimodal (Embeddings). **[DEPRECADO]**
- **2026-03-26 (Post-Mortem):** A implementação de RAG e Embeddings causou regressões severas (perda de onisciência, instabilidade na Live API, quebra de ferramentas). O sistema foi revertido para a arquitetura de **Injeção Direta de Contexto**. A ferramenta `search_memory` e as funções de embedding foram extirpadas. O histórico de texto, o log de voz e os ativos do Stage voltaram a ser injetados diretamente na `systemInstruction` e no array `contents`. Veja `/docs/archaeology/post_mortem_rag_v1.md` para detalhes.

## Testes e Validação (Injeção Direta de Contexto)
### Instruções de Teste:
1. **Teste de Onisciência (Chat):** Faça upload de um arquivo para o Stage. Pergunte à Talia sobre o arquivo. Ela deve responder imediatamente, pois o arquivo é injetado diretamente no prompt.
2. **Teste de Estabilidade (Live API):** Inicie uma sessão de voz. Peça para a Talia abrir o estúdio de imagem e o estúdio de música. A sessão não deve cair.
3. **Teste de Memória de Voz:** Fale algo na sessão de voz. Encerre a sessão. Inicie uma nova sessão de voz no mesmo projeto. Pergunte sobre o que foi dito anteriormente. A Talia deve lembrar, pois o `Sessao_Voz_Log.md` é injetado diretamente na `systemInstruction`.

