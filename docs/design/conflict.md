# Conflict

**Status:** Conceptual Conflict domain. Not a combat spec, army sim, or PvP feature list.  
**Kernel:** Entity · Relation · Intent · Occurrence · Domain. **No sixth primitive.**  
**Depends on:** `domain.md`, `world.md`, `information.md`, `play.md`, `events.md`.  
**Does not close:** O5 remainder (how `control` is established/changed/shared/authorized/lost), O18 (offline, grief), formulas, actor taxonomy, interruption math.

Pressure test first: **if Conflict were deleted, competing Intents, Events, and Occurrences would still exist.** Conflict is justified only where those are *unclear or misplaced* — not as a second Event engine and not as “combat.”

---

## 0. Hostile ontology: must Conflict exist?

**Without a named Conflict domain:**

- Two issuers can still Intent World for the same exclusive slot.  
- World could resolve that in **its** policy → World becomes the war engine (bad).  
- Events could be “the battle” → Events becomes the war engine (`events.md` forbids this).  
- Interruption of in-flight Intents has **no home** except the victim domain inventing ad hoc oppose rules.  
- “We are opposed over this Site” has no record distinct from a storm Event or a discovery Occurrence.

**What would be impossible or unclear:** a single **home for opposition policy** — *incompatible claims* — that is not World (geography) and not Events (world-evolution).

**Verdict:** Conflict **earns a Domain**. It does **not** earn a primitive. Its core is **incompatibility of claims**, not HP.

If later design finds opposition can live entirely as World policy + Event kinds, **reopen this document** rather than grow a military ontology.

---

## 1. What Conflict is

More than one of these can be true **without extra types**, if we keep the *process* rare:

| Aspect | Kind | Role |
| --- | --- | --- |
| **Incompatibility** | Conceptual state | Two or more requested or standing claims **cannot all be true** of the same subject (e.g. exclusive `control`, exclusive `access`, one in-flight Intent vs interrupt). |
| **`opposed-over`** | Relation (Conflict-owned) | Issuers (or issuer vs system issuer) + **subject** + **which slot** (control, access, in-flight Intent ref, …). |
| **Contest** | Domain object (optional aggregate) | **In-flight opposition process** that **issues Intents** to World / Information / Events / … Same *grammar* as Event; **different home and invariant.** |
| **Conflict domain** | Domain | Owns opposition **policy**, `opposed-over`, Contests. Does **not** own Sites, Intel, or wallets. |

**Not** a persistent “war entity” for every rivalry. Most rivalry is only `opposed-over` or even **instant** competing Intents with **no** Contest object (§2).

**Invariant that distinguishes Contest from Event:** a Contest **requires incompatible claims**. An Event **must not** require opponents (`events.md`: evolution, not combat).

Do not also invent Trigger, Battle, Front, Army, Faction-as-Conflict-type.

---

## 2. Conflict vs Intent

An ordinary Intent **competes** when the **home of the subject** cannot apply both results.

That is **not** yet Conflict. Two miners sequencing a deposit are **contention**, not opposition. Conflict begins when policy treats the claims as **opposed** (exclusive control, interrupt, deny access, sabotage), not merely **queued**.

| Question | Answer |
| --- | --- |
| Conflict before anyone acts? | **Not** as a stored “intention object.” No planned-Intent type. Opposition exists when **incompatible Intents and/or incompatible standing relations** (e.g. two `control` attempts, or `opposed-over` declared) exist. |
| Two Intents resolve with no Conflict object? | **Yes.** Instant refuse / last-accept / fail-in-flight can be **World (or other home) policy informed by Conflict queries** — or a **single** Conflict Intent “oppose this.” No Contest entity required. |
| Extra value of Conflict? | **Who owns opposition.** Interruption as **requests**, not World-as-war. A **named** `opposed-over` so Information can be wrong about it. Contest only when opposition is a **process**. |

Play remains: Intent → accept → Result + Occurrence. Conflict **adds** Intents *to Conflict* and Intents *from Conflict* to homes. It does not insert a new kernel step.

---

