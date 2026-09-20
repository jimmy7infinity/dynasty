# World substrate

**Status:** Conceptual world model. Not a map spec, not a renderer, not a site-lifecycle design.  
**Kernel:** Entity · Relation · Intent · Occurrence · Domain (`domain.md`, accepted). This document adds **no** kernel primitives.  
**Does not close:** control mechanics (O5), clock (O2), worldgen (O6), fog rules (O7), verb list, season mapping (O20), production formulas, logistics rules, event catalog.

This document answers:

> What does it mean for a persistent player to exist in a temporary world of places, sites, resources, routes, information, and changing conditions?

It must not become a Civ tile-ownership grid, an NFT plot registry, a frozen authored diorama, a bag of untyped “locations,” or a system where discovery is control.

---

## 1. What World is

**World** is a domain (kernel: Domain). It is the home of *situated, seasonal geography*: where things are, how they connect, what occupies a locus, who is co-located, and how those facts change.

World is **not** Identity, Information, Production, Conflict, Markets, Capital, Events, or Presentation. Those may query, command, and subscribe.

**World instance.** One entity whose identity scope is this season’s world. Almost all World canonical records are **seasonal** and bound to that instance. Persistent player facts must not live inside it (`domain.md` split-records rule).

No new primitive is required for “the map.” The map, as play, is Presentation of World projections plus Information (P4). Geometry used to *draw* is not automatically geometry used to *own*.

---

## 2. Classification of world concepts

| Concept | Kind | Why |
| --- | --- | --- |
| World instance | Domain object (Entity) | A season’s world as a reference other records hang from. |
| **Place** | Domain object (Entity) | A locus. Spatial graph node. Empty space can exist. |
| **Site** | Domain object (Entity), often an **aggregate** | A meaningful occupying thing. Not a locus. |
| Region / biome | Role or attributes of Place, plus `contains` | Hierarchy without a second spatial type. See §16. |
| `situated-at` | Relation | Site (or other entity) occupies a Place. |
| `contains` | Relation | Place in Place (region-scale). |
| `connects` | Relation | Traversable link between Places. May be reified. See §9. |
| `present-at` | Relation | Co-location of an entity at a Place. |
| `knowledge-of` | Relation (Information, not World) | Awareness. World must not own this as “discovered = mine.” |
| `access` | Relation and/or derived | Ability to enter or use. Not discovery, not control. |
| `control` | Reserved relation (World ± Conflict later) | Operational authority over a subject. **Meaning:** `control.md`. **Acquisition / sharing / authorized-issuer mechanism:** OPEN (O5 remainder). |
| `influence` | Derived projection | Soft, overlapping. Not a border. Mechanics OPEN. |
| `title` / `custody` | Relations (typically Capital / Identity) | World must not store “owner” as a site field. |
| Resource kind (Iron, …) | Catalog (Production) | Not a World entity type. |
| Deposit / vein | World aggregate state or child entity | Situated potential, not an inventory item. |
| Extracted lot | Domain object (Production / Logistics) | Movable quantity with custody. |
| Route-as-object | Optional reification of `connects` | Only when the link has its own state. |
| Opportunity | Derived projection | Unowned / uncontrolled situated potential. Not a collectible type. |
| “Contested,” “isolated,” “reachable” | Derived projections | Named sources: relations + conditions. |
| World change (appeared, gone, transformed, link changed) | Canonical mutation **in World** + usually an **Occurrence** | Event ≠ resulting state. |
| Spatial predicates (near, far, connected, …) | Queries over relations (and optional metric) | The game’s spatial *truth*. Coordinates are not required for all systems. |

---

## 3. Spatial model — facts, not a renderer

### 3.1 What play actually needs

The game needs **situatedness and reachability**, not a commitment to tiles or to a GPU.

| Spatial fact | Needed for | Canonical form |
| --- | --- | --- |
| **At** | Presence, conflict context, extraction “here” | `present-at` / `situated-at` |
| **In** (containment) | Regions, specialization, weather-scale conditions | `contains` |
| **Connected / traversable** | Movement, logistics, isolation, chokepoints | `connects` (+ constraints later) |
| **Reachable from** | Access, “can I get there” | Derived from `connects`, `access`, conditions |
| **Near / far** | Proximity, influence falloff, scouting | Derived: hops, impedance, and/or a metric if World stores one |
| **Along** | Convoys, disruption | Entity situated on a `connects` or route object |
| **Isolated** | Strategic value, dead-end-adjacent play | Derived: poor reachability |
| **Within influence** | Soft power, overlapping blooms (P10) | Derived; not exclusive paint |
| **Accessible** | Enter/use without control | `access` and/or derived |

