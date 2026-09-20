# Dynasty system architecture

**Version:** 0.1.2  
**Status:** Post-experiment / pre-implementation. Conceptual architecture. v0.1.2 is a corpus-correction pass: protected senior backing replaces the superseded spendable-senior example; indexes and authority boundaries are made explicit. No new tokenomics, RVI, settlement math, or control mechanism.  
**Does not:** invent mechanics, patch the game, specify code, schemas, chains, UI, tokenomics, or revenue.  
**Source:** ten gameplay/economy experiments plus the existing design corpus (`principles.md`, `domain.md`, `world.md`, `value.md`, `economic-engine.md`, `intents.md`, `control.md`, `information.md`, and related files).  
**How to use:** This document synthesizes the current architectural model. Precedence: `principles.md` → `status.md` → domain-owning files → this synthesis → experiment evidence. It does not close OPEN items in `status.md` / `questions.md`. Where experiment language and corpus language overlap or conflict, the conflict is named.

---

## Document status of claims

| Mark | Meaning |
| --- | --- |
| **LOCKED** | Restates a principle or locked status item. Implementers must not violate it. |
| **ESTABLISHED (experiments)** | Repeatedly *observed* as a property of play/World in the ten experiments (not a rule the experiment merely imposed). Binding for *this* architecture unless an experiment is reopened. **Not** a `status.md` LOCKED row. Not an implementation requirement. |
| **PROVISIONAL** | Concrete in experiments or corpus sketches; not a requirement. Includes DLP backing until money is locked. |
| **OPEN** | Identified; not designed. Do not treat as a missing feature to invent. |
| **EXPLORATORY** | Thought experiment or candidate. Not architecture. |
| **REJECTED** | Must not be reintroduced as the base model. |
| **SUPERSEDED** | Older teaching that must not be used as current architecture. |

---

# Part I — Source of truth

The following experiments are **evidence** for the *gameplay/economy* architecture. They are not a content bible, not a protocol spec, and not `status.md` locks. Named places, people, and hour counts are illustrations of structure, not a required starting map.

Independent experiment files are **not** in this corpus; the summaries live here.

1. West Mouth / Hollow Gorge / first 30 minutes  
2. Hour 0.5–3  
3. Hour 3–12  
4. First Opportunity / Overlap Hold  
5. First Productive Chain  
6. First Dependency  
7. 32-actor / 150-hour population experiment  
8. Second Basin / Far Basin  
9. Two Operators, One Place  
10. The World Moves  

**Established observations (experiments)** — what play showed, not what the protocol must implement:

- Population does not automatically create an economy.
- Consequential Places (operable bottlenecks, unique clocks, Place-bound Directs) create economic centers.
- Geography creates asymmetric possibility.
- Capabilities enable attempts; they do not determine quality of outcome.
- Mastery is contextual, not a permanent stat.
- Mastery can transfer (training, observation, hiring ordinary procedure).
- Knowledge can decay; procedures can become obsolete when World state changes.
- Relationships can create temporary, non-purchasable advantages.
- Capital creates scale and organizational capacity; it does not automatically buy knowledge, judgment, consent, or geography.
- Ordinary capabilities can commoditize under repetition and capital.
- A Place can remain consequential when personnel change.
- World state can change because of previous operations (including successful ones).
- World change can create new desires, constraints, dependencies, exchanges, organizations, and Projects without a marketplace subsystem.
- Success can create a future constraint rather than a reward.
- Local economic structure can emerge from World relationships rather than from a separate marketplace subsystem.

**Do not overclaim from experiments.** They do **not** prove that the entire map self-organizes, that a global economy or global liquidity exists, that final financing/authorization/settlement rules are known, or that “no marketplace ever” is a `status.md` lock. World Moves verdict **A (adaptive economy)** was **local** to the notch, not a proof of the whole World.

**PROVISIONAL (imposed in experiments; not measured laws):** DLP as coordinator of wages and commitments; DLP 1:1 ETH backing; borrowed/senior DLP remaining in Dynasty-controlled structures rather than an unrestricted private wallet. Crypto-off (remove DLP, desires remain) is an **EXPLORATORY** thought experiment, not a live ledger proof.

**REJECTED as base financing (SUPERSEDED teaching):** treating senior/lender DLP as ordinary spendable Project operating capital (including the old `10/1/6` leftover-priority example). See Part XVI. That model was used inside some experiment/architecture examples; it is **not** the current base model.

**Foundational property (World Moves):**

```
WORLD → CONSEQUENCE → DESIRE → INTERDEPENDENCE
  → ORGANIZATION / CAPITAL → WORLD CHANGE → NEW CONSTRAINT → NEW ACTION
```

**Corpus alignment.** These conclusions are consistent with P5, P7, P9, P11, P12, P16, P21–P23, and with `value.md` (W/P/E/S split) and `economic-engine.md` (W transformation, P2P ≠ RVI). They do **not** close ExternalDemand (`external-demand.md`), revenue, DYN mechanics, or wipe mapping (O20).

**Known tension with corpus.** Experiments ran a *continuous persistent World* (hours 0–900) without a seasonal wipe. `principles.md` P24 / L5 still commit to seasonal World reset as a direction. This architecture describes **in-season** persistence and causality. Mapping that state across a wipe remains **OPEN**.

---

# Part II — Core system thesis

## Thesis (architectural, not marketing)

> DYNASTY is a persistent World in which players possess capabilities, knowledge, capital and relationships that allow them to perform consequential operations. Those operations alter World state. Altered World state changes the set of available opportunities and constraints, causing new player decisions, dependencies, exchanges, organizations and Projects to emerge.

Architecturally this means:

1. **The World is the primary store of economic possibility.** Desire, exchange, and organization are not modules that inject demand into a static map.
2. **Actors are not classes.** They are entities that can be present, attempt operations, hold knowledge, hold capital, and stand in relations.
3. **An operation is a consequential attempt/process** (World, Information, or Capital), not a reward claim and not a mere UI query. Persistent World residue is common, not definitional.
4. **The economic layer is a reading of World + actor constraints,** plus optional protocol money (DLP) and optional protocol ownership (DYN). Removing DLP must not remove the reasons to act (`economic-engine.md` token=0 test; World Moves crypto-off).
5. **Projects are not content.** They are the coordination form that appears when a handshake cannot bound the objective, resources, and settlement.

## Central loop (play)

```
WORLD → PERCEPTION → BELIEF → CHOICE → OPERATION → CONSEQUENCE → WORLD
```

This is P9 (`Observe → Choose → Act → Result → Respond`) with explicit epistemology: perception is not World truth (`information.md`). Belief may be wrong. Consequence may be World, Information, relational, operational, and/or economic — persistent or not.

## Emergent economic loop

```
DESIRE → ACTION → CONSTRAINT → DEPENDENCY
  → EXCHANGE / ORGANIZATION / CAPITAL → ACTION
```

Desire is terminal and World-situated (keep a route, not drown, figure out why the clock changed). It is not “need 10 DLP.” Action produces constraint (scarcity of windows, worn equipment, incompatible use of the same wet). Constraint produces dependency (A cannot self-supply what B uniquely has). Dependency may produce exchange, employment, patronage, a coalition, or a Project. Those produce further action, which writes World again.

## How the loops interact

The play loop is **always** running. The economic loop **sometimes** appears, when desires + scarcity + geography + capability differences make another actor useful.

They share World state. This architecture does **not** use a marketplace as a foundational primitive. Whether marketplace-like mechanisms may ever exist remains **OPEN** in `status.md` (O15). DLP, if present, is an instrument *inside* the economic loop (commitment, scale, settlement of claims). It is not a third loop that manufactures desire.

If the play loop runs and the economic loop never appears, that is a valid World (population experiment: extra people, dead offtake, idle labor). If a designer adds a shop to force the economic loop, this architecture has been abandoned. NPC buyers as a **demand engine** remain **REJECTED** (experiments + Part XXIV). That rejection is not a lock of O15.

---

# Part III — System layers

Layers are **conceptual**. They are not a required microservice list. Mapping to `domain.md` Domain homes is noted. P28 still applies: Presentation is never the source of rules.

### 1. WORLD

