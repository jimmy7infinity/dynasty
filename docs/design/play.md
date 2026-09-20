# Play

**Status:** Conceptual action/decision substrate. Not a verb list, combat spec, production system, economy, or UI.  
**Kernel:** Entity · Relation · Intent · Occurrence · Domain. **No sixth primitive.**  
**Depends on:** `domain.md`, `world.md`, `information.md`.  
**Does not close:** clock (O2), verb catalog (O9), combat, production, markets, fees, token, lottery, backstop mechanics, duration numbers.

Constitutional loop (P9):

> OBSERVE → CHOOSE → ACT → RESULT → RESPOND

This document is the smallest model under that loop. It is **not** a universal rules engine that contains the game.

---

## 1. Play as a decision system

A **meaningful action** is a choice made under **incomplete information**, with **commitment**, that **some domain may refuse**, after which **the world (and the actor’s knowledge) are not as they were**, and **another choice remains** (P13).

It is not: a timer completing, a claim button, a forced unique path, or “spend capital → auto-win.”

### What a generic attempt contains

Kernel **Intent** already has: **issuer**, **home domain**, **kind**, **subject references**, **correlation**.

Play does **not** add cost, risk, duration, or requirements as kernel fields (status V7 remains unused). Those are **domain-specific** at eligibility and resolution.

| Dimension | In the generic model? | Where it lives |
| --- | --- | --- |
| Issuer | Yes (Intent) | Entity the home domain accepts |
| Attempted kind + subjects | Yes (Intent) | Kind owned by home domain |
| Available information | **Before** Intent | Information + World **queries** (observe) |
| Requirements / eligibility | Not an Intent field | Home **policy** + **queries** to other domains |
| Commitment / cost / exposure | Not generic fields | Home domain (and others via Occurrences) |
| Resolution | Home domain procedure | §7 |
| Resulting state | Only in **homes** that accept follow-on work | Each Domain’s store |
| Occurrences | After material change | Kernel Occurrence |
| Resulting information | Information domain | Intents/queries, not Play writing Intel |

**Minimize:** the decision object is **Intent**. Everything else is query, policy, or another domain’s state.

Play is **not** required to be a fat Domain with its own ontology. If a Play domain exists later, it should own at most: issuer-facing **eligibility projections** and correlation of in-flight Intents. It must not own World, Intel, lots, or settlement.

---

## 2. Intent (pressure test)

**What it represents.** An **attempted change addressed to one home domain** — “try to do K to these subjects,” not “make the world become desired state S.” Desired-state Intents would turn Play into a planner and hide the actual verb.

**Who can issue.** Any **entity** the receiving domain treats as an issuer (`domain.md` actor-as-role). Player, future org, protocol actor, sponsor — kinds remain OPEN. Presentation is never an issuer of record; the client submits on behalf of an issuer.

**Desired state vs attempted action.** **Attempted action.** The home domain interprets kind + subjects.

**Does Intent itself change state?** **No.** An Intent is a request. State changes only when a home domain **accepts** and **applies** (in-flight aggregate and/or canonical mutation).

**When it becomes an “action.”** When the home domain **accepts** it (immediately resolving or taking it in-flight). Rejected / ineligible Intents are **not** actions; they are refused requests. See §3.

**Can it fail?** **Yes.** Eligibility failure (never accepted) and resolution failure (accepted, then fails or partial) are different (§10).

**Withdraw?** **OPEN.** Conceptually allowed only while in-flight and only if the home domain’s policy permits; not a kernel operation.

**Opposed by another actor?** Not a property of Intent. Opposition is **other Intents** (typically Conflict) against the same subjects. Do not design interrupt math here.

---

## 3. Intent vs Action vs Result vs Occurrence

Do **not** stack: Intent → Action → Event → Result → Outcome → Occurrence.

| Name | Kind | Meaning |
| --- | --- | --- |
| **Intent** | Kernel primitive | Request to one domain |
| **Action** | **Not a primitive.** The **accepted execution** of an Intent (in-flight or finished) | Player-facing word for “what I committed to” |
| **Result** | **Not an object.** The **state delta** in home domain(s) after resolution | What is now true in canonical stores |
| **Occurrence** | Kernel primitive | Published **that something happened** (including refusals, if a domain chooses to publish) |

**Action = execution of an Intent.** If we stored a separate Action entity for every Intent, we would duplicate the kernel.

**Result ≠ Occurrence.** Result is the new canonical facts. Occurrence is the fan-out notice. Projections (influence, stale Intel) update from sources; they are not a fifth name for result.

**Requested outcome** is implied by kind — not a separate document the player files.

No new primitive.

