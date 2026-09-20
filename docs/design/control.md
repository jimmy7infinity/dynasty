# Control

**Status:** Conceptual meaning of the reserved `control` slot. Not acquisition mechanics, not combat, not property law.  
**Kernel:** Entity · Relation · Intent · Occurrence · Domain. **No sixth primitive.**  
**Depends on:** `domain.md`, `world.md`, `information.md`, `play.md`, `events.md`, `conflict.md`.  
**Does not close:** how control is gained/lost (O5 remainder), exclusive vs shared, offline (O18), production formulas.

`world.md` reserved `control` as “determine operations / outcomes of a Site.” This document fills **meaning**, not **how** control is gained. Acquisition, exclusive vs shared, and authorized-issuer **mechanism** remain OPEN (O5 remainder). `conflict.md` needs the slot to be real.

---

## 1. What Control is (hypothesis test)

**Hypothesis (not assumed):**  
“Control is the ability of an actor to reliably cause or prevent certain state changes concerning a subject.”

| Pressure | Result |
| --- | --- |
| Too broad | **Access** also causes state (entering). **Title** causes Capital state. **Custody** causes lot location. Without a **family of Intents**, the hypothesis = “can do anything,” which collapses every slot. |
| “Reliably” | Too strong. Events and Conflict **interrupt**. Control is **authoritative, not invulnerable**. |
| Capability vs relation | The “ability” is **World policy**: which issuer’s Intents of **operational kinds** World **accepts** for that subject. That policy is grounded in a **relation**, not a new primitive. |
| Derived? | Could be inferred from “last successful operate,” exclusive access, or presence. **Deriving it from those collapses the slots** (you could be present without operating). Keep **`control` as a World-owned relation**, optionally *later* proved derived — still **one named slot**. |
| Cross-domain | The **relation is World-home**. Production/Logistics **query** it; they do not store a second `control`. |

**Kind:** World-owned **Relation** `control` (issuer entity → subject entity). Not a Domain of its own. Not an Event. Not a score.

**Candidate definition (justified after the test):**

> **Control** is a World-owned relation: World treats the related issuer(s) as **operational authority** over a **subject** — World **accepts** a defined family of **operational Intents** from them concerning that subject’s World aggregate, and treats **incompatible** operational Intents from others as **opposition** (`conflict.md`), unless interrupted.

“Cause” = those Intents may apply. “Prevent” = others’ exclusive-operational Intents are ineligible or Conflict. Not omniscience. Not title. Not a buff.

---

## 2. Control vs the other slots

None of these survive if they mean the same thing.

| Slot | Home | Meaning | Example |
| --- | --- | --- | --- |
| **`knowledge-of`** | Information | Assimilated belief | Know the mine exists; never been; do not run it. |
| **`holds` Intel** | Information | Possess a record | Hold a sealed map of the mine; still not there, not running it. |
| **`present-at`** | World | Co-located at the Place | Standing in the mine. Raiders can be present. Staff can be absent (**operational-from-afar** still OPEN; must not rename presence). |
| **`access`** | World | May enter / use | Permitted into the facility; someone else **runs** the line. Walking a ruin. |
| **`influence`** | Derived | Soft, overlapping effect | Nearby presence/infra shifts conditions; you do not accept operational Intents. Not a border. |
| **`control`** | World | Operational authority (this doc) | World accepts “run / configure / halt / set access policy” kinds from you on **this Site**. |
| **`title`** | Capital / Identity | Economic/participatory stake | Deed, share, claim-of-value. **Not** World `owner`. |
| **`custody`** | Capital / Logistics | Who holds a movable | Ore in *your* wagon; the mill is **controlled** by someone else. |

**Examples that must remain distinct:**

- Know the mine, not there → knowledge, not control.  
- At the mine, not controlling it → presence (visitor, thief, customer).  
- Access without control → guest, worker without operational authority, public dock.  
- Influence without control → neighboring Site; overlapping blooms.  
- Control without title → occupying/operating a found facility.  
- Title without control → absentee stake; another issuer has `control`.  
- Custody without control of the process → you hold lots; you do not set the refinery’s operational Intents.

**If they collapsed under pressure:** they do **not**, provided operational Intent-kinds are **not** identical to “enter” (access) or “stand here” (presence). If later design makes “being there” the only operate verb, **control collapses into presence** — that would be a failed World design, not a reason to merge slots now.

---

## 3. What Control enables (conceptual)

Not mechanics. When `control` holds, **typically**:

- Issue **operational Intents** World accepts for that subject (run, halt, configure aggregate — kinds OPEN).  
- **Constrain** others: exclusive operational kinds go through Conflict / ineligibility.  
- **Operate infrastructure** that is the Site aggregate (not a separate “power score”).  
- **Direct production** only insofar as Production **queries** `control` or World applies production as Site internals — Production does not own `control`.  
- **Decide access policy** as operational Intents that **change** `access` relations (World still writes `access`). Control ≠ access.  
- **Defend** by issuing or being the subject of Conflict Intents over this `control` slot — Conflict still does not write World.  
- **Route** if the subject is a **reified route** World treats as operable infrastructure.  
- **Receive consequences** of operation (Occurrences: produced, broke, exposed) — not a dividend rule.

Control is **agency over operational Intents**, not a passive multiplier. A silent +% with no decisions is **not** control (P25, `play.md`).

---

## 4. Scoped: control over what?

**Default subject:** a **Site** (World entity/aggregate).

**May also be a subject** if it is a World entity with an operational aggregate: **reified route** / named infrastructure (not every `connects` edge).

| Candidate | Controllable? |
| --- | --- |
| Site | **Yes** — primary |
| Place (empty locus) | **No as territory.** Controlling Places = Civ tiles. You control a **Site at** a Place. |
| Production “process” as a type | **No extra type.** Internals of a controlled Site. |
| Strategic position | Only if it **is** a Site (or operable infra). Not a ghost type. |
| Opportunity | **No** (derived). |
| `connects` as bare relation | **No.** Reify first, then maybe. |
| Contracts | **No.** Contracts home. |
| Intel / `knowledge-of` | **No.** `holds` / knowledge. Not `control`. |
| Organization | **No World `control`.** Mandate/issuers are Identity (O36). An **org entity** may **be the issuer** of Site `control`. |
| Resource kinds | **No.** Deposits are Site state; lots are custody. |
| Other actors | **No.** Cannot puppet their Intents (`conflict.md`). |
| World instance, Events, Protocol records | **No.** |
| Settlement-grade deposits | **No.** |

---

## 5. Control is not ownership

**Title ≠ Control.** Required examples:

- Title, no control: stake in a mill another issuer operates.  
- Control, no title: found/occupied Site this season.  
- Control **temporary**; title (if any) **may** persist on a **different record** (Capital) — wipe mapping O20.  
- Control **contested** via Conflict over the `control` relation.  
- **Shared / delegated:** OPEN. Conceptually allowed as relation shape (multiple issuers, mandate). **Not designed.** Default language in Conflict is **incompatible exclusive** operational claims — sharing must be an explicit later relation mode, not silent co-owners of one exclusive slot.

**Authorized issuer (conceptual constraint; mechanism OPEN):** If World later accepts operational Intents from someone other than the named controller, that is a **mode of this existing `control` relation**, not a second control primitive and not a second exclusive control slot. It must not become hidden ownership, automatic hire/pay/trust/Direct/presence/title/organization/finance authority, a relationship ACL, capital-based agency, permanent floating permission, or a way to puppet another actor’s Intents (§4). A named controller remains the unique exclusive operational authority of the relation. Exact scope, duration, revocation, concurrency, chains, afar rules, and organizational implementation are **not designed**. Hire and payment do not create it.

Org exercises `control` as **issuer**; individuals may hold title/custody **elsewhere**. World stores one `control` relation to the issuer entity it accepts (player or org). No legal system here.

---

## 6. Control and Conflict

| Phrase | Meaning |
| --- | --- |
| Contest control | `opposed-over` the **`control` relation** (and/or competing operational Intents). |
| Lose / establish / transfer | **World Result** changing `control`. Conflict **requests**; World **writes**. |
| Interrupt control | Interrupt **in-flight operational Intents**, or Event conditions, via Intents to those **homes** — not a combat minigame. |
| Temporary exercise | `control` with seasonal/ephemeral classification; or in-flight only without standing relation — **OPEN** whether the latter counts as control (prefer: in-flight operate **without** `control` is just an Action, not the slot). |
| Share/delegate | OPEN relation mode. |

Competing Intents can suffice **without** a Contest object (`conflict.md`). Contest is only for in-flight opposition **process**.

---

## 7. Control and Information

Control **does not** imply omniscience.

- Operate without knowing the full aggregate (opaque internals, stale Intel).  
- **Believe** you control (`knowledge-of` / Intel) when World `control` is someone else.  
- Hidden facts can **undermine** (sabotage, unknown Event) without you knowing.  
- Information **enables** contest (you learn who runs it / that it exists) — does not **grant** `control` (P21).  
- Others may **not know** who has `control`.

World truth ≠ belief ≠ Intel.

---

## 8. Control and Events

Events **issue Intents** to World → World **may** change `control` (disaster, collapse, scripted vacancy). Events **create conditions** (access, connectivity) that make operational Intents eligible/ineligible. They are **not** “a combat outcome named Event.”

**Material `control` changes publish Occurrences** (World). Information may miss them.

Contest vs competing Intents: **unchanged** from `conflict.md`. Do not make every control fight an Event.

---

## 9. Time

Do not pick durations.