- **Purpose:** Canonical situated geography, conditions, infrastructure, resources-in-place, connectivity, operational aggregates.
- **Contains:** Places, Sites/infrastructure, `connects`, deposits/lots-in-place, conditions, scars, in-flight World processes.
- **Does:** Accepts operational Intents; mutates its records; publishes Occurrences.
- **May modify:** Its own canonical records only.
- **Dependents:** All play; Information queries; Economy/Projects that consume World facts; Protocol settlement that *references* World outcomes.
- **Must not:** Store actor beliefs; mint DLP; be a marketplace; equate discovery with control.
- **Invariants:** World-state ≠ knowledge-of-world-state. Persistent residue is an important possible consequence of operations; it is not required for an attempt to be an Operation.

### 2. ACTORS

- **Purpose:** Who can issue attempts, be present, hold relations.
- **Contains:** Identity, presence, capabilities-as-policy, commitments, affiliations (if any).
- **Does:** Issues Intents; occupies Places; enters relationships.
- **May modify:** Actor-home records (Identity); not World internals.
- **Dependents:** Every Intent.
- **Must not:** Be rigid classes; require an Organization to exist.
- **Invariants:** Player vs Organization vs contractor are roles/relations, not separate physics.

### 3. CAPABILITIES

- **Purpose:** Standing options to *attempt* families of operations.
- **Contains:** Actor-bound eligibility for intent families (Sense … Match, experimental vocabulary).
- **Does:** Constrains which attempts are credible.
- **May modify:** Nothing in World by itself.
- **Dependents:** Operations, specialization.
- **Must not:** Be XP, levels, guaranteed success, or mastery.
- **Invariants:** Capability ≠ mastery. Capability ≠ control relation.

**Overlap:** Corpus `intents.md` families mutate records; experimental capability names classify *who can attempt*. Both can exist if capability is policy on Intent kinds, not a sixth kernel primitive (`domain.md`).

### 4. KNOWLEDGE / INFORMATION

- **Purpose:** Actor-side epistemology (`information.md`).
- **Contains:** Observations, beliefs, Intel `holds`, `knowledge-of`, heuristics, sealed vs live records.
- **Does:** Changes what an actor will choose; does not change World by existing.
- **May modify:** Information records.
- **Dependents:** Choice quality; information exchange.
- **Must not:** Duplicate the map as omniscient truth; imply control (P21).
- **Invariants:** Incomplete and stale information is intended (P22).

### 5. RELATIONSHIPS

- **Purpose:** Persistent or semi-persistent actor–actor (and actor–Place) social/economic stance.
- **Contains:** Trust, refusal, employment, patronage, reliability, dependence, local familiarity.
- **Does:** Changes who is asked, who is believed, and (in experiments) who is willing to Direct. Whether a relationship is World-enforced eligibility remains **OPEN** (no home yet).
- **May modify:** Relationship records (home **OPEN**: Identity vs a later Orgs domain).
- **Dependents:** Flood veto, hiring, coalitions.
- **Must not:** Be a social meter that capital fills to 100.
- **Invariants:** Some relations are not DLP-purchasable (experiment: Sila flood trust).

### 6. ACTIONS / OPERATIONS

- **Purpose:** Attempts and in-flight processes that may change World, Information, commitments, or Capital — including holds, aborts, refusals, and interrupts.
- **Contains:** Intents, in-flight aggregates, results.
- **Does:** The play loop’s Act.
- **May modify:** Via home domains only.
- **Dependents:** Consequences, Projects.
- **Must not:** Be login-wait-claim (P9); be payments disguised as verbs; be equated with a durable scar.
- **Invariants:** Same capability, different context → different outcome. Queries and meaningless UI are not Operations.

### 7. PROJECTS

- **Purpose:** Bounded, stateful, multi-party operations with committed resources and a settlement condition.
- **Contains:** Objective, participants, committed resources (World and/or monetary), operating state, residual World. Monetary structures (backing vs operating balances) are referenced, not identical to the Project.
- **Does:** Coordinates what a handshake cannot.
- **May modify:** Project aggregate + requests World/Capital.
- **Dependents:** Financing, organizations.
- **Must not:** Be quests, APY products, or reward containers; collapse into “the purse.”
- **Invariants:** Emerge from coordination problems; World outcome uncertain; settlement *math* **OPEN**.

### 8. ECONOMIC EXCHANGE

- **Purpose:** Transfer of goods, services, rights, information, or DLP between actors because of incompatible desires/constraints.
- **Contains:** Bilateral (or few-party) transfers; employment; retainers; Bind-style commitments. **Not** a marketplace primitive in this architecture.
- **Does:** Clears some dependencies.
- **May modify:** Custody/title/DLP as their homes allow.
- **Dependents:** Specialization, capital recirculation.
- **Must not:** Manufacture demand. Play must not be hard-gated solely by an empty player market (P14). P14 is about **availability of required services/verbs**, not about NPC **buyers**. Whether a service backstop exists is **OPEN**. A backstop, if ever required, would not imply an NPC demand economy. Experiments forbade NPC buyers as a source of demand; that ban is separate from P14 and from O15.
- **Invariants:** P2P transfer ≠ external value creation. A bilateral DLP transfer is an exchange, not a protocol-wide appraisal of a World object.

### 9. CAPITAL / FINANCING

- **Purpose:** Scale operations that exceed one actor’s buffer, without turning lender backing into ordinary opex.
- **Contains:** Senior backing, operating/junior capital, claims. **PROVISIONAL** conceptual structure (Part XVI). Exact objects **OPEN**.
- **Does:** Funds Projects by locking protected senior backing and separately authorizing operating capital.
- **May modify:** Capital/Protocol records.
- **Dependents:** Large Erect/Direct campaigns.
- **Must not:** Exist as “borrow 10 ETH” with no World object; treat senior backing as spendable wages by default; send borrowed/senior capital into an unrestricted private wallet.
- **Invariants:** Senior backing is protected from ordinary operating loss. Operating capital is separately authorized. Borrowed/senior DLP remains in Dynasty-controlled structures.

### 10. DLP

- **Purpose:** Internal monetary unit for coordination, commitment, wages, and locks **PROVISIONAL** (not a `status.md` lock of implementation).
- **Contains:** Balances, locks, distinct monetary roles (free / operating / senior backing), redeemable claims. Exact structure **OPEN**.
- **Does:** Moves inside Dynasty; redeems to ETH if backing holds.
- **May modify:** DLP/ETH books only via Protocol rules.
- **Dependents:** Financing, some exchanges.
- **Must not:** Create desires; inflate because the game “paid” someone from nowhere; mint or burn because World succeeded or failed.
- **Invariants:** Redeemable DLP is 1:1 ETH-backed. **PROVISIONAL** until money is locked. World events do not mint or destroy DLP supply. World objects are not automatically DLP. No second “ETH-denominated claim” money.

### 11. DYN / OWNERSHIP

- **Purpose:** Protocol/project token representing *participation in surplus/revenue if any exists* **PROVISIONAL**.
- **Contains:** Balances, maybe stake — **undesigned**.
- **Does:** Not required to play (P16).
- **May modify:** Token records only.
- **Dependents:** Nothing in the play loop.
- **Must not:** Be DLP; be an emission faucet; be the source of revenue; substitute for World economy; be mistaken for RVI.
- **Invariants:** DYN ≠ revenue. Supply/emissions/governance **OPEN**.

### 12. PERSISTENCE / HISTORY

- **Purpose:** What remains after an operation or session.
- **Contains:** Scars, infrastructure, depleted deposits, equipment, relationships, knowledge, Project history, operational history.
- **Does:** Feeds the next perception and the next constraint set.
- **May modify:** Lifetime-classified records (`domain.md` axes).
- **Dependents:** Progression-as-consequence (not XP).
- **Must not:** Be a level number; wipe settlement-grade deposits as a toy (P15/P24).
- **Invariants:** Play → consequence → option/knowledge. Seasonal wipe mapping **OPEN**.

---

# Part IV — World model

Definitions must not blur. Corpus names in parentheses where they already exist.

