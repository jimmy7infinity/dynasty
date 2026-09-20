# Domain kernel

**Status:** Candidate kernel. Establishes conceptual vocabulary. Does not design the game.  
**Does not close:** control mechanics, spatial model, time model, token, lottery, seasons mapping, backstop, Profile NFT, combat, verb lists.  
**Source constraints:** `principles.md`, `status.md`, `questions.md`, `AUDIT.md`.

This document answers only:

> What are the fundamental things that exist, how is state classified, who owns it, and how do domains interact without sharing internals?

If a later document needs a new primitive, it must justify why Entity, Relation, Intent, Occurrence, and Domain cannot express it (P27).

---

## 0. Kind of thing (read this first)

| Kind | Meaning | Example |
| --- | --- | --- |
| **A. Kernel primitive** | Cannot be defined in terms of other domain concepts without circularity. The rest of the corpus must share this meaning. | Entity, Relation, Intent, Occurrence, Domain |
| **B. Derived / projection** | Computed from canonical state. Must name its source. Must not be mutated as if it were source. | Influence field, market spread, “is contested,” reputation score *if* computed |
| **C. Domain-owned object** | A meaningful game object. Semantics belong to one domain. Built from primitives. | Site, Resource pile, Profile, Order book, Season |
| **D. Aggregate** | A domain-owned boundary that keeps internal invariants. Others see it only through contracts. | A site’s internal facilities; a market’s book; an insurance book (if that domain exists) |
| **E. Relationship** | A Relation primitive instance: typed, domain-owned, may have state. Not a field secretly added onto someone else’s Entity. | Title, custody, knowledge-of |

**Not a giant universal entity.** Nouns in the brief (Site, Resource, Market, Blueprint, Org) are almost never kernel primitives. They are C, D, or E.

---

## 1. Candidate primitives

Five primitives. Everything else is derived, domain-owned, or a relation type.

### 1.1 Entity

**Definition.** An identifiable thing the system can refer to without knowing its internals. An entity has identity and a **home domain** that owns its canonical record.

**Why it must exist.** Commands, events, custody, discovery, and settlement all need a stable “this thing” that is not a row in another domain’s private table.

**What depends on it.** Every later domain. Actors, sites, deposits, contracts, sponsored objects — as *kinds of entity*, not as extra primitives.

**What it is NOT.** A bag of all game stats. A blockchain token. A tile. A player. “Having an Entity” does not imply ownership, control, visibility, or economic value.

**Fundamental or derived.** Fundamental.

---

### 1.2 Relation

**Definition.** A typed link among entities (usually two), owned by a domain, optionally carrying its own state (strength, expiry, season scope, public/private).

**Why it must exist.** Discovery ≠ control (P21), custody ≠ title, and influence ≠ exclusive territory only work if those are *different relations* (or derived from different relations), not flags on one object.

**What depends on it.** World (control, presence — later), Information (knowledge-of), Capital (title, custody), Contracts, Organizations (if any).

**What it is NOT.** A permission to mutate the related entities’ internals. A hard border. A complete model of control, influence, or ownership. The kernel does **not** decide how relations are created or destroyed.

**Fundamental or derived.** Fundamental as a *structure*. Specific relation types (control, knowledge-of, …) are domain-owned (E), not extra primitives.

**Reserved type names** (vocabulary only — acquisition rules OPEN):

| Name | Conceptual slot | Must not be treated as |
| --- | --- | --- |
| `knowledge-of` | An agent knows something about an entity or fact | Control, title, custody |
| `title` | Economic/participatory stake recognized by the owning domain | Control, or protocol settlement by itself |
| `custody` | Who currently holds or operates | Title, or lootable settlement |
| `control` | World relation: operational authority over a subject (`control.md`). Acquisition OPEN | Discovery, title, influence |
| `influence` | Reserved; likely derived (B) from world relations | Hard borders, exclusive ownership |

