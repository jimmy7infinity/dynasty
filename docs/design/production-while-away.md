# Production while away

**Status:** Whether a Site can keep transforming World state while the controller issues no new Intents — without becoming idle-claim.  
**Kernel:** Entity · Relation · Intent · Occurrence · Domain. **No sixth primitive.**  
**Does not modify:** other corpus files.  
**Depends on:** `offline.md`, `time.md`, `play.md`, `control.md`, `intents.md`, `world.md`.

**Question:** After configure/operate, then disconnect — **what is actually happening in the world?**

Not: rates, loot, timers, NPC labor, markets, settlement.

---

## 1. World state vs reward balance

| | **A. World changes** | **B. Claim balance** |
| --- | --- | --- |
| What exists | Deposits, lots, aggregate, `connects`, damage — **World (or Production) records** | A number on the player to **Claim** |
| Return | **Observe** changed world | **LOGIN → CLAIM** |
| Compatible? | **Can be**, if §4 | **No.** Violates P9, `play.md`, `offline.md`, “deposit → wait → claim” |

**B is rejected.** Offline production must not be an abstract wallet the sim owes you.

**A is not automatic.** A world that fills a **player-bound pocket** while you sleep is **B wearing A’s clothes**. Output must be **situated world state** (at the Site, in lots, in the vein) — not “unclaimed ore” on the account.

---

## 2. In-flight vs persistent operation vs passive reward

| | Kind | New primitive? |
| --- | --- | --- |
| **Accepted Intent still in-flight** | Finite **job** (this haul, this build) | No — `play.md` |
| **Site configured to operate** | **Aggregate state** after ChangeAggregate **resolved**; World **keeps mutating that aggregate** as its own home | No — World state, not a sixth noun |
| **Passive reward generator** | Player balance | **Forbidden** (B) |

These **are** different. Do not merge “the mill is on” into an infinite Intent unless we **choose** Model B in §8 for finite jobs only.

---

## 3. Mine example — conceptually valid?

```
Control mine → ChangeAggregate (extracting) → disconnect
→ World continues → vein/lots/aggregate change → Occurrences
→ return → Observe, then new Intents
```

**Valid only if:** output is **world state**; process can **fail/interrupt/lose control**; **no claim button**; return is Observe → Choose → Act.

Invalid if: a meter pays you on login.

How much: **not this document**.

---

## 4. Legitimate vs idle (minimum)

Not all required, but **without most of these it is a reward loop:**

| Condition | Why it matters |
| --- | --- |
| **Consumes/transforms World state** | Vein down, inputs gone, lots **at the Site** (or in-world), not a player IOU |
| **Can fail / exhaust / jam** | Not guaranteed yield |
| **Can be interrupted** | Conflict/Events/World Intents |
| **Exposure** | Others can contest `control`, damage, steal **lots**, cut `connects` |
| **Consequences before return** | The map is already different (P9: not wait-then-harvest as the *only* beat) |

Logistics **need not** be required for legitimacy; if outputs pile at the Site, **that pile is the world** (and a target).

**Not sufficient:** “it ran a formula.” **Necessary to avoid B:** no player-side unclaimed balance as the product.

---

## 5. Offline ≠ safe

These **conceptually matter** (no mechanics):

- Contest `control` / damage / Event transform  
- Inputs/vein **exhaust** → process **stops or fails**  
- `connects` gone (if the process depended on them)  
- Conditions change  
- Interrupt in-flight **or** halt configured operation  
- **Success while absent** — lots/state already there; still not a claim

A process that **cannot** be touched while the owner is away is **immunity**, rejected (`offline.md`).

---

## 6. Control vs production

**Control** = who World **accepts** for operational Intents / who **authorized** the configuration.

**Production** = World (or later Production) **transforming aggregate**.

**If `control` is lost:** continuing to run **for the old issuer’s benefit** contradicts operational authority. Coherent default:

> Losing `control` **ends authorization**. The process **halts** (or becomes inert/vacant config) unless World **writes** a new `control` and **that** issuer’s configuration. It does not keep stuffing the **loser’s** pocket.

Exact halt vs inherit-config: **OPEN**; **must not** keep paying the deposed.

---

## 7. Presence

