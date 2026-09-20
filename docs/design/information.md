# Information domain

**Status:** Conceptual model. Not a fog UI, not an intel market, not espionage.  
**Kernel:** Entity · Relation · Intent · Occurrence · Domain. No new primitives.  
**Aligns with:** `world.md` (existence ≠ observability ≠ knowledge ≠ discovery ≠ control). This document owns the actor-side of that split.  
**Does not close:** fog rules (O7), map lying (O44), discoverer benefit (O11), verb list, markets, licensing, confidence scores, season mapping (O20).

Central distinction:

> WORLD TRUTH ≠ OBSERVABILITY ≠ OBSERVATION ≠ RECORD ≠ KNOWLEDGE ≠ DISCOVERY ≠ CONTROL

The player does not receive canonical World truth because it exists.

---

## 1. Domain boundary

| Owns | World | Information | Not here |
| --- | --- | --- | --- |
| Canonical existence, spatial truth, site aggregates, world relations | Yes | No | |
| Observability *class* of a World record (may this fact ever be queried, and how widely?) | Yes | No | Fog *mechanics* still OPEN |
| Issuer-scoped answer: what is **potentially observable now** to this issuer | Yes (query) | No | Presence, access, range — World/play later |
| What an actor **retains**, believes, or **holds as a record** | No | Yes | |
| Provenance, sealed vs assimilated, stale-as-of, contradiction *among claims* | No | Yes | |
| Whether a claim matches World *right now* | World is the source | Information may **ask** World to verify under observability rules | Omniscient compare |
| Title, custody of goods, control, influence, presence | Other domains | May **claim** those facts; never **be** them | |

**Boundary test.** If Information stored a copy of the whole map “for convenience,” fog is dead. If World stored `discoveredBy` on a Site, discovery becomes a World stamp and will be mistaken for claim/control. If Presentation queries World without an issuer, every client is omniscient.

The split is imperfect in one place: **verification** needs World and Information together (an Intent Information accepts, which **queries** World). That is a contract, not merged ownership.

---

## 2. Core concepts (minimized)

| Candidate | Kind | Keep? |
| --- | --- | --- |
| Fact | Canonical World (or other home-domain) record | **Not Information.** Do not duplicate World as “Fact objects.” |
| Claim | Payload inside Intel: an alleged fact about referenced entities | **Keep as content, not a primitive.** |
| **Intel** | Information **domain object** (Entity) | **Keep.** The holdable/shareable record. |
| Observation | Interaction (Intent → World query → Information write) | **Not an object.** |
| **`holds`** | Relation (Information) | **Keep.** Possession of an Intel entity. |
| **`knowledge-of`** | Relation (Information) | **Keep.** Assimilated belief about a subject/claim. ≠ `holds`. |
| Discovery | **Occurrence** (+ resulting `knowledge-of`) | **Keep as event, not a Site flag.** |
| Report / evidence | Roles or kinds of Intel | **Drop as types.** |
| Uncertainty | Qualitative state of a claim/Intel | **Keep as classification, not an object.** |
| Provenance | State on Intel (and optionally a chain of references) | **Keep as structure on Intel, not a type.** |
| Freshness | `as-of` on Intel vs later World occurrences | **Keep as distinction, not a timer system.** |
| Confidence % | — | **Refuse.** |

**Intel** is the only Information-specific domain object. Everything else is relation, occurrence, payload, or classification.

---

## 3. World truth vs actor knowledge

These five must not collapse:

| | Meaning | Home |
| --- | --- | --- |
| **A. Exists** | Canonical record in World (or another home) | That home |
| **B. Observable** | Class + issuer-scoped World query: this issuer *could* perceive it under current World conditions | World |
| **C. Received a record** | Actor `holds` Intel that *asserts* something | Information |
| **D. Knows** | Actor has `knowledge-of` (assimilated) | Information |
| **E. Discovered** | First time that actor acquired `knowledge-of` existence (or equivalent) — an **Occurrence**, not a standing World title | Information publishes; not a Site field |

**Knowing vs holding a record** are not equivalent:

- **Know without a transferable record:** direct observation creates `knowledge-of` and typically a **non-transferable** memory Intel (or only `knowledge-of` — see §16: memory Intel is enough if it is non-transferable).
- **Hold without knowing:** sealed Intel (`holds`, contents not assimilated). A dossier in a locked case, an unread brief, a licensed file not opened.
- **Know and hold:** unsealed report you have read; memory you still “have.”

**`knowledge-of` meaning (conceptual, not storage):** a relation from an actor to a **subject** (entity ref, which may dangle) and/or to a **claim** (payload). It is the actor’s current epistemic stance, not World truth.

It is **not** derived solely from `holds` (sealed documents). It is **not** a projection of World (that would leak truth).