These names exist so domains cannot invent four incompatible words for the same slot. **`control` meaning** is filled in `control.md`. **How** `control` is established/changed/shared/authorized/lost remains OPEN (O5 remainder). Claim-as-English, influence mechanics, and operate-from-afar remain OPEN.

---

### 1.3 Intent

**Definition.** A proposed change, issued by an entity the receiving domain accepts as an issuer, addressed to **one** home domain, referring to entities by identity. The receiving domain accepts, rejects, or partially applies it according to *its* rules.

**Why it must exist.** Observe → choose → act (P9, P26). Cross-domain interaction cannot be “reach in and set fields.”

**What depends on it.** Actions domain, every verb, protocol NPC / backstop (if any), sponsored actors, bots policy.

**What it is NOT.** The verb list. A duration. A cost. A risk rating. A guarantee of success. Combat. An event (that is Occurrence). Implementation of a command bus.

**Fundamental or derived.** Fundamental as a composition surface. Verb catalog is domain-owned and OPEN.

**Minimum conceptual structure** (not a schema):

- issuer (entity reference)
- target domain
- kind (name owned by that domain)
- subject references (entities)
- correlation to later occurrences

Duration, cost, chance, and “risk” are **not** kernel fields (status V7 remains PROVISIONAL).

---

### 1.4 Occurrence

**Definition.** A fact that a domain asserts **has happened**, published without naming subscribers. Other domains may react by issuing their own intents or updating **their** state.

**Why it must exist.** P23 (events first-class), P26 (publishers must not know subscribers), P12 (the world changes besides player verbs).

**What depends on it.** Events domain, World, Conflict, Economy, Sponsorship, Seasons, and any future module (Insurance, Orgs).

**What it is NOT.** Permission to mutate the publisher’s state. A random debuff catalog. A lottery ticket. The Events *domain* (that domain will own kinds, scheduling, authorship — all OPEN).

**Fundamental or derived.** Fundamental as a composition surface. Event types are domain-owned and OPEN.

**Minimum conceptual structure:**

- source domain
- kind (name owned by that domain)
- subject references
- time-situated once a clock exists (clock itself OPEN)
- payload interpreted only by domains that opted into that kind

An occurrence is not automatically world-public. **Observability is a classification of the record**, not a primitive (P22).

---

### 1.5 Domain

**Definition.** A named owner of canonical state and invariants. The only party allowed to mutate that state. Not a folder, package, or service.

**Why it must exist.** P26–P28. Without a home domain, “who may change this?” has no answer, and seasons/conflict/economy will share one blob.

**What depends on it.** The whole corpus. Layer mapping (Game / Economy / Protocol / Presentation) is authority vocabulary **on** domains, not a sixth primitive.

**What it is NOT.** A microservice. The AUDIT roster (Identity, World, Lottery, …). That roster is PROVISIONAL (status V23). Domains may merge or split later; the kernel only requires that **canonical state has exactly one home**.

**Fundamental or derived.** Fundamental as an architectural primitive of the *design*, not as a thing players manipulate.

---

## 2. What was refused as a primitive

