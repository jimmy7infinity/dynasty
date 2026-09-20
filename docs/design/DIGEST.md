# Dynasty — fresh-agent corpus digest

**Role:** Navigational / handoff extract of the current design corpus. **Not** architecture. **Not** in the precedence chain. **Not** a replacement for source documents.

**Do not:** treat this file as a decision register; invent mechanisms; close OPEN items; promote PROVISIONAL or ESTABLISHED to LOCKED; use chat history as source of truth.

**Corpus remains authoritative.** If this digest and a source file disagree, the source file wins under the precedence below.

**Architecture version referenced:** `architecture.md` v0.1.2 (2026-09-06 corpus correction).

---

## How to use this digest

1. Read this file for orientation.
2. Before changing design, open the **owning** source file named in §P.
3. Check `status.md` before treating anything as a requirement.
4. Check `principles.md` before proposing a system.

**Precedence** (`README.md` — Precedence):

1. `principles.md` — constitutional constraints  
2. `status.md` — canonical LOCKED / PROVISIONAL / OPEN register  
3. Domain-owning documents — definitions and domain rules  
4. `architecture.md` — synthesis / current architectural model  
5. Experiment evidence (`architecture.md` Part I) — empirical support, **not** protocol law  
6. `questions.md` / `AUDIT.md` — unresolved space and historical notes  

`architecture.md` **ESTABLISHED (experiments)** is **not** a `status.md` LOCKED row. Architecture-local “DECIDED” does **not** close an OPEN row (`status.md` — Architecture vs this register).

---

## A. Dynasty in one page

**What it is.** A persistent strategic World whose operations mutate World state, and whose economy is intended to emerge from desire, constraint, capability, consequence, and interdependence. It is simultaneously a crypto-economic protocol. The game is the primary participation interface for that protocol. (`architecture.md` — Part II; `value.md` — Purpose)

**Game and protocol.** Simulation is off-chain; chain is settlement and ownership, not the full sim. Layers: Presentation · Game · Economy · Protocol/settlement. Rules must not live in UI, API, or “the entire chain.” (`principles.md` P28–P29; `status.md` L26–L27)

**World and economy.** The World is the primary store of economic possibility. Desire, exchange, and organization are not modules that inject demand into a static map. The play loop always runs; the economic loop appears when desires + scarcity + geography + capability differences make another actor useful. (`architecture.md` — Parts II, XIII)

**Central thesis** (`architecture.md` — Part II):

> Players possess capabilities, knowledge, capital and relationships that allow them to perform consequential operations. Those operations alter World state. Altered World state changes opportunities and constraints, causing new decisions, dependencies, exchanges, organizations and Projects to emerge.

Foundational World Moves pattern (`architecture.md` — Part I):

```
WORLD → CONSEQUENCE → DESIRE → INTERDEPENDENCE
  → ORGANIZATION / CAPITAL → WORLD CHANGE → NEW CONSTRAINT → NEW ACTION
```

**REAL VALUE IN → REAL VALUE OUT.** LOCKED requirement (`principles.md` P17; `status.md` L2). Recirculated player deposits are not sufficient by themselves. **No product is selected.** (`external-demand.md`; `architecture.md` — Part XIV)

**Not:** a marketplace app bolted onto a map; a DeFi wrapper around emissions; an idle-claim loop; a token economy that manufactures its own value.

---

## B. Constitutional principles

Status of all items below: **LOCKED** (`principles.md`; paired `status.md` L-rows). Mechanism details remain OPEN where noted.

| Principle | Constraint | Source |
| --- | --- | --- |
| P1 | Play with economic consequence — not spreadsheet, casino skin, or closed token loop | `principles.md` |
| P2 / L1 | Dual fantasy: Rust-like risk/loss **and** Civ-like strategy/networks; not tile-Civ | P2, L1 |
| P3 / P8 / L8–L9 | Continuous space; network of sites/relations; not tile-blob ownership | P3, L8, L9 |
| P4 / L12 | Strategic map is the primary interface | P4, L12 |
| P5 / L21 | No rigid classes; roles emerge | P5, L21 |
| P6 | Not a manufactured token economy (ANTE-like patterns rejected as constraints, not a tokenomics design) | P6 |
| P7 / L3 | World economy ≠ P2P transfer layer | P7, L3 |
| P9 / L28 | Observe → choose → act → result → respond; not login-wait-claim | P9, L28 |
| P10 / L13 | Soft influence; hard borders not default | P10, L13 |
| P11 / L16 | Money = power ≠ mastery | P11, L16 |
| P12 / L17 | May dominate what exists; must not own the unhappened future | P12, L17 |
| P13 / L14 | No dead ends | P13, L14 |
| P14 / L15 | Empty player market must not halt required play. **How** (incl. whether a backstop exists) is OPEN | P14, L15 |
| P15 / L20 | Conflict is not “steal deposits” | P15, L20 |
| P16 / L18–L19 | Token not required to play; coherent at price 0; holders not unbeatable | P16, L18, L19 |
| P17 / L2 | RVI → RVO; deposits recirculated as rewards do not suffice; **sources OPEN** | P17, L2 |
| P18 / L4 | Players are owners/participants, not tenants. Legal model OPEN | P18, L4 |
| P19 | Asymmetric opportunity; not a lottery-ticket default | P19 |
| P20 / L25 | Sponsorship is in-world participation, not banners. Commercial model OPEN | P20, L25 |
| P21 / L10 | Discovery ≠ control. Discoverer benefit OPEN | P21, L10 |
| P22 / L11 | Information is a resource; knowledge asymmetry intended | P22, L11 |
| P23 / L24 | Events first-class; not only random debuffs | P23, L24 |
| P24 / L5–L6 | World temporary; player persistent; persist capability over seasonal wealth. Mapping OPEN (O20) | P24, L5, L6 |
| P25 / L7 | Persistent progression material; not stacking production multipliers | P25, L7 |
| P26–P27 / L22–L23 | Modular domains; open but bounded kernel | P26, P27 |
| P28–P29 | Layer split; sim off-chain; chain = settlement/ownership. On-chain surface OPEN (O45) | P28, P29 |
| P30 / L29 | No implementation until core systems cohere | P30, L29 |