**Exact coordinates** (a metric embedding of Places) are **not** a constitutional requirement of World logic. They may exist as World attributes or as a Presentation projection so the map *feels* continuous (P3, P4).

Systems that must not depend on exact geometry unless World explicitly publishes a metric:

- Title, custody, knowledge-of
- Market matching (Economy)
- “Does this site exist?”
- Protocol settlement

Systems that may need a **distance or impedance** World is willing to answer:

- Logistics duration (clock still OPEN)
- Influence strength
- “Near” for scouting/conflict range

That answer can be graph impedance, a stored length, or coordinates. **Choosing among those is implementation (O4 remains OPEN).** The *design* commitment is: **canonical spatial meaning is predicates and relations World owns**, not “the tile I painted.”

### 3.2 Alternatives, judged

| Alternative | Use | Danger |
| --- | --- | --- |
| Continuous coordinates only | Good drawing; tempting as “the truth” | Becomes a plot grid if ownership attaches to cells |
| Tile grid as *meaning* | Easy Civ brain | **Forbidden** as ownership model (P3) |
| Graph of Places only | Logistics, isolation, chokepoints | Feels like a subway map if Presentation has no geography |
| Sites as only nodes | Fewer objects | No empty wilderness; everything is a site → NFT gravity |
| Hierarchy (Place contains Place) | Regions, biomes, scale | Fine if containment ≠ ownership |
| **Combination** | Relations + optional metric + drawing | Correct *if* ownership never keys off cells |

**Working stance (conceptual, not a tech choice):** Places form a **network of loci** (graph of `connects` / `contains`). Continuity is how that network is *shown* and, optionally, how impedance is computed. The empire is a **network of sites and relations**, not a blob of owned cells.

A grid used internally to compute “near” does not make the game a tile-empire — **unless** a claim/control/title system keys off cells. That keying is forbidden here.

### 3.3 O4 refinement (not a rewrite of `questions.md`)

`questions.md` asks how continuous space is represented without becoming tiles. This document’s answer to the *conceptual* half: **represent spatial truth as World-owned relations and queries; treat coordinates/tiles as optional realization.** The technical half stays OPEN.

---

## 4. Place vs Site

The distinction **holds**. Collapsing them makes every locus a candidate economic object.

### Place

A **Place** is a World entity: a locus in this world instance.

- It can be empty of sites.
- It can be nested (`contains`).
- It is the attachment point for presence and connectivity.
- Existence of a Place is **not** title, control, a resource, or a discovery reward.
- Lifetime: seasonal, world-instance scoped.

A Place is **not** “a location row in a generic table” with a string name and an owner column.

### Site

A **Site** is a World entity (typically an **aggregate**): a meaningful occupying structure or phenomenon **`situated-at` one Place** (or, later if needed, a defined set of Places — not designed here).

Sites are how ruins, deposits, labs, mines, posts, ports, anomalies, and player-built works appear in the world. They have internals World (or Production via intents) may change. They are **not** Places.

### Tests

| Example | Model |
| --- | --- |
| Unexplored stretch / sea / corridor | Place(s), no Site |
| Mineral deposit | Site `situated-at` Place; deposit state in the aggregate |
| Ruins, lab, mine, post, port | Site |
| Anomaly | Site (possibly ephemeral lifetime) |
| Player-built infrastructure | Site (how built is OPEN) |
| Temporary opening (storm-cut pass) | Prefer changing `connects` / conditions on Places; Site only if there is a *thing* to occupy |
| “I found a place” | `knowledge-of` a Place or Site; no control |
| Transformed refinery | Same Site entity; aggregate changed (lifecycle OPEN) |

**Claim** remains banned as a synonym for any of this (`domain.md`).

---

## 5. Presence

**Presence** is co-location: an entity is **`present-at` a Place**.