| Candidate | Classification | Why not kernel |
| --- | --- | --- |
| Player | Domain object (Identity): an entity that may issue intents | The kernel only needs an **issuer**. Player vs org vs NPC vs sponsor is Identity/Sponsorship (O8, O36). |
| Organization | Domain object; domain OPEN | Must not be required for the rest of the system to function. |
| Site, Region, Biome, Route, Position | World domain objects / aggregates | Spatial model OPEN (O4). Kernel has Entity + Relation only. |
| Resource, stockpile, blueprint | Production / Technology objects | Goods are not a second existence type. |
| Asset | Classification of an entity (economic significance), or a projection | “Asset” as primitive collapses ore, sites, ETH, and NFTs into one lie. |
| Market | Economy aggregate | Matching is not a kernel noun. |
| Contract (game) | Contracts domain object | Built from entities, relations, intents, occurrences. |
| Knowledge / Information / Fog | Information domain objects + `knowledge-of` | P22 requires the *distinction*, not a kernel intel type. |
| Season | Seasons aggregate + lifetime classification | Cadence OPEN. Kernel does not implement wipes. |
| Time / clock | Dimension of intents/occurrences | Clock OPEN (O2). |
| Capital / token / NFT | Protocol/economy objects | Authority classification, not extra primitives. |
| Ownership, control, influence | Relations or derived state | See §6. Conflating them is the failure mode. |
| Risk, SAFE/RISKY/INSANE | Not a thing that exists | See §5. Labels remain PROVISIONAL (V13). |
| Action (as verb) | Kind of Intent | The *surface* is Intent; verbs are not kernel. |
| Event (as catalog) | Kind of Occurrence | The *surface* is Occurrence; the Events domain is later. |
| Quantity / money | Domain-owned attributes | Protocol quantities live in Capital; game stacks in Production. |

**Agent** is a **role**, not a primitive: an entity some domain accepts as an intent issuer. The rest of the system must assume *only* that: something identifiable can attempt a change. It must not assume organizations, NPCs, or sponsors exist.

---

## 3. State classification (vocabulary)

Classification applies to **state records** (an entity’s canonical facts, a relation, an in-flight intent), not to a vibe attached to a noun.

These axes are the kernel’s working taxonomy. They replace a single “bucket per object.” They are **not** mechanics, numbers, or the audit’s three-axis sketch taken as law (V24 was a prompt; this is the evaluated vocabulary).

Which *value* a given site or deposit takes remains OPEN (O1 remainder, O20, O27).

### 3.1 Axes

| Axis | Distinguishes | Must not be used as |
| --- | --- | --- |
| **Authority** | Whose word is canonical: Presentation (never for rules) · Game · Economy · Protocol/settlement | “On-chain vs off-chain” as the only split. Presentation cannot win a dispute with Game. |
| **Lifetime** | Ephemeral (in-flight, session) · Seasonal (meaning ends with the world season unless a **mapping** exists) · Persistent (survives seasons as capability/history) | A wipe implementation. “Persistent” ≠ “wealth.” |
| **Finality** | Provisional (sim may still revise per domain rules) · Settlement-final (protocol has committed; sim must not silently rewrite) | “Everything valuable is settlement-final.” |
| **Identity scope** | Bound to an actor identity · bound to a world/season instance · bound to neither (commons, unowned opportunity) | Org membership (orgs OPEN). |
| **Observability** | Domain-private · holder-private · qualified public · world-public | UI. Fog rules (O7, O44) still OPEN; the axis exists so World-state ≠ knowledge-of-world-state. |
| **Mutability** | Immutable fact · mutable canonical · derived-only | Caching strategy. |
| **Derivability** | Canonical source · named projection | Treating a map overlay as source of truth. |
| **Transferability** | Whether *title* or *custody* relations of this kind may move | Automatically lootable; automatically NFT. |
| **Economic significance** | Play-only · economically meaningful · settlement-grade | Token design. Settlement-grade is the P15 class: not automatically PvP-lootable. |
| **Exposure** | Whether given occurrence/intent *kinds* may affect this record, in a context | An intrinsic “riskiness” of the object. See §5. |

**Ownership** is not an axis. It is title and/or custody relations (§6).  
**Custody** is not an axis. It is a relation that may diverge from title.  
**Seasonal scope** is lifetime + identity scope (this season’s id), not a fourth independent ontology.

### 3.2 Persistence is multi-dimensional

P24 (“world temporary, player persistent”) is a **direction**, not a four-bucket implementation.

A four-bucket model (transient / seasonal / persistent / on-chain) **breaks** on:

