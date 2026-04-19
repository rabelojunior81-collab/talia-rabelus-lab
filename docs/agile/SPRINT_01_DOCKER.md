# Metodologia Ágil - Documentação
## Sprint 1: Dockerização Multi-Ambiente (Talia AI)

### 1. Resumo Executivo
Este documento formaliza a arquitetura e a metodologia implementada para a Sprint 1, cujo foco principal foi desacoplar as configurações locais de desenvolvimento migrando a aplicação Talia AI para um ecossistema Docker escalável.

### 2. Kanban da Sprint
A implementação segue etapas atômicas (Plano Molecular), onde cada arquivo base da infraestrutura representa uma tarefa individual e revisável.

**Sprint Goal**: Empacotar a aplicação React/Vite em Containers Docker híbridos dev/prod, provendo aos engenheiros a capacidade de iniciar o sistema limpo via `docker-compose up` independentemente de usarem Windows ou macOS.

**Critérios de Aceite:**
1. Servidor *Vite* isolado mas permitindo **Hot-Reload** (Reflexão imediata de código alterado visualmente).
2. Capacidade de empacotar o software final minimizado (`dist`) via *Nginx* para cenários de Produção usando imagem enxuta e separada.
3. Tratamento explícito das exclusões (`.dockerignore`).

### 3. Entregáveis da Sprint (Artefatos Gerados)
- `Dockerfile.dev` -> Ambiente imutável de Desenvolvimento.
- `Dockerfile` -> Pipeline de Empacotamento Multi-Stage p/ Produção.
- `nginx.conf` -> Configuração de roteamento local de SPA (Fallback 404).
- `docker-compose.yml` -> Perfil Oficial (Foco Dev/Hot-Reload).
- `docker-compose.prod.yml` -> Perfil Produtivo de Homologação.
- `.env.example` -> Controle padronizado de tokens privados da API Gemini.

### 4. Responsáveis e Rastreabilidade
- **Branch Associada**: `feature/sprint-1-dockerization`
- **Revisão e Merge**: Dependente da Validação Final dos logs de subida do Container.