It is a **Relation** World owns. It may carry ephemeral vs longer-lived classification (session vs seasonal operation). It is **not** derived from discovery.

| Phrase | Treat as |
| --- | --- |
| Physical presence | `present-at` |
| Temporary vs lingering co-location | Classification on that relation, not a new type |
| Operational “we run that site from afar” | **Not presence.** Closer to `control` or a future staffing relation — OPEN, must not reuse presence |
| Goods sitting in a warehouse | `custody` + `situated-at` / `present-at` of the lot, not “the player is there” |
| “Informational presence” | **Forbidden name.** That is `knowledge-of` |

**Distinct from:** discovery, influence, control, title, custody.

You can know a site, influence its surroundings, hold title to a related lot, have custody of ore in a warehouse, and still not be `present-at` the Place — and the reverse.

How presence is obtained, lost, or lasts while offline is **OPEN** (O2, O18). World only owns the relation.

---

## 6. Discovery, existence, observability, knowledge, access, control

Keep these as **separate records**. Mixing them is how discovery becomes ownership.

| Concept | Home | Meaning | Not |
| --- | --- | --- | --- |
| **Existence** | World | The Place/Site/relation is canonical in this world instance | Anyone can see it; anyone owns it |
| **Observability** | Classification on the World record | How widely that fact *may* be queried | Fog mechanics (O7, O44) |
| **Knowledge** | Information | Held awareness / intel objects | World truth |
| **Discovery** | Occurrence + resulting `knowledge-of` (Information) | The *acquisition* of knowledge that something exists (and perhaps some facts) | Access, control, title, a standing “discoverer” flag on the Site |
| **Access** | World relation and/or derived query | May enter or use | Knowing it exists; running it |
| **Control** | Reserved World relation — **meaning in `control.md`** | Determine operations / outcomes of a Site | All of the above |

**Discovery conceptually** (not implemented): an issuer becomes aware that a World entity or condition exists. That is **knowledge**, actor-scoped, and may persist after the seasonal entity is gone (dangling reference is allowed; see §15). It may include more than a boolean (map fragment, false lead) — that richness is Information (O7), not World.

Discovery is **not** automatically: access, a persistent World stamp, or a plot deed.

**Existence without knowledge** is the default for hidden world. **Knowledge without access** is a rumor of a locked vault. **Access without control** is walking the ruin. **Control without title** is occupying what you do not economically own. **Title without control** is a stake you cannot enforce on the ground.

World **must not** expose a query “sites I discovered” that is implemented as control or title. If a discoverer benefit exists, it is a later Information/World rule (O11), not implied here.

---

## 7. Control, influence, presence, access, title, custody

This is vocabulary for Conflict, Economy, and World so they do not invent one `claim` integer. **Acquisition rules are not defined.**

| Concept | Meaning | Not | Kind | Depends on |
| --- | --- | --- | --- | --- |
| **Presence** | Co-located at a Place | Knowing; running; owning | Relation `present-at` | Place |
| **Access** | Permitted to enter or use | Co-location; exclusive run | Relation and/or derived | Connectivity, conditions, possibly keys (OPEN) |
| **Control** | Capacity to determine a Site’s operations / what it does | Discovery; presence; title; influence; NFT | Reserved **relation** (may later prove **derived** from several relations — still one slot). **Meaning:** `control.md`. Acquisition **O5 remainder**. | Site; Conflict will care |
| **Influence** | Soft effect over Places/Sites, overlap allowed | Hard border; exclusive ownership; control | **Derived** projection | Presence, control, infrastructure, other World relations — mix OPEN |
| **Title** | Economic/participatory stake | Control; presence; World field `owner` | Relation, usually **not** World-home | Capital / Identity |
| **Custody** | Who holds a movable or operates a holding | Title; control of the Site | Relation, usually not World-home for lots | Capital / Logistics |
| **Knowledge / discovery** | Awareness | All rows above | Information | Existence |

A player may simultaneously: know the site; be present; have access; exert influence; lack control; lack title; hold custody of a crate *at* the site. That tuple is the point.

**Influence must not default to a painted exclusive region.** Overlap is allowed. Hard edges would violate P10 if they become the territorial model.

World **does not** decide how Conflict uses these (no raid rules, no occupancy timers).