| Thing | Why one bucket fails |
| --- | --- |
| Deposited external capital | Settlement-final + persistent + not seasonal loot; still “in” a season’s play |
| Knowledge | Persistent, actor-bound, often holder-private; not wealth; not automatically on-chain |
| Reputation | Persistent projection or canonical Identity state — undecided (O25) |
| Game contract | May expire at wipe while a settlement obligation survives |
| Sponsorship | In-world object may be seasonal; commercial obligation may be settlement-grade |
| Profile / history | Persistent identity scope; transferability OPEN (O24) vs P11 |
| Discovered information | May be seasonal *truth* (the site wipes) and persistent *knowledge-of* (the player remembers a pattern) — two records |
| Organization | OPEN; if it exists, seasonal vs persistent is a later split, not a kernel bucket |

**Rule:** when a real-world or protocol fact and a seasonal game fact coincide, **split the records**. Do not force one entity to be both “the factory” and “the deposit.” Mapping between them at wipe is OPEN (O20). The kernel only forbids smashing them into one lifetime flag.

### 3.3 Matrix (how to classify, not what the values are)

Every new state record should be able to fill this without inventing a parallel vocabulary:

```
home domain        → Domain
authority          → Game | Economy | Protocol  (never Presentation)
lifetime           → ephemeral | seasonal | persistent
finality           → provisional | settlement-final
identity scope     → actor | world-season | unbound
observability      → private … public
mutability         → immutable | mutable | derived-only
canonical?         → source | projection(source=…)
transferability    → of which relations, if any
economic class     → play-only | meaningful | settlement-grade
exposure           → which occurrence/intent kinds, in which contexts (owned by Conflict/World later)
```

Domains that cannot fill this do not yet know what they are talking about.

---

## 4. Risk / loss

**Risk is not a primitive and not an intrinsic property of an object.**

An ore pile is not “RISKY.” A deposit is not “SAFE” because someone labeled it. Status V13 remains unused.

**Exposure** is a classification: in a **context**, certain **intent kinds** and **occurrence kinds** may change a record (damage, delay, reveal, transfer of a *non-settlement* relation, destroy seasonal entity, etc.). Context may include location, in-flight logistics, a contract, a season phase, or a conflict state — all defined later.

Loss is an **effect** of an accepted intent or an occurrence, applied by the **home domain** of the affected record.

Kernel implications (not conflict design):

- Settlement-grade, settlement-final records must not be in the default exposure set of PvP occurrence kinds (P15). Opt-in high-risk settlement is a later Capital question, not a default.
- Seasonal entities can be highly exposed without touching deposits.
- The same entity can be unexposed at rest and exposed in transit — because exposure is contextual, not painted on the type.
- Insurance (if it ever exists) subscribes to exposure occurrences; it does not require a global risk primitive.

---

## 5. Authority, title, custody, control, influence, discovery

Do not collapse these. Do not fill them with mechanics.

| Concept | Kind | Kernel commitment | Left OPEN |
| --- | --- | --- | --- |
| **Authority** | Axis on a record | Unique canonical owner (a domain + layer). Sim must not silently rewrite settlement-final protocol facts; protocol must not silently rewrite game facts. | Dispute, rollback, operator power (O40) |
| **Title** | Relation | May exist or not. Economic value does not require title (unowned opportunity, commons, unclaimed find). | Legal ownership, NFT (O24, L4) |
| **Custody** | Relation | May diverge from title (warehouse, deposit, escort, insurer). | Who may freeze/seize (O26) |
| **Control** | Relation or derived aggregate | **Reserved name.** Operational authority (`control.md`). Not implied by discovery, title, or custody. | How established/changed/shared/authorized/lost (O5 remainder) |
| **Influence** | Likely derived (B) | May exist without control. Must not default to hard borders (P10). | Mechanics (L13) |
| **Discovery / knowledge-of** | Relation and/or Information object | **Must not imply control** (P21). May exist with zero title, zero custody, zero control, zero influence. | Benefit of discovery (O11); intel object model (O7) |
| **Claim** | Overloaded English | Not a kernel type. World must not use “claim” as a synonym for `control`, presence, title, or discovery. | O5 remainder (claim-as-English) |

