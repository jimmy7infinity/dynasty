# Value (conceptual books)

**Status:** Kinds of value/state and their boundaries. **Not tokenomics, not an economic engine.**  
**Kernel:** Entity · Relation · Intent · Occurrence · Domain. **No Value primitive.**  
**Does not modify:** other corpus files.  
**Depends on:** `principles.md` (P6, P7, P16, P17, P25), `AUDIT.md` v2 K–M, `production-while-away.md`, `control.md`, `information.md`.

**Purpose:** Keep **game state**, **economic/exchange significance**, and **settled capital** from collapsing into “money.”

Dynasty is a **game/world** that is also the **participation interface** of a crypto-economic protocol. No engine is designed here.

---

## 1. What “value” is not one thing

| Sense | Meaning | Same as money? |
| --- | --- | --- |
| **Useful** | Aids Observe/Choose/Act (a route, a fact) | No |
| **Scarce** | Contested / limited in the world | No |
| **Desired** | Players want it | No |
| **Exchangeable** | Another actor might **pay** for it | Not yet settlement |
| **Productive** | Transforms world state (Site, lots) | Not automatically capital |
| **Settled external** | Protocol-final claim on external capital | **This** is the money book |

A scarce useful Site is not ETH. ETH is not operational `control`.

**Internal money (DLP)** is documented in `architecture.md` Parts XV–XVI (**PROVISIONAL** until locked): DLP is the internal monetary unit, 1:1 ETH-backed; transfers redistribute existing claims; World events do not mint or burn DLP; World objects are not automatically DLP and have no protocol-wide DLP price. This file owns the **W/P/E/S books**, not DLP contract design. Redemption, insolvency, and vault architecture remain **OPEN**.

**World ≠ money:** strategically valuable World state is still W. A bilateral payment can be E. Neither is a protocol appraisal, oracle, NPC bid, NPV, or “worth X DLP because the architecture said so.”

---

## 2. World value/state

Things valuable **because of World records**: resources/deposits, Sites, infra, `connects`, positions, capacity, unowned remainder, logistics situation, `control` of a Site.

**One category for this book:** **situated seasonal world state** (World-home). Subkinds (route vs mine) are **not** extra books.

World **owns the truth**. Not a Value primitive. Lots **at a Site** are world state (`production-while-away.md`), not a player reward balance.

---

## 3. Player / persistent value

Season-surviving, **actor-bound**: `knowledge-of`, Intel `holds` (may also be exchangeable), capabilities/options, access-as-persistent-OPEN, reputation OPEN, relationships OPEN, history/identity OPEN, blueprints OPEN (may be intel or Technology).

**Genuine value** = they change **what you can do, know, access, or choose** (P25).  
**Not genuine as designed:** permanent output multipliers, “score = money.”

Tradable history/profile **tensions P11** (O24) — not solved here.

---

## 4. Economic / exchange value

**When another actor might rationally pay:** they want **use, scarcity, productivity, a right, information, or optionality** they do not have — not because a token chart went up.

Drivers (not a price model): scarcity, utility, productivity, exchangeability, **title**, **control** (pay to operate or to stop you), info asymmetry, contract/access rights, optionality.

**Control is not a price.** Title is not `control`. Paying for `control` is power (P11), not mastery.

---

## 5. External value **in**

**Not RVI:** token speculation; deposits **as such**; A→B transfers **as such**; fees on those transfers **as such**.

**Candidates for “money in because something is economically valuable”** (none selected): pay for capacity/output/info/services/rights; fund production; sponsorship; participate in **world** processes that have **outside** buyers.

**Distinguish:** money *in the box* vs money in **because the box does something worth paying for**.

Unspecified which, if any, work (`AUDIT.md` M).

---

## 6. External value **out**

**Justified outflow** requires a **prior** real transition: world/economic Result + authorized **settlement** — not a claim faucet.

Candidates (undesigned): withdraw **earned** settled capital; pay for goods/services **across** the boundary; settle contract claims; revenue from **productive** activity with **external** counterparties.

**Question left open:** what must have happened **in World/Economy** before Protocol may decrease settled capital **to** the player. Do not design settlement.

---

## 7. Books — four survives (with names)

Not storage engines. **Truth homes** and **integrity class**.

| Book | What | Truth | Season | Exchangeable? | Lost? | Can affect settled capital? |
| --- | --- | --- | --- | --- | --- | --- |
| **W — World** | Situated seasonal state | World | Dies with instance (default) | Indirect (via later books) | Yes (conflict, Events, wipe) | Only **after** authorized transition |
| **P — Persistent player** | Capability, knowledge, identity | Information / Identity | Persists | Some Intel/rights **OPEN** | Knowledge may stale; identity not PvP-loot | Not by itself |
| **E — Exchange** | Rights/goods **in economic play** (title, listed lots, contracts, tradable Intel) | Future Economy/Contracts — **undesigned home** | **OPEN** (O20) | **Yes** (that is the point) | Yes | May **obligate** settlement; is **not** ETH |
| **S — Settled capital** | External-capital claims, settlement-final | Protocol / Capital — **undesigned** | **Must not vanish** as a wipe toy | Withdraw/transfer per Protocol | Not default PvP loot (P15) | **Is** this book |

**Four is enough.** A fifth “token book” is **not** added; a future token is **E and/or S** by design, not a new metaphysics.