---

## 8. Sites (conceptual structure only)

A Site is a World entity + aggregate whose **home is World**.

**Enough structure for other domains to talk:**

- Identity (reference)
- `situated-at` Place
- Aggregate internals (facilities, deposits, conditions) — opaque outside World
- Classification axes (`domain.md` §3): typically seasonal, game authority, world-instance scoped; economic significance varies; observability varies
- Relations others attach **by reference**: control (later), presence at its Place, title to *other* entities, knowledge-of

**Adjectives in the brief are not types.** Natural, discovered, constructed, transformed, temporary, contested, economically or informationally significant are **states, relations, or projections**, not subclasses that need a lifecycle chart.

**Not decided:** how sites spawn, how many, rarity, NFT-ness, UNKNOWN→REPLACED chain (V2 remains PROVISIONAL and unused).

A Site is **not** an NFT by existing. Transferability of title, if any, is a relation property elsewhere.

---

## 9. Resources

**Resource is not a World primitive and not a global entity type “Iron.”**

Split:

| Aspect | Where | Note |
| --- | --- | --- |
| **Kind** (what it is) | Production catalog | Shared name, not a map object |
| **Existence of a deposit** | World (site/place aggregate or child entity) | Situated potential |
| **Availability** | World conditions (can it be extracted *now*) | Not the same as quantity > 0 |
| **Quantity in the ground** | World aggregate attribute | Not an inventory stack |
| **Extracted lot** | Production/Logistics entity | Quantity + `custody` + situation or in-transit |
| **Title / custody of a lot** | Capital-style relations | Not “who owns the mountain” unless title is explicitly on a different object |
| **Extraction** | Intent to World and/or Production | World mutates deposit; lot appears — **formulas OPEN** |
| **Transformation** | Production | World may change site aggregate if the site itself is altered |

**Do not** treat every resource as an inventory item. In-ground iron is not a backpack. **Do not** treat the deposit as settlement-grade by default.

Prices are Economy. Depletion rates are OPEN.

---

## 10. Routes, connectivity, logistics (minimum)

Logistics needs **movement along connectivity**, not a chosen library.

| Need | World concept |
| --- | --- |
| Movement of actors | Change `present-at` along `connects` (rules OPEN) |
| Transport of lots | Lots situated or `along` a connection; custody unchanged unless Logistics/Capital say so |
| Connectivity | `connects` between Places |
| Isolation | Derived poor reachability |
| Chokepoints | Derived: high betweenness / few alternate `connects` |
| Distance / delay substrate | Impedance on `connects` or a published metric — not a clock |
| Infrastructure | Sites (or reified routes) whose existence **changes** `connects` / impedance (World mutates relations) |
| Access vs connection | Connected but inaccessible is allowed |

**Route:**

- Default: **`connects` relation** (optionally with state: traversable, impedance, exposure context).
- **Reify as a domain object** only when the link itself is a thing (named pass, sponsored corridor, damageable road) with invariants of its own.

**Graph:** conceptually, Places + `connects` **is** a network. Whether code stores an adjacency list, computes edges from geometry, or both is **implementation**. Logistics must depend on World **queries** (`connected`, `reachable`, `impedance`), not on a mandated graph engine.

---

## 11. World change

World canonical state that can change (non-exhaustive, not a lifecycle):

- Places/sites appear or cease
- Site aggregate (transform, damage — damage **meaning** is Conflict/World later)
- `situated-at`, `contains`, `connects`, `present-at`, `access`
- Deposit quantity/availability
- Conditions that projections use (weather-scale, isolation — details OPEN)

**Player activity** changes the world only by **Intents World accepts** (and by other domains’ intents World accepts). World does not scrape Identity.

**Events** (first-class elsewhere) change the world by **Intents to World**, not by writing World’s store. The Occurrence “anomaly manifested” is not the Site; the Site is the resulting entity.

Do not define triggers, schedules, or the UNKNOWN→REPLACED chain.

---

## 12. Opportunity

**Opportunity is not a first-class World type.** If it were, it would be farmed, listed, and NFTed.

It is a **derived projection**: situated potential that is not exclusively captured — e.g. a Place/Site/condition exists, is not (fully) controlled, may be unknown to many, and admits some later action. Exact predicate is OPEN; the **need** is that World can represent **unowned, uncontrolled existence**.