## 3. Conflict vs Event

| | Event | Contest (if any) |
| --- | --- | --- |
| Home | Events | Conflict |
| Job | World/system **evolution** | **Opposition** of claims |
| Issues Intents? | Yes | Yes |
| Needs opponents? | No | **Yes** |
| Storm / festival / sponsor season | Event | Not automatically Contest |
| Two issuers exclusive `control` | May **catalyze** a Contest or `opposed-over`; not itself the war engine | Conflict |

**Event may create or escalate Conflict:** Event Result/Occurrences → Conflict policy **may** instantiate `opposed-over` / Contest (e.g. a condition that makes a route exclusive). Not automatic.

**Conflict may generate Intents:** to World (presence/access/control/connectivity), Information (reveal, stale, seize Intel **objects**), Events (**interrupt or alter conditions** of an Event — Events home applies).

**Do not** implement Contest as an Event kind inside Events. That duplicates semantics *and* violates Events’ boundary.

The **isomorphism** (both are processes that Intent others) is acknowledged so we do not pretend they are metaphysically unique — they are **split by invariant**, not by a new primitive.

---

## 4. Conflict vs Occurrence

Conflict is **not** a notification.

**Occurrences** (illustrative, not a catalog): `opposed-over` created/cleared; Contest started/ended; interrupt **requested**; interrupt **applied** (from the home that actually failed the in-flight Intent).

**Conflict without knowledge:** **Yes.** Same as control changing unseen (`information.md`). Observability on Contest / `opposed-over`. Actors may know *that* opposition exists without the aggregate.

---

## 5. What can be contested

Contest **subjects** are **entity refs + slots**, not a new “contestable” primitive. Conflict **never writes** those slots; it **requests** the home.

| Subject | Contest **through** | Notes |
| --- | --- | --- |
| Presence | World `present-at` | Co-location fights are World Results. |
| Access | World `access` | Deny/enter without implying `control`. |
| Control | World `control` (operational authority, `control.md`; acquisition **O5 remainder**) | Core “who runs the Site.” |
| Sites / infrastructure | World aggregate via Intents | Transform/damage **meaning** OPEN; not HP here. |
| Routes / `connects` | World | Disruption, chokepoints. |
| Resources | World deposits / Logistics lots | Lots: **custody** exposure, not title-of-ETH. |
| Strategic position | Place/Site + presence/control | Not a type. |
| Influence | **Sources** of the projection, not the overlay | Influence stays derived (`world.md`). |
| Information | Information Intents | Seize/destroy/forge **Intel**; not delete `knowledge-of` as “loot the brain.” |
| Contracts | Later Contracts home | Conflict may **Occurrence**; Contracts resolve. |
| Reputation | Identity (OPEN) | Not a Conflict store. |
| Opportunity | **No** | Derived; contest the Place/Site/condition. |

**Not directly contestable (Conflict must not treat as raid loot):**

- Protocol **settlement-final** / **settlement-grade** core deposits (P15)  
- Player **identity** / profile as an object to steal  
- **Title** as a World field (title lives in Capital/Identity; Conflict does not assign deeds)  
- **knowledge-of** as a transferable scalp (epistemic; may stale or Intel may move)  
- **Opportunity** type (does not exist)  
- **The token** / treasury as PvP prize  
- **Mastery** / persistent capability as a drop  

---

## 6. Conflict and the seven slots

| Slot | Conflict may **request** change? | Remains conceptually separate? |
| --- | --- | --- |
| `knowledge-of` | Indirect (Intel Intents; stale-mark) | **Yes.** Discovery ≠ control. Winning ≠ knowing. |
| `present-at` | Yes → World | Yes |
| `access` | Yes → World | Yes |
| `influence` | Only via sources | **Yes.** Not a border paint. |
| `control` | Yes → World | **Yes.** Still not title. Meaning: `control.md`. Acquisition **O5 remainder**. |
| `title` | **No direct write** | **Yes.** Capital/Identity. |
| `custody` | Yes for **non-settlement** lots → their home | **Yes.** Custody ≠ title ≠ ETH. |