Control **may** be: standing (until World changes it); **conditional** (depends on World conditions — OPEN); **not** a per-tick score. “Continuously maintained” as a **mechanic** is OPEN (O18). Conceptually it is **state of a relation**, not a beam you hold down.

Instant operate-without-standing-`control` is an **Action**, not the slot.

---

## 10. Agency

| Phrase | Is it control? |
| --- | --- |
| I issue operational Intents World accepts | **Yes** |
| Passive +% production | **No** |
| I have title | **No** |
| I influence the hex bloom | **No** |
| I know the Site | **No** |

If the player cannot **choose** operational Intents, they do not have control.

---

## 11. Money (P11)

Capital **may** help **establish or hold** control (scale, redundant Sites, hired issuers — OPEN). It **may** buy **title** with **zero** `control`. It must **not** purchase a mastery skip: positioning, information, and decisions still sit on Intents.

Overwhelming control of **what exists** is allowed as **power**. Locking **what has not happened** is still P12. Anti-whale design: later.

---

## 12. New players / lockout

**Risk:** all existing Sites `control`led by veterans → new players only serve or raid.

**Structure, not a solution:** control attaches to **existing subjects**. New Places/Sites/conditions (`world.md` remainder, Events) are **not** pre-controlled. Permanent lockout of *all* remainder is worldgen/Event failure (O6), not a valid `control` victory.

---

## 13. Seasons

`control` on Sites is **seasonal / world-instance** with the Site. Title/capability **may** persist on **other** records. No wipe mapping here (O20). Do not persist `control` as +% (P25).

---

## 14. Capital / Protocol

Control is **game state** (World relation).

**May later have economic consequences:** who operates a Site → production Occurrences → Economy; disruption → markets; never “control = coin.”

Protocol **may observe** `control` Occurrences. It **must not** treat `control` as settlement or token ownership.

---

## 15. Minimization / if we removed the name

**Kernel expression:** Relation `control` in World; operational Intent kinds; Occurrences on change. No new primitive.

**If the name `control` disappeared:** World would still accept some Intents from some issuers. **Ambiguity:** that privilege would be smuggled into **access**, **presence**, or a hidden `owner` field — which **is** title/territory. Conflict would not know which slot is exclusive-operational. **Keep the name.**

---

## 16. Hostile review

| Failure | Guard |
| --- | --- |
| Control = ownership | Title separate |
| = influence | Derived vs relation |
| = presence / access | Different Intent families |
| = power score / +% | Agency test §10 |
| = territory | No Place-as-tile `control` |
| = Event subtype | World relation; Events only Intent |
| = combat outcome | Conflict requests; World writes |
| = permanent domination | Seasonal subject + P12 remainder |
| = sixth primitive | Relation only |

---

## Close

### A. Established

`control` is a **World relation** of **operational authority** over a **Site** (or operable infra entity). Not territory, not title, not a buff.

### B. Candidate definition

See §1 (boxed). Hypothesis narrowed: not “any state change,” not “reliably invulnerable.”

### C. Other slots

§2 table. They do not collapse if operational kinds ≠ enter ≠ stand-here.

### D. Can be controlled

Sites; possibly reified operable routes/infra. Org may **be issuer**.

### E. Cannot

Places-as-tiles; Opportunity; Intel/`knowledge-of`; contracts; resource kinds; other actors’ agency; deposits/settlement; Events/Protocol; bare `connects`.

### F. Conflict

Contests **this relation** (or exclusive operational Intents). Writes stay World.

### G. Events

May request `control` changes; not the war engine; Occurrences on material change.

### H. Information

No omniscience; false belief of control allowed; knowing ≠ controlling.

### I. Capital / Protocol

Observe; do not equate with money or settlement. Title lives elsewhere.

### J. Unresolved

Acquisition/loss rules; exclusive vs share/delegate; operate-from-afar vs presence; which Intent kinds are “operational”; O18; O5 remainder (meaning is now proposed — **how** still OPEN); Production vs World who applies run-intents.

### K. Tensions

- Exclusive `control` vs later sharing.  
- Capital scale vs P11.  
- Veteran `control` of all current Sites vs P12 (depends on remainder actually spawning).  
- Offline `control` (O18).  
- Control without presence (OPEN) vs “I feel I run it.”

### L. Proposed doc changes — **not applied**

| Doc | Proposal |
| --- | --- |
| `world.md` | Replace “meaning OPEN” on `control` with this definition; keep acquisition OPEN. |
| `domain.md` | Reserved slot: point at `control.md`; still not a primitive. |
| `conflict.md` | Note O5 **meaning** proposed here; contest target = this relation. |
| `status.md` | O5 split: meaning candidate vs how-to-obtain still OPEN — only if this pass is accepted. |

**Recommended next:** accept/amend this definition, then either **operational Intent families** (still no verb dump) or **O18**. Still no code.