That is P12’s substrate: new Places/Sites/conditions can appear (via World mutations / Event-requested intents) even if incumbents dominate *existing* sites. Worldgen and event design remain OPEN (O6). World only forbids a model where the set of loci is fixed and fully titled at season start with no remainder.

Asymmetric upside must not be “spawn Opportunity tokens.” That is still OPEN (O35) and must not hide here.

---

## 13. Information / fog (World side only)

Invariant 7 (`domain.md`): **world-state ≠ knowledge-of-world-state.**

World **owns** existence. World **classifies** observability. World **does not** own player intel objects.

**World must not** treat canonical existence as world-public by default.

**Queries are issuer-scoped** unless the record is classified world-public. A global `listSites()` that returns the full canonical set to any domain or to Presentation is a fog leak. Other domains do not get a back door.

What the map *draws* is Presentation consuming **allowed projections**, not the store. Whether the map may lie (beyond fog) is O44.

Information markets, proof-of-discovery, copy/fake/expiry: not World (O7).

---

## 14. World vs Events

| | World state | Occurrence |
| --- | --- | --- |
| What it is | Canonical situated facts | Assertion that something **happened** |
| Who mutates | World only | Published by World (or another domain); does not write World |

**Not every mutation is event-driven.** Derived projections (influence, isolation, contested-if-defined) update when sources change, without their own catalog.

**Not every tick of presence needs an Occurrence.** High-frequency motion can stay World-internal.

**Material canonical changes should publish Occurrences** so other domains can react without polling internals: e.g. site appeared/gone/transformed, connectivity changed, control relation changed (when that relation exists), deposit exhausted. Names are conceptual, not an event spec.

**Not every Occurrence is a World mutation** (market events, protocol events). Events domain scheduling is OPEN (O10).

World must not become the Events engine. Events must not become a second World store.

---

## 15. State authority and conceptual contracts

World owns World state. Others: **command, query, subscribe**. No foreign writes.

**Queries** (issuer-scoped unless world-public):

- Spatial: `at`, `in`, `connected`, `reachable`, `near` / impedance if published, `along`
- Site: existence, `situated-at`, opaque “has aggregate” not internals dumped
- Accessibility: derived `access`
- Presence: `present-at` subject to observability
- Open potential: derived opportunity-style projection (predicate OPEN)

**Commands** (Intents to World), kinds not finalized:

- Request presence change / movement (from Actions/Logistics)
- Request site/place/connectivity mutation (from Events, Production, Conflict, Sponsorship as issuers World policy allows)
- Request deposit/lot handoff at the World boundary (with Production)

**Occurrences** World may publish (illustrative kinds, not a catalog): material appear/gone/transform, connectivity change, control-slot change, presence crossing a *material* threshold if World defines one.

**Projections** World may publish: influence field, isolation, chokepoint, contested (if later defined from relations — not a Conflict engine).

Conflict does not set HP on a site by writing the aggregate. It issues intents; World applies or refuses.

---

## 16. Temporary world / persistent player

| Inherently this world instance | Must not live only as a field on a Site/Place |
| --- | --- |
| Places, sites, `connects`, deposits, `present-at`, World `access`/`control` | Identity, profile, reputation |
| Seasonal infrastructure | Persistent `knowledge-of` (Information) |
| This season’s influence projection | Capabilities, mastery (OPEN how) |

**Decoupling rule:** persistent records **reference** World entity ids; they **must not require** those entities to still exist. After wipe, knowledge can remain (“I remember a pattern / a kind of find”) while the Site id is stale. World must not cascade-delete Information.

World must not key a player’s persistent capability on `Site #123 still exists`.

Mapping seasonal wealth ↔ persistent capability is **O20**, not solved here.

---

## 17. Minimization test

