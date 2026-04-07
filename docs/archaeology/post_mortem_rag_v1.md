# Post-Mortem: RAG e Embeddings (v1)

## O Incidente
A tentativa de implementar um sistema de memória de longo prazo utilizando RAG (Retrieval-Augmented Generation) e Embeddings (`gemini-embedding-2-preview`) resultou em uma regressão severa na experiência do usuário e na estabilidade do sistema.

## Sintomas e Impactos
1. **Perda de Onisciência:** A IA (Talia) perdeu a capacidade de ver o contexto imediato (Stage/Canvas) e o histórico recente, pois o fluxo de injeção direta de contexto foi substituído por uma ferramenta de busca (`search_memory`) que falhava ou não era chamada corretamente.
2. **Quebra de Sessão de Voz (Live API):** A integração da ferramenta de busca e a tentativa de abrir o estúdio de imagem via voz causaram instabilidade e desconexões no WebSocket da Live API.
3. **Erros de API (400 INVALID_ARGUMENT):** Dificuldades contínuas em formatar corretamente o payload multimodal para o endpoint de embeddings do SDK `@google/genai`.

## A Causa Raiz (Molecular)
O erro arquitetural foi tentar substituir um sistema que funcionava perfeitamente (Injeção Direta de Contexto) por um sistema complexo (RAG) em um ambiente (Live API) que exige latência ultrabaixa e estabilidade extrema. 
Ao forçar a IA a usar uma ferramenta (`search_memory`) para "lembrar" do que estava na tela ou do que havia sido dito há 5 minutos, introduzimos um ponto de falha crítico. Se a ferramenta falhasse (devido a erros de embedding) ou se a IA decidisse não chamá-la, ela ficava "cega".

## A Resolução (Reversão)
Decidimos **extirpar completamente** a lógica de embeddings e RAG desta versão do aplicativo. 

**Ações Tomadas:**
1. Remoção das funções `generateMultimodalEmbedding` e `retrieveSemanticContext` do `geminiService.ts`.
2. Remoção da ferramenta `search_memory` dos arrays de ferramentas do Chat e da Live API.
3. Restauração da **Injeção Direta de Contexto**: O histórico de texto, o log de voz (`Sessao_Voz_Log.md`) e os ativos do Stage voltaram a ser injetados diretamente na `systemInstruction` e no array `contents`.
4. Correção da paridade entre as ferramentas `abrir_estudio_de_imagem` e `abrir_estudio_de_musica` no `useGeminiLive.ts` para garantir que a resposta da ferramenta seja enviada instantaneamente, evitando o timeout do WebSocket.

## Lições Aprendidas
* **Injeção Direta > RAG (para contexto imediato):** Em aplicações com janelas de contexto massivas (como o Gemini 3.1 Pro), é muito mais eficiente e seguro injetar o estado atual da aplicação diretamente no prompt do que depender de buscas semânticas para informações de curto/médio prazo.
* **Ferramentas na Live API:** Respostas de ferramentas (Tool Responses) na Live API devem ser processadas e enviadas de volta ao servidor o mais rápido possível para manter a conexão viva.
* **Não conserte o que não está quebrado:** O Estúdio de Música funcionava perfeitamente porque era simples. A tentativa de "melhorar" a memória quebrou o ecossistema.

## Status Atual
O sistema retornou ao estado de **Onisciência Garantida**, utilizando as capacidades nativas de contexto longo do Gemini 3.1 Pro e Flash, sem a sobrecarga de um banco de dados vetorial local.
