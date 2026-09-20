# Events

**Status:** Conceptual Event domain. Not an event table, scheduler product, GM console, or scripting language.  
**Kernel:** Entity · Relation · Intent · Occurrence · Domain. **No sixth primitive.**  
**Depends on:** `domain.md`, `world.md`, `information.md`, `play.md`.  
**Does not close:** catalog, rates, authorship taxonomy, clock, worldgen (O6), O10, sponsorship rights (O32), season mapping (O20), tokenomics.

P23: the world evolves through events, not only player verbs and not only random debuffs.

This document answers:

> What is an Event, and how can it change the world without becoming a second rules engine or a synonym for Occurrence?

---

## 1. Event vs Occurrence (central)

**Occurrence** (kernel): a **notice** that a domain asserts **something happened**. It does not mutate stores. It does not know subscribers.

**Event** (this domain): a **process / cause** the Events domain **owns** — an **Entity** (often an aggregate) that may **issue Intents** to other domains. It is **not** a specialized Occurrence. It is **not** the resulting World state.

| | Event | Occurrence |
| --- | --- | --- |
| Kind | Domain object (Events) | Kernel primitive |
| Role | Cause / in-flight or completed **process** | Fan-out **record that it happened** |
| Mutates other domains? | **No.** Only via **Intents** those domains accept | **No** |
| Count | One Event may cause many Intents and many Occurrences | Many Occurrences may have **no** Event |

**Occurrence without Event — yes, and common.** Player Intent → World result → World Occurrence (extracted, moved, `present-at` changed). Information Discovery Occurrence. Protocol settlement Occurrence. These are **not** Events.

**Event without Occurrence — no for material lifecycle.** When an Event **starts**, **materially progresses**, or **ends**, Events (and/or the domains it successfully commanded) **publish Occurrences**. Otherwise the process is unauditable and unknowable.

**Can the game work with only Occurrences (no Event entity)?** Thinly: Events domain as a stateless router that reacts to Occurrences by issuing Intents. That **fails** in-flight processes (a festival, a storm, a sponsored season of routes), **source/audit** (“what process did this?”), and **observability of the process** distinct from each Site delta. The Event **entity** earns its keep. It does **not** earn a kernel primitive.

**Forbidden stack:** Intent → Action → Result → Event → Occurrence → Notification.

Correct stack (same as `play.md`, plus optional cause):

```
Intent (to Events or elsewhere)
  → accepted Action in that home
  → Result (that home’s state)
  → Occurrences
  → (optional) Events domain instantiates or advances an Event
  → Event issues Intents to World / Information / …
  → those homes Result + Occurrences
```

Notification is Presentation. Not a domain noun.

---

## 2. Conceptual role (what Events do)

Events are **one** mechanism of **world/system evolution**: they request changes other domains already know how to apply.

They **may** (via Intents, not tables): create or transform Sites/Places; alter `connects` / access; ask Information to reveal or stale-mark; change deposit **conditions** (World/Production); disrupt logistics **contexts**; create market **conditions** (Economy reacts); raise conflict **context** (Conflict reacts); enable discovery (Information); shift economic **conditions** without settling value; open **unowned potential** (`world.md` opportunity projection).

They **must not**: be the combat engine, the production formulas, the market matcher, the fee schedule, or a probability loot table in this document.

No event catalog. No odds.

---

## 3. Sources (not a taxonomy)

Events are **not** assumed random. Randomness, if any, is a later resolution policy (OPEN), not the identity of the domain.

**Authorship/source is conceptually required** — provenance on the Event entity (like Intel): what **issuer** or **domain-as-issuer** catalyzed it. Needed for audit, sponsorship, and “not a GM finger.”

Illustrative origins (not a closed list): player activity; accumulated conditions (detected by **query**, not a Trigger type); environmental/economic **processes** (those domains’ Occurrences); discovery; conflict; external/sponsor issuers; season Occurrences; worldgen.

**Do not** freeze a source enum here.

---

## 4. Player-caused evolution

| Path | What it is |
| --- | --- |
| **Direct** | Player Intent → World (etc.) Result. **No Event required.** |
| **Reactive Event** | Domain Occurrences → Events **policy** (queries) → new or advanced Event → Intents |
| **Accumulated** | Same, over many Occurrences / World conditions. Thresholds OPEN. |
| **Emergent without Event** | Derived projections (isolation, influence). Not Events. |

**Not every action generates an Event.** That would make Events a notification log of play.

Relationship:

```
player Intent → domain Result → Occurrence
                    ↘
                 Events may ignore, or later instantiate an Event
```

Direct World change and Event-requested World change **both** remain World mutations. The difference is **cause**, not a second World.

---

## 5. Events vs World state

**Event ≠ resulting World state.** The transformed Site is World. The Event is the process that **requested** (or coincided with) that transformation.

**Not all meaningful World mutations require an Event** (`world.md` §14). Also:

- Direct accepted player/protocol Intents  
- Derived projections (no Event, often no Occurrence per tick)  
- Event-issued Intents  
- External/season Intents to World  

**Not event-sourcing as architecture.** Occurrences are notices, not the database of World.

World remains the only writer of World state.

---

## 6. Events vs Actions

Events are **active causes**, not merely diaries.

| | |
| --- | --- |
| Caused by Actions? | **May be** (via Occurrences + Events policy). Not always. |
| Cause domain Intents? | **Yes.** That is how they change anything. |
| Only publish Occurrences? | **No.** Occurrences without Intents cannot change World. |
| Chains? | **Yes**, as Occurrences → other Events or domain Intents. **No script VM.** |

An Event aggregate resolving is **the same shape as play**: Events domain accepts an Intent (instantiate/advance), **Action** in Events, then **outgoing Intents** to World/Information. Those are ordinary Intents; homes may **refuse**.

Events **must not** call other domains’ internals.

---

## 7–8. Composition and consequences

```
Event (Events-owned)
  → Intents to World / Information / …   (commands)
  → those domains Result
  → Occurrences
  → Economy / Conflict / Capital / … may react
```

**Not:** Event writes Site HP, Intel, order books, and wallets.

Same ownership rule as Play. Events are a **composition surface** because **many subscribers** can react to Event and downstream Occurrences **without Events naming them**.

If a consequence is required and a domain refuses the Intent, the Event **partially applies** (§16). Events domain does not reach around the refusal.

---

## 9. Information

World truth ≠ observability ≠ knowledge (`information.md`).

- Event entity has **observability** classification. Not automatically world-public.  
- **Knowing** an Event = `knowledge-of` / Intel, created by observation, reveal Intent, or public class — not by the Event existing.  
- An Event may **Intent World** to change observability and/or **Intent Information** to reveal or stale-mark. Two different moves.  
- Actors may know **that** an Event happened without the aggregate internals (observability on the Event).  

No visibility mechanics beyond this split.

---

## 10. Opportunity

P12 needs **new unowned/uncontrolled potential**. Event-issued World Intents (new Place/Site/condition) are **sufficient as a mechanism**, not exclusive (season worldgen also, O6).

**Opportunity stays a derived projection** (`world.md`). Not an Event subtype. Not a primitive.

Events that only punish incumbents will feel like a success tax (`AUDIT.md`). Events that only spawn camps will be captured by logistics. Catalog design later; the **model** allows remainder.

---

## 11. Real economic activity

Events **must not** assume they are purely fictional.

A sponsor issuer, an economic-process Occurrence, or player Occurrences **may** catalyze an Event whose **game** results (Sites, conditions, Intel) later produce **settlement** in Capital/Protocol — **via those domains reacting**, not via Events moving money.

Events **must not**: treat P2P play as REAL VALUE IN; emit token; book revenue; settle deposits.

```
external / economic / player catalyst
  → Event (game process)
  → World / Information Results
  → Occurrences
  → Capital / Sponsorship / Treasury may settle  (their rules)
```

No pricing, tokenomics, or flows here.

---

## 12. Sponsorship

A sponsor is an **issuer** (entity) that may Intent **Events** (or World, per later policy) to **request** instantiation of an Event kind.

Events/World **policy** accepts or refuses. Sponsor is **not** World. **Not** immune. **Not** a hidden control slot. **Not** able to bypass home-domain rules.

Sponsor rights remain **O32**. This model only forbids god-mode.

---

## 13. Seasons

Event entities are **typically world-instance scoped / seasonal** (same default as Places/Sites).

They **may** be referenced by persistent Information/Identity after the entity is gone (dangling refs).

Whether some Event *kinds* are cross-season, protocol-level, or history-only is **OPEN** (O20). Events must not silently write persistent production multipliers (P25) or settlement-final capital.

Season transition is not designed here. A season Occurrence may **catalyze** Events; Seasons domain still owns wipe mapping.

---

## 14. Causality

A full causal graph product is **not** a first-class kernel/Event concept.

**What is enough:**

- Event **provenance** (source issuer/domain, kind, subjects)  
- Intent **correlation** (`domain.md`) linking Event → outgoing Intents → Occurrences  
- Intel provenance if actors know via records  

That supports **audit**, **history**, **stale-marking**, and **dispute** at a coarse grain. Fine-grained “player activity → condition → Event → site → intel → fee” as a stored graph is **not required** now; settlement must still **not** hide inside Event payloads (explicit Capital Intents).

If disputes later need more, add it then — not a primitive today.

---

## 15. Authority / who may cause

No hierarchy document.

**Instantiate/advance Event:** Intent **to Events**, issuer = player, org (OPEN), sponsor, World/system-as-issuer, Economy-as-issuer, or another Event (reaction). Events **policy** decides eligibility (queries), same as any home (`play.md`).

Events domain is the **home** of Event entities. It is **not** above World.

---

## 16. Failure / invalidation

These are **ordinary resolution** (`play.md`), not a special Event physics:

- Outgoing Intent **refused** → Event incomplete  
- **Partial** Results  
- **Unintended** World/Information outcomes  
- **Superseded** by later World state or a later Event  
- **Invalidated** = Event ended; World state remains whatever homes already applied (no time-travel unless a home supports explicit reverse Intents — OPEN, dangerous)

Do not design Event-specific failure tables.

---

## 17. Recap: Event and Occurrence

| Question | Answer |
| --- | --- |
| What Event represents | Events-owned **process/cause** (Entity) that **intents** other domains |
| What Occurrence represents | Kernel **notice** of a happened fact |
| Every Event produces Occurrences? | **Yes**, for material start / progress / end (and downstream homes publish their own) |
| Occurrence without Event? | **Yes** |
| Know Event without internals? | **Yes** (observability + Information) |

Not a new primitive. Not an alias.

---

## 18. Minimization test

| Concept | Verdict |
| --- | --- |
| Event entity | **Keep** (process, source, in-flight, audit) |
| Event as kernel primitive | **Refuse** |
| Event as Occurrence subtype | **Refuse** (collapses cause and notice) |
| Trigger type | **Refuse** — policy + queries |
| Cause / Effect / Consequence types | **Refuse** — provenance + Intents + Results |
| Source type | **Refuse** — provenance on Event |
| Condition type | **Refuse** — World/Economy state queried |
| Opportunity type | **Refuse** — already derived in World |
| Script / effect payload that writes foreign stores | **Refuse** |

---

## 19. Hostile review

1. **Random debuffs?** Not the identity of the domain; catalog OPEN and constrained by P12/P23.  
2. **Notifications?** That’s Presentation + Occurrences.  
3. **Script engine?** Intents only; no VM.  
4. **Bypass ownership?** Homes refuse.  
5. **GM wand?** Issuer + policy; no unlabeled mutation.  
6. **Lottery tickets?** Forbidden as default (P19).  
7. **Every action an Event?** Forbidden.  
8. **Omniscient reveal?** Observability + Information.  
9. **Sponsor god?** Issuer only; O32 unsolved, god-mode forbidden.  
10. **Hidden settlement?** Capital Intents only.  
11. **Duplicate Occurrence?** Distinguished in §1.  
12. **Unauditable chains?** Provenance + correlation + Occurrences; not a graph DB.  
13. **Second rules engine?** World/Info/Play keep their rules; Events only requests.  
14. **Permanent via seasonal Event?** Classification + no silent persistent wealth.  
15. **Predetermined?** Direct play still changes World without Events; Events may be reactive/emergent. Predetermined catalogs are a later content risk, not required by this model.

**Kernel:** no contradiction.

---

## 20. Close

### A. Established

- **Event** = Events-domain **process** (Entity) that **issues Intents**.  
- **Occurrence** = happened-notice.  
- Not every mutation is an Event; not every Occurrence has an Event.  
- Events do not write foreign state.  
- Source/provenance on Event; not assumed random.  
- Player actions usually are **not** Events.  
- Opportunity via Event-requested World change is allowed; Opportunity is not an Event type.  
- Economic/sponsor catalysts allowed; settlement lives elsewhere.  
- Sponsor = issuer, not World.  
- Default Event lifetime follows the world instance.

### B. Event vs Occurrence

Process vs notice. One Event, many Occurrences. Many Occurrences, zero Events.

### C. Intent / Action

Events use the same loop: Intent-to-Events → Action in Events → outgoing Intents → other Actions. No extra verb layer.

### D. World

World owns geography. Events request. Direct player Intents still legal. Event ≠ Site.

### E. Information

Event existence ≠ knowledge. Reveal/stale via Information Intents. Observability on Event entities.

### F. Economy / protocol plug-in

Subscribe to Event and World Occurrences; settle with **Capital/Protocol Intents**. Events never book value.

### G. Left later

Catalog, scheduling, clock, accumulation rules, worldgen vs Events split (O6/O10), sponsor rights, which Events persist, interrupt of in-flight Events, content tone (punish vs open).

### H. Remaining open

O6, O10, O20, O32, O2 (duration of in-flight Events vs wait-walls — same legitimacy test as `play.md` §16), whether Events domain is the only legal non-player World mutator besides season (it is **not**; protocol/production Intents remain).

**Refinement of O10 (not rewriting `questions.md`):** “Who may emit” → Intent **to Events** (instantiate) or Events **as issuer** of Intents **to World/Information**. World still does not absorb Events.

### I. Contradictions left standing

- P12 vs Event-as-success-tax (content, not model).  
- In-flight Event duration vs P9 (O2).  
- Sponsor as catalyst vs raidable branded objects (O32).  
- Reactive Events vs “predetermined season script” (content risk).  
- Audit-by-correlation vs legal-grade causal graph (not built).

**Recommended next:** Conflict (interrupt in-flight Intents/Events) **or** `value.md` boundary (game vs settlement vs external) — still no catalog, no code.