---

## 4. Discovery (pressure test of `world.md`)

`world.md` places discovery in Information as gaining `knowledge-of`. That **survives**, with a sharper split:

| Piece | What it is |
| --- | --- |
| **Discovery (event)** | An **Occurrence**: this issuer *first* assimilated that a referenced World entity/condition exists (and maybe some claims). |
| **Discovered (state)** | Derived: `knowledge-of` existence holds for that issuer. **Not** a property of the Site. |
| **Discoverer benefit** | OPEN (O11). Must not be smuggled in as title, control, access, or influence. |

Discovery **must not** imply: ownership, title, control, influence, permanent access, economic entitlement.

Strategic value of discovery without control is allowed and intended: you can know a vein exists and still be unable to run it. That value is **epistemic**, not authority.

Discovery is **combination**: Occurrence (for subscribers: Economy, Technology, later lottery — without becoming tickets by default) + lasting `knowledge-of`. It is not only a derived flag with no event (other domains could not react). It is not only an Occurrence with no state (the player would forget unless something persists).

No discovery mechanics (how scouting works, rates, “first discoverer”).

---

## 5. Observation

**Observation is not owned by Information alone.**

| Step | Domain |
| --- | --- |
| Issuer attempts to perceive (Intent) | Actions / play (verbs OPEN) |
| What *can* be perceived given presence, access, conditions, … | **World** (issuer-scoped query). Mechanics of range/equipment OPEN. |
| What the actor **retains** from that | **Information** (creates/updates Intel and/or `knowledge-of`) |

World must not write `knowledge-of`. Information must not compute “are they close enough?”

Observation **depends on** (all undesigned): presence, distance, access, capability, prior knowledge, world conditions, time. Those parameters are **inputs to World’s observable slice**, not Information internals.

A failed observation (nothing useful) may still produce Occurrence or empty result — OPEN. Information should allow “I looked and learned nothing” without creating false claims.

---

## 6. Uncertainty

The system **must** distinguish:

> The world is X.

from:

> This actor’s claim is that the world is X.

World does not store beliefs. Information does not store World’s canonical X as the actor’s X.

Qualitative distinctions **needed**:

| State | Meaning |
| --- | --- |
| **Unknown** | No `knowledge-of` / no relevant Intel for this actor |
| **Known (as a claim)** | Assimilated claim exists; **not** “true” |
| **Partial** | Claim covers only some of the subject (exists, but not internals) |
| **Disputed / contradicted** | Two assimilated claims about the same subject disagree |
| **Unverified** | Claim not checked against a currently allowed World observation |
| **Outdated (stale)** | `as-of` precedes a **material** World change; may have been true then |
| **False** | Does not match World at the relevant time — usually *unknowable* to the actor until verification |

**Stale ≠ false. Incomplete ≠ uncertain. Unverified ≠ false.**

**No confidence percentages** unless a later domain proves qualitative states cannot work. Arbitrary 0–100 “intel ratings” would become a minigame and a leak of hidden truth if they track World.

---

## 7. Provenance

**Provenance matters.** Without it, every rumor equals seeing it yourself, and transfer erases responsibility.

It is **state on Intel** (source actor/domain, kind of origin, optional predecessor Intel). It is **not** a fixed taxonomy in this document.

Kinds that *may* exist later (illustrative, not a catalog): direct observation, another actor, artifact, event reveal, historical/persistent record, system/protocol notice.

**On transfer:** provenance **can** be preserved, stripped, summarized, or forged. That possibility is why Intel is an object with state, not a bare `knowledge-of` boolean. Default policy is OPEN (whether copies clone the chain, whether forgery is a play verb).

Information must not require a complete honest chain. Lies are claims with provenance that may itself be false.

---

## 8. Freshness / staleness

World changes; Intel does not auto-update (that would be a truth leak and would erase the Rust “I thought that barrel was still there”).

Intel carries an **`as-of`** (conceptual: tied to a time or to a World Occurrence, clock OPEN).

| | False | Stale | Incomplete | Unverified |
| --- | --- | --- | --- | --- |
| Was it ever matching World at `as-of`? | No (or not at the claimed time) | Yes, or believed so | Only part of the subject | Unknown |
| After World mutates | Still false | Now possibly wrong **because the world moved** | Still partial | Still unchecked |

Staleness may be **marked** when Information **subscribes** to material World Occurrences about the same subject (site gone, transformed, control-slot changed). Marking stale is not rewriting the claim into World truth and is not a decay timer.

Do not design freshness bars.

---

## 9. Information as a resource

Constitution: information can be economically and strategically meaningful (P22). That means other domains can **reference Intel entities** and `holds` / `knowledge-of` — not that every fact is a token.

