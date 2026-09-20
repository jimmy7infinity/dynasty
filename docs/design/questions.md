# Questions

Unresolved questions whose answers would materially change the design.

This is not a feature backlog. Do not answer here. Do not smuggle a solution into the wording. When a question is actually decided, move the decision to `status.md` and `principles.md` if it is constitutional.

Status values: **OPEN** unless noted. None are answered.

---

## Domain / state

**QUESTION:** What kinds of things exist in the domain, and which of them are primitives versus module-level types?  
**Why it matters:** Season, economy, conflict, and settlement will each invent an incompatible object list if the kernel is undefined.  
**Dependencies:** First deep dive — `domain.md`. Blocks almost every later doc.  
**Status:** OPEN.

**QUESTION:** For each kind of object, what is allowed to happen to it — persist, reset, damage, steal, reveal, delay, freeze, settle?  
**Why it matters:** Wipe, PvP, custody, and events all need the same classification. Different domains inventing different answers is how the thesis breaks.  
**Dependencies:** `domain.md`. Axes proposed in the audit (persistence / risk / authority) are PROVISIONAL, not a decision.  
**Status:** OPEN.

**QUESTION:** Who is the authority for each class of state — game simulation, economic domain, or protocol settlement?  
**Why it matters:** Off-chain sim plus on-chain value requires an explicit split or players cannot know what is final.  
**Dependencies:** `domain.md` → capital, protocol.  
**Status:** OPEN.

**QUESTION:** How does a future module attach (commands, queries, events) without mutating another module’s internals?  
**Why it matters:** P26/P27 are otherwise slogans. The first attachment test (e.g. a later Insurance or Org module) will expose missing contracts.  
**Dependencies:** `domain.md`.  
**Status:** OPEN.

---

## Time / presence

**QUESTION:** What is the game clock?  
**Why it matters:** Real-time, ticks, action queues, travel time, or a mix each imply different wait-walls, conflict, and logistics. P9 forbids arbitrary waiting walls but does not choose a clock.  
**Dependencies:** `domain.md` → time model. Blocks actions, conflict, production.  
**Status:** OPEN.

**QUESTION:** What happens to a player’s positions, sites, in-flight actions, and vulnerability when they are offline?  
**Why it matters:** Rust-like loss without an offline rule becomes grief. Full immunity while offline hollows conflict.  
**Dependencies:** Time model → conflict, world.  
**Status:** OPEN.

**QUESTION:** How can actions have duration without becoming login-wait-claim?  
**Why it matters:** Extraction, travel, research, and construction want duration. Duration is waiting. This is a direct P9 tension.  
**Dependencies:** Time model → play.md.  
**Status:** OPEN.

---

## World / spatial model

**QUESTION:** How is continuous space represented for simulation without becoming tile ownership?  
**Why it matters:** P3 forbids tile-blob empires. Simulation still needs queryable space for actions, logistics, and influence.  
**Dependencies:** `domain.md` → `world.md`.  
**Status:** OPEN.

**QUESTION:** What are Region, Biome, Site, Position, and Route — formally, and which are primitives?  
**Why it matters:** Actions, events, production, and conflict need shared nouns.  
**Dependencies:** `domain.md` → `world.md`.  
**Status:** OPEN.

**QUESTION:** How is World `control` established, changed, shared/delegated/authorized, and lost?  
**Why it matters:** The **meaning** of `control` is operational authority (`control.md`). Acquisition, exclusive vs shared, authorized-issuer **mechanism**, and loss remain OPEN (O5 remainder). An ambiguous *mechanism* still lets domains invent incompatible acquisition rules. Do not re-open meaning here.  
**Dependencies:** `control.md` (meaning) → `control-transitions.md` (World writes only; policy OPEN) → Conflict / Economy.  
**Status:** OPEN.

