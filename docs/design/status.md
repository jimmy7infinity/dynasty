# Status

Living register of what is decided.

Legend:

| Status | Meaning |
| --- | --- |
| LOCKED | Committed. Future design must respect it unless we explicitly reopen it. |
| PROVISIONAL | A concrete sketch exists. It is an experiment, not a requirement. |
| OPEN | The problem is identified. No solution is selected. |

Source: `AUDIT.md`. Principles live in `principles.md`. Questions live in `questions.md`. Do not treat repetition in the audit as a lock.

**Architecture vs this register.** `architecture.md` may mark experiment observations **ESTABLISHED** for that synthesis. That is **not** a LOCKED row here. Architecture-local “DECIDED” (e.g. marketplace not a primitive *in that document*) does not close an OPEN row here.

**How to change.** When something is actually decided, move it here with a one-line “decided / still open” pair. Do not decide items inside `AUDIT.md` or in chat only.

---

## LOCKED

| ID | Item | Decided | Still open | Depends on |
| --- | --- | --- | --- | --- |
| L1 | Dual fantasy | Rust-like risk/loot/loss **and** Civ-like strategy/development. Not a tile-Civ clone. | Feature list, combat, production model | — |
| L2 | Real value in → real value out | External value must enter and support activity. Recirculated player deposits are not sufficient by themselves. | Sources, instruments, magnitudes — **no product selected** | `value.md` exists; `external-demand.md` |
| L3 | World economy ≠ transfer layer | Non-P2P economic processes must exist. | What those processes are | domain.md → world → value |
| L4 | Ownership / participation | Players are owners/participants, not tenants. | Legal/technical ownership | identity, capital, legal |
| L5 | Seasonal world reset | World resets between seasons. Player persists. | Cadence, ceremony, per-object mapping | domain.md → seasons.md |
| L6 | Capability over wealth | Persist capability, not raw seasonal wealth, as the long-term axis. | Classification of each object | domain.md |
| L7 | Material persistent progression | History changes what you can do. Not cosmetic. Not stacking production multipliers. | What persists and how | domain.md → progression |
| L8 | Continuous non-tile map | Space is continuous. No tile-blob ownership. | Simulation discretization | domain.md → world.md |
| L9 | Sites / networks over tiles | Empire is a network of positions and relations. | Site ontology, lifecycle | world.md |
| L10 | Discovery ≠ control | Finding ≠ owning. | Benefit of discovery, if any | world.md, exploration |
| L11 | Information is a resource | Knowledge asymmetry is intended. | Object model, trade, fog | information, world |
| L12 | Map is primary interface | Strategic map is how you play. | Visual language, extra views | presentation (late) |
| L13 | Soft influence | No hard territorial borders as the default. | Influence mechanics | world.md |
| L14 | No dead ends | Always a meaningful next move. | How, especially at zero capital | play, backstop, conflict |
| L15 | Markets must not hard-gate | Empty player market cannot halt required play. | Backstop existence, terms, subsidy | markets + services |
| L16 | Money = power ≠ mastery | Capital buys scale/optionality/loss absorption, not automatic mastery. | Mastery surfaces, enforcement | domain, conflict, progression |
| L17 | New opportunity keeps emerging | Incumbents cannot own the unhappened future. | Event/worldgen design | world, events |
| L18 | Token not required to play | Play without holding the token. | Token uses, if any | token (late) |
| L19 | Token coordinates; coherent at price 0 | Token is not the economy. Price zero must not hollow the game. Holders must not be unbeatable. Value, if any, from external activity. | Mechanics | value.md → token |
| L20 | Deposits not PvP-loot by default | Core deposited real capital is not automatically lootable. Conflict ≠ steal ETH. | What *is* at risk | domain.md → conflict, capital |
| L21 | No rigid classes | Roles emerge; multiple viable paths; can change. | How paths stay viable | play |
| L22 | Modular contracts | Systems own state; interact via commands/queries/events; publishers do not name subscribers. | Actual primitive/module set | domain.md |
| L23 | Open system, bounded kernel | Composable primitives. Not unbounded complexity. | Primitive list | domain.md |
| L24 | Events first-class | World-evolution domain, not only random debuffs. | Catalog, authorship, rates | events (after world) |
| L25 | Sponsorship first-class | In-world external participation / revenue module, not banners. | Commercial model, rights vs agency | sponsorship (after world/economy) |
| L26 | Off-chain simulation | Chain is settlement/ownership, not the full sim. | Exact on-chain surface | domain.md, capital |
| L27 | Layer separation | Presentation / Game / Economy / Protocol. Rules not in UI, API, or whole-chain. | Contents of each layer | domain.md |
| L28 | Observe-choose-act loop | No idle-claim loop. No arbitrary wait-walls. | Time model, duration-without-walls | time, play |
| L29 | No implementation yet | No game code until core systems cohere. | What “cohere” means for a first slice | corpus completeness |

