# Principles

Constitutional constraints on all future design.

Source: `AUDIT.md` (accepted baseline). This file contains only what a later system can be tested against. It does not contain mechanics, numbers, examples-as-rules, tokenomics, visuals, or implementation.

**How to use.** If a proposal violates a principle, reject the proposal or explicitly reopen the principle in `status.md`. Do not “balance around” a principle in silence.

**How to change.** Reopen in `status.md`, record the reason, then edit this file. Do not edit principles inside other documents.

---

## What the game is

**P1 — Play with economic consequence.**  
The game is a game whose building, discovery, ownership, participation, and earnings can have real economic significance.  
*Test:* A design that is only a spreadsheet, only a casino skin, or only a closed token loop fails.

**P2 — Dual fantasy.**  
Play must combine Rust-like gathering, crafting, building, loot uncertainty, risk, loss, and rebuilding with Civilization-like strategy, development, specialization, and long-horizon networks.  
*Test:* A design that is only a raid sandbox, only a 4X, or a Civ tile-empire clone fails.

**P3 — Continuous space; network empire.**  
The map is continuous space. Players develop positions, sites, infrastructure, routes, relationships, contracts, influence, and knowledge. They do not own the world as a contiguous blob of tiles.  
*Test:* A design whose primary territorial verb is “own this tile” fails.

**P4 — Map as interface.**  
The strategic map is the primary interface to the world.  
*Test:* A design that cannot be played without a fully realized 3D world fails. Visual language is not a principle (see `status.md`).

**P5 — Roles emerge.**  
There are no rigid classes. Players become roles through play and may change. Multiple paths to success must be viable.  
*Test:* A design that forces a permanent class at creation, or that has only one viable path, fails.

---

## What the game must not become

**P6 — Not a manufactured token economy.**  
The game must not assign value to internal tokens primarily by circular speculation among players.  
*Test:* If removing all external inflows leaves only player-to-player recirculation plus emissions, the design fails. Rejected patterns (constraints, not a tokenomics design): inflationary mining; emissions for merely sitting/staking; early-entry structural advantage as the product; “stop playing and collect”; token issuance as value creation; circular token/treasury demand loops.

**P7 — Not a transfer layer pretending to be a world.**  
The world must have economic activity that is not reducible to moving value between players.  
*Test:* If shutting down production, sites, logistics, events, and external participation leaves the economy intact as a P2P transfer market, the design fails.

**P8 — Not a Civ tile-ownership clone.**  
*Test:* See P3.

**P9 — Not an idle-claim loop.**  
The loop is observe → choose → act → result → respond. It must not be login → wait → claim → login later. Arbitrary waiting walls are forbidden.  
*Test:* If the dominant profitable action is waiting on a timer with no meaningful decision, the design fails. Duration as such is not forbidden; duration that replaces choice is.

**P10 — Not a hard territorial-border game.**  
Influence is soft and dynamic. Hard borders must not be the default model of space.  
*Test:* If the map is primarily painted exclusive territories with hard edges, the design fails. Influence mechanics remain OPEN.

**P11 — Not pay-to-master.**  
Money may buy power: scale, optionality, and ability to absorb losses. Money must not automatically buy mastery: being the best explorer, strategist, fighter, trader, or decision-maker.  
*Test:* If capital can skip or purchase the skill-bearing decisions that define mastery, the design fails. Enforcement method is OPEN.

**P12 — Not a permanent lockout.**  
Players may dominate what exists. They must not own what has not happened yet. The world must keep generating new opportunities so incumbents cannot permanently lock others out.  
*Test:* If a sufficiently resourced incumbent can close the set of future opportunities, the design fails.

**P13 — Not a dead-end game.**  
A weak, broke, isolated, or defeated player must always have another meaningful move. The player economy creates opportunity; it must not hard-gate play.  
*Test:* If an empty player market, a lost site, or zero capital leaves the player with no meaningful action, the design fails.

**P14 — Markets must not hard-gate play.**  
If players can provide a service, they may compete. Play must remain possible when no player is offering that service.  
*Test:* A required verb that can be blocked solely by an empty player market fails. How availability is guaranteed (including whether a protocol/NPC backstop exists, and on what terms) is OPEN.

**P15 — Conflict is not “steal deposits.”**  
Core deposited real capital must not automatically become lootable through PvP. Conflict must not collapse to attacking a player in order to take settled external capital.  
*Test:* If winning a fight seizes another player’s core deposits by default, the design fails. What *is* at risk remains OPEN.

**P16 — Token is not the game.**  
The token must not be required to play. The game must remain economically coherent if token price is zero. A high token price must not make holders unbeatable at play. The token coordinates economic and strategic participation; it is not itself the economy. If the token has value, that value must come from real external activity, not from circular internal speculation.  
*Test:* (a) A player can play without holding the token. (b) Token price zero does not hollow out the game loop or world economy. (c) Token holdings alone do not determine mastery or unbeatable in-world power.

