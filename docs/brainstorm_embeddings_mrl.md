# Brainstorm: Redução de Dimensões no Gemini Embedding 2 (MRL)
**Data:** 26 de Março de 2026
**Tópico:** Por que reduzir de 3072 para 768 dimensões no banco de dados local da Talia?

## O Conceito: Matryoshka Representation Learning (MRL)
O modelo `gemini-embedding-2-preview` é treinado com a técnica MRL (inspirada nas bonecas russas Matryoshka). Isso significa que a informação semântica mais importante e densa está "empacotada" nas primeiras dimensões do vetor. Cortar o final do vetor descarta apenas nuances mínimas, preservando a essência do significado.

## Vantagens da Redução (768 dimensões) para a Arquitetura Local da Talia:

1. **Economia de Armazenamento (IndexedDB):** 
   Um vetor de 3072 floats (32-bit) pesa cerca de 12KB. Reduzindo para 768, o peso cai para ~3KB (uma redução de **75%**). Como estamos rodando o banco de dados *no navegador do usuário* (IndexedDB), essa economia é vital para não estourar a cota de armazenamento local a longo prazo.

2. **Velocidade de Busca e Processamento (CPU):** 
   A busca semântica local exige calcular a "Similaridade de Cosseno" entre o vetor da pergunta e *todos* os vetores salvos na memória. Fazer essa matemática com arrays 4x menores torna a busca exponencialmente mais rápida no JavaScript (Single Thread), evitando que a interface da Talia congele durante a busca.

3. **Consumo de Memória (RAM):** 
   Carregar milhares de memórias (vetores) para realizar o RAG consome RAM do dispositivo do usuário. Vetores menores garantem que a aba do navegador permaneça leve, fluida e não seja encerrada pelo sistema operacional (especialmente em celulares).

## Trade-off e Mitigação:
* **Perda de Qualidade:** Praticamente nula. Segundo a documentação, o score de precisão (MTEB) cai de 68.17 (1536d) para apenas 67.99 (768d).
* **Requisito Técnico Obrigatório:** Vetores truncados perdem a normalização nativa da API. Será obrigatório aplicar a normalização matemática (L2 Norm) no frontend antes de calcular a similaridade para garantir a precisão.