---

## PROVISIONAL

Sketches. May be discarded. **Do not implement. Do not cite as requirements.**

| ID | Item | What exists | Why not locked | Depends on |
| --- | --- | --- | --- | --- |
| V1 | Monthly cadence | “Monthly/seasonal” in the brief | 30-day length untested vs Civ planning and Rust loss | time, seasons |
| V2 | Site lifecycle chain | UNKNOWN → … → REPLACED | Too linear; likely wrong shape | world.md |
| V3 | Visual language | Dark map, icons, blooms, pulses | Art, not systems | presentation (late) |
| V4 | Site visual states | Undiscovered / contested / etc. | Overlaps and contradicts V2 | world, presentation |
| V5 | Richer local site view | Optional non-3D local view | Scope risk; not required by P4 | presentation |
| V6 | Action verb list | SCOUT, EXPLORE, DISCOVER, … | Mix of verbs, outcomes, and modes | play.md |
| V7 | Action record template | Actor, Target, Cost, Risk, Duration, … | Untested against a time model | time, actions |
| V8 | Knowledge graph + blueprints | Hidden branches, unknown tech | Intent clear; model absent | technology |
| V9 | Blueprint alienability | Sell / license / secret / org | Each option hits economy and P11 | technology, markets, P11 |
| V10 | Example persist vs seasonal lists | Identity vs factories vs stockpiles | Examples, not a classification rule | domain.md |
| V11 | Profile as NFT | NFT as identity/history pointer | Ownership, tradability vs P11 unresolved | identity |
| V12 | Off-chain state + NFT pointer | Likely split | Not decided | identity, P26/P29 |
| V13 | Risk tier labels | SAFE / RISKY / INSANE | Labels without definitions | domain.md, conflict |
| V14 | Conflict feature cloud | Raids, sabotage, intel, insurance, … | Menu, not a model | conflict.md |
| V15 | Backstop “predefined cost” | Brief language | Anti-gate is L15; pricing/subsidy/quality OPEN | services, value |
| V16 | Play-weighted lottery | Gameplay affects eligibility | Ticket-farming attractor; may be rejected | asymmetric upside (late) |
| V17 | Legendary from worldgen | Prefer generated over placed | Preference only | world, exploration |
| V18 | Engine chain diagram | NFT → World → Economy → Treasury | Diagram, **not** architecture. Must not be read as a circular treasury loop. | domain.md |
| V19 | apps/packages folder map | Listed package names | Implementation fantasy | not a design doc |
| V20 | Guessed primitive list | Player, Site, Asset, … | Starting set for debate only | domain.md |
| V21 | GTA-like sponsor examples | Branded routes, sites, events | Tone reference, not a catalog | sponsorship |
| V22 | Archetype names | Farmer, spy, banker, … | Desired emergence, not systems | play |
| V23 | Proposed domain roster | Identity, World, Events, … in AUDIT C | Design-time grouping; may merge | domain.md |
| V24 | Classification axes | Persistence / risk / authority (AUDIT H) | Proposed for debate, **not** locked | domain.md |
| V25 | Protected senior backing | `architecture.md` v0.1.2: senior DLP is locked backing, not ordinary opex; operating capital is separate | Conceptual correction of a superseded spendable-purse example. Lock, custody objects, release, default, settlement math, lender-authorized spend remain OPEN. **Not** an implementation spec. | capital, `architecture.md` Parts XV–XVI |

---

## OPEN

Identified problems. No selected solution. Details: `questions.md`.