---

## C. Architecture map

| Layer | Means | Does **not** mean | Authoritative doc | Status |
| --- | --- | --- | --- | --- |
| **Kernel** | Entity, Relation, Intent, Occurrence, Domain. One home mutates its own canonical state | Sixth primitive; folder map; verb list | `domain.md` | Candidate kernel. Primitive *list* OPEN (P27). `domain.md` exists; per-object values OPEN (O1) |
| **World** | Situated seasonal geography: Places, Sites, `situated-at` / `contains` / `connects` / `present-at` / `access` / `control` | The economy; the token; tile ownership; beliefs | `world.md` | Conceptual model. Spatial *technical* representation OPEN (O4) |
| **Play** | Observe → choose → Intent to **one** home → Action → Result → Occurrence | Fat rules engine; idle-claim; owning World/Intel | `play.md`, `intents.md` | Loop LOCKED (P9). Clock OPEN (O2) |
| **Information** | Intel, `holds`, `knowledge-of`. World truth ≠ belief ≠ record | Control; omniscient map; automatically RVI | `information.md` | Distinctions filled. Object model OPEN (O7) |
| **Control** | World relation: **operational authority** over a Site (or operable infra) | Title, presence, access, discovery, XP, territory | `control.md` | **Meaning filled.** Acquisition / share / authorize / loss = O5 remainder **OPEN** |
| **Capabilities** | Standing option to *attempt* a family of operations | Mastery; control; XP; guaranteed success | `architecture.md` Part VII; `intents.md` | Family **names** (Sense…Match) PROVISIONAL experimental vocabulary |
| **Projects** | Bounded stateful multi-party operation with committed resources and a settlement condition | Quest; APY product; arbitrary ETH sink | `architecture.md` Parts XI–XII | Definition architecture-current. Settlement **math OPEN** |
| **Value / economy** | Four books W/P/E/S. Economy emerges from World constraints | Token as the economy; fifth book for DLP | `value.md`, `economic-engine.md` | Books filled. RVI product OPEN. E home undesigned |
| **DLP** | Internal monetary unit, 1:1 ETH-backed (theory) | Project token; World object; reward mint | `architecture.md` Part XV | **PROVISIONAL** until money locked in `status.md`. Procedures OPEN |
| **DYN** | Placeholder Project/Protocol participation token | DLP; revenue; required to play | `architecture.md` Part XVIII | **PROVISIONAL** concept. Mechanics **OPEN** (O34) |
| **Settlement** | Redistribute **existing** DLP claims; World remainder stays World | Appraisal oracle; yield product; RVI | `architecture.md` Parts XVI–XVII; `value.md` §13 | Boundary conceptual. Math **OPEN** (O46) |
| **External revenue** | Outside party pays for use / play / association / right wanted for itself | Deposits; P2P; DYN mint; chart | `external-demand.md`; `architecture.md` Part XIV | Requirement LOCKED (P17). **No product selected** (O28) |
| **Protocol / chain** | Ownership and selected economically important settlement | Full World sim | `principles.md` P29; `architecture.md` Part XXVIII | Split LOCKED. Surface **OPEN** (O45) |

---

## D. Critical distinctions

