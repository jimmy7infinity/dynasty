# Design audit and workspace plan

**Date:** 2026-09-03  
**Status:** Audit only. No mechanics finalized. No implementation.

This document transforms the foundational brief into a conservative design baseline: what is actually locked, what is still a sketch, what systems the game will need, which documents should exist, and which investigations must happen before code.

**Navigation:** Current index and document jobs live in `README.md`. Current LOCKED/PROVISIONAL/OPEN register lives in `status.md`. Current architectural synthesis is `architecture.md` **v0.1.2**. Sections A–H below remain the **original 2026-09-03 baseline** and are not rewritten.

**Provenance (2026-09-06):** A later integrity pass found that architecture v0.1–v0.1.1 taught senior financing as spendable DLP in a commingled Project purse with leftover-priority (the `10/1/6` example). That teaching is **SUPERSEDED**. Current base model: protected locked senior backing; operating capital separate; lock/settlement mechanics OPEN. See `architecture.md` Parts XV–XVI and `status.md` V25 / O46. Do not restore leftover-priority as architecture.

**Corpus note (not a reinterpretation):** After `domain.md` through `offline.md` were accepted, a **cross-domain audit** was appended: [Cross-domain audit v2](#cross-domain-audit-v2--2026-09-03).

---

## A. Foundational principles

These are the non-negotiables. They constrain every later system. They are not mechanics.

1. **Play with economic consequence.** The fantasy is playing a game whose building, discovery, ownership, participation, and earnings can have real economic significance — not a spreadsheet with a map skin.

2. **Real value in → real value out.** External capital and revenue (ETH, stablecoins, sponsorship, external yield, fees, services) must enter the ecosystem and support genuine activity. The game must not manufacture a closed speculative token loop and call it an economy.

3. **The world has an economy, not just a transfer layer.** Economic activity must exist that is not reducible to moving money between players.

4. **Players are owners and participants** in a world they help build, not tenants of a casino skin.

5. **Asymmetric opportunity.** A small player must have a non-zero path to an extraordinary outcome. This is not a promise of fairness of results.

6. **Money buys power, not mastery.** Capital may buy scale, optionality, and loss absorption. It must not automatically buy being the best explorer, strategist, fighter, trader, or decision-maker.

7. **You can dominate what exists. You cannot own what has not happened yet.** The world must keep generating new opportunities, discoveries, resources, anomalies, markets, events, and strategic possibilities so incumbents cannot permanently lock others out.

8. **No dead ends.** A weak, broke, isolated, or defeated player always has another meaningful move. The player economy creates opportunity; it does not hard-gate play.

9. **Player markets must not be the only path.** If players can provide a service they may compete. If none are available, a protocol/NPC backstop may provide the service at a known rate. The backstop’s economics are OPEN; the anti-gate principle is not.

10. **Rust urgency + Civilization planning, not a Civ clone.** Gathering, crafting, building, loot uncertainty, risk, loss, and rebuilding — plus strategy, development, specialization, and long-horizon networks. Not tile-blob empire painting.

11. **Continuous space. Sites and networks, not tiles.** The “empire” is a network of positions, infrastructure, routes, relationships, contracts, influence, and knowledge.

12. **Discovery ≠ control.** Finding something does not mean owning it.

13. **Information is a resource.** Knowledge asymmetry is desirable. Different players may truly know different things about the world. The map is the interface.

14. **Influence is soft.** Prefer dynamic influence over hard territorial borders.

15. **The world is temporary. The player is persistent.** Seasonal world reset is a major direction. Persist capability (identity, knowledge, reputation, access, decision quality, option space) rather than raw seasonal wealth.

16. **Persistent progression must be material, not cosmetic.** Lifetime history should change what a player can do. Prefer more options, knowledge, access, and flexibility over permanent production multipliers.

17. **Observe → choose → act → result → respond.** The loop must not be login → wait → claim → login tomorrow. Avoid arbitrary waiting walls.

18. **The token coordinates the economy; it is not the economy.** The token should be important but not required to play. It should derive value from real external activity. The game must remain economically coherent if token price is zero. A high token price must not make holders unbeatable at play.

19. **Core deposited real capital is not PvP loot.** Conflict may risk resources, sites, positions, information, reputation, and opt-in high-risk assets. It must not collapse to “attack player → steal ETH.”

20. **No rigid classes.** Players become roles through play and may change. Multiple viable paths.

21. **Modular open system.** Major systems own their logic and state and communicate through explicit commands, queries, and events. New modules should plug in without rewriting unrelated systems. The core domain exposes stable primitives and contracts. This is not a license for uncontrolled complexity.

22. **Events are first-class.** The world evolves through events, including player-caused, economic, environmental, sponsored, and rare events — not only random debuffs.

23. **Sponsorship / external revenue is first-class.** Brands and external parties participate in-world as an external revenue engine, not as banner ads. The commercial model is OPEN.

24. **Simulation is off-chain. Blockchain is settlement and ownership.** Domain rules do not live in the UI, the API, or “the whole chain.”

25. **Do not implement until the core systems are coherent.**

---

## B. Design status matrix

Conservative reading: if the brief gives an example, a candidate, or a “potential,” it is not locked.

### LOCKED

| Item | Notes |
| --- | --- |
| Dual fantasy: Rust-like risk/loot/loss + Civ-like strategy/development | Experience thesis, not a feature checklist. |
| Real-value-in / real-value-out | Economic thesis. |
| World economy independent of mere P2P transfers | Principle. Mechanism OPEN. |
| Player ownership / participation | Principle. Legal/ownership model OPEN. |
| Seasonal world resets as a major direction | Cadence, ceremony, and asset transition OPEN. |
| Persist capability over persist wealth | Classification of each asset still OPEN. |
| Persistent progression must matter | Shape of bonuses still constrained (not flat +% forever). |
| Continuous non-tile map | Representation details PROVISIONAL. |
| Sites / positions / networks over tile ownership | |
| Discovery ≠ control | Tensions with “claim/control” language — see risks. |
| Information can be valuable; knowledge asymmetry desired | How info is stored, leaked, traded OPEN. |
| Map is the primary interface | Visual language PROVISIONAL. |
| Soft influence, not hard borders | Influence mechanics OPEN. |
| No dead ends / markets must not hard-gate | Backstop design OPEN. |
| Money = power ≠ mastery | Enforcement mechanisms OPEN. |
| Continuous emergence of new opportunity | Event/world-gen design OPEN. |
| Token not required to play | |
| Token coordinates; game coherent at token price zero | Exact token uses OPEN. |
| Token must not make holders unbeatable | |
| Core real deposits not automatically lootable | What *is* lootable OPEN. |
| No rigid classes; multiple viable paths | |
| Modular domains with explicit contracts/events | Folder layout is not architecture. |
| Open system / composable primitives | Primitive list not final. |
| Events as a first-class domain | Event catalog OPEN. |
| Sponsorship as a first-class economic module | Pricing/deals OPEN. |
| Off-chain simulation; chain as settlement/ownership | Exact on-chain surface OPEN. |
| Observe/choose/act loop; no idle-claim loop | Time model OPEN. |
| No implementation until systems cohere | |

### PROVISIONAL

Treat as sketches. May be discarded.

| Item | Why provisional |
| --- | --- |
| Monthly cadence specifically | “Monthly/seasonal” is direction; 30-day length is untested against Civ-scale planning and Rust-scale loss. |
| Site lifecycle: UNKNOWN → … → REPLACED | Useful prompt; likely too linear and too state-machine-shaped. |
| Visual language (dark map, geometric icons, blooms, pulses) | Art direction, not systems. |
| Candidate site visual states | Overlaps and contradicts the lifecycle list. |
| Optional richer local site view | Scope risk. |
| Universal action list (SCOUT, EXPLORE, …) | Verb soup; several are outcomes or modes, not actions. |
| Action record shape (Actor, Target, Cost, Risk, …) | Reasonable template; not validated against a time model. |
| Knowledge graph + Rust blueprints + hidden branches | Intent is clear; model is not. |
| Blueprint alienability (sell, license, secret, org) | Each option has economy and mastery implications. |
| Persistent vs seasonal inventories as listed | Lists are examples, not a classification rule. |
| Profile as NFT | Ownership, mutability, and “history has price” vs mastery are unresolved. |
| Off-chain state + NFT as pointer | Likely, not decided. |
| Risk tiers SAFE / RISKY / INSANE | Labels without definitions or player communication rules. |
| Conflict menu (raids, sabotage, intel, insurance, …) | Feature cloud. |
| Protocol backstop “at a predefined cost” | Principle locked; pricing, subsidy, and quality OPEN. |
| Lottery weighted by play | Dangerous attractor toward “everything is a ticket.” |
| Legendary discoveries from world generation | Preferable; still undefined. |
| Conceptual engine chain: Player NFT → World → Economy → Treasury | Diagram, not architecture. |
| Package/folder map under `apps/` and `packages/` | Implementation fantasy. |
| Primitive list (Player, Site, Asset, …) | Starting set only. |
| GTA-like in-world sponsorship examples | Tone reference, not a catalog. |
| Archetype names (farmer, spy, banker, …) | Desired emergence, not systems. |

### OPEN

Do not design these by accident.

**Time and presence**

- What is the clock? Real-time, ticks, action queues, travel time, or mixed?
- What happens when the player is offline?
- How long is a season, and is it even calendar-monthly?
- Is there a season winner, score, or only ongoing play?

**World and space**

- How is continuous space discretized for simulation without becoming tiles?
- What is a Region, Biome, Site, Position, Route — formally?
- What does “control,” “claim,” “influence,” and “presence” mean, and how do they differ from discovery?
- How is the map generated each season? Authored, procedural, mixed?
- Fog of war: per-player, per-org, decaying, stealable?

**Actions and loop**

- What is an Actor (player, agent, org, protocol NPC, sponsored entity)?
- Which verbs are primitive vs composed?
- How is duration used without wait-walls?
- How are failures, interrupts, and partial results handled?

**Information, tech, discovery**

- What is Knowledge as an object? Personal? Copyable? Consumable?
- Is unknown technology truly unknown to the client, or only to the character?
- How do blueprints interact with mastery vs money?
- Who can verify a discovery without destroying information asymmetry?

**Economy and capital**

- Sources of durable REAL VALUE IN beyond player deposits.
- Custody: what is deposited, where, who can freeze/seize, how withdrawals work.
- Asset taxonomy: game resource vs seasonal good vs settlement asset vs token vs NFT.
- How real capital and sponsored prizes survive or convert at wipe.
- Hoarding: what makes productive use better than stockpiling without punishing prudence.
- Inflation/deflation of in-world goods across a season and across seasons.
- Protocol backstop: who pays, what quality, what happens if it is cheaper than players.
- Market microstructure: order types, location of markets, thin-book handling.
- Fees: design purpose, not percentages.
- Insurance, credit, banking: whether they exist at all.

**Token, treasury, distribution**

- Token uses, if any, that do not violate “not required to play” and “coherent at price zero.”
- Staking, governance, treasury participation — mechanics and capture risks.
- Lottery / high-variance distribution vs ownership participation — two ideas, zero specs.
- Legal characterization (utility, security, gambling) — must be investigated, not assumed.

**Conflict**

- What can be damaged, stolen, delayed, or revealed?
- Offline raid rules.
- Grief vs legitimate dominance.
- How money-as-power appears in war without buying mastery.
- Recovery after loss (no dead ends).

**Identity and orgs**

- Profile ownership model (account, NFT, recoverable identity, soulbound vs tradable).
- Whether a storied profile can be sold (conflicts with money ≠ mastery).
- Organizations, corporations, permissions, liability.
- Reputation: computed from what, attacked how, shown how?

**Events and sponsorship**

- Event authorship vs generation vs player-triggered.
- Who can publish events into the world?
- Sponsored entity rights vs player agency (can a branded site be raided?).
- Commercial model, brand safety, refunds, failure of a sponsored event.

**Trust, scale, law**

- Simulation authority, anti-cheat, dispute, rollback.
- Shards / instances / one world / many worlds.
- Population bounds.
- Bots and automation policy (economic games attract bots).
- Moderation, harassment, naming.
- Regulatory: money transmission, gambling, securities, advertising, sanctions.
- Circuit breakers when the economy or a module fails.

**Presentation**

- Client surfaces beyond the strategy map.
- How much simulation truth the map is allowed to lie about.

---

## C. System map

This is a **domain map**, not a repo layout. Module boundaries below are proposed for design work. They are not locked implementations.

### Responsibility layers

These layers are locked as a *separation principle*. Contents are not.

```
PRESENTATION / CLIENTS
  map, HUD, narrative chrome
  must not own domain rules

GAME DOMAIN
  world, time, actions, information, conflict, events-as-world

ECONOMIC DOMAIN
  production, markets, contracts, sponsorship, world economic processes

PROTOCOL / SETTLEMENT DOMAIN
  identity ownership, deposits/withdrawals, token, treasury, selected settlements

INFRASTRUCTURE (later; not design-primary)
  API, workers, storage, chain adapters
  must not become the source of truth for rules
```

Cross-cutting **domain contracts**: commands, queries, events. Publishers must not know their subscribers.

### Proposed domains (design-time)

| Domain | Owns | Must not own |
| --- | --- | --- |
| Identity | Player as actor, profile reference, reputation as a published signal | World simulation, token math |
| Time / Seasons | Clock, season lifecycle, wipe/transition *rules once designed* | What each other domain persists (they declare it) |
| World | Space, regions, biomes, sites, positions, routes, influence fields | Market matching, combat resolution details |
| Information | Fog, intel objects, discovery records, map fragments | Site physics, prices |
| Actions | Universal action runtime: validation, cost, duration, resolution hooks | Specific verb implementations |
| Exploration | Scout/explore procedures and discovery rolls/processes | World mutation (emits events; World applies) |
| Technology | Knowledge graph, blueprints as designed later | Crafting execution, map |
| Production | Extraction, crafting, transformation of resources | Spatial embedding (uses World) |
| Logistics | Movement of goods and actors | Combat, prices |
| Conflict | Contestation, damage, security, raids *once designed* | Custody of settlement assets |
| Events | Event types, scheduling, dispatch, world-scale coordination | Subscriber business logic |
| Markets | Matching, listings, price discovery | Inventing goods (other domains define assets) |
| Contracts | Player-to-player and player-to-protocol agreements as game objects | Legal real-world contracts |
| Services / Backstop | Availability guarantee, protocol NPC provision | Setting all world prices |
| Economy (world process) | Scarcity, sinks/sources, non-P2P processes | Token issuance policy (protocol) |
| Finance / Capital | Risk classification of assets, custody interfaces, deposit/withdraw intents | Gameplay verbs |
| Sponsorship | External party participation, in-world sponsored objects/events, inbound revenue recognition | Ad banners, UI chrome |
| Protocol / Treasury | Settlement, fees received, treasury accounting | Game simulation |
| Token / Coordination | Token as coordinator *if/when designed* | Gameplay skill |
| Lottery / Distribution | High-variance distribution *if it exists* | Being the reward for every action |
| Organizations | Shared agency, permissions *if it exists* | Replacing Identity |

Several of these may merge after the first deep dive. Do not create a package per row.

### Dependency sketch (design order, not runtime call graph)

Read arrows as “needs a coherent model of.”

```
Identity
Time / Seasons
        \         /
         Domain primitives & state classification
                      |
                    World
                      |
              Information ← → Events
                      |
                   Actions
           /          |          \
    Exploration   Production   Conflict
           \          |          /
            Logistics + Contracts
                      |
                   Markets
                      |
              Services / Backstop
                      |
            Economy (world process)
                      |
     Sponsorship → Finance/Capital → Protocol/Treasury
                      |
              Token / Coordination
                      |
           Lottery / Distribution (optional)
                      |
                 Organizations (optional)
                      |
                  Presentation
```

**Events** and **Actions** are composition surfaces. New modules should subscribe to events (SiteDiscovered, SiteContested, MarketOpportunityCreated, SeasonEnded, SponsorshipActivated, …) without the publisher naming them.

**Sponsorship** injects into World, Events, and Economy. It must not inject into Presentation only.

**Token** sits late on purpose. If designed early it will become the economy.

### Coupling warnings

- World ↔ Conflict ↔ Economy will want to share mutable site state. That is the first place modularity dies unless World owns site state and others emit intents.
- Information wants to leak from every other system. Give it an explicit API or every module will special-case fog.
- Seasons want to reset “the world.” If Season can reach into every module’s storage, boundaries are fake. Each module must declare seasonal vs persistent state.
- Backstop and Markets will fight if they share no quality/price protocol.
- Sponsorship and Conflict will fight if branded objects have implicit immunity.

---

## D. Design document proposal

Small corpus. Each file has a single job. Split a file only when it cannot be read in one sitting or when two domains are independently changing.

Proposed root: `docs/design/`

| File | Purpose | Scope | Depends on | Must not contain |
| --- | --- | --- | --- | --- |
| `README.md` | How to use the corpus | Process, legend, doc list | — | Mechanics |
| `principles.md` | Locked principles only | The list in section A, refined | — | Examples treated as rules; numbers; tokenomics |
| `status.md` | Living LOCKED / PROVISIONAL / OPEN | Matrix, decision log | principles | Rationale essays (link to audit/questions) |
| `questions.md` | Investigations to run before deciding | Questions, evidence needed, owners | status | Solutions masquerading as questions |
| `AUDIT.md` | This audit; historical baseline | Risks, missing systems, order | brief | Future silent decisions |
| `domain.md` | Primitives, layers, contracts, state classification | Nouns, events/commands, persistence/risk/settlement axes | principles, status | Folder trees, DB schemas, chain layout |
| `world.md` | Space, sites, influence, discovery≠control, information, events-as-world | Spatial ontology + event *roles* | domain | Combat resolution; prices; UI pixels |
| `play.md` | Loop, actions, time, no-dead-ends, archetypes as emergence | Verbs, clock, failure, backstop-as-play | domain, world | Idle-game timers justified as “production” |
| `conflict.md` | Risk, war, grief, security | What is at risk and why | domain, world, play | “Steal ETH”; full insurance product |
| `value.md` | Four economies, sponsorship, capital, token philosophy, lottery as distinct questions | Flows and constraints, not parameters | domain, world, play, conflict | Percentages, emissions, APY, deal sheets |
| `seasons.md` | Wipe, persistence, profile, hoarding, catch-up | Transition rules *once we have classification* | domain, value | Permanent +% production; “just NFT it” |

**Create now:** README, AUDIT (this file).  
**Create next:** principles, status, questions, then `domain.md` as the first deep dive.  
**Defer:** world, play, conflict, value, seasons until domain classification exists.

**Explicitly not separate docs (yet):** technology, crafting, logistics, organizations, lottery, staking, map art bible, legal memo (legal will need counsel, not a game-design file pretending to be a memo).

**Also not in this corpus:** `apps/` architecture, API outlines, database schemas, Solidity, token allocation, pitch decks.

---

## E. Design risks

These are the failure modes most likely to kill the thesis, the game, or the company. None of them are solved here.

### 1. Economic sustainability (existential)

The thesis requires **real value in**. The brief lists sources (ETH, stables, sponsorship, yield, fees, services) but does not establish a durable inflow that is not mostly **player deposits**.

If inflows are primarily player capital:

- The “world economy” is a transfer + fee machine.
- Treasury distributions are recycling.
- Sponsorship is hoped-for, not designed.
- Token value becomes circular speculation — the thing we forbade.

**Dangerous assumption:** activity automatically produces external revenue.

### 2. Circular flywheel

The sketched loop (capital → world → activity → fees/yield/sponsorship → treasury → distribution → more participation) can be drawn for any token game. It is not evidence.

Fees on player activity are not external revenue. Yield needs an external source. Sponsorship needs a product brands will pay for **inside a game about loss and conflict**.

### 3. Whale dominance vs “power not mastery”

Money buys scale, optionality, and loss absorption. In a site/infrastructure game, that *is* most of the power: more extractors, more redundant sites, mercenary coverage, information markets, sponsored alliances.

Wipes reset positions but not:

- capital available to redeploy on day 1
- knowledge of how the game works
- purchased or persistent profiles
- off-season staking/treasury power

Without explicit **mastery surfaces that capital cannot skip**, this becomes pay-to-control-the-map with a skill minigame for flavor.

### 4. New-player catch-up

Veterans keep knowledge, reputation, and possibly profile advantages. Fog of war and hidden tech make the world unreadable. Monthly reset helps positions, not competence.

If extraordinary outcomes are lottery-weighted toward veterans, the “small player path” is marketing.

If they are unweighted, veterans still flood tickets via scale.

### 5. Monthly wipes vs Civilization vs real capital

Civ-like planning wants infrastructure that matters for a long time. Rust-like seasons want loss. Real capital must not “simply disappear.”

This is the central design paradox:

- Wipe hard → real-value-in feels like a rug for seasonal goods bought with real money; Civ fantasy dies.
- Wipe soft → snowball and hoarding across seasons; Rust fantasy dies.
- Convert seasonal wealth into persistent wealth → wipe is cosmetic.
- Convert into persistent *capability* → capability becomes the new wealth (and may be tradable).

**30 days is unvalidated.** It may be too short for networks and too long for a raid game.

### 6. Resource hoarding

Rational players will store whatever survives the wipe or converts well. If ore dies at wipe, they convert to whatever persists (knowledge, NFTs, token, reputation farms, sponsored prize eligibility). If ore can be sold for stables before wipe, the late season becomes an exit liquidity race, not a game.

Productive-use rewards can become mandatory sinks that feel like tax.

### 7. Inflation and barrenness

If the world emits resources faster than sinks, late-season glut. If sinks are wipe and loss, mid-season may be fine and end-season nihilism. If protocol prints rewards to attract users, we are back to manufactured value.

### 8. Player-market liquidity

A monthly world with possibly modest population will have **thin markets**. Thin markets:

- fail the “player economy is preferred” story
- push everyone onto the backstop
- are easy to squeeze by whales
- cannot support specialist archetypes (banker, logistics) until critical mass

### 9. Protocol backstop economics

If the backstop is cheap and good, it is the economy and players never supply.  
If it is expensive or bad, it is a paywall or a dead end.  
If treasury subsidizes it, it is a permanent hole in real-value-out.  
If it prints in-world goods, it inflates.  
If it only exists for some verbs, other verbs remain gated.

The backstop is an **economic policy instrument**, not a UX convenience. It is undesigned.

### 10. PvP griefing and offline vulnerability

Rust DNA without careful offline rules produces:

- new players farmed as resource nodes
- real-money-adjacent time investment destroyed while at work
- organized harassment that is “legal play”

If nothing painful can be lost, raids are theatre. If painful things can be lost, griefing is the product.

Core ETH not lootable does not save this. People rage-quit over **irreplaceable time and seasonal position**, especially if they spent real money to accelerate.

### 11. Complexity and onboarding

The brief stacks: survival crafting, grand strategy, hidden tech, information warfare, logistics, DeFi-like capital, sponsorship, lotteries, seasons, orgs, events.

That is several games. New players cannot be asked to understand all of it. If the map is the interface, the map will be asked to explain too much.

**Risk:** we design a cathedral and ship a confusing extract-and-wait client.

### 12. Real-money incentives (bots, RMT, fraud)

Any real-value-out attracts:

- bots on exploration/loot
- account and profile trading
- collusion in markets and lotteries
- fake sponsorship / phishing
- wash activity to farm fees or tickets

Anti-cheat and market surveillance are missing systems, not polish.

### 13. Token dependency despite the slogan

Easy failure: staking required for “meaningful participation,” which is the actual game. Then token price zero means the game is hollow, violating the lock.

Opposite failure: token does nothing; it is a speculative satellite and we lied about coordination.

### 14. Lottery collapse of gameplay

“Gameplay may influence eligibility” will be read by players (and designers) as **do thing → get ticket**. Then exploration, PvP, and production are farming methods. Rust loot wonder dies. Legal risk rises (gambling).

### 15. Discovery ≠ control vs site claiming

The brief also wants DISCOVERED → CONTESTED → CONTROLLED and found sites converted into player refineries. That is a control model.

If discoverers cannot benefit, they are unpaid scouts for capital.  
If discoverers get automatic control, discovery *is* control.  
If they get a temporary advantage, we need a spec.

### 16. Information markets vs mastery and fairness

Tradable intel + money = whales buy the fog of war. That can be legitimate power, but it eats knowledge-as-mastery.

False intel, insider leaking from events, and sponsored information are all exploit surfaces.

### 17. Profile NFT value vs money ≠ mastery

“A profile could become valuable because of its history.” If tradable, mastery is for sale. If soulbound, we need recovery and we forfeit a liquidity story. If history is cosmetic, we violated “progression must be material.”

### 18. Events as random punishment

Events that exist to break incumbents will feel like a success tax. Events that exist to create opportunity will be camped by whoever has logistics. Sponsored events may be unassailable content islands.

### 19. Sponsorship vs player agency

Brands want control, safety, and metrics. The game wants raids, loss, and satire-adjacent GTA integration. A branded route that cannot be disrupted is a hard border. A branded site that is burned on stream is a sales problem.

This can poison REAL VALUE IN if we promise brands a product the game cannot honestly offer.

### 20. Open system unbounded composition

Stable primitives are right. Unchecked module addition yields:

- economic exploits at seams
- event storms
- players unable to model the world
- designers who cannot reason about incentives

Open system requires a **small kernel** and a high bar for new primitives — not a plugin bazaar on day one.

### 21. Wait-walls by another name

Extraction, travel, research, and construction want duration. Duration is waiting. Without a time model, we will ship timers and contradict principle 17.

### 22. On-chain / off-chain trust

Off-chain simulation + on-chain value = players must trust the operator. That is fine as a phase, but it is a **custody and legitimacy** risk, especially with deposits and lotteries. “Not your sim, not your bags.”

---

## F. Missing design systems

Not solutions. Questions that currently have no owner.

1. **State classification kernel** — For every object: seasonal or persistent? Game, economic, or settlement? Lootable / damageable / frozen? Who is the authority?

2. **Time model** — Clock, simultaneity, offline, duration, season length.

3. **Spatial model** — Continuous space without tiles; queryable by actions and logistics.

4. **Control vs influence vs presence vs discovery** — Four words, zero definitions.

5. **Actor model** — Player, agent, org, protocol NPC, sponsored entity; stacking and permissions.

6. **Action kernel** — Primitives vs recipes; interruption; partial success.

7. **Information object model** — What is a piece of intel; copying; lying; expiry.

8. **Loss and recovery** — Defeat without dead ends; what rebuilds, what is gone.

9. **Offline vulnerability policy** — The Rust question. Undesigned.

10. **World generation / season seed** — How new opportunities appear at season start and during.

11. **Event kernel** — Who may emit; causality vs randomness; player-behavior accumulation; sponsored events as a subtype.

12. **Production as decisions** — Sites as more than rates; still no model of changing conditions.

13. **Logistics** — Capacity, risk in transit, presence on routes. Mentioned, not designed.

14. **Market structure** — Where markets exist in the world; what they list; failure when empty.

15. **Backstop policy** — Coverage set, quality, cost formation, subsidy, interaction with players.

16. **Capital custody and accounting** — Deposits, withdrawals, reconciliation with off-chain sim, failure modes.

17. **Sponsorship operating model** — What a sponsor *is* in the domain; rights; what players can do to sponsored objects; what happens when a deal ends mid-season.

18. **Token role spec** — Or a decision that token design waits until value flows exist.

19. **Asymmetric upside spec** — If not tickets-for-everything, then what objects actually produce extraordinary outcomes.

20. **Mastery surfaces** — Explicit list of skills capital cannot purchase directly.

21. **New-player path** — First session, first week, first season; how no-dead-ends feels at zero knowledge and zero capital.

22. **Population and world multiplicity** — One map or many; what “the world” means at 50 vs 50,000 players.

23. **Trust, authority, dispute, rollback** — Especially for value-bearing outcomes.

24. **Automation policy** — Allowed agents vs bots.

25. **Social / communication / diplomacy** — Stories are a goal; comms are undesigned.

26. **Organizations** — Shared sites, shared liability, seasonal vs persistent orgs.

27. **Legal/compliance track** — Parallel to design; lottery, token, deposits, advertising.

28. **Economic instrumentation** — What we measure to know the flywheel is real vs circular.

29. **Circuit breakers** — Halting a module without halting the world.

30. **Presentation rules** — What the map is allowed to show; lying vs fog.

---

## G. Recommended design order

Order is chosen to **minimize rework**: decide the nouns and clocks before the verbs, the world before the markets, the value constraints before the token.

| Phase | Design | Why this position |
| --- | --- | --- |
| 0 | Principles + status + questions (corpus) | Shared language. Already started. |
| 1 | **Domain primitives and state classification** | Every later doc will otherwise invent its own object model and persistence story. |
| 2 | Time / presence / season *clock* (not wipe economics yet) | Duration, offline, and “no wait walls” infect all verbs. |
| 3 | World substrate: space, sites, influence, discovery≠control | Actions need targets. Events transform sites. Economy extracts from sites. |
| 4 | Information as a resource | Otherwise fog is a rendering trick and intel is flavor. |
| 5 | Action kernel + core loop feel | Only now can we define SCOUT vs EXPLORE without fiction. |
| 6 | Event kernel (first-class) | World liveness and anti-lockout depend on this; needs World + Actions to plug into. |
| 7 | Loss, conflict, and risk classes | After we know what exists to lose. Still no “steal ETH.” |
| 8 | Production / logistics as decisions | Sites become more than rates. |
| 9 | Markets + contracts + backstop as one design | They are one availability system, not two features. |
| 10 | Season transition and persistence mapping | Now we know the objects we are wiping or keeping. |
| 11 | Persistent progression / knowledge / profile | After we know what must not be +% production and what must not be tradable mastery. |
| 12 | Capital custody + world-economy processes (non-P2P) | REAL VALUE IN needs an honest accounting model. |
| 13 | Sponsorship module | External revenue into World/Events/Economy, after those exist. |
| 14 | Protocol treasury | After inflows are named. Still no percentages. |
| 15 | Token as coordinator | Late on purpose. |
| 16 | Asymmetric upside / lottery (or reject the module) | After we know what “extraordinary” attaches to besides tickets. |
| 17 | Organizations | Optional complexity; after single-player agency is real. |
| 18 | Presentation / map language | Last among design; first among later production. Still not code. |

**Do not** start with tokenomics, lottery weights, package structure, or combat damage tables.

---

## H. First design deep dive

**Design `domain.md`: Domain primitives and state classification.**

### Why this first

The project is trying to be an **open, modular world** with **seasonal reset**, **real capital**, and **off-chain simulation**. Those forces do not meet in a tech tree or a raid spec. They meet in the question:

> What kinds of things exist, and what is allowed to happen to each of them?

Without that kernel:

- Season design will invent a wipe list.
- Economy design will invent an asset list.
- Conflict design will invent a loot list.
- Chain design will invent an NFT list.
- None of them will match.

The open-system principle requires a **small set of stable nouns and contracts**. The brief already guessed at some (Player, Site, Asset, Resource, Knowledge, Action, Contract, Event, Market, Capital, Control, Influence, Relationship, Reputation). That list is not final — **finalizing the list, the axes, and the interface rules** is the work.

### What this deep dive should produce

1. A proposed primitive set, with why each is a primitive vs a module.
2. Explicit **non-primitives** (things that must not be kernel objects yet).
3. Three classification axes (proposed for debate, not smuggled as locked):
   - **Persistence:** seasonal / persistent / settlement-grade
   - **Risk:** what conflict and events may do (damage, steal, reveal, delay, nothing)
   - **Authority:** sim domain vs economic domain vs protocol settlement
4. Contract style: commands, queries, events — what a module may not do (reach into another’s state).
5. How a *future* module (Insurance, Org, new Event source) would attach — as a test of openness.
6. A list of tensions to resolve later, especially Discovery vs Control, and Profile value vs mastery.
7. Open questions remaining — not filled in.

### What this deep dive must not do

- Decide token mechanics, lottery, or sponsorship pricing.
- Decide the action verb list.
- Decide site lifecycle states.
- Produce schemas, Solidity, or folder maps.
- Treat the brief’s example lists as the primitive set.

### Why not World or Economy first

World-first would encode uncleared persistence and control semantics into geography. Economy-first would invent goods that the world cannot host and a token that the thesis does not yet allow us to specify. Both would be rework.

World should be the **second** deep dive, immediately after the kernel exists.

---

## Immediate next actions (no code)

1. Accept or amend this audit’s LOCKED list into `principles.md`.
2. Copy the matrix into `status.md` as the living register.
3. Copy section F into `questions.md` as an investigation backlog.
4. Commission the first deep dive: `domain.md`.
5. Do not open implementation workstreams.

---

# Cross-domain audit v2 — 2026-09-03

**Scope:** Consistency of the post-foundation corpus.  
**Sources:** `principles.md`, `status.md`, `questions.md`, `domain.md`, `world.md`, `information.md`, `play.md`, `events.md`, `conflict.md`, `control.md`, `time.md`, `offline.md`.  
**Does not:** Redesign those documents, invent economy/tokenomics/production/markets, add a sixth primitive, or close OPEN items by stealth.

**Verdict (headline):** The **game/world grammar composes**. The **economic grammar is still unspecified**. Coherence of play ≠ demonstration of REAL VALUE IN.

---

## A. Current conceptual model

**Kernel:** Entity · Relation · Intent · Occurrence · Domain.

**Loop:** Observe (issuer-scoped queries) → Choose → Intent to **one** home → accept = Action → Result in that home → Occurrence → others **may** Intent → Respond (eligible Intents remain).

**World:** Seasonal instance of Places, Sites, `situated-at` / `contains` / `connects` / `present-at`, reserved **`control`**, derived influence/reachability. Spatial **meaning** is predicates, not tiles.

**Information:** Intel objects + `holds` + `knowledge-of`. World truth ≠ belief ≠ record. Discovery = Occurrence of first assimilated existence-knowledge.

**Events:** Process entities that **Intent** other domains. Not Occurrences. Not World.

**Conflict:** Opposition of incompatible claims (`opposed-over`); optional **Contest** process. Not combat. Not Events.

**Control:** World relation: operational authority over a Site (or operable infra). Not title, not presence.

**Time:** No Time domain. Occurrence order + in-flight + live shared world. Duration only if it creates a decision.

**Offline:** No new Intents. Logout ≠ Leave, ≠ drop `control`, ≠ immunity, ≠ forfeiture. C+D control. Exposure is situational.

**Play is not a fat rules engine.** Homes own rules.

---

## B. Domain ownership map

| Domain / concept | Owns | May change | May observe | May request | Does not own |
| --- | --- | --- | --- | --- | --- |
| **Kernel** | Grammar | — | — | — | Game nouns |
| **World** | Places, Sites, spatial relations, `present-at`, `access`, `control`, deposits-in-ground | **Only World state** | Issuer-scoped queries; Conflict/Info **queries** | — | Intel, opposition policy, wallets, Events store |
| **Information** | Intel, `holds`, `knowledge-of` | **Only** those | World **observable slice** (query) | Verify/observe via Intents/queries | Existence, `control`, settlement |
| **Play** | Loop; eligibility as **projection** | Nothing canonical required | All published queries | Intents on behalf of issuers (conceptual) | World, Intel, fees |
| **Events** | Event entities (process) | **Only** Event records | Occurrences, World queries | **Intents** to World/Info/… | Sites, combat, settlement |
| **Conflict** | `opposed-over`, optional Contest | **Only** those | World/Info queries | **Intents** to World/Info/Events | `control` writes, HP, ETH |
| **Control** | *(not a domain)* slot in World | Via **World** | — | Operational Intents if relation holds | Title, presence |
| **Time** | *(not a domain)* | — | — | — | Clocks as god-engine |
| **Offline** | *(not a domain)* | — | — | — | Session as World geography |
| **Identity** (thin) | Issuer entities, session | Identity records | — | — | Geography |
| **Capital/Protocol** | **Unspecified** (future) | Settlement **only** when designed | Game Occurrences | Settlement Intents | Game simulation |
| **Presentation** | UI | Nothing authoritative | Allowed projections | Submit Intents for issuer | All rules |

---

## C. Kernel audit

| Concept | Kernel expression | Secret primitive? |
| --- | --- | --- |
| Actor | Entity + issuer role | No |
| Action | Accepted Intent | No |
| Event | Entity in Events domain | No |
| Conflict / `opposed-over` | Domain + Relation | No |
| Contest | Optional Entity (process) | **Provisional** — isomorphic to Event |
| Control | World Relation | No |
| Presence | World Relation `present-at` | No |
| Time | Order + in-flight | No |
| Information / Intel | Domain + Entity + Relations | No |
| Offline | Absence of new Intents | No |

**Kernel still sufficient.** Nothing earned a sixth primitive. **Risk:** Contest and Event are the same *shape*; if both grow engines, that is duplication, not a new primitive.

---

## D. Cross-domain causal chains

All five chains **expressible** without new nouns.

**A. Player action**  
Issuer → Intent (home, often World or Information) → home Result → Occurrence → Information may Intent (record) or subscribe (stale). No god sequencer.

**B. Event**  
Intent to Events → Event entity → outgoing Intents → other homes Result → Occurrences. Event ≠ Site.

**C. Conflict**  
A Intent and/or B Intent → incompatible → `opposed-over` and/or Contest → Conflict Intents to World/Info/Events → those homes Result → Occurrences. Instant oppose **may skip** Contest object.

**D. Control**  
Slots stay separate. Establish/contest: Intents (World and/or Conflict) → **World** writes `control` → later operational Intents World **accepts** from that issuer. Presence/access/title/custody **queryable**, not automatic `control`.

**E. Offline**  
Disconnect → no new Intents; `present-at`/`control` **unchanged by logout**; in-flight/Events continue → World Results → Occurrences; return → Observe (incomplete) → Respond.

---

## E. Distinction audit

| Pair | Collapses? |
| --- | --- |
| knowledge-of vs Intel/`holds` | **No** if sealed vs assimilated holds |
| knowledge-of vs presence | No |
| presence vs access vs control | **No** unless operational kinds = enter = stand-here (`control.md` failure mode) |
| influence vs control | No if influence stays derived |
| control vs title | No |
| custody vs control | No |
| Intent vs Event | No (request vs process-that-intents) |
| Event vs Occurrence | No |
| Contest vs Event | **Shape collapses; invariant does not** (opponents required vs not) |
| World truth vs belief vs Intel | No |
| Offline vs not present vs not control | No (`offline.md`) |

**Flag:** If World uses one `owner` field, **title and control collapse**. If logout clears `present-at`, **offline and Leave collapse**.

---

## F. Control / Conflict audit

Scenarios **work** as written:

| Scenario | Status |
| --- | --- |
| Control without presence | OPEN (operate-from-afar) but **allowed conceptually** |
| Presence without control | Yes |
| Access without control | Yes |
| Title without control | Yes |
| Custody without control | Yes |
| Offline control | C+D: relation persists; new ops need agency |
| Contested control | `opposed-over` on `control`; World writes |
| Temporary control | Classification / in-flight ≠ slot (`control.md`) |
| Multiple actors present, one control | Yes |
| Org as control issuer | Conceptual; no taxonomy |

**Contradictions (unresolved, not silently fixed):**

- Exclusive `control` vs later share/delegate.  
- Conflict assumes a `control` **slot** while **how to obtain** it is still OPEN.  
- Operate-from-afar vs “I feel I run it.”  
- Offline linger `present-at` = sitting duck vs vanish-logout.

---

## G. Time / Offline audit

**Does not imply:** logout = Leave; logout = loss of `control`; logout = immunity; logout = inactivity penalty; control = continuous attention.

**Accidental implication risks (docs must not drift):**

- In-flight “must remain present at resolve” as a **global** rule → close-game fails all Actions.  
- Production-while-away without operational Intents → idle-claim.  
- Freeze-all-in-flight-on-logout → fake world **or** wait-wall.

O18 **policy candidate** exists; **mechanics** not designed.

---

## H. World audit

| Need | Model |
| --- | --- |
| Empty geography | Place, no Site |
| Site / player-built / worldgen / infra | Site `situated-at` Place |
| Routes | `connects`; reify if operable |
| Opportunity | Derived, not a type |
| Disappear / contest | World mutation; `opposed-over` |
| Not tiles | Predicates; no Place-`control` |

**Hidden assumption watch:** “everything is a Site” — **rejected**. “everything occupies a Place” — **situated entities and `present-at` do**; bare `connects` and influence projections **do not** need to be Places.

**No ontology expansion required.**

---

## I. Information audit

Discovery ≠ control. Stale ≠ false. Hidden existence default. Control **belief** can be wrong. Offline Events need not be known. Dead Sites → dangling refs. Intel **objects** may later trade; `knowledge-of` is not scalp.

**Gap (not a collapse):** proof-of-discovery without broadcasting (O7) still OPEN.

---

## J. Play / Event / Conflict audit

| Noun | Distinct? |
| --- | --- |
| Intent | Request |
| Accepted / in-flight | Action in a home |
| Event | Evolution process |
| Contest | Opposition process — **provisional** |
| Occurrence | Notice |
| State change | Result in a home |

**Contest:** Earns a **name** only when opposition is an **in-flight process** that must not live in Events (combat-engine ban). Instant oppose **does not** need the object. **Keep provisional.** If Contest grows HP/catalog, **merge back** to Conflict Intents + in-flight in World/Events-interrupt only.

---

## K. Future economic / security boundary

**Not designed. Required later for Capital/Protocol:**

Game state ≠ economic state ≠ **settled capital**.

The game **must not** arbitrarily mutate settled capital.

When real capital exists, later design **must** satisfy (solutions not chosen):

- Clients cannot authoritatively **create value** or **fabricate outcomes**.  
- Game bugs cannot **mint/duplicate** settled capital.  
- Economically consequential transitions are **authorized and auditable**.  
- Settlement is **deterministic / invariant-preserving**.  
- Player capital cannot be **arbitrarily confiscated** by undifferentiated game logic (P15 already: deposits not PvP loot).  
- Privileged authority **minimized**; upgrade/emergency powers **bounded**.  
- Replay, double-settlement, races **considered**.  
- Simulation vs settlement **mismatch** cannot silently create/destroy value.

**Not chosen:** chains, custody, multisig/DAO, oracles, contract layout.

**Preserve:** Deposit → wait → claim is **not** the loop. P2P fees ≠ REAL VALUE IN. Token appreciation ≠ value creation.

---

## L. Adversarial / exploit concerns

Once capital is real, **game exploits are financial exploits**. Categories later Capital/Protocol (and sim authority) must treat as in-scope — **no anti-cheat design here:**

Duplication; replay; races; conflicting simultaneous Intents; stale state; double settlement; fabricated client state; impossible transitions; rollback abuse; accounting errors; oracle/input manipulation; bots/automation; Sybil; collusion; timing edges; extraction from bugs (including Information/fog leaks as trading edges).

---

## M. REAL VALUE IN → REAL VALUE OUT — status

**Constitutional (LOCKED).** **Not a demonstrated mechanism.**

| Stream | Status |
| --- | --- |
| External capital (deposits) | Named; custody/settlement **OPEN**; not loot by default |
| External revenue | Named (sponsorship, yield, services); **no model** |
| P2P transfers | Possible later; **not** external value by themselves |
| Protocol fees | Purpose OPEN; **not** automatically RVI |
| Productive activity | World/control **substrate**; production **undesigned** |
| Yield | Unspecified |
| Sponsorship | First-class **module**; commercial model **OPEN** |
| Token appreciation | Explicitly **not** value creation |

Do not pretend any row is solved.

---

## N. Economic dependencies (unanswered)

Eventual economy **depends on** (do not answer here):

What is produced/consumed/traded; game value vs external value vs settleable; what can be owned/transferred; `control` of productive Sites; measurable World outcomes; season boundary vs real capital (O20); Intel as asset vs knowledge; lots vs deposits; backstop (P14); leftover O5 **how** control is established.

---

## O. Contradictions / tensions (visible)

- Discovery ≠ control vs later “claim the Site.”  
- Control ≠ title vs Profile/NFT value (O24).  
- Presence ≠ control vs operate-from-afar OPEN.  
- Offline persist vs vulnerability (linger duck vs vanish).  
- Temporary world vs persistent dynasty (O20).  
- Real capital vs seasonal reset (O20).  
- Money = power ≠ mastery (Intel markets, scale, hired issuers).  
- Veteran `control` of *existing* vs remainder (O6 must actually spawn).  
- Asymmetric info vs “fair” compete.  
- Event vs Contest isomorphism.  
- Event vs Occurrence (docs OK; implementation drift risk).  
- World authority vs agency (homes may refuse).  
- Markets vs backstop (P14).  
- Player economy vs RVI.  
- Real money vs mutable sim (section K).  
- Production-over-time vs idle-claim.  
- P13 vs lost Site (remainder + backstop OPEN).

**None silently resolved.**

---

## P. Concepts that survived minimization

Kernel five; World Place/Site + listed relations; Information Intel/`holds`/`knowledge-of`; Play loop; Events as process; Conflict `opposed-over`; Control relation; Presence relation; Offline as absence-of-new-Intents; Occurrence as notice.

---

## Q. Still provisional

Contest **object**; operate-from-afar; presence linger **displace** rules; production-while-away; exclusive vs shared `control`; Event catalog; site lifecycle (V2 unused); monthly cadence; Profile NFT; domain roster (V23); lottery as module.

---

## R. Important unresolved (smallest set before an economic/gameplay engine)

Must get **clearer** before production/markets/capital are safe to design:

1. **How `control` is established/lost** (O5 remainder) — slot meaning exists; acquisition does not.  
2. **Operational Intent family** (what “run the Site” *is*, still no verb dump).  
3. **Production-while-away** vs P9/idle-claim.  
4. **O20** seasonal mapping of anything economically real.  
5. **O6** remainder actually appears (else P12 is fiction).  
6. **P14** backstop as anti-dead-end vs economy.  
7. **Capital/Protocol boundary** (K–L) as **requirements**, then a dedicated `value.md` / capital doc — **not** tokenomics first.  
8. **O18 leftovers:** displace without Leave; grief of the absent.  
9. **O7** intel transfer vs P11.

Everything in §16 remains premature **except** that engine work should **not** start until 1–3 are sketched at the same conceptual grain as `control.md`.

---

## S. Recommended next design sequence

1. **Do not** start tokenomics, markets, settlement architecture, or code.  
2. Optional **hygiene** (explicit accept): apply the already-listed cross-refs in `world.md` / `control.md` / `conflict.md` / `time.md` / `status.md` — not new design.  
3. **Operational Intents + production-as-decisions** (game), including away-from-keyboard — still no rates.  
4. **`value.md`** = four books (game / economic / settled / external) + RVI **questions**, no percentages.  
5. **O20** only after we know what objects exist to map.  
6. Sponsorship/lottery/token **last**.

---

## Coherence answer

**Yes:** there is a coherent **game/world grammar** (kernel + World + Information + Play + Events + Conflict + Control + Time/Offline). Chains A–E close. Distinctions hold if World does not smuggle `owner` and Play does not smuggle wait-claim.

**No:** there is **not** yet a coherent **economic engine**. RVI is a principle. Settlement security is a **future invariant list**, not a design.

**Broken?** Nothing in the grammar is *internally* broken enough to halt. The **holes** that would break the *thesis* if ignored: RVI unspecified, O20, remainder (O6), idle production, control acquisition, real-money/sim mismatch (K).