**Yes, conceptually:**

- Influence without control.
- Discovery without any claim.
- Control without transferability (if World later says so).
- Economic significance without title (a rich vein nobody holds).
- Custody without title (you are holding what is not yours).
- Title without control (you have a stake you cannot enforce on the ground).

**No, not yet:** rules that create or destroy any of these. That is World, Conflict, Capital, Information.

---

## 6. Actors

**Kernel assumption:** an **issuer** is an entity reference on an Intent. The receiving domain decides whether that issuer is allowed.

The kernel does **not** need Player, Organization, NPC, or External as subtypes.

| Kind | Where it lives | Kernel obligation |
| --- | --- | --- |
| Player | Identity domain object | None beyond “may be an issuer.” |
| Organization | OPEN (O36) | Must not be required. If added, it is an entity that Identity says may issue (perhaps via mandate relations). |
| System / protocol actor | A domain may issue intents as itself | Backstop, if any, is this pattern — economics OPEN. |
| External / sponsor | Sponsorship domain object | May be an issuer of *some* kinds; rights vs raids OPEN (O32). |

Capabilities are **domain policy** on intent kinds, not an org chart in the kernel.

---

## 7. Actions and events as surfaces

| Surface | Kernel | Later domain |
| --- | --- | --- |
| **Action** | Intent: attempt addressed to one domain | Actions/play: verbs, duration, failure, recipes (O9) |
| **Event** | Occurrence: happened, fan-out | Events domain: catalog, authorship, rates, world-scale scheduling (O10) |

Player-facing “I SCOUT” is a kind of Intent owned by Exploration/World, not a primitive.

World-facing “the anomaly manifested” is a kind of Occurrence owned by Events/World, not a primitive.

**Causal chain (conceptual):** Intent accepted → home domain mutates **its** state → zero or more Occurrences → other domains **optionally** issue new Intents. No domain writes to another’s store.

In-flight work is ephemeral state **inside the home domain** (an aggregate), not a kernel duration field.

---

## 8. Interaction model (modularity)

### 8.1 Fundamental vs pattern

| Mechanism | Role |
| --- | --- |
| **Command** | An Intent addressed to a domain. Fundamental. |
| **Query** | A published question answered from canonical state or a named projection. Fundamental. Callers do not read internals. |
| **Occurrence** | Fan-out fact. Fundamental. |
| **Reference** | Entity identity used across domains. Part of Entity, not a sixth primitive. |
| **Projection** | Derived read model. Fundamental *rule* (must name source); the tech is a pattern. |
| **Capability** | Optional pattern for “this issuer may perform kind K.” Identity/policy may use it. Not required to start. |
| **Policy** | Domain-internal rules. Not a kernel object. |

Message buses, RPCs, and chains are implementation of the above. They are not the kernel.

### 8.2 State ownership rule

1. Every canonical record has one home domain.
2. Only that domain mutates it.
3. Other domains pass **references**, send **commands**, ask **queries**, or listen to **occurrences**.
4. If you need another domain to change, you request; you do not assign.

### 8.3 Stable contract

A **stable contract** is a named command, query, or occurrence kind plus:

- which domain owns it
- which entity references it may carry
- that it does not grant write access to the owner’s internals
- compatibility: new subscribers can appear without changing the publisher

That is what P26/P27 mean. It is not a protobuf file.

---

## 9. Cross-domain invariants

A short list. If a design violates one, it is wrong even if it is locally clever.