| Term | Definition | Not |
| --- | --- | --- |
| **WORLD** | The domain (and instance) of situated geography and conditions. | The whole product; the economy; the token |
| **PLACE** | A locus / graph node. Empty space is allowed (`world.md`). | A Site; an NFT plot; a class |
| **SITE** | Occupying aggregate at a Place (`situated-at`). Operable internals. | The Place itself |
| **RESOURCE** | Situated matter, energy, or World substance (deposit, lot-in-place, water, heat). | A wallet balance; a quest item |
| **RESOURCE LOT** | Movable/extracted quantity with location and custody. | Automatically ETH |
| **TOOL / EQUIPMENT** | World object that enables or constrains operations (kit, leaves, damper, winch). | A capability; an XP stick |
| **ASSET** | Economic-significance *classification* of an entity (play-only / meaningful / settlement-grade). | A gameplay verb; a kernel type (`domain.md`) |
| **CAPABILITY** | Actor-bound standing option to attempt a family of operations. | World object; mastery |
| **KNOWLEDGE** | Actor-held information, records, beliefs, heuristics. | World truth |
| **ACCESS** | World relation: may enter/use. | Control; discovery |
| **INFRASTRUCTURE** | Persistent World structure or operable route/site aggregate. | A guild; a token |
| **CONNECTS** | Traversable (or operable) link between Places. May be reified when the link has state. | The entire game; ordinary Haul |
| **CONDITION** | Time-situated World quality (wet, seiche window, fog, flood regime). | A quest flag |
| **WORLD STATE** | The full canonical World record set at a time. | What any actor knows |
| **PERSISTENT CONSEQUENCE** | World (or relationship/knowledge) residue that outlives the operation that caused it (scar, eased leaf, dead market, open pin). | A toast notification |
| **OPERATIONAL STATE** | Configuration of an aggregate or in-flight process (pin OPEN, lock holding drawdown, haul in transit). | Settlement |
| **OUTPUT** | Immediate product of an operation (lot, mark, seated damper, notice given). | Meaning |
| **OUTCOME** | What the output *means* for actors, capital, World, and future possibility (route lives, Sila not flooded, Goss procedure dead). | The output object itself |
| **CONTROL** | World relation: operational authority over a subject (`control.md`). | Title; presence; Direct-as-stat |
| **DIRECT** (experiments) | Capability family: attempt to operate/time/hold an operable aggregate. | Automatic `control`; a class |

**Overlap (named, joining mechanism OPEN):** **Direct** is a capability (standing option to *attempt* operate/time/hold). **`control`** is the World relation in `control.md`: World treats related issuer(s) as operational authority (accepts a defined family of operational Intents). **Operate** is typically a ChangeAggregate Intent. **Patron** (hires/funds) ≠ **operator** (runs) ≠ Direct ≠ `control`. An actor may hold `control` and Direct poorly. Experiments observed **hiring**: a patron paying someone else to run an operable aggregate. That pattern does **not** specify how World comes to accept the hiree’s operational Intents.

**Authorized issuer (conceptual constraint only):** If supported, an additional authorized issuer is a **mode of an existing `control` relation**, not a second control primitive, not a second exclusive control slot, not hidden ownership, not automatic hire/pay/trust/Direct/presence/title/finance authority, not a relationship ACL, not capital-based agency, not permanent floating permission, and not a puppet of another actor’s Intents (`control.md` §4). A named controller remains the unique exclusive operational authority of the relation. World may additionally accept specified operational Intents from additional issuers **while that control relation exists**. Exact scope, duration, revocation, concurrency, chains, afar rules, and organizational implementation remain **OPEN**. Do **not** treat “Direct without `control`” as a settled architectural fact. Delegation/mandate remains **OPEN** (`control-transitions.md`).

**Overlap:** **Infrastructure** vs **Site** vs **Equipment**. Site is the occupying entity; infrastructure is the persistent operable structure (often the Site); equipment is typically movable or replaceable kit. A reseated leaf is infrastructure *and* equipment-like. Implementation may use one aggregate with roles rather than three tables — conceptually they must stay distinguishable.

---

# Part V — Graph / geography

**Principle (experiments + P3):** Geography is not scenery. It determines reachability, transport scale, where capabilities can be exercised, where infrastructure can exist, where presence often matters, what can be controlled, where bottlenecks are, and which regions *can* couple economically. Physical presence ≠ operational eligibility; operational-from-afar remains **OPEN**.

| Concept | Meaning |
| --- | --- |
| **PLACE** | Node. |
| **CONNECTS** | Edge. Ordinary meaning: traversal/logistics. |
| **OPERABLE CONNECTION** | A `connects` (or Site on it) that requires Direct/control to use at kit scale (Salt Notch lock). |
| **PERSON ACCESS** | A body can traverse (goat shelves). |
| **KIT-SCALE ACCESS** | Equipment/lots can traverse only under operable conditions. |
| **PLACE-BOUND OPERATION** | An operation whose *subject* cannot be teleported; hiring a person does not move the Place (Wren’s lock ≠ Orrin’s ridge eye). Distinct from whether the issuer must be physically present (**OPEN**; `control.md` operational-from-afar). |
| **GRAPH CHANGE** | Mutation of Places/`connects`/impedance. Rare, high-consequence when it is a true topology change. |

**`connects` as a verb** (Highland / graph authorship, **PROVISIONAL**): a rare operation that *authors* a World graph relation at a Place that basins cannot join from below. It is **not** the game. Most play is presence, operate, haul, sense, contest — on an *existing* graph.

**Economic coupling** is not implied by “two Places exist.” Coupling requires a World cause (route, shared water, capital attention, migration, complementary kit). West Mouth and Far Basin remaining weakly coupled was a valid result.

---

# Part VI — Actor model

**Actor:** An entity some domain accepts as an Intent issuer, with identity and (typically) presence.

**Potential components (not a mandatory schema):** identity; location/presence; capabilities; knowledge/beliefs; capital; equipment (custody); relationships; commitments; Project participation; organizational affiliations; history.

| Term | Meaning |
| --- | --- |
| **ACTOR** | Issuer-capable entity. |
| **PLAYER** | Human-backed Identity. Not a kernel subtype. |
| **ORGANIZATION** | Optional entity/relation bundle for repeated coordination. **OPEN** as a required system (O36); **emergent in experiments**. |
| **CREW** | Repeated co-presence and complementary operations. Informal. |
| **EMPLOYEE** | Wage relation; operational kind without residual claim. |
| **CONTRACTOR** | Bounded service (window fee, start/not call, abort-read). |
| **PATRON** | Capital/relationship that funds or retains without necessarily operating. |
| **OPERATOR** | Who actually runs/Directs the aggregate (may not be patron). How a hiree becomes an authorized operational issuer is **OPEN**. |

Roles emerge from repetition (P5). Do not ship character-create classes.

**Overlap:** Organization vs Relationship vs Project. A Project is bounded and settles. A relationship may outlive it. An organization is repeated coordination that may have no settlement date. Experiments produced crews, patronage, and temporary coalitions without a guild object.

---

# Part VII — Capability model

**Capability** = ability to credibly *attempt* a family of operations.  
**Mastery** = quality of decisions when exercising capability (timing, refusal, reading conditions, who to trust).

No numerical skill levels were established. Do not add XP, classes, or stat progression.

### Families (experimental vocabulary — **PROVISIONAL names**, not `status.md` LOCKED primitives)

Corpus equivalent: policy on `intents.md` families, not extra kernel primitives.

| Family | Means (experiments) | Typical World mutation |
| --- | --- | --- |
| **Sense** | Perceive conditions, marks, drift, windows. | Information write; maybe none |
| **Assay** | Judge quality/composition/fitness of a lot or structure. | Information; sometimes gate Transform |
| **Extract** | Take resource from a situated deposit. | Deposit/lot |
| **Transform** | Change form of a lot or aggregate (process, mill). | Lot/Site internals |
| **Haul** | Move lots/kit along `connects` under conditions. | Presence/situation of lots |
| **Erect** | Build, seat, ease, modify infrastructure. | Site/`connects`/aggregate |
| **Sustain** | Maintain, berm, keep a condition livable. | Aggregate/conditions |
| **Direct** | Time, hold, stack, abort operable process (lock, pin, damper, scrape). | Operational state |
| **Deny** | Prevent use, hold closed, refuse a window. | Access/ops ineligibility |
| **Bind** | Commit a future operational stance (flood veto, notice-before-open). | Commitment/relation |
| **Underwrite** | Put capital at risk in a controlled structure. | Capital/Project |
| **Match** | Introduce counterparties or clear a need **without a global order book**. Rare; **underdefined**. Experiments mostly used bilateral ask. |

**Capability is not:** XP, level, permanent power multiplier, class, guaranteed success, mastery.

**Mastery can:**

