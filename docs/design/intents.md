# Operational Intents

**Status:** Candidate **families** of Intents. Not a verb list, UI, API, or cost table.  
**Kernel:** Entity · Relation · Intent · Occurrence · Domain. **No sixth primitive.**  
**Does not modify:** other corpus files.  
**Depends on:** `play.md`, `control-transitions.md`, `information.md`, `conflict.md`, `events.md`, `offline.md`.

**Purpose:** Smallest vocabulary of **attempted domain-state changes** actors (and Events) can submit. Not gameplay design.

---

## 1. What qualifies as an Intent

**Test:** An Intent is an attempt to **mutate canonical state in exactly one home domain**.

**Not Intents:** queries; Occurrences/notifications; passive relations; “I own this” as a speech act; UI clicks; waiting; login/logout; client math; Observe.

If you cannot name **which home** and **which records**, it is not an Intent.

---

## 2. Intent vs Observe

Observe = **query**. Writes nothing.

| Example | Kind |
| --- | --- |
| Inspect a **known** Site | World **query** (issuer-scoped) |
| Inspect surroundings | World **query** |
| Read Intel you `holds` / already assimilated | Information **query** |
| Ask who `control`s (if observable) | World **query** |
| Search / investigate so as to **gain** `knowledge-of` or Intel | **Information Intent** (home Information) that **queries** World, then **writes** Information |
| Search that only **filters** already-known intel | Query |

Looking is not an Intent. **Retaining** what you saw is.

---

## 3–4. Pressure-test (not all valid as separate verbs)

**World — collapse, don’t proliferate:**

| Candidate | Verdict |
| --- | --- |
| Establish / relinquish / transfer `control` | **One family:** mutate `control` (`control-transitions.md`) |
| Abandon | **Not a family.** Compose Leave (`present-at`) + Relinquish (`control`) |
| Construct / dismantle | Mutate **Site existence** / `situated-at` |
| Configure / operate / repair / extract / transform | Mutate **Site aggregate** (and maybe spawn/move **lots**) — **kinds**, not five kernels |
| Transport | Mutate `present-at` / lot situation along `connects` |
| Delegation | **Provisional** grant of `control` (OPEN share mode) |
| Discovery | **Not** a World Intent (P21) |

**Information:**

| Candidate | Verdict |
| --- | --- |
| Inspect / read | **Query** |
| Investigate / record | **Intent:** create/update `knowledge-of` / Intel |
| Share / transfer Intel | **Intent:** mutate `holds` |
| Publish / conceal | **Intent:** mutate Intel **observability** |
| “Know harder” | **Not** an Intent |

**Conflict:** not a second World writer. Player-facing: Intents **to Conflict** that mutate `opposed-over` / Contest, which then **Intents World**.

---

## 5. Conflict interaction

**Sufficient general shape:**

```
A → Intent to World (or in-flight)
B → incompatible Intent to World and/or Intent to Conflict (oppose / interrupt)
Conflict (if opposition) → Intents to World / Events
World evaluates World Intents → writes World only
```

**Not required:** a special “ContestControl” World verb that bypasses Conflict. Establishing on vacancy can be **World-only**. Contested replace uses **Conflict + World**.

Conflict **mediates opposition**, does not write `control`.

---

## 6. Event Intents

Events use the **same** Intent abstraction (Events as **issuer**). No Event-only Intent type. Homes may **refuse** Event issuers per policy (OPEN).

```
Event → Intent → home accept/reject → Result → Occurrence
```

---

## 7. Control-related

| Attempt | Home | Notes |
| --- | --- | --- |
| Establish / relinquish / transfer `control` | **World** | Vacant vs contested: World policy + Conflict as needed |
| Operate / configure controlled infra | **World** | Requires `control` (eligibility **query**) |
| Contest | **Conflict** then World | Not a World write by the attacker |

No mechanics.

---

## 8. Failure (not primitives)

Already `play.md`. Keep as **states of an Intent/Action:**