---

## 4. Requirements

Requirements are **not** a bag of properties on Intent.

They are **policies of the home domain**, evaluated using **queries** (and the home domain’s own state).

| Might depend on | How, conceptually |
| --- | --- |
| Capability | Identity / Technology **query** or policy: may this issuer use kind K? |
| Information | Information **query**: `knowledge-of` / `holds` — not World truth |
| Access, location, presence | World **query** |
| Resources, lots | Production / Logistics **query** |
| Relationships, contracts | Those domains’ **queries** |
| Capital | Capital **query** — must not auto-win (§11, P11) |
| Tools | Entity refs the home domain understands |
| Timing | OPEN clock; if used, home policy, not a Play timer |

**No internal inspection.** World does not open Information’s store; Information does not read World aggregates. Each answers its **published queries**.

Ineligible → **blocked**, not a failed action (§10).

---

## 5. Cost, commitment, exposure, loss

Vocabulary for later domains. **Not formulas.**

| Term | Meaning | When it bites |
| --- | --- | --- |
| **Cost** | Something **consumed** as part of attempting or resolving | At accept, during, or at resolve — **home domain defines**. May apply on failure. |
| **Commitment** | Something **reserved / locked**, not yet consumed; **may be released** | While in-flight; release on cancel/fail if policy says so |
| **Exposure** | Contextual **possibility** that later Intents/Occurrences may affect a record (`domain.md`) | From **accept** until a later resolution, or while in a context (in transit, present-at) |
| **Loss** | Exposure **realized** — actual mutation (damage, steal of a *non-settlement* relation, destroy seasonal entity, …) | When Conflict/World/etc. apply an effect |

An action may: cost without exposure; expose without immediate cost; commit then cost; cost **and** fail. Play does not pick patterns per verb.

Play **must not** encode “all actions cost tokens” or “failure is free.”

---

## 6. Exposure (actions)

Risk is **not** SAFE/RISKY/INSANE on the verb (V13 unused).

Exposure of a record during an attempt may arise from:

- the **kind** (home domain declares what it exposes)
- **subjects** (this Site, this lot)
- **context** (Place conditions, `present-at`, in-transit)
- issuer’s **other relations** (not Play’s to invent)
- **timing** / external conditions (OPEN)

Play’s job: the home domain may **declare exposure** (which records, which later occurrence kinds) when it **accepts**. Conflict and others **subscribe**; they do not receive a license to write the home store.

No raid design.

---

## 7. Resolution

Conceptual stages — **not** a global RNG vs determinism choice:

1. **Requested** — Intent issued.  
2. **Eligible / ineligible** — home policy + queries. Ineligible = blocked.  
3. **Accepted** — now an action (possibly in-flight).  
4. **Resolution** — home procedure: immediate, condition-gated, or uncertain. **Method OPEN** (O9).  
5. **Resulting state** — home (and only homes that accepted follow-on Intents) mutated.  
6. **Occurrences** — material happened-facts published.

**Requested ≠ resulted.** Partial and unintended results are allowed (§10).

Immediate vs delayed vs “wait for world” is **not** chosen globally. Clock remains OPEN. In-flight state lives in the **home domain** (ephemeral aggregate), not in Play as a timer service.

---

## 8. Time (acknowledge, do not define)

Play **must not** assume a clock, and **must not** assume everything is instant.

Agnostic shapes (all legal until O2):

| Shape | Meaning |
| --- | --- |
| Immediate | Accept and resolve in one step |
| In-flight | Accepted; canonical result later |
| Interruptible | Other Intents may affect in-flight (Conflict later) |
| Condition-gated | Resolves when World/Event conditions hold — **not** “come back tomorrow to claim” |
| Scheduled | OPEN; easy to abuse as wait-walls |

**P9:** duration is allowed only if it **creates decisions** (exposure, commitment, opportunity cost, intercept, logistics, coordination, changing conditions) — not because a bar is filling.

Idle-claim (“wait then harvest with no choice”) is **ineligible as a design** even if technically delayed.

---

## 9. The loop

| Stage | Conceptual content | Not |
| --- | --- | --- |
| **Observe** | Issuer-scoped World **observable slice** + Information `knowledge-of` / `holds` + other **published** projections | Canonical world dump; omniscience |
| **Choose** | Pick an **eligible** Intent kind + subjects under that information | A hidden optimal action the UI highlights as truth |
| **Act** | Issue Intent; home **accepts** (commitment/cost/exposure per that domain) | Client-side rule execution |
| **Result** | State deltas + Occurrences; Information may update via its own Intents/reactions | UI animation as rules |
| **Respond** | New observe; new eligible set; **some** meaningful Intent remains (P13) | Dead end; “log in tomorrow” |