1. **No silent cross-mutation.** Only the home domain writes canonical state.  
2. **Rules are not presentation.** UI/API/chain adapters do not own game or economic rules (P28).  
3. **Projections are not sources.** Derived state names its canonical source. Conflicts are resolved at the source.  
4. **One authority per canonical fact.** Domains must not infer title, control, or settlement from different private definitions of the same fact. Use the reserved relation slots and the classification axes.  
5. **Settlement and simulation do not overwrite each other.** Protocol must not rewrite game facts by side channel; game must not rewrite settlement-final facts. Bridging is an explicit mapping (OPEN), not a shared variable.  
6. **Knowledge-of does not imply control.** (P21)  
7. **World-state and knowledge-of-world-state are different records.** (P22)  
8. **Settlement-grade default exposure excludes PvP seizure.** (P15) Opt-in is a later Capital question.  
9. **Seasons do not reach into foreign stores.** A wipe is domains applying **their** lifetime rules (and any published mapping). There is no global `DELETE FROM world`.  
10. **New primitives are guilty until justified.** (P27)

---

## 10. Insurance test (module that must not exist yet)

Insurance is **not** in the design (O31). This is only a plug-in test.

**What Insurance would own:** its own aggregates (coverage terms, book, claim records). Classification: likely economy authority; lifetime maybe seasonal for in-world cover and settlement-final for payouts — **split records**.

**What it would not own:** site internals, combat resolution, season clock, player profiles.

**How it would attach:**

| Need | Kernel support |
| --- | --- |
| Point at “this insured thing” | Entity reference; home remains World or Production |
| Know who is asking | Issuer entity; Identity says they may hold a policy relation Insurance owns |
| Define coverage | Insurance-owned relation or aggregate; not a World field |
| Price risk | Query World/Conflict **projections** or subscribe to occurrence kinds; Insurance must not read World internals. Pricing is Insurance’s problem (undesigned). |
| Hear about loss | Subscribe to World/Conflict occurrences (`Damaged`, `Destroyed`, `Revealed`, … — names not specified here) |
| Pay | Command to Capital/Protocol: move settlement-grade value. Capital accepts or rejects. Insurance does not debit a wallet table inside Identity. |
| Season end | Subscribe to Seasons occurrence `SeasonEnded`. Insurance applies **its** lifetime rules (void cover, settle, expire). Seasons does not delete Insurance rows. |
| Conflict | No rewrite of Conflict. Conflict does not know Insurance exists. |

**If this failed, typical kernel bugs would be:** risk as an enum on Entity; control baked into Entity; wipe as a god-module; capital as a field on Site; events that require the publisher to call Insurance.

**Residual gaps (acceptable, not kernel holes):** clock (when is a claim timely), what “destroyed” means, whether payouts are settlement-grade, legal characterization. Those are later domains and O43.

**Verdict:** the five primitives + classification + invariants are sufficient for Insurance to exist **without rewriting World, Conflict, or Identity internals.** Conflict/World must publish *some* loss-related occurrences eventually; that is a contract they should expect, not an Insurance special case.

---

## 11. Minimization test

| If we drop… | Can the rest represent it? | Keep? |
| --- | --- | --- |
| Entity | No. No references. | Keep |
| Relation | Possible only by stuffing foreign keys into Entity and exploding coupling. Discovery ≠ control dies. | Keep |
| Intent | Possible only as “direct mutation” or as Occurrence-of-attempt, which muddles in-flight vs happened. | Keep |
| Occurrence | Possible only if publishers call known subscribers. Breaks P23/P26 and Insurance. | Keep |
| Domain | Possible only as one shared store. Breaks P26 and seasonal wipe isolation. | Keep |
| Agent-as-primitive | Yes. Issuer is an entity reference + domain policy. | **Dropped** (role only) |
| Site, Resource, Asset, Market, Player | Yes. Domain objects. | Dropped from kernel |
| Time-as-primitive | Yes. Dimension later. | Dropped |
| Risk-as-primitive | Yes. Exposure classification + later conflict. | Dropped |
| Ownership-as-primitive | Yes. Title/custody relations. | Dropped |
| Season-as-primitive | Yes. Aggregate + lifetime axis. | Dropped |
| Capability-as-primitive | Yes. Policy pattern. | Dropped |
| Quantity-as-primitive | Yes. Domain attributes. | Dropped |