| Concept A | Concept B | Correct distinction | Source |
| --- | --- | --- | --- |
| World | Money / DLP | W is situated state. DLP is monetary claims. Scarce useful World ≠ ETH | `value.md` §1–2; `architecture.md` XV |
| DLP | DYN | DLP = internal money (1:1 ETH theory). DYN = participation token, not money | `architecture.md` XV, XVIII |
| Capital (ETH→DLP deposit) | Revenue / RVI | Deposit = capital in the box, not revenue | `architecture.md` XIV; `value.md` §5 |
| P2P DLP/goods transfer | External value creation | Legitimate E; **not** RVI by itself | `value.md` §11; P17 |
| Capability | Mastery | Capability = may attempt. Mastery = quality of decisions/execution. Not XP | `architecture.md` VII; P11 |
| Capability | Control | Capability is actor-bound eligibility. `control` is a World relation | `control.md` §1; `architecture.md` IV |
| Control | Presence | `present-at` = co-located. Standing there is not operational authority | `control.md` §2 |
| Control | Title | Title = economic/participatory stake. Absentee title with zero `control` is allowed | `control.md` §5 |
| Control | Access | Access = may enter/use. Guest/worker without operational Intents | `control.md` §2 |
| Control | Custody | Custody = who holds a movable. Ore in your wagon ≠ running the mill | `control.md` §2 |
| Control | Hire / payment | Hire is an economic pattern. Payment does **not** create `control` or authorized issuance | `control.md` §5; `architecture.md` IV |
| Control | Relationship / trust | Social/economic stance. Not automatic World eligibility; some relations not DLP-purchasable | `architecture.md` IX |
| Direct | Control | Direct = experimental **capability family** (attempt operate/time/hold). Not automatic `control`. “Direct without `control`” is **not** a settled fact | `architecture.md` IV |
| Authorized issuer | Control | Extra issuer, if any, is a **mode of existing `control`**, not a second exclusive slot. Mechanism OPEN | `control.md` §5 |
| Intent | Action | Intent = proposed mutation to **one** home. Action = accepted Intent (player-facing attempt) | `domain.md` §1.3; `architecture.md` X |
| Action | Operation | Operation = consequential attempt/process (incl. hold/abort/refuse). Query/UI click is not an Operation | `architecture.md` X |
| World outcome | Monetary settlement | World determines Project outcomes. Settlement redistributes existing DLP. Kit loss ≠ DLP burn | `architecture.md` XVI |
| World object | Monetary claim | Object remains W. Bilateral DLP transfer can price a deal; that is not protocol appraisal | `architecture.md` XV |
| Experiment ESTABLISHED | Architecture LOCKED | Observed in play; binding for *this* synthesis; **not** `status.md` LOCKED | `README.md`; `architecture.md` status table |
| PROVISIONAL | LOCKED | Sketch / working model. Not an implementation requirement (`status.md` V-rows) | `status.md` |
| Architecture “no marketplace primitive” | O15 | Architecture-local: no marketplace as foundational primitive. **O15 remains OPEN** whether marketplace-like mechanisms may ever exist | `architecture.md` XIII; `status.md` O15 |

---

## E. Current financing model

**Status:** **PROVISIONAL** intended base model (`status.md` V25; `architecture.md` Parts XV–XVI). **Not** `status.md` LOCKED. **Not** an implementation spec.

> Senior capital is protected, locked backing. It is not ordinary Project operating capital. (`architecture.md` — Part XVI)

**Senior capital:** lender-provided DLP locked as backing/security/reserve for a financing arrangement. **Not** ordinary operating cash. Ordinary Project operating failure does **not** consume senior backing merely because the Project operates.

**Locking (conceptual only):** those DLP are restricted as senior backing. Exact lock objects **OPEN** (O46).

**Operating / junior capital:** separately authorized; **may** be consumed by wages, equipment, inputs, other explicitly permitted expenditure.

**Conceptual example (not a waterfall):** Alice’s mine needs 10 DLP senior backing. Reed supplies 10 DLP → **locked senior backing**. Alice separately supplies operating/junior capital. Ordinary operating losses do **not** consume Reed’s 10. (`architecture.md` — Part XVI)

**Borrower-control (PROVISIONAL custody constraint):** borrowed/senior DLP never enters the borrower’s **unrestricted private wallet**; remains in Dynasty-controlled structures. This does **not** make senior spendable opex. (`architecture.md` — Part XVI)

**Lender-authorized spending:** if ever introduced, a **separate** financing arrangement. It does **not** redefine the base model. **OPEN.** Do not design it by silently spending senior in examples.

> The old 10/1/6 spendable-purse leftover-priority model is **SUPERSEDED**.

That example: 10 senior + 1 junior in one spendable purse of 11; 5 spent; 6 leftover to senior; junior 0. It **commingled** protected backing with operating money. **Do not restore. Do not invent a replacement settlement algorithm.** (`architecture.md` — Parts XV–XVI; `README.md` rejected list; `AUDIT.md` 2026-09-06 provenance)

**OPEN (O46 / Part XVI):** lock; custody objects; release; default; settlement math; senior return / yield; lender-authorized spend; fraud/unauthorized drain; unwind if financed but never operated; how World remainder is assigned at Project end (never via hidden price).

Projects are **not** protocol-guaranteed yield products. Protected backing ≠ promised profit.

---

## F. DLP / monetary model

**Status of 1:1 backing theory:** **PROVISIONAL** until money is locked in `status.md`. Do not reopen the 1:1 *theory* merely because procedures are OPEN. (`architecture.md` — Part XV)