**Is the loop sufficient?** **Yes** as the universal *player* model. Eligibility is part of Observe/Choose (query “what can I attempt?”), not a sixth stage. In-flight is Act still unresolved, then Result later — still the same loop, possibly nested.

Do not map this to screens.

**Composition:** one player decision is **one Intent to one home**. Cross-domain effects are **queries during eligibility/resolution** and **Occurrences → other domains’ Intents**. Do not mandate a fixed pipeline (World then Information then Economy). Example: observe-home Information **queries** World, then writes Intel — one Intent, two domains, no god sequencer.

---

## 10. Failure and no dead ends

| Kind | Meaning |
| --- | --- |
| **Impossible** | Kind not offered to this issuer (policy). Not an attempt. |
| **Blocked** | Intent issued but **ineligible** (missing access, etc.). Nothing committed, or only a refusal Occurrence. |
| **Failed** | Accepted, resolution does not achieve the requested kind. **Something may still have happened** (cost, exposure, partial, information). |
| **Partial** | Some subjects/effects applied. |
| **Costly** | Cost or loss even on “success” or failure. |
| **Unintended** | Result outside the requested kind’s expected delta (World/Events). |

Failed ≠ “nothing happened.” Failed ≠ dead end.

**P13** is a constraint on the **eligible set after Result**, including defeat, zero capital, empty markets (P14 — how guaranteed is OPEN). Play does not invent the backstop; it **forbids** a resolution that leaves **no** meaningful eligible Intent.

Capital must not be the only remaining “action” if that action is pay-to-continue as a gate (P11/P14). Details OPEN.

---

## 11. Agency

Preserve: choice under **asymmetric information**, **tradeoffs** (cost vs exposure vs time-when-defined), **multiple viable kinds** (P5, P21 — no class tree).

Do **not:** fixed action tree, class kits, “every verb is a number,” capital as hidden DC that always succeeds, or a single optimal path the spreadsheet finds because Observe was full information.

Observe is **incomplete by default** (`information.md`). Choosing with wrong Intel is valid play.

---

## 12. Economic consequences without an economic action kernel

**Action ≠ economic transaction.**

```
Intent → home domain resolution → state + Occurrences
                                      ↓
                    Economy / Capital / Protocol may react
                    (their Intents, their settlement)
```

A future kind **may** create/consume/transfer claims, expose assets, open contracts, levy fees, touch productive capacity, mint Intel of economic class, or interact with external capital — **only in the domains that own those records**.

Play/generic Intent **must not** contain fee schedules, token moves, or “this is a payable.”

If settlement is required, that is a **separate Intent to Protocol/Capital**, triggered by policy or by an Occurrence, not a side effect buried in a World write.

---

## 13. Real value — what Play must not assume

P17 is **not** implemented here.

Play **must not** assume:

- P2P transfers **are** REAL VALUE IN  
- deposits **are** revenue  
- token price **is** value creation  
- scores, loot, or Intel **are** settlement-grade value  
- issuing an Intent **is** an on-chain transaction  

Later domains must keep three books distinct:

| Book | Home (typical) |
| --- | --- |
| Game consequences | World, Information, Production, Conflict, … |
| Economic settlement | Protocol / Capital |
| External value creation | Sponsorship / treasury / named inflows — OPEN (`value.md`) |

Play only delivers **Occurrences and state deltas**. It does not certify value.

---

## 14. Actions across domains

A meaningful decision **may** touch many domains. It **must not** be one Intent that mutates all of them.

**Composition surface = Intent + Occurrence + Query** (`domain.md`).

Other domains do not know the UI. They know kinds, queries, and Occurrences.

No prescribed sequence. Typical **legal** pattern: home accepts → mutates self → publishes → others **may** issue Intents. Information observation: Information is home, **queries** World, mutates Information.

---

## 15. Command / query / occurrence

| Mechanism | In the conceptual play model? |
| --- | --- |
| **Command** | Yes = Intent |
| **Query** | Yes = observe + eligibility + verify |
| **Occurrence** | Yes = result fan-out |
| **Policy** | Yes = home-domain eligibility/resolution rules (not a kernel object) |
| **Capability** | Optional pattern for “issuer may K” — Identity/etc., not required to start |

Implementation buses are not Play.

**Audit:** material accepts, results, and settlements should be **reconstructable from Occurrences + home records**. Game action logs are not automatically chain settlement (P29).

---

## 16. No wait walls — when duration is legitimate

Duration is **not** banned. **Meaningless** duration is banned.