| ID | Cluster | Blocked until | Notes |
| --- | --- | --- | --- |
| O1 | Domain kernel / state classification | **domain.md** | Nouns, persistence, risk, authority. First deep dive. |
| O2 | Time / presence / clock | domain.md, then time | Duration vs P9; offline |
| O3 | Season length and scoring | O2, seasons.md | Includes whether anyone “wins” |
| O4 | Spatial model | domain.md → world.md | Continuous space without becoming tiles |
| O5 | Control / claim / influence / presence | `world.md`, `control.md` | **Meaning** of `control` is filled in `control.md`. Remainder: acquisition mechanics, exclusive vs shared, authorized-issuer **mechanism**. |
| O6 | World generation / season seed | world.md, events | How new opportunity appears |
| O7 | Information object model | world, information | Fog, copy, lie, trade, expiry |
| O8 | Actor model | domain.md | Player / agent / org / NPC / sponsor |
| O9 | Action kernel | time + world | Primitives vs recipes; interrupt; partial result |
| O10 | Event kernel | world + actions | Who emits; causality vs randomness |
| O11 | Exploration / discovery benefit | world, information, L10 | Discoverer vs capital |
| O12 | Technology / knowledge | information, progression | Unknown tech; blueprints vs P11 |
| O13 | Production as decisions | world | Sites ≠ static rates |
| O14 | Logistics | world, conflict | Capacity, transit risk |
| O15 | Market structure | world, production | Location, emptiness, thin books. **Remains OPEN.** `architecture.md` does not use a marketplace as a foundational primitive (architecture-local; not a lock of this row). NPC buyers as demand are rejected in architecture. |
| O16 | Contracts as game objects | markets, identity | Not real-world legal contracts |
| O17 | Backstop policy | O15 + value | Who pays, quality, vs player supply |
| O18 | Conflict / grief / offline | domain, world, O2 | What can be lost; offline raids |
| O19 | Loss and recovery | O18, P13 | Defeat without dead ends |
| O20 | Wipe transition of real capital | domain + value + seasons | Central paradox; do not solve early |
| O21 | Hoarding / inflation | O13, O20 | Productive use vs stockpile vs tax |
| O22 | Mastery surfaces | P11, progression | What capital cannot buy |
| O23 | New-player path | play, P13 | First session / week / season |
| O24 | Profile ownership | identity, P11, P18 | Tradable history vs mastery |
| O25 | Reputation | identity, conflict | Compute, attack, display |
| O26 | Capital custody | domain, P15, P17, P29 | Deposit, withdraw, freeze, trust |
| O27 | Asset taxonomy | domain.md | Resource vs seasonal vs settlement vs token vs NFT |
| O28 | Durable REAL VALUE IN | value.md | Beyond player deposits |
| O29 | World-economy processes | world, production, events | Non-P2P activity |
| O30 | Fees as design | value.md | Purpose, not percentages |
| O31 | Insurance / credit / banking | orgs, markets | Whether they exist at all |
| O32 | Sponsorship operating model | world, events, conflict, P20 | Rights vs raids; deal failure |
| O33 | Treasury | O28, O32 | After inflows are named |
| O34 | Token role | O28, O33, L18–L19 | Design late or wait |
| O35 | Asymmetric upside / lottery | P19; after objects exist | May be rejected as a module |
| O36 | Organizations | identity, world | After single-player agency |
| O37 | Population / shards | world | One world vs many; 50 vs 50k |
| O38 | Automation / bots | markets, exploration, capital | Policy, not polish |
| O39 | Social / comms / diplomacy | play | Stories undesigned |
| O40 | Authority / dispute / rollback | P29, capital | Trust in off-chain sim |
| O41 | Instrumentation | value | Detect circular vs real flywheel |
| O42 | Circuit breakers | modular architecture | Halt a module, not the world |
| O43 | Legal / regulatory | token, lottery, deposits, ads | Parallel track; not solved in design docs |
| O44 | Presentation truth | L12, L11 | What the map may hide or lie about |
| O45 | On-chain surface | P29, O26, O34 | After settlement objects exist |
| O46 | Financing lock / release / settlement / lender-authorized senior spend | V25, `architecture.md` XVI | Conceptual model exists; **mechanisms OPEN**. Do not restore spendable-senior leftover-priority. |

---

## Decision log

| Date | Change |
| --- | --- |
| 2026-09-03 | Corpus opened from accepted `AUDIT.md`. Principles extracted. No OPEN item closed. |
| 2026-09-06 | Corpus correction: indexes updated (`value.md` exists; `control.md` fills control meaning). Architecture v0.1.2: protected senior backing is the base financing *model*; lock/settlement mechanics remain OPEN (V25, O46). Marketplace still OPEN (O15). No RVI product selected. |