| Claim | Status |
| --- | --- |
| DLP is Dynasty’s internal monetary unit | PROVISIONAL architecture |
| 1:1 backed by ETH | PROVISIONAL |
| ETH deposit → DLP = conversion, not value creation | PROVISIONAL theory |
| DLP ≠ DYN; DLP ≠ World object; DLP ≠ reward mint | Architecture-current; aligns P6/P16 |
| Transfers redistribute existing claims; do not mint supply | PROVISIONAL conservation |
| Wages = transfers from existing backed operating balances, not new DLP | PROVISIONAL |
| World events / Project success-failure / kit destruction do not mint or burn DLP supply | Architecture-current conservation |
| No protocol-wide “worth X DLP” appraisal | Architecture-current; World ≠ money |
| No fifth value book for DLP (DLP is S when redeemable; in-play use is E-coordination) | `value.md` §7; Part XV |
| Redemption reverses deposit **subject to mechanics** | **OPEN** |
| Redemption queues, insolvency, vault architecture, contracts | **OPEN** (O26) |
| Exact free/locked/operating/senior objects | **OPEN** (conceptual states named only) |
| Parallel ETH-denominated IOU as a second money | **REJECTED** as patch |

**Supply boundary:** ETH deposit/redemption is the monetary supply boundary. World state does not mint/burn DLP.

---

## G. DYN

**Status:** **PROVISIONAL** concept (`architecture.md` — Part XVIII). Token **role** **OPEN** (`status.md` O34). Design late (AUDIT G).

**Purpose (intended, not specified):** Project/Protocol token; may trade; may eventually be earned or staked; intended to represent participation/exposure to genuine Dynasty ETH-denominated surplus **if such surplus exists**.

**DYN is not:** DLP; required to play (P16 / L18 LOCKED); revenue; an emission faucet; APY product; substitute for World economy; value creation by issuance.

**REJECTED as constraints (not a tokenomics design):** inflationary mining; sit/stake emissions; early-entry structural advantage as the product; idle collect; circular token/treasury demand loops. (`principles.md` P6; `architecture.md` XVIII)

**OPEN — do not invent:** supply, emissions, staking APY, governance, DAO, allocations, legal ownership meaning, buybacks.

---

## H. REAL VALUE IN / revenue

**RVI → RVO is LOCKED** (P17 / L2). **Mechanism is OPEN** (O28). There is **no fully designed RVI mechanism** (`architecture.md` — Part XIV).

| Phenomenon | RVI? |
| --- | --- |
| ETH deposited to obtain DLP | Capital, not revenue |
| P2P DLP / in-world exchange | E, not automatically RVI |
| World production | W; not automatically ETH revenue or DLP |
| DYN issuance | Not revenue |
| Token appreciation | Not revenue |
| Fees on P2P | Not automatically external (`value.md` §10; O30) |

**Genuine revenue** would require Dynasty to provide something externally valuable that causes **new** value to enter (`external-demand.md` §1).

**`external-demand.md` (exploration, not a product spec):** honest named families are **pay-to-play/participate** (ordinary game monetization; does **not** prove world-export thesis) and **conditional sponsorship** (needs audience; O32 unresolved). W goods as real-world commodities: **no convincing demand**. File argues tickets can meet a **weak** reading of P17 and **must not** silently demote the harder claim. **Constitutional choice not made.** No ExternalDemand domain created.

---

## I. World / gameplay architecture

**World.** Domain of situated seasonal geography. Empty Places allowed. Not everything is a Site. (`world.md`)

**Place.** Locus / graph node. Controlling a Place as territory = forbidden tile-Civ. Control attaches to a **Site at** a Place. (`world.md`; `control.md` §4)

**Site.** Occupying aggregate `situated-at` a Place; operable internals.

**Resources.** Deposit/vein = situated World potential. Extracted **lot** = movable quantity with custody. Lots at a Site are W, not a hidden S balance (`production-while-away.md`).

**Equipment / infrastructure.** World objects that enable or constrain operations. Site vs infrastructure vs kit must stay distinguishable (`architecture.md` Part IV).

**Geography.** `connects` = reachability. Kit-scale vs person-scale access may differ. Economic coupling requires a **World cause**; two Places existing is not an economy (`architecture.md` Parts V, XXIII). Rare graph-authorship (`connects` as a verb) is **PROVISIONAL**, not the game.

**Information.** Incomplete/stale intended (P22). Discovery = knowledge Occurrence, not `control` (P21). Selling Intel among players is E, not RVI.

**Relationships.** Persistent stance (trust, refusal, employment, patronage). Home **OPEN**. Not a 0–100 bar capital can fill.

**Operations.** Consequential attempts under World/Information/Capital rules. Persistent residue is common in-season (**ESTABLISHED** experiments) but does **not** define Operation.

**Desire/constraint loop.** Desire is World-situated (keep a route, not drown), not “need 10 DLP.” Action → constraint → dependency → maybe exchange/org/Project (`architecture.md` Part II).

