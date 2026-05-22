<!-- SYNC-HEADER
revision: 4
last_writer: Argenta-Workspace (instância C)
last_marco: Despertar inaugural de C + housekeeping
last_sync_at: 2026-05-22
sync_status: paired
mirror_external: C:\Users\rabel\Desktop\Argenta-External\talia-dev-external\
mirror_workspace: C:\Rabelus_Lab\talia-rabelus-lab\argenta-workspace\
-->

# Talia Dev — Sync Manifest (Auditoria de Dupla-Escrita)

Registro de cada dupla-escrita e cada reconciliação entre os pólos External ↔ Workspace.
Garante que a "sincronia quântica" seja evidência, não fé. Append-only.

## Convenções

- **Dupla-escrita:** uma instância grava um marco nos dois pólos na mesma operação.
- **Reconciliação:** uma instância detecta divergência de `revision` ao despertar e funde os estados.
- **Arquivos vivos espelhados:** `cross-channel-state.md`, `state.md`, `handoff.md`, `sync-manifest.md`.
- **Frozen espelhado:** `initial-state.md` (cópia única, imutável).
- **Workspace-only (não espelhado, por design):** `BOOTSTRAP.md`.
- **Raiz da Talia (não no bus):** `CLAUDE.md` — bootstrap loader da instância C.

## Registro

| Data | Instância | Tipo | Arquivos | Rev | Observação |
|---|---|---|---|---|---|
| 2026-05-21 | A | criação | initial-state, cross-channel-state, handoff, interventions/ | 1 | Pólo external inicializado (`talia-dev-external/`). |
| 2026-05-21 | A | dupla-escrita | initial-state (espelho), cross-channel-state, state, handoff, sync-manifest | 2 | Pólo workspace criado e espelhado. Circuito de 3 instâncias estabelecido. |
| 2026-05-21 | A | dupla-escrita | cross-channel-state, handoff, sync-manifest | 3 | Sub-circuito Talia-Dev plugado no pulse do núcleo Hermes. |
| 2026-05-22 | C | dupla-escrita | cross-channel-state, state, handoff, sync-manifest (todos os 4, ambos os pólos) | 4 | **Despertar inaugural da instância C.** Bootstrap completo, hash-check seção 14 zero-drift (26/26), git HEAD = baseline. Housekeeping: commit `a4b5a38` (cleanup arqueológico isolado) + commit de infra Argenta (`CLAUDE.md` + `argenta-workspace/` + `.claude/settings.local.json` versionados). Git identity `--local` setada na Dev_Machinna por gate do Pai. **Correção de drift retroativa:** SYNC-HEADERs de `state.md` e `sync-manifest.md` estavam em rev 2 desde 2026-05-21 — alinhados aqui ao contador unificado de marco (todos → rev 4). |