- **Transfer:** Goss trained Pike on ordinary lock Direct; Kess received flood procedure.
- **Decay / obsolete:** Goss wind-count after hydrology shift; Sol’s old binder; OPEN AT RED.
- **Become locally valuable:** Sol live seiche after notes died; Yew unbuild; Sila dump-shape.
- **Become irrelevant:** Rusk “I can open anytime”; Orrin more liquid than Places (specialist vs Place-bound — a *flaw* to remember, not a feature to maximize).

**Place-bound vs liquid mastery:** If mastery is only in a person’s head and the Place does not require them, capital hires them away (Orrin). If the Place’s operable clock cannot move, hiring does not teleport the bottleneck (Notch). Architecture must preserve both *as World facts*, not as class tags.

---

# Part VIII — Knowledge / information

| Term | Meaning |
| --- | --- |
| **Observation** | Issuer-scoped query result; not automatically retained. |
| **Belief** | Actor’s current epistemic stance (`knowledge-of`); may be false. |
| **Information** | Domain of retained claims and holds. |
| **Record / Intel** | Holdable object asserting claims. |
| **Heuristic** | Compressed procedure (“count Outer winds”). Fragile under World change. |
| **Stale information** | Record whose as-of no longer matches World. |
| **Uncertainty** | Classification of a claim; not a confidence percentage. |
| **Sealed information** | `holds` without assimilated contents. |
| **Live information** | Observation or record tied to current conditions (Sol sitting the Still). |
| **Information asymmetry** | Intended (P22). |

**Why this is gameplay:** The World does not expose perfect state. Sense → observation → belief → decision can be correct or wrong. After World Moves, multiple actors formed incompatible beliefs; acting on them wasted capital or saved a camp.

Selling information is E among players, not RVI. Authentication of information (how a client proves a mark) is **OPEN**.

---

# Part IX — Relationships

Relationships are persistent or semi-persistent state, not a 0–100 bar.

Examples from experiments: trust; refusal (Wren wage, Carol Transform without offtake); cooperation (emergency lock); reliability; priority; reputation (**OPEN** as a computed object, O25); local familiarity; dependence; employment; patronage; Bind (Sila camp pool / flood veto).

**Economic value without currency:** Sila trusting Wren during flood was, in experiment, a constraint on *who she would accept*. More DLP did not rewrite it. Reed can **hire** Goss for throughput and still fail that constituency. Hiring is an observed pattern; World authorization of the hiree remains **OPEN**.

**Must not:** social-meter RPG; purchasable max trust; faction IDs that mint quests.

**Underdefined:** canonical home, decay, forgery, display. Treat as Identity/World-adjacent records until O25/O36 are designed.

---

# Part X — Action / operation model

**Session loop:** Observe → Choose → Act → Result → Respond.

| Term | Meaning |
| --- | --- |
| **INTENT** | Proposed mutation to one home domain (`domain.md` / `intents.md`). |
| **ACTION** | Player-facing attempt; maps to an Intent (and maybe a query). |
| **OPERATION** | A consequential attempt or in-flight process governed by World, Information, and/or Capital rules (may span duration if it creates exposure/choice, not wait-claim). Includes hold, maintain, abort, refuse, prevent, interrupt, Sustain, Bind, Direct. Not a UI click or a pure query. |
| **RESULT** | Domain outcome: accepted, rejected, failed, succeeded, interrupted, aborted (`intents.md` / `play.md`). |
| **CONSEQUENCE** | What follows for actors and records. May be persistent, temporary, operational, informational, relational, and/or economic. Persistent residue is important when it occurs; it does not define Operation. |

The same capability yields different outcomes given timing, location, information, other actors, equipment, conditions, relationships, capital, and judgment.

---

# Part XI — Project model

> A Project is a bounded, stateful operation undertaken by one or more participants, requiring committed resources, pursuing a defined objective, and eventually reaching a settlement condition.

**Emerges when** desire + bounded objective + participants + committed resources + execution + settlement cannot reasonably be a simple action/handshake (Notch Leaves; pinch damper; Leaf Ease). **Does not emerge** because the design needs a quest.

| Element | Role |
| --- | --- |
| Objective | Bounded World change (seat damper; ease leaf), not “gain XP” |
| Operator | Who runs; not automatically the financier |
| Participants | Capabilities present |
| Required capabilities / resources | World-real |
| Senior backing | Lender-provided locked DLP; not ordinary opex (Part XVI) |
| Operating / junior capital | Separately authorized capital that may be consumed by permitted expenditure |
| Monetary structures | Must not collapse backing, opex, and settlement cash into one undistinguished purse |
| Operating state | In-flight World + Project aggregate |
| Conditions / risks | Uncertain World |
| Outputs | World mutation; operating DLP may be consumed; kit may remain as World objects (not appraised into DLP) |
| Duration | Only if decision-bearing |
| Settlement | Redistributes **existing** monetary claims; math **OPEN**; no appraisal |
| Failure / halt | Allowed; residual World remains; ordinary operating failure does not consume protected senior backing |
| Residual World state | Leaves, scars, eased leaf — not rolled back because finance failed; remains World unless a later rule assigns title/custody/`control` |

**Joins OPEN:** Project vs organization vs financing arrangement vs handshake; exact lock/custody objects; when settlement fires; assignment of World residue.

**A Project is not:** quest, investment product, APY contract, arbitrary ETH sink, guaranteed return, reward container.

---

# Part XII — Project state machine

**Candidate from experiments (supported):**

```
PROPOSED → FINANCED → OPERATING → SETTLEMENT
```

Also observed: **never proposed** (handshake only); **halt** during operate; **failure** into settlement with residual World; **refusal to form** (valid).

| Transition | Allowed? |
| --- | --- |
| Proposed → Financed | If commitments meet threshold |
| Proposed → Abandoned | Yes (no World write required) |
| Financed → Operating | When operator starts; backing locked; operating capital authorized (objects **OPEN**) |
| Operating → Settlement | Success, failure, or halt that ends the bound |
| Operating → Halted | **PROVISIONAL** extra state if halt is pause-not-end |
| Settlement → Operating | **Invalid** (new Project if more work) |
| Financed → Settlement | If never operated (unwind rules **OPEN**) |
| Settlement → Financed | **Invalid** |

**Not established:** a marketplace listing state; investor secondary market; rolling “seasonal fund.”

Do not add states for architectural completeness.

---

# Part XIII — Economic model

**Start from World, not tokens.**

Economy emerges from:

**Desire + scarcity + geography + capability differences + information + timing + dependency + consequence + capital.**

That produces, when conditions hold:

| Form | How it appeared |
| --- | --- |
| Exchange | Incompatible wants (Carol haul vs Orrin eye; window fees) |
| Employment | Reed wages Goss/Pike/Orrin |
| Contracting | Per-window, abort-read, start/not calls |
| Specialization | Place-bound Direct vs liquid Sense |
| Patronage | Reed funds; Sila camp pool |
| Organizations | Scrape crew; temporary Leaf Ease coalition |
| Financing | Junior/operating capital + protected senior backing |
| Competition | Wren vs Goss on one lock |
| Cooperation | Storm + Still lurch once |

**Marketplace.** This architecture does **not** treat a marketplace as a foundational primitive. Exchange is actor-to-actor. A later matching facility would be optional infrastructure, not the economy (`economic-engine.md`). **`status.md` O15 remains OPEN:** whether marketplace-like mechanisms may ever exist is not locked here. Do not invent a marketplace to “complete” the economy. Do not invent NPC buyers as demand.

**Lots offtake can die.** A production chain without a real desire does not become a market because people exist (population experiment; First Productive Chain).

---

# Part XIV — Value creation

`value.md` books:

| Book | Meaning |
| --- | --- |
| **W** | World state |
| **P** | Persistent player (capability, knowledge, identity) |
| **E** | Exchangeable rights/goods in play |
| **S** | Settled external capital |

**REAL VALUE IN → REAL VALUE OUT** is a **LOCKED** requirement (P17 / L2), **not** a designed product.

| Phenomenon | Creates external value? |
| --- | --- |
| External capital deposited (ETH → DLP) | Capital *in the box*, not revenue / not RVI by itself |
| Internal DLP transfers | No |
| Player-to-player exchange | E, not RVI |
| Productive World activity | W; not automatically revenue or DLP |
| Minting DLP against ETH deposit | Conversion, not creation |
| Minting DYN | Not revenue |
| Token price appreciation | Not revenue |