Legitimate later (choose none now): exposure while in-flight; commitment locked; opportunity cost vs other Intents; world/events changing under you; interception; logistics along `connects`; coordination with other issuers.

**Illegitimate:** login-wait-claim; empty progress bar as content; blocking the only remaining move until a timer (that **is** a dead end / wait-wall).

If in-flight exists, **Respond** must still offer **other** meaningful Intents (or the in-flight itself must be a real decision, e.g. cancel/defend — OPEN).

---

## 17. Minimization test

| Concept | Verdict |
| --- | --- |
| Intent | **Keep** (kernel) |
| Action as primitive | **Refuse** — accepted Intent |
| Requirement object | **Refuse** — policy + queries |
| Cost / commitment / exposure / loss | **Keep as vocabulary**, not Play objects |
| Resolution | **Keep as a stage**, not an entity |
| Result / outcome as types | **Refuse** — state delta + Occurrence |
| Play god-engine | **Refuse** |
| Verb list | **Refuse** here (O9) |
| Clock | **Refuse** to define (O2) |
| Lottery-on-every-Intent | **Refuse** as default (P19) |

---

## 18. Hostile review

1. **Universal engine?** No — homes own rules.  
2. **Intent = Action duplicate?** Action is not stored twice.  
3. **Mutate all domains?** One home per Intent.  
4. **Economy in kernel?** No — Occurrences plug in.  
5. **UI as rules?** Presentation never home of rules (P28).  
6. **Full information?** Observe is issuer-scoped and incomplete.  
7. **Every action a ticket?** Forbidden as default.  
8. **Wait as gameplay?** Forbidden as dominant; duration only if it creates decisions.  
9. **Fail = dead end?** Forbidden; eligible set must remain.  
10. **Capital auto-success?** Forbidden (P11). Capital may enable scale, not skip mastery.  
11. **Pure optimization?** Incomplete information + non-generic costs.  
12. **Pure gambling?** No global RNG mandate.  
13. **Coupling via internals?** Queries only.  
14. **Unauditable?** Occurrences + home records; settlement separate.  
15. **Action = settlement?** Distinct Intents / domains.

**Kernel:** no contradiction. No sixth primitive.

---

## 19. Close

### A. Established

- Play is the **decision loop**, not a rules warehouse.  
- **Intent** = attempted action to **one** home; does not mutate by existing.  
- **Action** = accepted execution of that Intent.  
- Eligibility = **policy + queries**.  
- Cost / commitment / exposure / loss = shared **vocabulary**.  
- Result = state delta; **Occurrence** = notice.  
- Observe uses World + Information contracts; never omniscience.  
- Failure can be partial/costly; must not zero the eligible set.  
- Duration allowed only as strategy, not retention.  
- Game consequences ≠ settlement ≠ external value.

### B. Intent / Action / Occurrence

Intent (request) → accept → Action (execution) → Result (state) + Occurrence (publication). Stop adding synonyms.

### C. Contracts with World and Information

**Observe:** World observable slice; Information `knowledge-of` / `holds`.  
**Act:** Intents to World, Information, or others — never Presentation.  
**Observe-as-act:** Information (or World) as home, **query** the other, **write** only the home.  
Eligibility may **query** access, presence, knowledge — not internals.

### D. Economic plug-in

Home resolves game state → Occurrences → Economy/Capital/Protocol **react** with **their** Intents. No fees in generic Intent. Settlement is never implied by a World or Information write.

### E. Left to later domains

Verb list, clock, combat, production, logistics, conflict interrupt, withdraw rules, backstop, fees, token, lottery, UI, whether a thin Play domain exists for eligibility projections.

### F. Remaining open

O2, O9 (primitives vs recipes, interrupt, partial — this doc only **names** partial/fail), O14, O17, O18, P14 mechanism, in-flight cancel, opposed resolution.

**Refinement of O9 (not rewriting `questions.md`):** “Action” is not a kernel noun; design verbs as **Intent kinds** owned by homes, optionally composed as recipes that issue several Intents.

### G. Contradictions left standing

- P9 vs production/travel wanting duration (O2) — legitimacy criteria only.  
- P13 vs empty markets (P14) — Play forbids zero eligible Intents; does not supply the backstop.  
- P11 vs requirements that **query** capital — query allowed; auto-success not.  
- Tradable Intel (power) vs mastery when “choose” is dominated by bought omniscience — still P11/O7.

**Recommended next:** Conflict **vocabulary of interruption** against in-flight Intents, **or** Production as decisions on Sites — still no verb list dump, no token, no code.

Alternatively a thin **Events** boundary (who may request World/Information Intents) if world-liveness is the next risk. Still no code.