---

## 7. Loss without “steal ETH”

Meaningful **seasonal / game** loss (mechanics OPEN): Site control; access; presence; infrastructure integrity; in-transit lots; Intel objects; in-flight Intents; route usability; time/position.

**Not:** core deposited real capital as default PvP loot.

Downstream, Economy may see productive capacity fall. That is **not** Conflict settlement.

Offline helplessness is **O18** — flagged, not solved. A model that only works if the victim is at the keyboard is incomplete.

---

## 8. Interruption

Conflict **does not** mutate another domain’s in-flight aggregate.

It **Intents the home** of that Action or Event:

| Effect | Shape |
| --- | --- |
| Interrupt in-flight Intent | Conflict → home: fail / abort / partial (home policy) |
| Accepted Intent fails | Home Result: failed/partial (`play.md` §10) |
| Force a new Intent | **No.** Conflict cannot puppet the victim. Victim **Responds** with their own Intents (P13). |
| Interrupt / condition-change an Event | Conflict → **Events**: request interrupt or condition change; Events applies or refuses |
| Exposure while in-flight | Home **declares exposure** at accept (`play.md`); Conflict (and others) **subscribe** / **use** that context |

Preserve: **attempt** (Intent) · **process** (Action / Event / Contest) · **state** (Result) · **notice** (Occurrence).

---

## 9. Resolution (shape only)

Resolution is **home-domain** (World applies control change; Information applies Intel; Events applies Event interrupt). Conflict **policy** may decide *whether* to issue which Intents, using **queries**:

Information (incomplete, stale, false); positioning (`present-at`, reachability); preparation (prior Intents, infrastructure); resources (lots — **not** auto-win); timing (O2); contracts (later); **player decisions** (more Intents); uncertainty (no global RNG mandate, no hidden capital DC).

**P11:** capital may buy **scale** (more issuers, more redundant sites, hired issuers if that domain exists). It must not be a stat check that skips positioning, information, and decision.

No rock-paper-scissors kit. No army sim.

---

## 10. Information

- Hidden `opposed-over` / Contest (observability).  
- False/stale Intel about who `control`s or whether opposition exists.  
- Scout = observe (`play.md` + Information), not a combat stat.  
- Ambush / intercept = **in-flight + incomplete knowledge + World situation** — concepts, not features.  
- Know *that* conflict exists without internals (`information.md` pattern).

---

## 11. Not only PvP

Opposition issuers may be: player; system/World-as-issuer; Event-as-catalyst (not Event-as-combat-engine); environmental **condition** expressed as World state that makes Intents fail (not always a Contest); org (O36).

**No actor taxonomy lock.** Same `opposed-over` grammar.

Player vs “the storm” may be **Event + World conditions** with **zero** Conflict object. Use Conflict when **claims oppose**, not when the weather is bad.

---

## 12. Capital / Protocol boundary

Conflict **must not** move wallets, book fees, mint tokens, or settle deposits.

**Legitimate downstream (mechanisms OPEN):** seasonal productive capacity changes; lot custody lost in transit; Intel sold/stolen; contract breach Occurrences; insurance (if any) subscribing to loss Occurrences; markets reacting to disrupted `connects`.

```
Conflict Intents → World / Information Results → Occurrences
                                              → Capital / Protocol may react
```

---

## 13. New players, lockout, dead ends

- Dominate **existing** contested subjects; **cannot** own unhappened Places/Events (`world.md` / P12).  
- Veteran **knowledge** and **capital scale** are real advantages; they are not `control` of future sites.  
- Permanent lockout of *all* remainder is a **content/worldgen** failure (O6), not a Conflict victory condition.  
- After loss, **eligible Intents remain** (P13). Conflict must not resolve to “no moves.”  
- Conflict is **not** mandatory play. Isolation/trade/explore remain.

---

## 14. Seasons

Contests, `opposed-over`, Site `control` are **world-instance / seasonal** by default.

Persistent: Identity, `knowledge-of` of past wars (dangling refs). **Not** a standing army across wipes.

