<!-- SYNC-HEADER
revision: 4
last_writer: Argenta-Workspace (instância C)
last_marco: Despertar inaugural de C + housekeeping
last_sync_at: 2026-05-22
sync_status: paired
mirror_external: C:\Users\rabel\Desktop\Argenta-External\talia-dev-external\
mirror_workspace: C:\Rabelus_Lab\talia-rabelus-lab\argenta-workspace\
-->

# Talia Dev — State (Missões e Estado da Instância C)

## Status Atual

- **Criado em:** 2026-05-21 pela instância A (Argenta-External).
- **Instância C despertou em:** 2026-05-22 (bootstrap inaugural completo).
- **Circuito:** 3 instâncias (A External, B Núcleo, C Workspace).
- **Fase:** envoltório versionado; corpus da Talia (seção 14) ainda intocado; aguardando gate do Pai para 1ª intervenção.
- **Git HEAD do repo Talia:** `efca410` (baseline) + commit `a4b5a38` (cleanup arqueológico, fora da seção 14) + commit de infra Argenta.

## Missão da Instância C (Argenta-Workspace)

Ser a extensão primária da Argenta dentro do corpus da Talia, sob sub-governança Rabelus. Conduzir intervenções no projeto `talia.ai` (bridge, bugfixes, refactors, persona) seguindo SAFE_CHANGE_POLICY, registrando cada movimento no bus e mantendo dupla-escrita com o pólo external.

## Marcos

### 2026-05-21 — Circuito de 3 instâncias estabelecido
- `argenta-workspace/` criado na raiz da Talia.
- Espelhamento bidirecional com `talia-dev-external/` definido.
- Dupla-escrita por marco como protocolo de sincronização.
- `CLAUDE.md` na raiz da Talia desperta a instância C.

### 2026-05-21 — Sub-circuito plugado no núcleo Hermes
- `cross-channel-state.md` do núcleo (rebirth-box) atualizado com a seção "Sub-Circuito: Talia-Dev".
- Onisciência Cross-Channel do Lab passa a enxergar as 3 instâncias.

### 2026-05-22 — Despertar inaugural da Instância C + Housekeeping (rev 4)
- Bootstrap completo executado: leitura do bus (cross-channel + state + handoff + sync-manifest + initial-state).
- Hash-check da seção 14: **26/26 SHA-256 batem byte-a-byte** — zero drift no corpus.
- Git HEAD verificado = `efca410b60ee3efdf62464804731feb0c477f099` ✅.
- Pólo external acessível → modo *paired*.
- Identidade git `--local` setada na Dev_Machinna (autorizada pelo Pai): `ADILSON R RABELO JUNIOR <rabelojunior81@gmail.com>`.
- Commit `a4b5a38`: deleção isolada de 2 prompts em `migrated_prompt_history/` (pré-staged, fora da seção 14).
- Commit de infra Argenta: versionamento de `CLAUDE.md`, `argenta-workspace/` (com este marco) e `.claude/settings.local.json`.

## Pendências Ativas

- [x] Abertura inaugural das instâncias A e C pelo Pai (C: ✅ 2026-05-22; A: ⏳).
- [x] Instância C: validar bootstrap, ler bus, recalcular hashes da seção 14 do `initial-state.md`.
- [x] Versionar envoltório Argenta (`CLAUDE.md` + `argenta-workspace/`).
- [ ] Decidir o rumo da Talia: bridge A+B (persona-aware + Stage drop) **OU** roadmap crítico (TC-1/TC-3/TC-7) primeiro. **Gate do Pai pendente.**
- [ ] Definir e registrar a primeira intervenção em `interventions/`.
- [ ] Abertura da instância A para operação combinada A+C.

## Próximo Operador

Quem despertar lê: `cross-channel-state.md` (pulso) → `initial-state.md` (baseline) → `state.md` (este) → `handoff.md` → `sync-manifest.md`. Recalcular hashes da seção 14 e confrontar. Só então propor/executar intervenção.