Operation **does not require** physical `present-at` or attention (`control.md`, `offline.md`).  
Presence **is not** authority. A visitor does not run the mill by standing in it.

---

## 8. Intent models

| Model | What it is | Use |
| --- | --- | --- |
| **A. One-shot Intent** | Extract once → Result | Discrete jobs. Valid. Not “continuous mill.” |
| **B. In-flight process** | One accepted Intent, many World mutations until halt/fail | Finite operations (a run, a haul). Valid. Infinite in-flight ≈ fake duration. |
| **C. Configured state** | ChangeAggregate **completes**; **operating** is **Site state**; World applies further Results **without new player Intents** | Continuous mill. Valid **only** as §1A + §4, not as a player reward pump. |

**Need both A/B and C** for different activities. **No new primitive:** C is aggregate + World self-mutation as home.

World does **not** need to Intent itself each tick as a player-shaped Intent. Material steps still **Occurrence**.

---

## 9. Occurrences

Material **World facts**, not a taxonomy: process started (config/in-flight); aggregate/lot/vein changed; exhausted; damaged; interrupted; `control` changed; subject gone.

Not: “+N claimed.”

---

## 10. Return

Player **responds to the world**: Observe lots, damage, vacancy, stale Intel → Choose → Act.

**Not:** claim accumulated. **Not:** LOGIN → CLAIM → LOGOUT.

If output exists, it **already exists** in World. Taking it away is a **new Intent** (ChangePresence / later logistics), not a reward screen.

---

## 11. Economic boundary

If this later has value, it is because **state transitions** (lots, capacity, disruption) exist — then Economy/Capital **may** react.

Offline production is **not** a financial primitive, yield, stake, or settlement instruction.

---

## 12. Exploit implications (invariants, not architecture)

Future sim/settlement **must** preserve:

- No **duplicate** apply of the same Result  
- No **replay** of a finished job  
- No **double** lots from one transition  
- No continue after **Site gone**  
- No production **without** current authorization (`control` / config)  
- **Control change** and **operate** cannot both “win” incoherently (no two exclusive `control`s; halt on loss)  
- **Client cannot invent** output the World never wrote  
- Simultaneous interrupt + produce: **one coherent World Result**

Game bug here **becomes** financial exploit if lots settle.

---

## 13. The distinction

**World continues:** the mine, the vein, the crates **on the map** changed; you might have **lost** the Site; you **Observe**.

**Game owes a reward:** a balance waited for you; the world was a loading screen; you **Claim**.

Dynasty may have the first. It **must not** have the second.

---

## Close

### A. Core answer

Yes, **if** configured/in-flight production is **World-state transformation** with exposure and halt on lost `control`, and return is Observe. **No** if it is an unclaimed balance.

### B. World vs reward

A allowed under §4. **B forbidden.**

### C. In-flight vs persist vs reward

Job = B-in-flight. Mill-on = C-state. Reward pump = invalid.

### D. Legitimacy

World records change; can fail/interrupt; not a pocket; halt when unauthorized.

### E. Control

Authorizes configure/operate; **loss stops** running for the loser.

### F. Presence

Not required; not sufficient.

### G. Intent

A/B/C as above; no extra primitive.

### H. Occurrences

World facts of start/change/stop/loss — not claim ticks.

### I. Return

Observe world; new Intents to move/defend/reconfigure — never Claim.

### J. Economy

Later, from state; not a yield primitive.

### K. Invariants

§12.

### L. Unresolved

Halt vs inherit on `control` change; lots at Site vs Production home; how often World applies C (not a timer spec — **must not** be a claim interval); inputs from nowhere.

### M. Tensions

- Live mill vs idle-game feel if nothing can go wrong.  
- Lots piling at an unattended Site vs logistics-required (not designed).  
- Success-while-absent vs “I didn’t play.”  
- C without player Intents vs “only Intents change the world” — **home may evolve its own aggregate**; that is not a player reward Intent.

### N. Cross-refs — **not applied**

| Doc | Note |
| --- | --- |
| `offline.md` | Point production-away: **A not B**; halt on lost `control`. |
| `intents.md` | ChangeAggregate modes ≠ claim. |
| `play.md` | Return loop Observe not Claim. |

No other edits until accepted.