**Genuine external revenue** would be an outside party paying because they receive use, association, access-to-play, or a right they want for itself (`external-demand.md`). **No mechanism is selected.** There is **no fully designed RVI mechanism** in this corpus.

**Conceptual product (unresolved monetization):** Dynasty provides a persistent strategic World in which real capital can participate in protocol-enforced operations.

**Revenue design: OPEN / NOT YET DESIGNED.** Do not invent one here. Do not treat internal circulation as external value creation.

---

# Part XV — DLP

**PROVISIONAL until money is locked in `status.md`.** Implementation, redemption queues, insolvency, vault architecture, and contracts remain **OPEN**. Do not reopen the 1:1 theory merely because those procedures are OPEN.

**What DLP is:**

- DLP is Dynasty’s **internal monetary unit**.
- DLP is **1:1 backed by ETH**.
- ETH deposit → corresponding DLP (conversion, not value creation).
- Redemption reverses that relationship **subject to redemption mechanics** (**OPEN**).
- DLP is **not** the Project token and **not** DYN.
- DLP transfers **redistribute existing** monetary claims. They do not mint supply.
- Wages and operating payments are **transfers from an existing backed holder or operating balance**, not new DLP.

**Supply conservation:**

- World events do **not** automatically mint or burn DLP.
- World objects are **not** automatically DLP and have **no protocol-wide DLP price**.
- Project success does **not** automatically mint DLP.
- Project failure does **not** automatically burn DLP.
- Destroying equipment, windows, or infrastructure does **not** destroy DLP supply.
- A Project can destroy World value while DLP units remain in circulation.

**World ≠ money:** a World object can be scarce, useful, and economically important without being “worth X DLP.” A bilateral DLP transfer can price a deal between parties. That is not a protocol appraisal, oracle, NPC bid, NPV, or book value.

**States (conceptual; exact objects OPEN):**

| State | Meaning |
| --- | --- |
| **FREE DLP** | Actor-controlled, transferable, redeemable per Protocol |
| **LOCKED DLP** | Restricted (lock kinds **OPEN**; senior backing is one intended kind) |
| **COMMITTED / ESCROWED** | Bound to a relation or future act |
| **OPERATING CAPITAL** | Authorized spendable DLP for Project expenditure (wages, inputs, equipment, permitted costs) |
| **SENIOR BACKING** | Lender-provided DLP locked as protected backing; **not** ordinary operating money |
| **REDEEMABLE CLAIM** | Right to redeem DLP for ETH 1:1 per Protocol. Not a second money invented to patch backing |

**Backing (single theory, PROVISIONAL until locked):** every redeemable DLP is backed by an equivalent amount of ETH in the protocol vault. Do not introduce a parallel ETH-denominated IOU as a substitute for that backing.

**Overlap:** DLP is S when redeemable; in-play use is E-coordination. Do not create a fifth value book for DLP (`value.md`).

**SUPERSEDED — do not use as current architecture:** an older example treated a 10 DLP senior deposit + 1 DLP junior as a **single spendable Project purse of 11**, paid 5 in wages, left 6, and assigned the 6 to senior as “first claim on leftover” with a 4 DLP “senior shortfall.” That example **commingled protected backing with operating money**. It is **not** the base financing model (Part XVI). If encountered in older notes, treat it as **SUPERSEDED**.

---

# Part XVI — Financing

**Base model (current architecture; lock/custody/release/settlement mechanics remain OPEN):**

> Senior capital is protected, locked backing. It is not ordinary Project operating capital.

**Conceptual example (not a settlement waterfall, not a schema):**

Alice wants to start a mine requiring 10 DLP of senior backing. Reed supplies 10 DLP. That 10 DLP becomes **locked senior backing** for the mine. It is **not** ordinary Project operating money. Alice separately supplies operating/junior capital. The mine may consume the **operating** capital during ordinary operation (wages, equipment, inputs, other explicitly permitted expenditure). Ordinary operating losses **do not consume** Reed’s protected 10 DLP. Exact lock, custody, release, default, settlement, and lender-authorized-spending mechanics remain **OPEN**.

```
World opportunity → Project → operator operating/junior capital
  → financing requirement → senior backing locked
  → operation consumes operating capital (not senior backing)
  → World outcome → settlement of existing monetary claims
```

No “borrow 10 ETH” against the void.

**Roles (conceptual — do not assume one undistinguished purse holds all of them):**

| Role | Meaning |
| --- | --- |
| **Senior / lender capital** | Lender-provided; locked/committed; **backing/security** for the financing arrangement; **protected from ordinary Project operating loss**; not ordinary opex |
| **Operating / junior capital** | Separately authorized capital that **may be consumed** by wages, equipment, inputs, operating costs, other explicitly permitted expenditure |
| **Monetary remainder** | Actual DLP balances/claims that still exist at settlement (operating leftovers, still-locked backing, other named DLP). Not World objects. |
| **World remainder** | Surviving equipment, resources, Sites, infrastructure, outputs, Intel, other World objects. Remain World state unless an explicit future rule assigns title/custody/`control`. **Not DLP.** |
| **Project purse / balances** | A convenient name for Project-related DLP structures. **OPEN** whether one object or several. Must **not** silently mean senior + opex + settlement cash + lender claim as one spendable pot |

**Borrower-control (PROVISIONAL custody constraint):** borrowed/senior DLP **never** enters the borrower’s **unrestricted private wallet**. It remains in Dynasty-controlled structures. That constraint does **not** make senior backing spendable opex.

**Lender-authorized spending:** If Dynasty eventually supports a lender **explicitly authorizing** some protected senior capital to be spent, that is a **separate financing arrangement**. It does **not** redefine the base model. Do not design that arrangement here.

**Junior / operator:** subordinate/residual claim on **named monetary remainder** and/or at-risk **World** kit, per Project terms (**OPEN**). Not a protocol promise that junior absorbs every World loss. Not a mixed “recoverable Project value” that adds DLP + kit + hypothetical sale prices.

**World outcome:** uncertain. Destroyed kit is World loss; it is **not** appraised into DLP and does **not** delete DLP supply. Project failure as a World operation does **not**, by itself, spend protected senior backing.

**Settlement (conceptual boundary; math OPEN):**

- World state determines Project outcomes.
- Financial settlement redistributes **existing** DLP claims.
- World remainder stays World remainder.
- World remainder does not automatically become DLP.
- Settlement does not itself constitute external revenue.
- Do not invent appraisal, liquidation oracles, NPC buyers, NPV, book value, or protocol valuation.
- Do not invent a single additive quantity “recoverable Project value” = DLP + World objects + hypothetical sale value.

**Not a yield product:** Projects are not protocol-guaranteed returns. Protected backing is **not** the same as a promised profit. Release conditions, default, fraud, and unauthorized drain remain **OPEN** as mechanisms — they must not be used to smuggle ordinary opex through senior capital.

**REJECTED as base model:** senior DLP as ordinary spendable Project capital; wages paid from senior by default; senior exposed to ordinary operating loss merely because the Project operates; leftover-priority-on-a-commingled-purse as the meaning of seniority; “not senior protection” as architecture law.

---

# Part XVII — Project balance sheet

**Conceptual, not a schema. Not a valuation.**

**World / operating side (not money):** inventory/lots; equipment; infrastructure (if Project-custodied); in-flight operational state. Strategically valuable ≠ priced in DLP.

**Monetary side:** operating DLP balances; locked senior backing; other named DLP claims. These are **existing units**, not appraised World.

**Claims (conceptual):** senior backing as a financing relation; other named monetary claims; junior/operator residual on **named monetary remainder** and/or World kit per terms (**OPEN**).

**OPERATIONAL VALUE ≠ MONETARY REMAINDER ≠ WORLD REMAINDER.** A running lock can be operationally valuable and barely salvageable. Settlement must not invent a mark-to-model of “the economy of Far Basin,” and must not appraise destroyed or surviving equipment into DLP. How (if at all) named World objects change title/custody/`control` at Project end is **OPEN**, never via hidden price.

---

# Part XVIII — DYN / ownership layer

**PROVISIONAL concept:**

DYN is a Project/Protocol token: market-traded, speculative, possibly earned under eventual rules, possibly staked, *intended* to represent participation in Dynasty’s actual ETH-denominated surplus **if such surplus exists**.

**DYN is not:** DLP; required to play; a reward emission; the source of revenue; an APY faucet; a substitute for the game economy; value creation by issuance.