**Capability families.** Experimental names Sense, Assay, Extract, Transform, Haul, Erect, Sustain, Direct, Deny, Bind, Underwrite, Match — **PROVISIONAL names**, not LOCKED primitives. Match is **underdefined** (must not silently become a global order book).

**Mastery.** Contextual, transferable, mortal when World changes. Not a stat. (`architecture.md` Part VII)

**Control / presence / access / title.** See §D and §J. Influence is **derived**, not a hard border (mechanics OPEN).

---

## J. Authority / agency model

```
Capability (may attempt)
  → Intent (to one home)
    → home eligibility / accept or reject
      → if accept: that home mutates its records
```

**Control:** World accepts a defined family of **operational Intents** from the related issuer(s) concerning the subject. Authoritative, not invulnerable (Events/Conflict can interrupt). (`control.md` §1)

**Only World writes `control`.** Conflict/Events **request**. Discovery, presence, title, logout are **not** causes. (`control-transitions.md`)

> Authorized issuer is a **mode of an existing `control` relation**, NOT a second control primitive.

If World later accepts operational Intents from someone other than the named controller: unique exclusive controller remains; additional named issuers may be eligible for **specified** operational Intents **while that control relation exists**. Must not become: hidden ownership; floating ACL; automatic hire/pay/trust/Direct/presence/title/org/finance authority; puppet of another actor’s Intents. **Exact mechanism OPEN** (O5 remainder). (`control.md` §5; `architecture.md` Part IV)

**Hire/payment:** observed gameplay pattern. Does **not** specify how World comes to accept the hiree’s operational Intents. **OPEN.**

**Direct:** capability to attempt operate/time/hold. Patron ≠ operator ≠ Direct ≠ `control`.

**Presence:** `present-at`. Operational-from-afar **OPEN** (`control.md`). Experiments often used a body at the Place; architecture does **not** lock a one-body Direct rule (`architecture.md` Part XXII).

**Refusal:** other actors may refuse (wages, Transform without offtake, flood trust). Capital cannot automatically buy consent (`architecture.md` Part IX).

**Control transfer:** World Result of accepted Intent (grant, opposition World honors, Event-requested write, vacant establish). Share/delegate **OPEN**. (`control-transitions.md`)

---

## K. Projects

**Definition** (`architecture.md` — Part XI):

> A Project is a bounded, stateful operation undertaken by one or more participants, requiring committed resources, pursuing a defined objective, and eventually reaching a settlement condition.

**Why:** coordination a handshake cannot bound. **Not** because design needs a quest.

**Candidate lifecycle (supported by experiments, not extra states for completeness):**

```
PROPOSED → FINANCED → OPERATING → SETTLEMENT
```

Halt-as-pause is **PROVISIONAL**. Settlement → Operating **invalid**. Marketplace listing / investor secondary / seasonal fund **not established**. (`architecture.md` — Part XII)

**Must distinguish:** World state; participants; resources; capital (senior backing vs operating/junior); operating state; risks; objective; outcome; settlement.

**Settlement (OPEN math):** redistributes **existing** DLP claims; no appraisal; World remainder stays World; not itself RVI. Ordinary operating failure does not consume protected senior backing.

**OPEN joins:** Project vs org vs financing vs handshake; lock/custody objects; when settlement fires; World-residue assignment.

---

## L. Experiments / evidence

Independent experiment files are **not** in this repository. Summaries: `architecture.md` — Part I.

> Experiments are **evidence**, not protocol law. ESTABLISHED ≠ `status.md` LOCKED.

| # | Name | Finding used in architecture | Did **not** prove |
| --- | --- | --- | --- |
| 1–3 | West Mouth / Hollow Gorge; Hour 0.5–3; Hour 3–12 | Early situated play; named places are illustrations, not a required map | Starting content bible |
| 4 | First Opportunity / Overlap Hold | Opportunity/overlap as World situation | Remainder/worldgen (O6) |
| 5 | First Productive Chain | Production without real desire/offtake is dead | That mine→craft→market is enough for RVI |
| 6 | First Dependency | Dependency can produce exchange/org | Global markets |
| 7 | 32-actor / 150-hour population | Population does not automatically create an economy | Critical-mass token flywheel |
| 8 | Second Basin / Far Basin | Local density vs inter-regional coupling; coupling needs World cause | Isolation is a bug to “fix” with a global market |
| 9 | Two Operators, One Place | Competition/cooperation on one operable aggregate | Control acquisition mechanics |
| 10 | The World Moves | Success changes World and can destroy the conditions that made it work; **local** adaptive economy | Whole-map self-organization; global liquidity; “no marketplace ever” as status lock |

**Pooled ESTABLISHED (experiments)** — see Part I list (capability ≠ outcome quality; mastery contextual/transferable/obsolete; capital ≠ judgment/geography/trust; etc.).

**PROVISIONAL imposed in experiments (not measured laws):** DLP as wage coordinator; 1:1 ETH; borrowed/senior DLP in Dynasty-controlled structures.

**EXPLORATORY:** crypto-off (remove DLP, desires remain) — thought experiment, not a live ledger proof.

