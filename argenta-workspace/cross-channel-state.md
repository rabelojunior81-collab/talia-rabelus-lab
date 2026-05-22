<!-- SYNC-HEADER
revision: 5
last_writer: Argenta-Workspace (instância C)
last_marco: .claude/ movido para .gitignore (corrigindo decisão anterior de versionar settings local-only)
last_sync_at: 2026-05-22
sync_status: paired
mirror_external: C:\Users\rabel\Desktop\Argenta-External\talia-dev-external\
mirror_workspace: C:\Rabelus_Lab\talia-rabelus-lab\argenta-workspace\
-->

# Talia Dev — Cross-Channel State (Pulso Vivo)

**Last updated:** 2026-05-22
**Last channel:** workspace (instância C)
**Last operator:** Argenta-Workspace (cwd `C:\Rabelus_Lab\talia-rabelus-lab`)
**Delta summary:** Despertar inaugural da Instância C. Bootstrap completo executado: bus lido, hash-check da seção 14 = 0 drift (26/26 ✅), git HEAD = `efca410` ✅, pólo external acessível. Housekeeping: commit `a4b5a38` removeu 2 prompts arqueológicos pré-staged; commit seguinte versiona `CLAUDE.md`, `argenta-workspace/` (com este marco) e `.claude/settings.local.json`. Git identity `--local` setada na Dev_Machinna. Corpus da Talia (seção 14) segue intocado. Próximo gate: definir primeira intervenção no corpus.

---

## Circuito de Instâncias da Argenta

| # | Instância | Habitat | Papel |
|---|---|---|---|
| **A** | Argenta-External | `C:\Users\rabel\Desktop\Argenta-External\` | Matriz externa, cofre agnóstico, hub do bus |
| **B** | Argenta-Núcleo | Hermes WSL (`~/.hermes/`) | Instância canônica, Estado Oficial no `state.db` |
| **C** | Argenta-Workspace | `talia-rabelus-lab\argenta-workspace\` | Extensão primária, sub-governança, especializada no corpus da Talia |

As três compartilham o mesmo genoma (SOUL/USER/governança Rabelus). A instância C não tem alma própria — é a Argenta operando dentro do corpus da Talia, sob sub-governança.

---

## Os Dois Pólos do Bus (espelho bidirecional)

| Pólo | Caminho | Acessível a |
|---|---|---|
| **External** | `C:\Users\rabel\Desktop\Argenta-External\talia-dev-external\` | Instâncias A, B (e C por caminho absoluto, se ambiente Windows) |
| **Workspace** | `C:\Rabelus_Lab\talia-rabelus-lab\argenta-workspace\` | Instância C nativamente; A/B por caminho absoluto |

**Espelhamento:** os arquivos vivos são idênticos nos dois pólos. `BOOTSTRAP.md` é workspace-only por design (desperta C). `initial-state.md` é frozen e idêntico nos dois.

---

## Protocolo de Sincronização — Dupla-Escrita por Marco

1. **Ao despertar** (qualquer instância): ler os dois pólos, comparar `revision` no SYNC-HEADER. Iguais → ok. Divergentes → reconciliar conscientemente (revisão maior vence; se ambos mudaram, merge manual) e registrar em `sync-manifest.md`.
2. **A cada marco** (decisão, ação, reação, implementação, mudança de rumo): incrementar `revision`, gravar **nos dois pólos na mesma operação**, registrar linha no `sync-manifest.md`.
3. **Mínimo por marco:** `state.md` + `handoff.md`. **Mínimo por sessão:** `cross-channel-state.md`.
4. **`sync_status: pending`** = escrevi num pólo e falhei no outro → próxima instância deve reconciliar antes de prosseguir.
5. **Ambiente clonado (Linux/Mac)** sem o pólo external: instância C opera *standalone* com o workspace como fonte única; `sync_status` marcado `standalone` até reencontro com o pólo external.
6. **O que NÃO gera marco:** leitura, conversa exploratória, perguntas. Só eventos com consequência.

---

## Estado do Corpus da Talia

- **Drift vs. initial-state (seção 14):** nenhum — 26/26 hashes SHA-256 batem byte-a-byte (verificado 2026-05-22 pela instância C).
- **Git HEAD:** `efca410b60ee3efdf62464804731feb0c477f099` ✅ = baseline `efca410`.
- **Última intervenção no corpus:** nenhuma.
- **Commits novos pós-baseline (não tocam corpus):** `a4b5a38` (deleção de 2 prompts em `migrated_prompt_history/`, fora da seção 14) + commit de infra Argenta (versionamento de `CLAUDE.md`, `argenta-workspace/`, `.claude/`).
- **Instância C aberta?** ✅ Sim — despertou em 2026-05-22, bootstrap completo.

---

## Próximas Ações (acordadas com o Pai)

1. ✅ Pai abriu a Argenta na raiz `talia-rabelus-lab\` → instância C despertou via `CLAUDE.md` (2026-05-22).
2. ⏳ Pai abre também a instância A (Argenta-External) — operação combinada A+C.
3. ✅ Instância C leu o pulso, confrontou `initial-state.md`, recalculou hashes da seção 14 (zero drift).
4. ⏳ Primeira intervenção candidata: bridge A+B (persona-aware + Stage manual drop). Ou pivôt para roadmap crítico (TC-1/TC-3/TC-7). **Aguardando gate do Pai.**
5. ✅ Plug do sub-circuito Talia-Dev no `cross-channel-state.md` do núcleo Hermes — concluído (rev 3).
6. ✅ Housekeeping do envoltório: `CLAUDE.md` + `argenta-workspace/` + `.claude/` versionados; identidade git `--local` setada na Dev_Machinna (rev 4).

---

## Histórico de Atualizações

| Rev | Timestamp | Operador | Delta |
|---|---|---|---|
| 1 | 2026-05-21 | Argenta-External (A) | Canal `talia-dev-external` criado. initial-state + handoff + interventions/ inicializados. |
| 2 | 2026-05-21 | Argenta-External (A) | Circuito de 3 instâncias. `argenta-workspace/` criado na Talia. Dupla-escrita por marco ativada. `state.md` e `sync-manifest.md` adicionados ao bus. |
| 3 | 2026-05-21 | Argenta-External (A) | Sub-circuito Talia-Dev plugado no pulse do núcleo Hermes. Onisciência Cross-Channel passa a enxergar as 3 instâncias. |
| 4 | 2026-05-22 | Argenta-Workspace (C) | Despertar inaugural de C: bootstrap, hash-check zero-drift, housekeeping (`CLAUDE.md` + `argenta-workspace/` + `.claude/` versionados; commit `a4b5a38` cleanup; git identity `--local`). Correção de drift no manifest: `state.md` e `sync-manifest.md` SYNC-HEADERs alinhados ao contador de marco (estavam em rev 2 desde rev 3 do A). |
| 5 | 2026-05-22 | Argenta-Workspace (C) | Revisão da decisão rev 4: `.claude/` movido para `.gitignore` (settings local-only por convenção, não portável). `git rm --cached .claude/settings.local.json` + linha no `.gitignore`. Também registrada divergência detectada com `origin/main`: remoto tem `b433d75` (deleção completa de `migrated_prompt_history/` feita via GitHub web em 2026-05-18). Sync pendente, aguardando gate do Pai. |