**QUESTION:** How do “claim,” “influence,” and “presence” differ from control and from discovery?  
**Why it matters:** Soft influence (P10) cannot be designed until they split. `control.md` / `world.md` already distinguish `control` (operational authority), `present-at`, `access`, derived `influence`, and discovery ≠ control (P21). **Claim** remains overloaded English, not a kernel type. Influence **mechanics** remain OPEN.  
**Dependencies:** Same as control.  
**Status:** OPEN.

**QUESTION:** How is the map generated each season, and how do new opportunities appear during a season?  
**Why it matters:** P12 requires a future that incumbents cannot own. Authored, procedural, event-driven, or mixed generation are different games.  
**Dependencies:** World → Events.  
**Status:** OPEN.

---

## Information

**QUESTION:** What is a piece of information as an object — who holds it, can it be copied, sold, faked, expired, or stolen?  
**Why it matters:** P22 says information is a resource. Without an object model, fog is a rendering trick and intel is flavor. Tradable intel also tensions with P11 (whales buy the fog of war).  
**Dependencies:** `domain.md` → information → markets.  
**Status:** OPEN.

**QUESTION:** What is the scope of fog of war — per player, per organization, decaying, stealable?  
**Why it matters:** Knowledge asymmetry, orgs, and intel markets all hang on this.  
**Dependencies:** Information → Organizations (if any).  
**Status:** OPEN.

**QUESTION:** How can a discovery be verified without destroying information asymmetry?  
**Why it matters:** Markets, contracts, and “legendary” finds need proof. Proof that broadcasts to everyone collapses P22.  
**Dependencies:** Information → exploration, markets, events.  
**Status:** OPEN.

**QUESTION:** How much simulation truth is the map allowed to hide or misrepresent?  
**Why it matters:** P4 says the map is the interface. P22 says players may know different things. Lying vs fog is a design choice, not a visual one.  
**Dependencies:** Information → presentation (late).  
**Status:** OPEN.

---

## Actions

**QUESTION:** What is an Actor?  
**Why it matters:** Player, agent, organization, protocol NPC, and sponsored entity may all act. Permissions and stacking are undefined.  
**Dependencies:** `domain.md` → identity, organizations, sponsorship.  
**Status:** OPEN.

**QUESTION:** Which verbs are primitive, and which are composed recipes?  
**Why it matters:** The candidate list mixes actions, outcomes, and modes. An unbounded verb set will not stay modular.  
**Dependencies:** Time + world → play.md. The candidate verb list is PROVISIONAL.  
**Status:** OPEN.

**QUESTION:** How are failure, interruption, and partial results resolved?  
**Why it matters:** Conflict, logistics, and no-dead-ends all require actions that can stop halfway without undefined state.  
**Dependencies:** Action kernel → conflict, logistics.  
**Status:** OPEN.

---

## Events

**QUESTION:** Who may emit an event into the world, and through what contract?  
**Why it matters:** Events are a first-class domain (P23). Unspecified emitters either centralize the world or let every module fire unbound side effects.  
**Dependencies:** `domain.md` → world → event kernel.  
**Status:** OPEN.

**QUESTION:** How are player-caused, environmental, economic, sponsored, and rare events distinguished without a hidden priority that punishes success?  
**Why it matters:** Events used only to break incumbents feel like a success tax. Events that only create campsite rewards are captured by whoever has logistics.  
**Dependencies:** Event kernel → conflict, economy, sponsorship.  
**Status:** OPEN.

**QUESTION:** Can accumulated player behavior cause world events, and if so, what is the interface for that causality?  
**Why it matters:** Without this, “the world reacts” is flavor. With it, exploiters will farm event triggers.  
**Dependencies:** Event kernel. Do not assume a trigger catalog.  
**Status:** OPEN.

---

## Exploration / discovery

**QUESTION:** What does a discoverer get if discovery is not control?  
**Why it matters:** If nothing, explorers are unpaid scouts for capital. If exclusive control, P21 is violated. A third relation is undesigned.  
**Dependencies:** World (control) → exploration → economy / conflict.  
**Status:** OPEN.