**Named tension:** experiments ran a wipe-free World (hours 0–900). P24 / L5 still LOCK seasonal reset. Architecture describes **in-season** causality. Cross-season mapping **OPEN** (O20).

---

## M. Rejected / superseded ideas

| Item | Status | Why | Source |
| --- | --- | --- | --- |
| ANTE-like inflation / emissions / circular treasury–token loops | REJECTED as base | Token issuance is not value creation; circular demand fails P6 | P6; `architecture.md` XVIII, XXIV |
| Idle / staking extraction; “stop playing and collect” | REJECTED | Idle-claim / manufactured yield | P6, P9 |
| Early-entry structural advantage as the product | REJECTED | P6 constraint | P6 |
| Token issuance or DYN mint as revenue | REJECTED | Not RVI | `architecture.md` XIV, XVIII |
| Token appreciation as revenue | REJECTED | Chart ≠ value creation | `value.md` §10 |
| World object → automatic DLP price / protocol appraisal | REJECTED | World ≠ money | Part XV; `README.md` |
| NPC buyers / NPC demand engines | REJECTED as demand | Manufactures desire. **Distinct from P14** (verb availability; backstop OPEN) | Part XXIV; O15 notes |
| Automatic money → universal agency / pay-to-master | REJECTED | P11 | P11; Part XXI |
| XP / classes / numerical mastery levels | REJECTED | P5, P25; mastery is contextual | Part VII, XX |
| Spendable senior / leftover-priority **10/1/6** | **SUPERSEDED** | Commingled backing with opex | Parts XV–XVI; V25 |
| Marketplace as foundational primitive | Architecture-local (not a status lock) | Exchange from dependency; O15 still OPEN | Part XIII |
| Quests / APY Projects / arbitrary ETH sinks | REJECTED as Project model | Projects are bounded World coordination | Part XI |
| Fifth accounting book for DLP or token | REJECTED | Four books W/P/E/S suffice | `value.md` §7 |
| Client or World Intent writes Book S | REJECTED | Integrity hardens at S | `value.md` §8, §13 |
| Treating ESTABLISHED experiments as LOCKED law | REJECTED | Different registers | `README.md` |
| Inventing RVI / DYN tokenomics / settlement waterfall / redemption / orgs / authorization ACL because OPEN | REJECTED as process | OPEN is not a gap to fill | `README.md`; P30 |

---

## N. OPEN questions

Do **not** answer these. Details: `questions.md`. IDs: `status.md`.

### World

| ID | Question | Why it matters | Source |
| --- | --- | --- | --- |
| O4 | How to represent continuous space for sim without tiles | P3 vs queryable space | `world.md`; `questions.md` World |
| O6 | Worldgen / remainder during a season | Else P12 is fiction | `questions.md`; L17 |
| O13 | Production as decisions, not static rates | Sites ≠ +N/hour | `economic-engine.md` |
| O14 | Logistics: capacity, transit risk, or instant transfer | Network-empire fantasy | `questions.md` Logistics |

### Time

| ID | Question | Why it matters | Source |
| --- | --- | --- | --- |
| O2 | What is the clock? Offline? Duration without wait-walls? | Infects all verbs; P9 tension | `time.md`; `offline.md` |
| O3 | Season length / scoring / winners | Civ vs Rust vs legal | `status.md` V1; `questions.md` Seasons |

### Control / authority