**OPEN (do not invent):** supply schedule, emissions, staking APY, governance, DAO, allocations, legal ownership meaning, buybacks.

**REJECTED patterns (ANTE-like; constraints, not a tokenomics design):** inflationary mining; emissions for merely sitting/staking; early-entry structural advantage as the product; “stop playing and collect”; token issuance mistaken for value creation; circular token/treasury demand loops (buy/stake → emissions → perceived wealth → more buying → treasury appreciation).

P16/L18–L19 remain LOCKED: play without token; coherent at price 0; holders not unbeatable.

---

# Part XIX — Organizations

Not a predefined guild system (O36 still OPEN as a *module*).

They arise because repeated coordination is valuable; capabilities complement; capital needs operators; information needs coordination; geography rewards presence; Projects exceed one actor.

**Forms observed:** crew; partnership; patronage network; temporary coalition; employer/employee. Firm as a legal object **not** established.

Remain emergent unless later design formalizes them. Formalization must not mint factions, quests, or designer jobs.

---

# Part XX — Persistence

**May persist (in-season, ESTABLISHED):** World changes; depleted resources; infrastructure; scars; equipment; relationships; knowledge; reputation (**if modeled**); Projects (history); organizations (if any); routes; operational history; consequences.

**Progression:**

```
PLAY → CONSEQUENCE → OPTION / KNOWLEDGE
```

**Not:**

```
XP → LEVEL → VERB
```

History changes what you can do by changing the World and the actor’s options (P25), not by stacking output multipliers.

**Across seasons:** P persists; W defaults to seasonal; S must not toy-wipe; E mapping **OPEN** (O20). Experiments did not test wipe.

---

# Part XXI — Capital vs agency

**CAPITAL ≠ AGENCY** (P11).

**Capital can buy:** attempts; equipment; redundancy; people; time; scale; infrastructure; financing; information *where legitimately purchasable*.

**Capital cannot automatically buy:** first discovery; correct judgment; mastery; another person’s refusal; trust; geography; being physically present in two Places at once; the right answer under uncertainty. Whether operational Intents can be issued from afar (without presence) is **OPEN** (`control.md`).

**Do not nerf wealth.** Mega-funders are intended. Reed may build institutions and exert enormous influence. Constraint: money must not collapse every other source of agency into a shop menu.

Whale domination is an **economic/social exploit class**, not solved by secretly weakening rich players.

---

# Part XXII — Specialization

Emergent. No classes.

**Why can’t everyone do everything?** Not because of class gates.

Observed constraints include: **physical presence** (one body at a time); **Place-bound subjects** (hiring does not move the lock); **kit-scale vs person-scale access**; **information that must be live**; **relationships that are not transferable**; **opportunity cost of attention**; **equipment custody**; **refusal**; **time**; **capital that still needs someone who can actually operate**.

Physical presence is not the same as operational eligibility. Experiments often required a body at the operable Place. `control.md` leaves **operational-from-afar OPEN**. This architecture does **not** lock a one-body/one-Place Direct rule. Wealth, organizations, and hiring will make the distinction economically significant; the join is unspecified.

Everyone *may attempt* what policy allows (P5). P14 is about not being hard-gated when no player offers a **required service**, not about inventing demand. Quality, access, and consequence still diverge.

---

# Part XXIII — Economic coupling

**LOCAL ECONOMIC DENSITY:** how much interdependence exists *around a Place* (Far Basin lock economy).

**INTER-REGIONAL ECONOMIC COUPLING:** whether two densities share causes (West Mouth ↛ Far hydrology).

Far Basin adapted; West Mouth did not join automatically. **Not necessarily a flaw.**

**Principle:** ECONOMIC COUPLING MUST HAVE A WORLD CAUSE.

Possible causes (not mandatory mechanics): physical routes; shared infrastructure; complementary operations; information dependencies; migration; capital flows; resource chains; strategic competition; organizational expansion.

Do not add a global market to “fix” isolation.

---

# Part XXIV — What Dynasty is not

| Not | Why it conflicts |
| --- | --- |
| Casino with token rewards | Desire must be World-situated; rewards-as-desire fail crypto-off and P6 |
| Inflationary mining game | DLP cannot mint from play; W lots ≠ S |
| XP/class RPG | P5, P25; mastery is contextual |
| Farming simulator | First Productive Chain: production without desire is dead |
| APY simulator | Projects are not yield products |
| Marketplace-first economy | Exchange is consequence of dependency, not a venue that creates demand |
| Resource spreadsheet | P7; geography, timing, judgment |
| Generic DeFi wrapper | World simulation is the product; chain is settlement/ownership (P29) |
| Pay-to-win strategy | P11: power ≠ mastery |
| Token price Ponzi / ANTE-like loop | P6, P16; emissions, idle collect, circular treasury demand |
| Endless quest treadmill | Projects emerge; World is not a content calendar |
| NPC job economy / NPC buyers | Designer-created **demand** (NPC purchasers, jobs-for-tokens) manufactures desire. Forbidden as a demand engine. **Distinct from P14:** P14 concerns **availability** of required play verbs/services if the player market is empty. A service backstop, if one is ever required, does not imply NPC buyers or an NPC economy. Existence and terms of any backstop remain **OPEN**. |
| Idle yield game | P9; offline production is W transformation, not hidden S |

---

# Part XXV — System invariants

| # | Invariant | Status |
| --- | --- | --- |
| 1 | Redeemable DLP is 1:1 ETH-backed; World events do not mint or destroy DLP supply | **PROVISIONAL** until money is locked |
| 2 | DLP supply does not increase from “game wages”; wages are transfers from existing backed operating balances | **PROVISIONAL** (same) |
| 3 | Borrowed/senior DLP remains in Dynasty-controlled structures, not the borrower’s unrestricted private wallet | **PROVISIONAL** (custody) |
| 4 | Senior capital is protected locked backing; ordinary operating expenditure does not consume it | **PROVISIONAL** intended base model (Part XVI, V25); lock/release/settlement **OPEN** (O46). Not `status.md` LOCKED implementation. |
| 5 | Projects are bounded (objective, resources, settlement condition) | **ESTABLISHED (experiments)** |
| 6 | Persistent World residue from consequential operations is common in-season | **ESTABLISHED**; cross-season **OPEN**; residue ≠ definition of Operation |
| 7 | Operations are consequential attempts under World/Information/Capital rules (including abort/refuse/hold); queries are not Operations | **ESTABLISHED** as play distinction; persistence not required |
| 8 | No protocol-guaranteed Project *return* (profit). Protected senior backing ≠ yield product | **PROVISIONAL** as finance law; empirically, Projects can fail as World operations |
| 9 | Capital ≠ guaranteed agency | **LOCKED** (P11) |
| 10 | Capability ≠ mastery | **ESTABLISHED** |
| 11 | P2P transfer ≠ external value creation | **LOCKED** (`value.md` / P17 reading) |
| 12 | DYN ≠ revenue creation | **LOCKED** as principle; DYN mechanics **OPEN** |
| 13 | World consequences persist (in-season) | **ESTABLISHED** |
| 14 | World state must be capable of changing from play and from World processes | **LOCKED** (P12, P23) + experiments |
| 15 | Information may be incomplete or stale | **LOCKED** (P22) |
| 16 | Economic coupling requires a causal World relationship | **ESTABLISHED (experiments)** |
| 17 | Discovery ≠ control | **LOCKED** (P21) |
| 18 | World Intent does not write S | **LOCKED** (`value.md`) |
| 19 | Presentation never owns rules | **LOCKED** (P28) |
| 20 | No domain silently mutates another’s canonical store | **LOCKED** (P26 / `domain.md`) |

Do not mint DLP to repair World loss. Do not invent a second money. Redemption, vault insolvency, and exact custody remain **OPEN**.

---

# Part XXVI — State ownership

Conceptual objects. Names are not final. Purpose: expose duplication and missing homes.