**QUESTION:** What can exploration yield, as categories of outcome — not as a loot table?  
**Why it matters:** The intended emotion is genuine uncertainty. Categories (component, information, nothing, danger, lead) are still PROVISIONAL sketches. Rates and tables must not be invented here.  
**Dependencies:** Information, technology, events.  
**Status:** OPEN.

**QUESTION:** Must legendary discoveries emerge from play/world generation rather than placement — as a rule, or only as a preference?  
**Why it matters:** The audit treats this as PROVISIONAL. Locking it early would constrain worldgen before worldgen exists.  
**Dependencies:** World generation, exploration.  
**Status:** OPEN.

---

## Technology / knowledge

**QUESTION:** What is Knowledge as a held object — personal, copyable, consumable, institutional?  
**Why it matters:** Persistent capability (P24/P25) likely lives here. Copyable knowledge is an economy. Personal knowledge is mastery. Both hit P11 if money can buy them.  
**Dependencies:** Domain → information → progression.  
**Status:** OPEN.

**QUESTION:** Is unknown technology unknown to the client, or only to the character?  
**Why it matters:** Datamining vs diegetic mystery. Affects information markets and “hidden branches.”  
**Dependencies:** Information, presentation, technology.  
**Status:** OPEN.

**QUESTION:** How do blueprints (if they exist) interact with money versus mastery?  
**Why it matters:** Sellable/licensable blueprints can turn mastery into a market (P11, P16). Secret blueprints create information-power. None of the alienability options is selected.  
**Dependencies:** Technology, markets, P11.  
**Status:** OPEN.

---

## Resources / production

**QUESTION:** How do important sites create decisions, risk, and changing conditions rather than a static yield?  
**Why it matters:** The brief forbids “mine = +N per hour” as the model of important locations. No replacement model exists.  
**Dependencies:** World → production → events, conflict.  
**Status:** OPEN.

**QUESTION:** What sinks and sources exist inside a season, and what happens to them at wipe?  
**Why it matters:** Inflation, barren late seasons, and hoarding are otherwise inevitable.  
**Dependencies:** Production → seasons → value.  
**Status:** OPEN.

---

## Logistics

**QUESTION:** Do goods and actors move through space under capacity and risk, or is transfer instant?  
**Why it matters:** Routes, disruption, and mercenary/logistics play do not exist unless movement is real. Instant transfer collapses the network-empire fantasy.  
**Dependencies:** World, time, conflict.  
**Status:** OPEN.

---

## Markets

**QUESTION:** Where do markets exist in the world, what may be listed, and what happens when the book is empty or thin?  
**Why it matters:** Seasonal worlds with modest population will be thin. Thin books fail the “player market is preferred” story and push load onto whatever availability system exists.  
**Dependencies:** World, production, population. Coupled with backstop.  
**Status:** OPEN.

**QUESTION:** What is the purpose of fees (if any) as a design instrument — not their size?  
**Why it matters:** Fees on player activity are not external revenue. Treating them as REAL VALUE IN would violate P17.  
**Dependencies:** Markets → treasury / value. No percentages.  
**Status:** OPEN.

---

## Contracts

**QUESTION:** What is a game-level contract as an object — parties, enforcement, default, season expiry?  
**Why it matters:** Routes, services, orgs, and sponsorship all want agreements. Unenforced contracts are chat. Over-enforced contracts become the real game.  
**Dependencies:** Identity, markets, time/seasons. Not real-world legal contracts.  
**Status:** OPEN.

---

## Services / backstop

**QUESTION:** When a player market cannot provide a needed service, what actually happens?  
**Why it matters:** P13/P14 require a meaningful next move. They do not select a protocol NPC, a substitute verb, a delay, or something else.  
**Dependencies:** Markets + play. Cannot be resolved as pricing before the availability model exists.  
**Status:** OPEN.

**QUESTION:** If a backstop exists, who pays, what quality does it provide, and what happens if it is cheaper or better than players?  
**Why it matters:** Cheap/good backstop is the economy. Expensive/bad backstop is a gate or dead end. Treasury subsidy is a hole in real-value-out. Printing goods is inflation.  
**Dependencies:** Services, treasury, production, P17.  
**Status:** OPEN.