| Operation | Conceptual | Not designed |
| --- | --- | --- |
| Held | `holds` Intel | Inventory UI |
| Transferred / shared / withheld | Move or copy `holds`; or copy Intel (new entity, provenance OPEN) | Market, chat |
| Licensed | Contract (later) **references** Intel | Pricing, terms |
| Sold | Economy references Intel | Prices |
| Falsified | New Intel with claims that do not match World | Crime verbs |
| Combined | New Intel whose claims derive from several (OPEN whether allowed) | Crafting intel |

**Knowing** is not automatically **an asset**. **Possessing a transferable record** can be. That is the economic hinge: markets, if any, trade **Intel** (or rights to it), not “the player’s brain.”

P11 tension: buying Intel is money buying *power* (optionality), not automatically mastery. Mastery remains using, judging, and acting on claims — OPEN to enforce later. Do not forbid tradable Intel here; do not make it the only knowledge.

---

## 10. Sharing — conceptual operations, not verbs

Later play/social/economy may need these **interactions**. They are not an action list.

| Interaction | Sketch |
| --- | --- |
| Observe | World slice → Information write |
| Record | Assimilated knowledge → transferable Intel (copy) |
| Disclose / share | Grant another actor `holds` or copy |
| Transfer | Move `holds` |
| Withhold | Do not disclose |
| Verify | Information commands a World query; result is new Intel / updated unverified→verified-as-claim, **not** a silent overwrite of World |
| Contradict | Two claims coexist; disputed state |

No social graph, no chat spec, no “spy class.”

---

## 11. Access / visibility (anti-leak)

Canonical World is **not** universally queryable (`world.md` §13). Information adds:

- Actors query **their** `holds` and `knowledge-of`, not the Information store.
- No `listAllIntel()` for other domains except through published, scoped projections.
- **World-public** facts (if any) are World observability class, not “Information copies them to everyone.”
- Presentation consumes **Information projections for this issuer** plus only World-public slices — never a merged god-map.
- Access to **evidence** (unsealing) is not the same as `holds` sealed Intel.

This is not an ACL product. It is the rule that **issuer identity is required** on queries that could reveal hidden world or others’ Intel.

---

## 12. Persistent player / dead seasonal subjects

World objects die. Information **must** support:

- `knowledge-of` and Intel that **reference** Site/Place ids which no longer exist
- Claims that remain meaningful as **history** (“a site of that kind existed,” “I found X that season”) without requiring the Site aggregate
- No cascade delete from World wipe (invariant 9 + `world.md` §16)

Whether that history is *useful* next season, wiped, or mapped to persistent capability is **O20 / progression** — not solved. Information only must **not** be modeled as a child row of a Site.

Memory of *how the game works* vs memory of *this Site id* may later split; do not invent that split here.

---

## 13. Events

| May Events… | Boundary |
| --- | --- |
| Create information | **Intent to Information** (reveal: create Intel / `knowledge-of` for specified issuers). Occurrence alone does not update brains. |
| Invalidate / stale-mark | World mutation → Occurrence → Information **reacts** on **its** records. Events do not edit `knowledge-of` internals. |
| Reveal hidden world | Change World **observability** (World intent) and/or create Information (reveal). Two different moves. |
| Change what is observable | World’s observability class / conditions. Information does not own observability. |

Events change the **information environment**. Information remains responsible for **actor knowledge**.

---

## 14. Information and control

P21: discovery ≠ control.

| | Allowed |
| --- | --- |
| Knowledge without control | Yes. Strategic. |
| Control without anyone’s knowledge | Yes. World/Conflict may change the control slot with no Intel update until observed. |
| Intel that **claims** who controls | Yes. May be wrong, stale, or contradicted. |
| Knowledge **granting** control | **No.** |

Knowing that a site exists has strategic value **without** authority over it. Any extra discoverer entitlement is O11, not implied.

---

## 15. Conceptual contracts

Not APIs.

| From → To | Contract |
| --- | --- |
| **World → Information** | Issuer-scoped **potentially observable** slice. Material Occurrences about subjects (appeared, gone, transformed, connectivity, control-slot) so Information can mark stale. Never a full dump. |
| **Information → World** | Verify/observe **requests** (Intents Information sends or Actions send with Information as writer). No write to World. |
| **Information → Actions / play** | What this issuer **knows** / **holds** (for choice). Not truth. |
| **Information → Presentation** | Issuer projections for the map. Not World canonical. |
| **Information → Conflict** | Claims about threats, presence, control — as Intel/`knowledge-of`, possibly wrong. |
| **Information → Economy** | Which Intel is transferable / economically significant; references for trade/license. No prices. |
| **Information → Events** | Occurrences: discovered, intel created, contradicted, stale-marked. Events do not own the store. |
| **Information → Technology** | Epistemic claims (“I have seen this pattern”). **Capability unlocks** stay Technology. Whether a blueprint *is* Intel or a Technology entity is **OPEN** — do not merge domains here. |
| **Identity** | Issuer entity refs. Orgs OPEN: whether `knowledge-of` is shared by mandate is later. |