**W+P are the game. E is “might pay.” S is money.** Collapsing them is the failure mode.

---

## 8. Boundary examples

| Thing | Book |
| --- | --- |
| Mine, vein, lots **on the map**, `control` | **W** |
| Configuring extraction | World Intent → **W** changes |
| Title to a mill, a sale listing | **E** (when that domain exists) |
| Proceeds after **authorized** settlement | **S** |
| Blueprint / `knowledge-of` | **P** (and maybe **E** if tradable Intel) |
| Intel record | Information; **P** and/or **E**; **not S** |
| ETH | **S** only |

Coherent if **no** World Intent writes **S**, and **no** client writes **S**.

---

## 9. Transformations (optional, not pipelines)

Possible: **W** useful output → **E** right → **S** settlement.  
Possible: Information → knowledge → capability → **W** advantage → **E**.

**Not mandatory.** Many **W/P** things never touch **S**. That is allowed (§14).

---

## 10. RVI → RVO test

| Fake / circular | Genuine (still unspecified how) |
| --- | --- |
| Emit token, assign price, call it value | Outside party pays **because** of world/services/rights |
| Recycle deposits as “yield” | New **external** inflow (sponsor, customer, real output sale) |
| P2P wash + fees as RVI | Fee is **not** automatically external |
| Chart goes up | Token price **≠** value creation |

**Yes:** the principle can be **named** while the economy is **unsound** (that is today’s state).  
**Yes:** useful **W/P** value **without** token appreciation (P16: game coherent at price 0).

**RVI remains a requirement, not a mechanism.**

---

## 11. P2P

A pays B **≠** RVI.

P2P is **legitimate E** if they exchange **real W/P/E things** (lots, Intel, services, rights) — a **market in use-value**, still **internal** unless an **outside** counterpart or **new** external inflow exists.

---

## 12. Token boundary (no mechanics)

Token **coordinates**; it **is not** the economy (P16).

| Test | Constraint |
| --- | --- |
| Price = 0 | **W/P play and W economy must still function** |
| High price | Must **not** buy mastery / unbeatable `control` by holding |
| Meaningful without required to play | Coordination/E/S participation **optional** for the loop |

Relevance **from activity**, not from being the only prized object.

---

## 13. Security boundary (no architecture)

**Stronger integrity begins when a transition is allowed to change Book S** (or to create an **E** right that **must** settle into S).

Sketch (not a pipeline): World/E Result → **authorized** settlement Intent → **S** changes.

**Before that line:** ordinary game mutation (still needs anti-cheat later).  
**After that line:** `AUDIT.md` v2 K–L (no mint, no client fabrications, no silent sim/S mismatch).

**Not chosen:** chain, custody, oracles.

---

## 14. Game vs economic significance

Useful distinction. Dynasty **must not** require every mechanic to mint **E/S**. Fog, exploration wonder, remainder can be **W/P-only**.

---

## 15. Anti-idle

`production-while-away.md`: offline “value” = **W** transformation (lots, vein), not a hidden **S** or claim balance. If that later becomes **E/S**, it is because **state existed**, not because a faucet ran.

---

## 16. Explicitly not settled

Market structure, prices, custody, deployment, revenue, treasury, token, sponsorship economics, settlement, legal, economic security architecture, O20 mapping of E/S, what actually sells to the outside.

---

## Close

### A. Value

Several senses; only **S** is settled external capital.

### B–C. Categories / four books

**W, P, E, S** survive. No Value primitive. No token book.

### D. World

Situated seasonal state; World truth.

### E. Player

Capability/knowledge/identity; P25; not +% forever.

### F. Exchange

Pay-for-use/rights/goods/info; home **undesigned**.

### G. Settled capital

Protocol truth; not PvP loot by default; not wipe-deleted as a toy.

### H. RVI in

**LOCKED requirement, OPEN product.** Because something is worth paying for — mechanisms **OPEN**. Not speculation/deposits/P2P-as-such. `external-demand.md`: no fully designed external revenue mechanism yet.

### I. RVI out

After real transitions + authorized settlement — **OPEN** how.

### J. Transforms

Optional, not required pipelines.

### K. RVI test

Principle ≠ engine; circular/fake named; price 0 still playable.

### L. P2P

Legitimate **E**; not RVI by itself.

### M. Token

Coordinate; not the economy; not required to play.

### N. Security

Hardens at **S** (and S-binding E).

### O. Game vs $

Both allowed; not every verb pays.

### P. Unresolved

What **E** home is; what outsiders buy; O20; control-for-pay vs P11; Intel markets vs P11.

### Q. Tensions

- Useful W vs empty S.  
- P2P depth vs circular capital.  
- Sponsorship as RVI vs raidable brands.  
- Persistent tradable P vs mastery-for-sale.  
- Live mill (**W**) vs looking like idle **S**.

### R. Cross-refs — **not applied**

| Doc | Note |
| --- | --- |
| `AUDIT.md` v2 | Point M/K at this book split. |
| `principles.md` | No change; P17 still unmet as mechanism. |
| `production-while-away.md` | Output is **W**, not **S**. |

No other edits until accepted.

**Next (not this file):** still not tokenomics. Either **E-home sketch** (what is listed/sold) without prices, or **O20** once W/E/S objects are named.