**QUESTION:** Which verbs are covered by availability guarantees, and which are allowed to be player-only?  
**Why it matters:** Partial coverage reintroduces hard gates on uncovered verbs.  
**Dependencies:** Action kernel + backstop.  
**Status:** OPEN.

---

## Conflict / loss / recovery

**QUESTION:** What can conflict damage, steal, delay, reveal, or destroy?  
**Why it matters:** P15 only forbids automatic seizure of core deposits. Everything else is undefined. If nothing painful can be lost, raids are theatre. If seasonal position and time can be erased freely, grief is the product.  
**Dependencies:** `domain.md` (risk classification) → world → conflict.md.  
**Status:** OPEN.

**QUESTION:** How is grief distinguished from legitimate dominance?  
**Why it matters:** Without a distinction, “legal play” includes hunting new players as resource nodes.  
**Dependencies:** Conflict, offline rules, new-player path.  
**Status:** OPEN.

**QUESTION:** How does money-as-power appear in war without buying mastery?  
**Why it matters:** Mercenaries, redundancy, and intel markets are scale. P11 must still be evaluable in conflict.  
**Dependencies:** Conflict, markets, P11.  
**Status:** OPEN.

**QUESTION:** After defeat, what is gone and what is the next meaningful move?  
**Why it matters:** P13 applies hardest here. Recovery that restores everything makes conflict fake. Recovery that does not exist is a dead end.  
**Dependencies:** Conflict, seasons, backstop.  
**Status:** OPEN.

---

## Seasons / persistence

**QUESTION:** How long is a season, and is it calendar-monthly?  
**Why it matters:** Monthly is PROVISIONAL. Length changes whether Civ-scale networks can exist and whether Rust-like loss stays sharp.  
**Dependencies:** Time model → seasons.md. After objects exist, not before.  
**Status:** OPEN.

**QUESTION:** Is a season scored, won, or only inhabited?  
**Why it matters:** Winners, leaderboards, and prize seasons change incentives, sponsorship, and lottery-like legal risk.  
**Dependencies:** Seasons, sponsorship, asymmetric upside.  
**Status:** OPEN.

**QUESTION:** How do real capital and sponsored prizes transition at wipe without (a) disappearing, (b) becoming runaway persistent wealth, or (c) making the wipe cosmetic?  
**Why it matters:** This is the central paradox of P17 + P24 + P15. Solving it early without an object taxonomy will be rework.  
**Dependencies:** Domain classification → value.md → seasons.md.  
**Status:** OPEN.

**QUESTION:** What makes productive use better than hoarding without punishing prudence as a tax?  
**Why it matters:** Rational players store whatever survives or converts. Late season becomes an exit race if conversion to external value is easy.  
**Dependencies:** Production, seasons, capital.  
**Status:** OPEN.

---

## Player progression

**QUESTION:** Which persistent capabilities change what a player can do, without becoming production multipliers or purchasable mastery?  
**Why it matters:** P25 and P11 are otherwise unenforceable.  
**Dependencies:** Domain → knowledge → identity.  
**Status:** OPEN.

**QUESTION:** What is the new player’s path through the first session, week, and season at low knowledge and low capital?  
**Why it matters:** Fog, hidden tech, seasons, and real-money context are hostile. P13 must hold at the start, not only at the endgame.  
**Dependencies:** Play, information, P13.  
**Status:** OPEN.

---

## Identity / profile

**QUESTION:** What is the ownership model of a player profile?  
**Why it matters:** Account, NFT, recoverable identity, soulbound vs tradable each conflict differently with P11 and P18. Profile-as-NFT is PROVISIONAL.  
**Dependencies:** Identity, legal, P11, P18.  
**Status:** OPEN.

**QUESTION:** If a profile’s history makes it valuable, can it be sold?  
**Why it matters:** Tradable history sells mastery. Non-tradable history needs recovery and forgoes a liquidity story. Cosmetic history fails P25.  
**Dependencies:** Profile ownership, P11, P25.  
**Status:** OPEN.