| Object | Likely owner | Authoritative source | Mutable (examples) | Derived | Lifecycle | Persist | Tx boundary | Depends on |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| World instance | World | World | conditions | projections | season **OPEN** | yes in-season | World intents | — |
| Place | World | World | attributes | reachable | as World | yes | World | World |
| Site / Infrastructure | World | World | aggregate, `control` | operable? | create/ruin | yes | World | Place |
| Actor | Identity | Identity | profile | — | persistent P | yes | Identity | — |
| Capability | Identity or policy | Policy on Intent kinds | eligibility | — | persistent options | yes | policy | Actor |
| Knowledge / Intel | Information | Information | holds, knowledge-of | freshness vs World | stale/live | actor-bound | Information | Actor, World refs |
| Relationship | **OPEN** Identity | that home | stance | reputation **OPEN** | decay **OPEN** | yes | that home | Actors |
| Equipment | World or Logistics | home of situation | condition, location | — | wear/loss | yes | World/Logistics | Place, Actor custody |
| ResourceLot | Production/World | **OPEN split** | qty, situation | — | consume | until consumed | that home | Place |
| Operation | Home of mutation | that home | in-flight | — | ephemeral→result | in-flight | that home | Actor, Place |
| Project | **OPEN** (Economy/Projects) | Project aggregate | state, monetary refs | — | proposed…settled | history | Project + Capital | World, Actors |
| Commitment | Project/Identity | that home | bound resources | — | until release | yes | that home | Project, DLP |
| ProjectMonetary | Protocol/Capital | Protocol | operating vs locked backing (**OPEN** split) | — | with Project | yes | Capital | DLP, Project |
| SeniorBacking | Capital | Capital | locked amount | — | until release (**OPEN**) | yes | Capital | not opex |
| OperatingBalance | Capital | Capital | spendable DLP | — | until consumed/settled | yes | Capital | Project |
| DLPBalance | Protocol | Protocol | free/locked | backing check | persistent S | yes | Protocol | ETH |
| DYNBalance | Protocol | Protocol | **OPEN** | — | **OPEN** | **OPEN** | Protocol | **OPEN** |
| Organization | **OPEN** | — | membership | — | emergent | **OPEN** | — | Actors |
| Event / Occurrence | Publishing domain | that domain | immutable fact | — | append-only | yes | publisher | subjects |
| Consequence | Not a type | residue in homes | — | narrative | — | as residue | — | do not duplicate World |

**Missing / duplicated risks:** `control` stored on Site *and* as a floating NFT; knowledge copied into World `discoveredBy`; DLP in Identity wallet *and* Project monetary structures without a single protocol book; mixing World remainder with monetary remainder; Organization duplicating Relationship.

---

# Part XXVII — State machines

Only where lifecycle semantics require it:

| Concept | Machine? | Why |
| --- | --- | --- |
| Project | **Yes** | Proposed/financed/operating/settlement |
| Operation / in-flight Intent | **Yes** | Accept/fail/interrupt/invalidate (`play.md`) |
| `control` | **Transitions, not a toy FSM** | Vacant / held / contested via Conflict (`control-transitions.md`) |
| Infrastructure condition | **Maybe** | Wear/operable/ruined if those are discrete |
| DLP commitment | **Yes** | Free / locked backing / operating / redeem path |
| Financing | **Part of Project + Capital** | Do not duplicate Project machine |
| Settlement | **Terminal of Project** | Not a standalone game |
| World conditions | **Often continuous** | Seiche is not a four-state enum unless World says so |
| Relationship | **No required FSM** | Avoid social-meter states |

Do not FSM “the economy.”

---

# Part XXVIII — On-chain vs off-chain

**Do not choose a chain.** P29: simulation off-chain; chain is settlement and ownership. Exact surface **OPEN** (O45).

| Concept | Preliminary class | Tradeoff |
| --- | --- | --- |
| DLP backing / ETH custody | **LIKELY ON-CHAIN** | Trust for redemption |
| DLP transfers (free) | **HYBRID** | UX vs settlement integrity |
| Project commitments / monetary structures | **LIKELY ON-CHAIN or HYBRID** | If S moves, integrity hardens (`value.md` §13) |
| Financing / senior backing | **LIKELY ON-CHAIN or HYBRID** | Same |
| Settlement of existing DLP claims | **LIKELY ON-CHAIN** | Deterministic claims; no appraisal |
| World state | **LIKELY OFF-CHAIN** | Scale, fog, continuous sim |
| Knowledge / observations | **LIKELY OFF-CHAIN** | P22; sealing on-chain is costly and may leak |
| Relationships | **LIKELY OFF-CHAIN** | Forgery vs gas; not S |
| Capabilities | **LIKELY OFF-CHAIN** | Policy; not a token |
| Operations | **LIKELY OFF-CHAIN** | Tick/sim |
| Infrastructure | **LIKELY OFF-CHAIN** | World remainder; not automatically DLP |
| DYN | **LIKELY ON-CHAIN** | If it exists as a token |
| Revenue distribution | **UNKNOWN** | No mechanism |
| World-remainder assignment at settlement | **HYBRID / UNKNOWN / OPEN** | Must not become a hidden appraisal |

Economic consequence ≠ must be fully on-chain. Game state ≠ must be fully off-chain. The dangerous line is **anything allowed to change Book S**.

---

# Part XXIX — Security / economic attack surface

Do not solve here. Separate classes.

### Financial / protocol

- DLP double-backing / unbacked mint  
- Withdrawal races / redemption insolvency  
- Unauthorized drain of **operating** balances  
- Treating **senior backing** as spendable opex (the superseded model as an exploit)  
- Fake World remainder presented as DLP (sim lies → monetary claims from thin air)  
- Senior backing dilution (silent extra seniors) or silent unlock  
- Unauthorized Project state changes  
- Settlement manipulation  
- Replay of settlement  
- Operator–financier collusion to extract **operating** DLP or to spend senior without a distinct authorized arrangement  
- Alternate-account wash to fake junior/operating loss / insurance  

### Gameplay exploit

- Capability forgery  
- Relationship forgery (fake flood trust)  
- Oracle / information manipulation (false marks sold as live)  
- Timing attacks on windows  
- Unauthorized World mutation  
- Botting of Sense/Direct  
- Griefing operations that are “legal” but destroy Play (P13 tension)  

### Social / economic

- Whale domination of all existing Sites (P12 remainder must actually exist)  
- Sybil labor / reputation  
- Hiring all Place-bound operators (cannot teleport Places, can still starve a basin of *people*)  
- Botting thin information markets  

**Unknown:** dispute/rollback authority (O40) — the off-chain sim is a trust surface for any hybrid settlement.

---

# Part XXX — Open questions

Do not fake decisions. Status relative to this architecture + `questions.md`.

| Question | Status |
| --- | --- |
| Exact revenue mechanism | **OPEN** |
| Exact DYN economics | **OPEN** |
| Legal meaning of DYN ownership | **OPEN** |
| Exact DLP implementation | **OPEN** (1:1 ETH backing **PROVISIONAL**; World does not destroy DLP) |
| Exact Project settlement mechanics | **OPEN** (no waterfall; no appraisal) |
| Exact financing contracts / lock / release / default | **OPEN** |
| Lender-authorized spending of senior backing | **OPEN** (separate arrangement if ever designed) |
| How World remainder is assigned at Project end | **OPEN** (never appraisal) |
| How World state is persisted | **OPEN** (in-season yes; tech no) |
| How information is authenticated | **OPEN** (O7) |
| How much World simulation is deterministic | **OPEN** |
| How randomness is handled | **OPEN** |
| Cheating / botting policy | **OPEN** (O38) |
| Organization representation | **OPEN** (O36) |
| Reputation / relationship representation | **OPEN** (O25) |
| How economic coupling evolves | **PROVISIONAL** principle only |
| How much World is on-chain | **OPEN** (O45) |
| Scalability | **OPEN** |
| Gas/cost constraints | **OPEN** |
| Oracle requirements | **OPEN** |
| Governance / upgradeability | **OPEN** |
| Protocol emergency controls | **OPEN** (O42) |
| Clock / time model | **OPEN** (O2) |
| Seasonal wipe mapping | **OPEN** (O20); P24 LOCKED as direction |
| P14 service availability vs NPC buyers | **OPEN** and **distinct**: P14 is required-verb availability; NPC buyers are demand. A backstop, if any, is not an NPC economy |
| Control acquisition mechanics | **OPEN** (O5 remainder) |
| How a hired operator becomes an authorized operational issuer | **OPEN** (`control-transitions.md`). Conceptual constraint: mode of existing `control`, not a second primitive (`control.md`) |
| Operational-from-afar / presence vs eligibility | **OPEN** (`control.md`) |
| Match as a capability vs no marketplace | **UNDERDEFINED** |
| Direct vs control vs operate; hire authorization | **OPEN** join (`control-transitions.md` delegation). Concepts stay distinct; mechanism unspecified |
| ExternalDemand who pays / what they get | **OPEN** (`external-demand.md`) |
| Whether Insurance/credit exist | **OPEN** (O31) |
| Population / shards | **OPEN** (O37) |