| | |
| --- | --- |
| Rejected | Never accepted; **no** write |
| Accepted, unsuccessful | Failed Result; side effects possible |
| Accepted, successful | Requested write |
| Accepted, interrupted | Conflict/home policy |
| Accepted, invalidated | Conditions changed before/during resolve |

No sixth noun.

---

## 9. Duration

**In-flight legitimate** only if it creates exposure, commitment, intercept, logistics, or changing conditions (`play.md` / `time.md`).

**Candidates:** relocate/transport; construct; extract-as-process; Contest process; intercept window.  
**Research:** suspect wait-claim unless it creates choices.  
**Illegitimate:** energy, claim-timer, wait because offline, wait as content.

Offline does **not** create duration.

---

## 10. Offline

Issued while online, resolve offline: **allowed** (in-flight).  
Requires live Respond while offline: **cannot**; delayed Respond (`offline.md`).  
Invalidated / interrupted while gone: **allowed**.  
Return: Observe then new Intents. Logout **issues nothing**.

---

## 11. Economic boundary

Gameplay Intent → domain Result → Occurrence → **later** Capital **may** react.

An Intent is **not** a payment, token move, settlement, ticket, or revenue claim.

---

## 12. Minimal families

Prefer **record mutated**, not English verbs.

**World**

1. **ChangePresence** — `present-at` (actors; lots if World-home)  
2. **ChangeAccess** — `access`  
3. **ChangeControl** — `control` (establish / relinquish / transfer as **modes**)  
4. **ChangeSite** — create/destroy/transform Site entity + `situated-at`  
5. **ChangeAggregate** — internals, deposits, operable state (operate / configure / repair / extract / transform as **modes**)  
6. **ChangeConnectivity** — `connects` / reified routes  

BUILD/UPGRADE/REPAIR/CONFIGURE/OPERATE → **4 + 5**, not five families.  
EXTRACT/TRANSFORM → **5** (and maybe lots). TRANSPORT → **1**. TRADE → **not World** (undesigned Economy). CRAFT → Production later; if it only changes Site aggregate, it is **5**.

**Information**

7. **Assimilate** — write `knowledge-of` / memory Intel (investigate/record)  
8. **ChangeIntelHolds** — share / transfer  
9. **ChangeIntelDisclosure** — publish / conceal  

**Conflict**

10. **Oppose** — create/advance `opposed-over` (and optional Contest)  
11. **Yield** — clear opposition / concede  
12. **RequestInterrupt** — ask a **home** to fail in-flight (may fold into Oppose later)

**Events:** no extra family; reuse 1–12 as **issuer**.

Do not lock names. Do not ship twelve buttons.

---

## Close

### A. Definition

Attempted mutation of **one** home’s canonical state.

### B. vs Observe

Queries vs Assimilate (write knowledge).

### C–E. Families

§12. World 1–6, Information 7–9, Conflict 10–12.

### F. Conflict

Oppose/Yield/Interrupt → requests World; incompatible World Intents.

### G. Events

Same Intents; Events as issuer.

### H. Control

ChangeControl + ChangeAggregate (ops). Contest via Conflict.

### I. Failure

Reject / fail / success / interrupt / invalidate — Action states.

### J. Duration

In-flight only if a decision; never wait-claim.

### K. Offline

No new Intents; in-flight may resolve.

### L. Economy

Consequences via Results/Occurrences; Intent ≠ settlement.

### M. Minimal vocabulary

Twelve families, **six World**. Verbs are modes.

### N. Unresolved

Which ChangeAggregate modes exist; lots World vs Production; whether RequestInterrupt ⊂ Oppose; presence required to ChangeControl; Event issuer privileges; TRADE home.

### O. Tensions

- Investigate as Intent vs “search is a query.”  
- Extract continuing offline vs idle-claim.  
- Operate without presence.  
- Many modes reconstituting a verb list.

### P. Cross-refs — **not applied**

| Doc | Note |
| --- | --- |
| `play.md` | Families live here; still no verb dump. |
| `control-transitions.md` | ChangeControl = that grammar. |
| `information.md` | Assimilate vs query. |

No other edits until accepted.
