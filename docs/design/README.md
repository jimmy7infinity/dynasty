# Design corpus

This directory is the canonical design source of truth for Dynasty.

It is **not** an implementation spec. Do not put code, schemas, smart contracts, tech-stack choices, or UI component inventories here.

A later agent with only this repository (no prior chat) should be able to reconstruct: what Dynasty is, what is constitutional, what is decided, what experiments showed, what is provisional, what is rejected, what is OPEN, and what must not be invented.

## How to use this corpus

1. Read `principles.md` before proposing a system. If a proposal violates a principle, it is rejected or the principle must be changed explicitly.
2. Check `status.md` before treating an idea as a requirement. **PROVISIONAL** is not a decision. **OPEN** is not a gap to fill with invention. Experiment **ESTABLISHED** in `architecture.md` is not a `status.md` LOCKED row.
3. Write new design into the document that owns that domain. Do not scatter the same rule across files.
4. Record unresolved questions in `questions.md`. Do not silently answer them in another document.
5. Update `status.md` when a question is actually decided.
6. Treat `architecture.md` as **synthesis** of the current architectural model. If it conflicts with `principles.md` or `status.md`, name the conflict; do not silently upgrade architecture examples into constitution.

## Precedence (conceptual)

1. `principles.md` — constitutional constraints  
2. `status.md` — canonical decision/status register  
3. Domain-owning documents — definitions and domain rules  
4. `architecture.md` — synthesis / current architectural model  
5. Experiment evidence (summarized in `architecture.md` Part I) — empirical support, not protocol law  
6. `questions.md` / `AUDIT.md` — unresolved space and historical workspace notes  

Do not mechanically override a domain definition with a higher-level slogan if they are different abstraction layers. If inconsistent: contradiction, stale index, different layer, provisional synthesis, or unresolved boundary — say which.

## Status legend

| Status | Meaning |
| --- | --- |
| LOCKED | Non-negotiable unless we explicitly reopen it (`status.md` / principles). |
| ESTABLISHED | Repeatedly observed in experiments; binding for architecture unless reopened; **not** automatically LOCKED. |
| PROVISIONAL | Directional idea or working model. Useful. Not an implementation requirement. |
| OPEN | Undecided. Must not be treated as designed. |
| EXPLORATORY | Thought experiment or candidate. |
| REJECTED | Must not be reintroduced as the base model. |
| SUPERSEDED | Older teaching that must not be used as current architecture. |

## Suggested reading order

1. This file  
2. `principles.md`  
3. `status.md`  
4. `domain.md`  
5. `world.md` → `control.md` → `control-transitions.md` → `intents.md` → `play.md`  
6. `value.md` → `economic-engine.md` → `external-demand.md`  
7. `architecture.md` (synthesis; financing Parts XV–XVII; experiments Part I)  
8. `questions.md`  
9. `AUDIT.md` (historical workspace plan; not the current index)  
10. `DIGEST.md` only as optional orientation; never as a substitute for the files above

## Documents (what exists)

| File | Responsibility |
| --- | --- |
| `README.md` | Index, corpus rules, reading order. |
| `principles.md` | Constitutional principles. Highest-level locked constraints. |
| `status.md` | Canonical LOCKED / PROVISIONAL / OPEN register and decision log. |
| `questions.md` | Unresolved design questions. Does not answer them. |
| `domain.md` | Kernel: Entity, Relation, Intent, Occurrence, Domain. Not the full game. |
| `world.md` | Situated World model (Places, Sites, `connects`, presence, access). Control *meaning* is filled in `control.md`. |
| `control.md` | Operational authority (`control` relation). Not acquisition mechanics. |
| `control-transitions.md` | How `control` may change. Sharing/delegation/authorized issuer **mechanism OPEN**. |
| `intents.md` | Intent / Action / Result semantics and home routing. |
| `play.md` | Observe–choose–act loop; what Play must not assume about value. |
| `information.md` | Knowledge, Intel, fog, discovery ≠ control. |
| `conflict.md` | Opposition over World relations; not steal-deposits. |
| `events.md` | World-evolution occurrences; not a lottery. |
| `time.md` | Time/presence/clock problem space. Clock **OPEN**. |
| `offline.md` | Offline / absence vs `control` and production. |
| `production-while-away.md` | Offline production as World transformation, not hidden S. |
| `value.md` | W/P/E/S books; World ≠ money; RVI requirement vs unspecified sources. |
| `economic-engine.md` | Causal economic model; P2P ≠ RVI; token=0 test. |
| `external-demand.md` | External value / revenue question. **No product selected.** |
| `architecture.md` | Post-experiment synthesis (v0.1.2). Current architectural model. Not an implementation plan. Does not close OPEN items. |
| `AUDIT.md` | 2026-09-03 design audit and workspace plan, plus later provenance notes. Living historical material. **Not** the status register. |
| `DIGEST.md` | Fresh-agent handoff extract. **Not** architecture. **Not** in the precedence chain. Corpus files above remain authoritative. |

Do not invent additional files to make this list look complete. Do not treat `DIGEST.md` as a source of new decisions.

## Explicitly rejected (do not “complete” the design with these)

- NPC buyers / NPC demand engines  
- Spendable senior DLP as ordinary Project opex (superseded `10/1/6` leftover-priority model)  
- Protocol appraisal of World objects into DLP  
- Token faucets, inflationary mining, idle-collect emissions, circular treasury/token loops  
- XP / classes / numerical mastery levels  
- Treating ESTABLISHED experiments as LOCKED protocol law  
- Inventing RVI, DYN tokenomics, settlement math, redemption, orgs, or authorization mechanics because they are OPEN  

## Rules for contributors (human or model)

- Do not write game code until the core systems named in `AUDIT.md` / `status.md` are coherent enough to implement a vertical slice.
- Do not invent tokenomics, revenue splits, drop rates, marketplaces, or settlement waterfalls.
- Do not convert examples into mechanics.
- Prefer modular domain contracts over feature lists.
- A new system must eventually answer: player problem, gameplay created, economic effect, failure modes, dependencies, what it makes harder, principle conflicts.
- If something is unresolved, write **OPEN**. Do not assume an answer.