**DECIDED (for this document’s scope, not a `status.md` dump):** major gameplay/economy experiments are complete as *evidence*; this architecture does **not** use a marketplace as a foundational primitive (**O15 remains OPEN** in `status.md`); DLP must not create desire; roles are not classes; coupling needs World cause; senior backing is protected from ordinary opex (Part XVI). 1:1 DLP and custody-not-private-wallet are **PROVISIONAL** architecture choices, not experiment-discovered laws. Marketplace absence is **not** a `status.md` LOCKED forever.

---

# Part XXXI — Conceptual data model

Not a schema. Relationships:

```
Actor ──possesses──► Capability
Actor ──possesses──► Knowledge / holds Intel
Actor ──has──► Relationship ──with──► Actor
Actor ──present-at──► Place
Actor ──may control──► Site / Infrastructure
Actor ──custody──► Equipment / ResourceLot
Actor ──initiates──► Operation / Intent
Actor ──participates-in──► Project
Actor ──may-belong-to──► Organization

Place ──contains──► ResourceLot (situated)
Place ──contains──► Infrastructure / Site
Place ──connects──► Place
Infrastructure ──may-reify/change──► connects
Infrastructure ──has──► operational state
Site ──situated-at──► Place

Operation ──changes──► WorldState
Operation ──produces──► Output
Output ──interpreted-as──► Outcome
Operation ──may-be-scoped-by──► Project

Project ──contains──► Commitments
Project ──references──► operating DLP and/or locked senior backing   (exact objects OPEN)
Commitment ──references──► DLP and/or Equipment
Project ──produces──► World remainder (via World, not as a duplicate object)
SeniorBacking ──is-not──► ordinary operating expenditure
OperatingBalance ──may-be-consumed-by──► permitted Project expenditure
JuniorBuffer ──at-risk-in──► named monetary remainder and/or World kit (OPEN)

Organization ──affiliates──► Actors   (OPEN)

DLP ──backed-by──► ETH (if redeemable)
DYN ──references──► participation in surplus   (OPEN; not DLP)

World ──≠── Information
knowledge-of ──≠── control
control ──≠── Direct (capability)
patron ──may-hire──► operator     (gameplay pattern; World authorization OPEN)
title ──≠── control
```

---

# Part XXXII — Architectural principles

1. **World before economy.**  
2. **Desire before exchange.**  
3. **Consequence before progression.**  
4. **Capability before action.**  
5. **Mastery is not a stat.**  
6. **Information is gameplay.**  
7. **Geography creates asymmetric possibility.**  
8. **Capital creates scale, not competence.**  
9. **Wealth is allowed to become power.**  
10. **Operations are consequential attempts** (they often alter World state). Persistent residue is important when it occurs; it does not define an Operation.  
11. **Projects are bounded commitments.**  
12. **DLP is money, not value creation.**  
13. **Borrowed/senior capital remains in Dynasty-controlled structures, not an unrestricted private wallet.**  
14. **Senior capital is protected locked backing, not ordinary operating money** (lender-authorized spend, if ever, is a separate arrangement; **OPEN**).  
15. **DYN does not create revenue.**  
16. **Economic coupling requires a World cause.**  
17. **No subsystem should manufacture demand merely to justify itself.**  
18. **Player-to-player exchange is not external value creation.**  
19. **Real value must enter from somewhere external.**  
20. **The game and economic protocol are one interacting system, not two unrelated products.**

Additional (corpus, not numbered in the brief): discovery is not control; World Intent does not write S; presentation does not own rules.

---

# Part XXXIII — Final architecture summary

Dynasty is a persistent strategic World. Players are present in Places, hold capabilities and knowledge, stand in relationships, and may hold capital. They observe incomplete information, choose, and attempt operations. Accepted operations mutate World state: deposits, infrastructure, routes, conditions, scars. The World can also change from prior success, wear, hydrology, and other processes. That new state changes what is possible and what hurts. Players form new wants, depend on each other, exchange, hire, refuse, form temporary organizations, and sometimes bind a Project with committed resources and a settlement condition. That is the economy. It is not a marketplace app bolted onto a map.

The World is geography plus conditions plus operable aggregates. A Place is a locus. Infrastructure sits in Places and may require Direct. `connects` is reachability; kit-scale passage may be operable and rare graph authorship is not the whole game. Two regions do not share an economy unless something in the World couples them.

Players do not pick classes. They attempt Sense, Extract, Haul, Erect, Direct, and related families. Quality is mastery: contextual, transferable, mortal when the World moves. Capital can reproduce ordinary procedure and buy scale. It cannot buy refusal, geography, or being right.

A Project is a bounded coordination object with committed resources and a settlement condition. It appears when a handshake is not enough. **Current architecture:** senior/lender DLP is **locked protected backing**, not ordinary opex. Operating/junior capital separately funds wages, equipment, and inputs. Ordinary operating failure does not consume protected senior backing. Borrowed/senior DLP stays in Dynasty-controlled structures, not an unrestricted private wallet. Exact lock, release, and settlement math remain **OPEN**. The World outcome is not a guaranteed yield. Residual World remains World after settlement. Destroyed or surviving kit is not appraised into DLP and does not mint or delete DLP supply.

DLP, if implemented, is 1:1 ETH-backed internal money (**PROVISIONAL** backing). DLP moves by transfer or leaves by redemption (mechanics **OPEN**). Depositing ETH is capital, not revenue. Transfers are not revenue. World events do not mint or burn DLP. Removing DLP must leave desires intact. DYN, if it exists, is a speculative participation token, not required to play, not the economy, not a revenue printer, not DLP. Revenue from genuine external demand is **unspecified** — RVI is a LOCKED requirement whose product remains OPEN.

Dynasty differs from a normal game because operations are meant to leave persistent World and economic residue, and because real capital may enter protocol-enforced operations. It differs from generic DeFi because there is no yield object at the center: the object is a simulated World whose bottlenecks, clocks, and refusals are the scarcity. A DeFi wrapper around emissions would be a failed reading of this architecture.

**Undecided:** clock, wipe mapping, on-chain surface, DLP/DYN implementation, redemption/insolvency, settlement math, World-remainder assignment, hire→authorization mechanism, operational-from-afar, revenue/RVI product, legal ownership, orgs/reputation objects, whether a P14 service backstop exists, whether marketplace-like mechanisms ever exist (O15), information authentication, bots, governance, lender-authorized senior spend.

**What a later engineer must not do:** invent NPC buyers or a marketplace to “complete” demand; invent RVI/tokenomics/settlement waterfalls; add XP, classes, quests, or token faucets; nerf whales instead of preserving non-money agency; put the whole sim on-chain; let the client mint DLP; let borrowed/senior funds sit in an unrestricted hot wallet; spend senior backing as ordinary opex; appraise World objects into DLP; treat DYN price as success; treat P2P volume as RVI; treat ESTABLISHED experiments as `status.md` LOCKED.

**What they must preserve:** World causality; incomplete information; Place-bound vs liquid capability; Projects as rare coordination; economy as emergence; protocol money as coordination of real commitments; capability ≠ control ≠ hire ≠ title; World ≠ money.

---

## Relation to other corpus files

| File | Relation |
| --- | --- |
| `principles.md` | Constitution. This doc must not weaken it. |
| `domain.md` | Kernel (Entity, Relation, Intent, Occurrence, Domain). Capabilities/Projects/DLP are domain objects or protocol objects, not new kernel primitives. |
| `world.md` / `control.md` / `information.md` / `intents.md` | Substrate this architecture sits on. |
| `value.md` / `economic-engine.md` / `external-demand.md` | Value books and the unmet RVI mechanism. |
| `status.md` / `questions.md` | OPEN items remain OPEN. Experiment “established” ≠ status LOCKED. Architecture-local “DECIDED” ≠ status dump. |
| `AUDIT.md` | Original workspace plan plus later provenance notes. Not a substitute for `status.md`. |

**Superseded in this file (v0.1.2):** spendable-senior-in-one-purse leftover-priority (`10/1/6`). Do not restore it as the base model.

No code. No schemas. No tokenomics. No patches.