**QUESTION:** What is reputation — computed from what, attackable how, visible how?  
**Why it matters:** Reputation is listed as persistent capability. Undefined reputation becomes either flavor or an unearned gate.  
**Dependencies:** Identity, conflict, markets.  
**Status:** OPEN.

---

## Capital / custody

**QUESTION:** What may be deposited and withdrawn, where does it sit, and who can freeze or seize it?  
**Why it matters:** P15 and P17 are custody questions as much as game questions. Off-chain sim plus deposits is a trust model.  
**Dependencies:** Domain authority split → finance → protocol.  
**Status:** OPEN.

**QUESTION:** How does off-chain simulation reconcile with on-chain settlement when they disagree?  
**Why it matters:** “Not your sim, not your bags.” Dispute, rollback, and finality are undesigned.  
**Dependencies:** Authority / disputes, P29.  
**Status:** OPEN.

**QUESTION:** How is protected senior backing locked, released, and distinguished from operating capital?  
**Why it matters:** The current architecture model (`architecture.md` XVI) forbids treating senior DLP as ordinary opex. Custody objects, default, and settlement math are not selected.  
**Dependencies:** V25, O46, P15. Do not restore the superseded commingled-purse leftover-priority example.  
**Status:** OPEN.

**QUESTION:** If a lender may ever authorize spending of senior backing, what arrangement is that?  
**Why it matters:** That would be a **separate** financing product, not the base model. Do not design it by silently spending senior in examples.  
**Dependencies:** O46.  
**Status:** OPEN.

---

## World economy

**QUESTION:** What economic processes exist that are not player-to-player transfers?  
**Why it matters:** P7 is otherwise unmet. Extraction, scarcity, logistics, manufacturing, events, and external participation are names, not a model.  
**Dependencies:** World, production, events, sponsorship.  
**Status:** OPEN.

**QUESTION:** How would we know the flywheel is real external value rather than recirculated deposits?  
**Why it matters:** The sketched capital → activity → fees → treasury loop can be drawn for any token game. It is not evidence.  
**Dependencies:** Instrumentation, P17.  
**Status:** OPEN.

---

## External value

**QUESTION:** What durable inflows exist besides player deposits?  
**Why it matters:** If none, P6 and P17 fail and the token thesis becomes circular. Naming candidates is not selecting them.  
**Dependencies:** Sponsorship, services, treasury. `value.md` and `external-demand.md` exist; they **do not select** sources. Do not invent sources.  
**Status:** OPEN.

---

## Sponsorship

**QUESTION:** What is a sponsor as a domain object, and what rights attach to sponsored sites, routes, events, and prizes?  
**Why it matters:** P20 requires in-world participation. Rights that grant immunity create hard borders (P10). Rights that allow raids may be unsellable.  
**Dependencies:** World, events, conflict, P20.  
**Status:** OPEN.

**QUESTION:** What happens when a sponsored object is destroyed, a deal ends mid-season, or a prize cannot be paid?  
**Why it matters:** Failure modes decide whether sponsorship is a real economic module or a marketing promise.  
**Dependencies:** Sponsorship operating model, treasury, seasons.  
**Status:** OPEN.

**QUESTION:** What commercial model, if any, is compatible with player agency and with P17?  
**Why it matters:** Pricing, revenue share, and deals are OPEN and must stay OPEN here. The question is compatibility, not a rate card.  
**Dependencies:** External value, legal, brand-safety (non-design).  
**Status:** OPEN.

---

## Treasury

**QUESTION:** What is the treasury for, once inflows are named?  
**Why it matters:** Distributing recirculated fees to stakers is not REAL VALUE OUT from the world. Designing treasury before inflows exists will invent tokenomics.  
**Dependencies:** External value, sponsorship, fees-as-design. After inflows. No percentages.  
**Status:** OPEN.

---

## Token