| ID | Question | Why it matters | Source |
| --- | --- | --- | --- |
| O5 remainder | How `control` is established, changed, shared/delegated/**authorized**, lost | Meaning is filled; mechanism is not | `control.md`; `questions.md`; `status.md` O5 |
| — | Operational-from-afar vs presence | Capital/orgs make this huge | `control.md`; Part XXII |
| — | Which Intent kinds are “operational” | Else control collapses into enter/stand-here | `control.md` Close J |
| O11 | What does a discoverer get if not control? | Unpaid scouts vs P21 | `questions.md` Exploration |

### Economy / value

| ID | Question | Why it matters | Source |
| --- | --- | --- | --- |
| O28 | Durable RVI beyond deposits | Thesis otherwise circular | `external-demand.md`; L2 |
| O29 | Non-P2P world-economy processes | P7 | `economic-engine.md` |
| O15 | Market structure | Thin books; not locked by architecture “no primitive” | `status.md` O15 |
| O17 | Backstop who pays / quality | P14 vs printer vs dead end | `questions.md` Services |
| O30 | Fees as design purpose | Fees ≠ RVI | `value.md` |
| O31 | Insurance/credit/banking exist at all? | Do not assume | `status.md` |
| O32 | Sponsorship rights vs raids | P20 vs Rust fantasy | `external-demand.md` |
| O33 | Treasury after inflows named | Else tokenomics-by-treasury | `questions.md` Treasury |

### Financing / settlement

| ID | Question | Why it matters | Source |
| --- | --- | --- | --- |
| O46 | Lock, release, default, settlement math, lender-authorized senior spend | V25 is conceptual only | `architecture.md` XVI |
| — | World remainder assignment at Project end | Never via appraisal | Part XVI–XVII |
| O26 | Deposit/withdraw/freeze/trust | P15, P17, P29 | `questions.md` Capital |

### DLP / redemption

| ID | Question | Why it matters | Source |
| --- | --- | --- | --- |
| — | Redemption queues, insolvency, vault | 1:1 theory ≠ procedures | Part XV |
| O26 | Custody of DLP/ETH | Off-chain sim + deposits | `questions.md` |

### DYN

| ID | Question | Why it matters | Source |
| --- | --- | --- | --- |
| O34 | What the token does without violating P16 | Easy failure: staking *is* the game | `questions.md` Token |

### Marketplace / exchange

| ID | Question | Why it matters | Source |
| --- | --- | --- | --- |
| O15 | Where markets exist, empty/thin books | Architecture forbids completing this with NPC buyers | Part XIII |
| O16 | Game-level contracts | Unenforced = chat; over-enforced = the game | `questions.md` Contracts |

### Organizations

| ID | Question | Why it matters | Source |
| --- | --- | --- | --- |
| O8 | Actor kinds | Player/agent/org/NPC/sponsor | `domain.md` |
| O36 | Shared-agency orgs | Explodes every domain | Part XIX |
| O25 | Reputation object | Flavor vs unearned gate | `questions.md` Identity |

### On-chain boundary

| ID | Question | Why it matters | Source |
| --- | --- | --- | --- |
| O45 | Exact on-chain surface | After settlement objects exist | Part XXVIII |
| O40 | Sim operator, dispute, rollback | “Not your sim, not your bags” | `AUDIT.md` K; `questions.md` Authority |

### Seasonal reset / persistence

| ID | Question | Why it matters | Source |
| --- | --- | --- | --- |
| O20 | How real capital / E / sponsored prizes map at wipe | Central paradox of P17+P24+P15 | `value.md`; `questions.md` Seasons |
| O21 | Hoarding vs productive use vs tax | Late-season exit race | `questions.md` |
| O24 | Profile ownership / tradable history vs P11 | Mastery for sale | `questions.md` Identity |

### Other

| ID | Cluster | Source |
| --- | --- | --- |
| O1 | Kernel remainder / per-object classification | `domain.md` |
| O7 / O44 | Intel objects; map truth vs lie | `information.md` |
| O9 / O10 | Action kernel; event kernel | `intents.md`; `events.md` |
| O12 | Technology / blueprints vs P11 | `questions.md` |
| O18 / O19 | Conflict/grief/offline; loss and recovery | `conflict.md`; `offline.md` |
| O22 / O23 | Mastery surfaces; new-player path | P11, P13 |
| O35 | Asymmetric upside / lottery module (may be rejected) | P19 |
| O37–O39 | Population/shards; bots; social | `status.md` |
| O41–O43 | Instrumentation; circuit breakers; legal | `questions.md` |

`seasons.md` is referenced (L5, O3) but **does not exist**. Do not invent it to look complete (`README.md`).

---

## O. Known ambiguities / drift risks

1. **Control meaning vs mechanism.** Meaning = operational authority (`control.md`). O5 remainder = how. `AUDIT.md` 2026-09-03 §B still asks what control *means* — **HISTORICAL**; do not treat as current. Precedence: `status.md` O5 + `control.md`.
2. **Authorized issuer.** Constraint ≠ designed ACL. Do not add a second exclusive `control` slot.
3. **Protected senior vs 10/1/6.** Current = locked backing + separate opex. 10/1/6 = **SUPERSEDED**. Do not invent a waterfall to “replace” it.
4. **DLP vs World value.** Bilateral deal price ≠ protocol appraisal.
5. **RVI.** Requirement LOCKED; product OPEN. Tickets/sponsors in `external-demand.md` are exploration, not a P17 close.
6. **Marketplace vs NPC demand vs P14.** Three different things. O15 OPEN. NPC **buyers** REJECTED. P14 backstop OPEN and is not an NPC economy.
7. **Experiments vs architecture.** Local World Moves ≠ global economy lock. Capability vocabulary ≠ implementation primitives.
8. **Seasonal wipe vs persistent capital.** Experiments did not test wipe. S must not toy-wipe; W defaults seasonal; E mapping OPEN (O20).
9. **Presence vs afar operation.** OPEN. Do not freeze experiment body-at-Place as law, and do not silently allow teleporting operational authority.
10. **World outcome vs settlement.** Kit destroyed is W loss; does not spend senior or burn DLP supply by itself.
11. **Production while away.** W transformation (lots, vein), not hidden S / idle-claim (`production-while-away.md`; P9).
12. **Architecture “DECIDED” vs status OPEN.** Marketplace-not-a-primitive is architecture-local. DLP 1:1 is architecture PROVISIONAL, not a LOCKED money row in `status.md`.
13. **Contest vs Event.** Same *shape*; keep Contest **PROVISIONAL**; do not grow two combat engines (`AUDIT.md` cross-domain J; `conflict.md`).
14. **World `owner` field.** Would collapse title and control (`AUDIT.md` cross-domain E).

---

## P. Document map

`filename → owns → role`

| File | Owns | Role |
| --- | --- | --- |
| `README.md` | Corpus rules, precedence, reading order | Index |
| `principles.md` | P1–P30 tests | Highest constitution |
| `status.md` | L / V / O register + decision log | What is committed |
| `questions.md` | Unresolved questions | Does not answer |
| `domain.md` | Kernel five primitives; classification axes | Not the full game |
| `world.md` | Places, Sites, spatial relations | Control *meaning* deferred to `control.md` |
| `control.md` | Meaning of `control` | Not acquisition |
| `control-transitions.md` | How `control` may change (World writes) | Policy OPEN |
| `intents.md` | Intent / Action / Result; home routing | Not verb dump as law |
| `play.md` | Observe–choose–act; Play vs value | |
| `information.md` | Intel / knowledge-of / fog | Discovery ≠ control |
| `conflict.md` | `opposed-over`; requests, does not write World | Not steal-ETH |
| `events.md` | Events as processes that Intent other homes | Not lottery |
| `time.md` | Clock problem space | Clock OPEN; no Time domain |
| `offline.md` | Logout ≠ Leave / drop control / immunity | C+D persist |
| `production-while-away.md` | Offline production = W, not hidden S | |
| `value.md` | W/P/E/S books; RVI tests | Not tokenomics |
| `economic-engine.md` | Causal W economy; token=0 | RVI loop not closed |
| `external-demand.md` | Who would pay, for what | **No product selected** |
| `architecture.md` | Synthesis v0.1.2; experiments I; DLP XV; financing XVI; DYN XVIII | Not implementation; does not close OPEN |
| `AUDIT.md` | 2026-09-03 baseline + later provenance | **Not** the status register |
| `DIGEST.md` (this file) | Handoff extract | **Not** architecture |

---

## Q. Fresh-agent operating rules

1. **Corpus over conversation.** Reconstruct from `docs/design/`, not chat, memory, or generic game/DeFi architecture.
2. **Locked over provisional.** `principles.md` / `status.md` LOCKED outranks architecture sketches and experiment ESTABLISHED.
3. **Open means open.** Do not fill O-rows with invention. Do not promote OPEN → PROVISIONAL → ESTABLISHED → LOCKED without explicit justification and provenance.
4. **Experiments are evidence, not law.**
5. **Do not invent missing mechanisms** (RVI product, settlement waterfall, redemption, DYN tokenomics, authorization ACL, marketplace, orgs).
6. **Do not silently promote architecture.** Conversation ≠ `status.md`.
7. **Preserve provenance.** Mark SUPERSEDED / HISTORICAL. Do not let old examples become current rules. Do not rewrite `AUDIT.md` A–H merely to match later files.
8. **Challenge contradictions.** Name conflict, owning docs, precedence. Stale wording ≠ new design. Hygiene ≠ redesign.
9. **Distinguish game value from protocol revenue.** W/P play can be real without S profit.
10. **DLP is money; DYN is not DLP.** DYN is not revenue.
11. **World objects are not automatically money.** No implicit “worth X DLP” oracle.
12. **Protected senior backing is current (PROVISIONAL); 10/1/6 is SUPERSEDED.** Ordinary opex does not consume senior.
13. **Authorized issuer is not a second control primitive.** Hire/Direct/presence/title/pay do not automatically authorize.
14. **RVI is required; its mechanism is OPEN.** Deposits, P2P, World production, token mint, and chart are not automatically RVI.
15. **Do not start implementation by filling architecture gaps.** P30 / L29. If asked to code across an OPEN boundary, name the dependency; do not decide it.

If a user request conflicts with the corpus: identify the conflict, affected documents, and required changes; **wait for explicit confirmation** before promoting the idea into architecture.

---

## Self-audit (quality test)

A reader of **only** this digest should **not** conclude: senior is spendable by default; 10/1/6 is current; World objects have automatic DLP prices; DLP is a reward token; DYN is money; deposits are revenue; P2P is RVI; token issuance creates value; authorized issuer is a second slot; hire/Direct automatically create control; experiments are protocol law; marketplace is designed; NPC buyers exist; RVI or settlement is solved.

They **should** be able to tell LOCKED vs PROVISIONAL vs OPEN vs SUPERSEDED and which file owns the detail.

---

## Compression note

| | |
| --- | --- |
| Source corpus | ~8,200 lines across 21 files in `docs/design/` (excl. this digest) |
| This digest | Compact extract; not exhaustive |
| Intentionally compressed | Full principle tests; experiment narratives and named characters; domain classification axes; Intent family tables; `external-demand.md` candidate-by-candidate tests; AUDIT risk essays; architecture Parts XXV–XXXI tables |
| Must look up in source for detailed work | Any mechanism-adjacent design; exact O5/O46/O20 wording; kernel invariants; conflict/offline policy candidates; on-chain class table; the actual question text before proposing an answer |

**The source corpus remains authoritative.**