Other domains **must not** mutate Information internals.

---

## 16. Minimization test

| If dropped | Result | Verdict |
| --- | --- | --- |
| Intel object | Only booleans `knowledge-of`; cannot seal, sell, forge, provenance-chain | **Keep** |
| `holds` | Cannot possess unread/sealed records | **Keep** |
| `knowledge-of` | Holding a file = knowing it | **Keep** (hostile #6) |
| Discovery as Occurrence | Other domains cannot react without polling | **Keep event** |
| Discovery as Site flag | Becomes claim/control | **Refuse** |
| Fact type | Duplicate World | **Refuse** |
| Observation object | Duplicate Intents | **Refuse** |
| Report / evidence types | Roles of Intel | **Refuse as types** |
| Provenance structure | All sources equal; transfer washes origin | **Keep on Intel** |
| Stale vs false | “Wrong” erases history | **Keep distinction** |
| Confidence % | Hidden truth leaks; minigame | **Refuse** |
| Opportunity-like “intel tokens” as the only knowledge | Ticket farming | **Refuse as default** |

Could `knowledge-of` be derived from “unsealed `holds`”? **Almost**, if every memory is non-transferable Intel. Keep the relation **named** anyway so sealed vs assimilated stays explicit and World never stores it.

---

## 17. Hostile review

1. **World leak?** Issuer-scoped World + no Information god-query. Presentation must not skip Information.  
2. **Discovery = ownership?** Occurrence + `knowledge-of` only.  
3. **Knowledge = control?** Forbidden.  
4. **Permanently true?** Intel does not auto-sync; stale-mark on material Occurrences.  
5. **Stale vs false?** Distinct.  
6. **Report vs knowing?** `holds` ≠ `knowledge-of`.  
7. **Universal ontology?** One object type (Intel) + two relations + claims as payload.  
8. **UI mechanics?** Fog drawing is Presentation; this doc has no widgets.  
9. **Identical info?** Default hidden; public only if World classifies public.  
10. **Site gone?** Dangling refs; no cascade.  
11. **Foreign mutation?** Commands only.  
12. **Percentage game?** Refused.

**Kernel:** no contradiction. Intel is an Entity. `holds` and `knowledge-of` are Relations. Discovery and stale-mark are Occurrences. Information is a Domain.

**`world.md`:** compatible. Discovery ownership stays Information; World still must not stamp Sites.

---

## 18. Close

### A. Established

- Information owns actor-side claims, records, and belief relations — not World truth.
- Observability and “what can I see now” stay World; retention stays Information.
- **Intel** (object) + **`holds`** + **`knowledge-of`**.
- Observation is a cross-domain interaction, not a type.
- Discovery = Occurrence of first assimilated existence-knowledge; not control or a Site field.
- Belief ≠ World; stale ≠ false; sealed ≠ known.
- Provenance belongs on Intel; transfer policy OPEN but *possible*.
- Economic meaning attaches to **Intel / rights**, not to omniscience.
- Persistent knowledge may outlive seasonal subjects.
- Events may reveal or stale-mark only through intents/occurrences, not by writing Information internals.

### B. Left to later domains

Fog parameters, verbs, markets, licensing, forgery play, org-shared knowledge, blueprint-vs-Intel, discoverer benefit, confidence (if ever), season mapping of memories, Presentation lying (O44), proof-of-discovery without broadcasting (O7).

### C. Contracts with World and kernel

Five primitives only. World: observable slice + material Occurrences. Information: issuer-scoped knowledge/holds; verify via World query; never a dump. Invariants 6–7, 9 from `domain.md`.

### D. Remaining open

O7 (object details beyond this kernel-level Intel — copy, fake, expiry **mechanics**), O11, O12 (tech vs intel), O24 (profile vs selling mastery-as-intel), O44, org sharing (O36), verify-without-revealing-to-all.

**Refinement of `questions.md` (not rewritten):** “What is a piece of information?” → Intel entity with claims, provenance, `as-of`, `holds` vs `knowledge-of`. Copy/fake/expiry **rules** still OPEN.

### E. Contradictions left standing

- Tradable Intel vs P11 (money buys the fog of war) — allowed as power, not solved.  
- Persistent memories vs seasonal uniqueness (O20).  
- Technology blueprints vs Intel objects — two homes possible; not merged.  
- Public verification vs P22 (proving a find without telling the world) — still O7.

**Recommended next:** `play.md` (observe/choose/act using World + Information contracts). Still no code, no market, no fog UI.