---

## Economy and ownership

**P17 — Real value in → real value out.**  
External value must enter the ecosystem and support genuine activity. Player deposits recirculated as rewards do not satisfy this principle by themselves.  
*Test:* Named inflows that are not player-to-player recirculation must exist in the economic design. Specific sources, shares, and instruments are OPEN.

**P18 — Players are owners and participants.**  
Players participate in a world they help build. They are not tenants of a house-edge product.  
*Test:* A design that only extracts from players without ownership or participation in world outcomes fails. Legal and technical ownership models are OPEN.

**P19 — Asymmetric opportunity.**  
A small player must have a non-zero path to an extraordinary outcome. This is not a promise of equal results or equal expected value.  
*Test:* If extraordinary outcomes are reachable only by already-dominant capital or already-dominant veterans, the design fails. Mechanism is OPEN. “Do action → lottery ticket” as the universal pattern is not implied and is not permitted as a default (see `status.md` / `questions.md`).

**P20 — Sponsorship is in-world economic participation.**  
External parties may participate inside the world as a revenue engine. Sponsorship must not be reduced to banner advertising bolted onto the client.  
*Test:* If the only sponsor surface is client chrome, the design fails. Commercial terms, rights, and brand-safety rules are OPEN.

---

## World, knowledge, and time

**P21 — Discovery is not control.**  
Finding something does not mean owning or controlling it.  
*Test:* If the discoverer automatically receives exclusive control, the design fails. What benefit, if any, discovery confers is OPEN.

**P22 — Information is a resource.**  
Knowledge asymmetry is intended. Different players may truly know different things about the world.  
*Test:* If all players are shown the same world-state as a matter of course, the design fails. How information is stored, copied, traded, lied about, or expired is OPEN.

**P23 — Events are first-class.**  
The world evolves through events. Events are not merely random debuffs. They may create, destroy, or transform opportunities, information, sites, markets, and conflict.  
*Test:* A design in which the world never changes except by direct player verbs, or in which “events” are only damage rolls, fails. Event catalog, authorship, and rates are OPEN.

**P24 — The world is temporary; the player is persistent.**  
Seasonal world reset is a committed direction. Persist capability — identity, knowledge, reputation, access, decision quality, option space — rather than raw seasonal wealth.  
*Test:* A design that persists seasonal stockpiles and positions as the main long-term advantage, or that wipes the player as well as the world, fails. Cadence, ceremony, and per-object mapping are OPEN.

**P25 — Persistent progression is material and non-runaway.**  
Lifetime history must change what a player can do. It must prefer more options, knowledge, access, and flexibility. It must not be primarily permanent production multipliers.  
*Test:* If persistence is titles/statistics only, it fails P25. If persistence is a stacking output bonus that compounds across seasons, it fails P25.

---

## Architecture

**P26 — Modular open system.**  
Major systems own their logic and state. Other systems interact through explicit commands, queries, and/or events. A publisher must not need to know its subscribers. New systems must be able to attach through those contracts without rewriting unrelated systems.  
*Test:* If module A mutates module B’s internal state, or if adding a system requires editing unrelated systems’ internals, the design fails.

**P27 — Open, not unbounded.**  
The domain exposes stable primitives and contracts from which later systems can be composed. Openness does not license uncontrolled complexity or an unbounded primitive set.  
*Test:* A new primitive or module must justify why existing primitives cannot express it. The primitive list itself is OPEN (`domain.md`).

**P28 — Layer separation.**  
Domain rules live in the game and economic domains. They must not live in the client, the API, or “the entire chain.”  
Layers: Presentation · Game · Economy · Protocol/settlement. Infrastructure must not become the source of truth for rules.  
*Test:* If a rule can only be known by reading UI or API code, or if the full simulation must live on-chain, the design fails.

**P29 — Simulation off-chain; chain is settlement and ownership.**  
Blockchain is for ownership and selected economically important settlement, not for running the world.  
*Test:* A design that requires the entire game on-chain fails. Exact on-chain surface is OPEN.

**P30 — Domain before implementation.**  
Do not implement until the core systems are coherent enough that a vertical slice would not freeze unresolved constitution into code.  
*Test:* Implementation of a system that is OPEN in `status.md`, or that violates these principles, is out of order.

---

## Implied constraints (not extra theses)

These are restatements already contained above. They exist so a future session does not “discover” them as new principles:

- A high-variance module, if any, must not reduce every system to ticket farming (P19, P6).
- Player-market preference does not override P13/P14 when the market is empty.
- Seasonal reset does not authorize disappearing core deposited real capital (P17, P15, P24). How that is satisfied is OPEN.
- Folder layout, package maps, and tech stack are not architecture (P26, P28).