| Concept | If dropped | Verdict |
| --- | --- | --- |
| Place | Sites become the only loci → empty space gone; NFT gravity | **Keep** |
| Site | Every Place is a “site” or nothing occupies | **Keep** |
| Region as its own type | `contains` + Place attributes (biome) | **Drop as type**; keep as role |
| Biome as type | Attribute / condition on Place | **Drop as type** |
| Route as always-entity | `connects` suffices until the link has independent state | **Relation first**; reify when needed |
| Resource as World type | Kind catalog + deposit state + lots | **Drop as World type** |
| Opportunity as type | Derived unowned potential | **Drop as type** |
| Presence | Co-location stuffed into control or discovery | **Keep relation** |
| Access | Collapse into control or discovery | **Keep slot** (relation and/or derived) |
| Influence | Paint exclusive regions or ignore P10 | **Keep as derived** |
| Control | Collapse into title or occupancy | **Keep reserved slot**; **do not fill** |
| Coordinates as truth | Tile/plot ownership | **Not required as meaning** |
| Graph engine as spec | Logistics locked to one tech | **Drop**; keep queries |

---

## 18. Hostile review

1. **Civ tiles?** Meaning is relations, not cells. Implementation grids allowed only if ownership/control/title do not key off cells.  
2. **Discovery = ownership?** Forbidden; discovery is knowledge acquisition.  
3. **Control = ownership?** Title is not World; control is a separate slot, unfilled.  
4. **Influence = border?** Derived, overlapping, not exclusive paint.  
5. **Locations as NFTs?** Places are not titled by existing; sites are not NFTs by existing.  
6. **Resources as inventory?** Deposits ≠ lots.  
7. **Fog leak?** Issuer-scoped queries; existence ≠ public.  
8. **Foreign mutation?** Intents only.  
9. **Mandatory graph product?** No; queries over `connects`.  
10. **Veterans lock the future?** Unowned loci/conditions can exist; appearance of new ones is O6, but the *model* allows remainder.  
11. **Persistent identity glued to sites?** References may dangle; no cascade.  
12. **Ontology sprawl?** Region/biome/opportunity/resource-type dropped as types.  
13. **Silent conflict?** No raid/occupation rules.  
14. **Silent economy?** No prices, markets, or “site = rate.”

**Kernel contradiction?** None. Place and Site are Entity kinds. Spatial truth is Relations + queries. No sixth primitive.

---

## 19. Close

### A. Established

- World domain owns situated seasonal geography.
- **Place** vs **Site** split.
- Spatial *meaning*: `situated-at`, `contains`, `connects`, `present-at`, plus derived near/reachable/isolated/influence.
- Coordinates/tiles are not the ownership model; O4 technical choice remains open.
- Presence, access, control, influence, title, custody, knowledge remain distinct.
- Discovery = acquiring knowledge-of existence (and maybe facts), not control.
- Resources: kind vs deposit vs lot.
- Routes: `connects` first.
- Opportunity: derived unowned potential, not a type.
- Fog: World does not globally publish canonical state.
- Material World mutations emit Occurrences; derived/continuous changes need not.
- Persistent player records must outlive World entities they mention.

### B. Later domains

Time/offline, verbs, combat, production rates, logistics policies, event catalog and authorship, worldgen, fog details, discoverer benefit (O11), control acquisition / share / authorize (O5 remainder), influence formula, season mapping, markets, sponsorship rights, NFT/title, Information object model.

### C. Dependencies on `domain.md`

Five primitives; classification axes; reserved slots; split records; invariants 1, 6, 7, 8, 9; command/query/occurrence; no new primitives.

### D. Remaining open (still in `questions.md`)

O4 (technical space), O5 (control acquisition / share / authorize remainder), O6 (generation), O7/O44 (fog and map truth), O2 (clock, offline presence), O11 (discoverer benefit), O13 (production as decisions), O14 (logistics rules), O18 (conflict/grief).

**Refinements, not silent answers:** Place/Site/Region-as-role; spatial predicates as canonical meaning; opportunity as projection; resource split; graph as concept not vendor.

### E. Contradictions (left standing)

- Brief language of claim/control/develop vs P21 — slot reserved, mechanics unfilled.  
- Map-as-interface (P4) wants geography; anti-tile law forbids cell-ownership — drawing vs meaning.  
- Operational-from-afar vs presence — not collapsed; not designed.  
- New opportunities vs later exclusive control of all *existing* sites — model allows remainder; O6 must actually use it.

**Recommended next:** `play.md` (actions, time, loop) **or** Information’s world-facing `knowledge-of` rules — not token, not seasons mapping, not combat. Still no code.