**QUESTION:** What, if anything, does the token do that does not violate “not required to play,” “coherent at price zero,” and “holders are not unbeatable”?  
**Why it matters:** Easy failure: staking *is* the game. Opposite failure: the token is a speculative satellite.  
**Dependencies:** Value flows and treasury first. Token is late by design.  
**Status:** OPEN.

**QUESTION:** Should token design wait until value flows exist, rather than proceed now?  
**Why it matters:** Early token design will become the economy (P16). Waiting is a process choice, not a mechanic.  
**Dependencies:** Corpus order (AUDIT G).  
**Status:** OPEN.

---

## Asymmetric upside

**QUESTION:** What objects or situations actually produce extraordinary outcomes for a small player?  
**Why it matters:** P19 requires a non-zero path. It does not require a lottery module. “Gameplay influences eligibility” will be read as ticket farming unless this is specific.  
**Dependencies:** After world objects, conflict, and value exist. Module may be rejected.  
**Status:** OPEN.

**QUESTION:** How are ownership/participation in protocol value and high-variance chance kept as distinct ideas?  
**Why it matters:** The brief wants both. Collapsing them makes every system a raffle and raises legal risk.  
**Dependencies:** Treasury, token, this section, legal.  
**Status:** OPEN.

---

## Organizations

**QUESTION:** Do shared-agency organizations exist, and if so are they seasonal, persistent, or both?  
**Why it matters:** Shared sites, liability, fog, and contracts change every domain. Premature orgs explode complexity.  
**Dependencies:** After single-player agency is real. Identity → world.  
**Status:** OPEN.

---

## Population / shards

**QUESTION:** Is there one world or many, and what breaks at very small versus very large population?  
**Why it matters:** Thin markets, backstop load, influence, and “the” world economy all depend on who shares a map.  
**Dependencies:** World, markets, seasons.  
**Status:** OPEN.

---

## Automation / bots

**QUESTION:** What automation is allowed, and what is treated as prohibited botting?  
**Why it matters:** Real-value-out attracts bots on exploration, markets, and tickets. Policy is a design input, not polish.  
**Dependencies:** Actions, markets, capital, authority.  
**Status:** OPEN.

---

## Social systems

**QUESTION:** What communication, diplomacy, or history surfaces exist, if any?  
**Why it matters:** Player-created stories are part of the fantasy. They currently have no system. Chat bolted on later will not match contracts, intel, or reputations.  
**Dependencies:** Play, information, organizations.  
**Status:** OPEN.

---

## Authority / disputes

**QUESTION:** Who is the simulation operator, what can they reverse, and how are value-bearing outcomes disputed?  
**Why it matters:** Off-chain authority is a custody and legitimacy risk, especially with deposits and high-variance outcomes.  
**Dependencies:** Capital, P29, legal.  
**Status:** OPEN.

---

## Instrumentation / circuit breakers

**QUESTION:** What must be measured to tell a real flywheel from a circular one?  
**Why it matters:** Without instrumentation, P17 cannot be audited in operation.  
**Dependencies:** Value, markets, sponsorship.  
**Status:** OPEN.

**QUESTION:** How can a module halt without halting the world?  
**Why it matters:** Open composition implies failure isolation. An economic or event-module failure otherwise takes down play or custody.  
**Dependencies:** Domain contracts (P26).  
**Status:** OPEN.

---

## Legal / regulatory constraints

**QUESTION:** How should token, deposits, high-variance distribution, and in-world advertising be characterized for legal review?  
**Why it matters:** Answers constrain or kill lottery, token, custody, and sponsorship. This track is parallel to design. Game-design docs must not pretend to be legal advice or a conclusion.  
**Dependencies:** Token, capital, asymmetric upside, sponsorship. Counsel, not `domain.md`.  
**Status:** OPEN.

---

## Intentionally not asked here

These appear in the audit as sketches, not as questions to solve in this file:

- Exact tokenomics, emissions, APY, revenue splits
- Combat formulas and damage tables
- Loot tables and drop rates
- UI component inventories
- Tech stack, schemas, on-chain layouts
- Package/folder structure