Wipe conversion **O20**. Conflict must not smuggle persistent +% power (P25).

---

## 15. Failure modes (review)

| Mode | Guard in this model |
| --- | --- |
| Generic PvP / “combat” | Opposition of **slots**, not a match type |
| Second Event engine | Different invariant + home; no Contest-as-Event-kind |
| Whale lockout | Remainder + P12; capital ≠ mastery |
| Offline helpless | **OPEN (O18)** — unresolved tension |
| Wallet theft | P15; no Capital writes |
| Must participate | Not required |
| Dead ends | P13 on eligible set |
| Military sim | No armies/HP |
| Deterministic RPS | No kit |
| Pay-to-win stat check | P11; queries ≠ auto-success |

---

## 16. Minimization

**Keep:** Conflict **Domain**; `opposed-over`; **optional** Contest process; interrupt **as Intents**.

**Refuse:** Battle, HP, weapons, fronts, “combat stats,” Opportunity-as-prize, Event-as-war, Conflict-as-primitive, every contention as Contest.

**Instant oppose without object** is the default. Contest is the **expensive** representation.

---

## Close

### A. Established

- Conflict = **opposition of incompatible claims**, home for that **policy**.  
- Core record: **`opposed-over`**. Contest **only** if opposition is an in-flight **process**.  
- Same Intent grammar as the rest of the corpus.  
- Not PvP-only, not combat-only, not an Event clone.

### B. Relations to the grammar

| | |
| --- | --- |
| **Intent** | Into Conflict (declare/oppose/yield) and **out** to homes (interrupt, change slots). |
| **Action** | Accepted Intent in Conflict or in the home that applies loss. |
| **Event** | Evolution; may **catalyze** opposition; **not** the war engine. Interrupt Event via **Intent to Events**. |
| **Occurrence** | Notices; not the conflict itself. |
| **World** | Geography and reserved `control`; **applies** requested slot changes. |
| **Information** | Knowledge of opposition may be missing/wrong; Intel may be targeted; `knowledge-of` is not loot. |

### C. Can affect (via homes)

Presence, access, `control` (operational authority; how **O5 remainder**), site/infra/route **World** state, non-settlement custody of lots, Intel **objects**, in-flight Actions/Events (by request), sources of influence.

### D. Cannot affect (directly)

Settlement-grade deposits, identity, title assignment, token/treasury as loot, Opportunity type, mastery-as-drop, foreign internals.

### E. Capital / Protocol

Observe Occurrences; settle elsewhere. Conflict is not a wallet.

### F. Unresolved

O5 remainder (acquisition / share / authorize / loss), O18 (offline/grief), when contention becomes opposition, Contest vs instant, interrupt kinds, org war, reputation, mercenary issuers, how World **queries** Conflict without a god engine.

### G. Tensions

- Offline vs Rust-like loss (O18).  
- Capital scale vs P11.  
- Intel theft vs P11 (buying/raiding fog).  
- Contest process **looks like** Event — split is **policy**, easy to implement wrong.  
- How `control` is established/lost (O5 remainder) while Conflict already contests the named slot (`control.md`).  
- P13 vs “you lost the Site” — remainder must exist (explore, other Places, P14 OPEN).

### H. Proposed changes to existing docs — **not applied**

| Doc | Proposal |
| --- | --- |
| `play.md` | State that **opposition** is Conflict Intents to the in-flight **home**, not a kernel feature of Intent. |
| `events.md` | Already forbids combat engine; add an explicit cross-ref: **interrupt/condition-change** comes as Intents **from Conflict**, applied **in Events**. |
| `world.md` | “Contested” projection **sources** `opposed-over` + exclusive slots — still **derived**, not a Site flag meaning ownership. |
| `domain.md` | None required. `control` remains reserved. |
| `information.md` | Optional: Intel as Conflict **subject** (objects), never `knowledge-of` as scalp. |

Do not edit those files until this document is accepted.

**Recommended next:** O18 offline, or O5 remainder (acquisition) — opposition already has a named `control` slot (`control.md`). Still no combat math, no code.