Nothing else survived the cut.

---

## 12. Hostile review (self)

1. **Too many primitives?** Five. Further cuts lose modularity or P21.  
2. **Domain objects smuggled in?** Reserved relation *names* are vocabulary, not World design. They are the minimum needed so control and discovery are not the same flag.  
3. **OPEN questions solved?** No control rule, no wipe mapping, no verb list, no clock, no token, no insurance product. Actor *kinds* still OPEN; kernel only needs issuer.  
4. **Conflation?** Authority ≠ title ≠ custody ≠ control ≠ influence ≠ knowledge-of. Table in §5.  
5. **Seasonal + persistent?** Split records + lifetime × identity scope × finality. No four-bucket model.  
6. **External capital?** Settlement-final + protocol authority + settlement-grade economic class + P15 exposure default. Mapping at wipe still OPEN (O20).  
7. **Stable contracts?** Commands, queries, occurrences, references, named projections.  
8. **Insurance?** Passes as a subscriber/commander, not a parasite.  
9. **Unknown future modules?** Same attachment path. High bar for new primitives.  
10. **Understandable?** Five nouns, a classification sheet, ten invariants.

---

## 13. Close

### A. What this kernel establishes

- Five primitives: **Entity, Relation, Intent, Occurrence, Domain**.
- Agent as a **role**, not a type system.
- State classification axes (vocabulary), including multi-dimensional persistence.
- Risk as **contextual exposure**, not a thing.
- Conceptual space for title / custody / control / influence / discovery **without filling it**.
- Interaction: command, query, occurrence, reference, projection.
- Ten global invariants.
- Insurance can plug in without a rewrite.

### B. What it deliberately does not establish

- Spatial model, site lifecycle, verb list, clock, season length.
- What control, claim, presence, or influence *do*.
- What discovery confers (O11).
- Asset lists, token, lottery, markets, backstop, sponsorship deals, Profile NFT.
- Domain roster (V23 still PROVISIONAL).
- On-chain surface.
- Whether Insurance, Orgs, or credit exist.

### C. Remaining tensions (do not resolve here)

- P21 vs later “claim/control/develop” language in World — kernel only forbids implication; `control.md` fills meaning; acquisition remains O5 remainder.
- P24 vs P15 vs P17 — wipe mapping (O20). Kernel says split records; it does not map them.
- P11 vs transferable persistent profiles / knowledge (O24, O12).
- P22 vs tradable intel vs P11 (whales buy fog).
- P9 vs duration (O2) — Intent has no duration field so wait-walls cannot hide in the kernel; play.md still has to face them.
- Settlement-final vs off-chain operator (O40) — invariant 5 states the conflict; it does not pick a trustee.

### D. Questions that remain for later domains

Still live in `questions.md`. This document **refines** some of them; it does not rewrite that file.

| Topic | Refinement |
| --- | --- |
| O1 kinds of things | Kernel vs domain object is now distinguished. Remaining work: populate World, Identity, Production, etc. **without new primitives.** |
| O1 / V24 axes | Working taxonomy is §3. Per-object values still OPEN. |
| O8 Actor | Kernel: issuer entity. Kinds (player/org/NPC/sponsor) still OPEN. |
| Attachment (questions.md domain §) | Commands / queries / occurrences / projections are the answer *shape*. Specific kinds remain domain work. |
| O5 control | Use reserved slots; do not invent a fifth word. Meaning: `control.md`. Acquisition / share / authorize / loss still OPEN. |
| O27 asset taxonomy | Not a primitive. Classify entities on §3 axes instead of a global Asset type. |
| O2 time | Kernel will not grow a Clock primitive unless play.md proves Entity/Intent/Occurrence cannot carry time-situated facts. |

**Recommended next document:** `world.md` (space, sites, and the open control/influence/presence/discovery split), still with no code — after this kernel is accepted.

**Not next:** token, lottery, combat, seasons mapping, `value.md`.
