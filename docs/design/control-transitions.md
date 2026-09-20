# Control transitions

**Status:** How the World `control` relation may change. Not combat, timers, production, markets, or settlement.  
**Kernel:** Entity · Relation · Intent · Occurrence · Domain. **No sixth primitive.**  
**Does not modify:** other corpus files.  
**Depends on:** `control.md`, `conflict.md`, `events.md`, `play.md`, `offline.md`, `world.md`.

**Question:** What does it mean for World to change who has operational authority?

All changes are **World Results**. Nobody else writes `control`.

---

## Grammar

```
Issuer → Intent (to World, or to Conflict/Events which then Intent World)
  → World eligibility (policy + queries)
  → accept or reject
  → if accept: World mutates `control`
  → Occurrence (observability ≠ omniscience)
```

**Rejected Intents do not mutate `control`.**  
**Occurrences do not mutate `control`.**  
**Events/Conflict do not write `control`; they request.**

Vacancy = **no** `control` relation on that subject (or explicit null — same fact). World must have a **coherent answer**: this issuer, these issuers (only if sharing is later designed), or **none**.

Default in this corpus: **one operational authority** per subject. Duplicate `control` for exclusive ops is **forbidden**. Sharing/delegation = **OPEN** relation mode, not a second silent writer.

**Authorized issuer:** if supported, it is a mode of the existing `control` relation (`control.md`), not a second primitive, not a second exclusive slot. Mechanism **OPEN**. Do not choose Model A/B/C here. Grant/delegation in the table below is a *shape of World Intent*, not a designed mandate product.

---

## 1. Establishing Control

None of these **are** control. Some may **cause a World Intent** that, if accepted, writes `control`.

| Candidate | Valid cause? | Why |
| --- | --- | --- |
| **Discovery** | **No** | P21. `knowledge-of` must not write `control`. |
| **Mere presence / “occupation”** | **No** | Presence ≠ control. Standing there is not operational authority. |
| **Uncontested establish Intent** | **Yes** | Issuer Intents World to take `control` of a **vacant** (or allowed) subject; World may **query** presence/access — **policy OPEN**. The **Intent** is the cause, not occupancy. |
| **Construction** | **Conditional** | Create-Site Intent **may** also set `control` to constructor **if World policy says so**. Not automatic (could build for another issuer). |
| **Successful opposition** | **Yes** | Conflict Intents World; World **replaces** `control`. Contest object **not** required if instant. |
| **Voluntary grant / relinquish-to** | **Yes** | Current controller (or allowed issuer) Intents World to set `control` to another or to vacancy. |
| **Delegation** | **Provisional** | Same shape as grant; mandate/share **OPEN** (`control.md`). |
| **Contract** | **Provisional** | Contracts (undesigned) may **Intent World**; World does not scrape a contract store. |
| **Event** | **Yes, indirect** | Event Intents World; World may write `control` (vacancy, collapse, assignment). Event **cannot** write the relation. |
| **Abandonment** | **Lose**, then others **establish** on vacancy | Abandonment is not a gain. |
| **Title change** | **No** | Title ≠ control. Capital must not write World `control`. |
| **Logout / online** | **No** | `offline.md`. |

First controller of a **new** Site is always a **World Result** of an accepted Intent (construct, event, worldgen-as-system-issuer — worldgen **OPEN**), never discovery.

---

## 2. Losing Control

| Candidate | Clears `control`? | Why |
| --- | --- | --- |
| **Successful contest** | **Yes** | World Result (often via Conflict request). |
| **Voluntary relinquish** | **Yes** | World Intent from allowed issuer. |
| **Subject gone** | **Yes** | Site destroyed/removed: relation cannot point at nothing. |
| **Subject transformed** | **OPEN** | Same entity: relation **may** persist. New entity: treat as gone + possible new establish. |
| **Inoperable infra** | **Not automatically** | Broken aggregate ≠ vacancy. Ops may **fail** while `control` remains. Clearing the relation is a **separate** World Result if policy wants it. |
| **Event** | **Yes, if** World accepts Event’s Intent | Not the Event store writing. |
| **Contract/delegation ends** | **If** that end issues a World Intent | Provisional. |
| **Offline / absence** | **No** | Others/Events still **may** take it via Intents. |
| **Rejected oppose** | **No** | No write. |
| **Stale Intel / belief** | **No** | Information does not write World. |

---

## 3. vs Conflict

Not every transition is Conflict. Vacant establish, grant, event vacancy, subject-gone **need no** `opposed-over`.

**Contested** transitions: Conflict **owns opposition**; **World writes**. Instant oppose **need not** create a Contest entity (`conflict.md`).

---

## 4. vs Intent

The **general** grammar is § Grammar. There is no side door.

System/Event/Conflict issuers are still **Intents to World**.

---

## 5. vs Title

All **allowed** as facts in different homes:

- Title holder **fails** to get `control`.  
- Non-title holder **has** `control`.  
- `control` changes, title **unchanged**.  
- `control` cleared, title **persists**.

Title Intents **must not** be World `control` writes.

---

## 6. vs Presence / offline

| | |
| --- | --- |
| Establish while present | World **may** require `present-at` on that Intent — **OPEN**. Presence still does not write. |
| Maintain while absent | **Yes** (`offline.md` C+D). |
| Lose while absent | **Yes** — others/Events/in-flight, not logout. |
| Present, cannot control | **Yes** (visitor). |
| Present, can contest | **Yes** — their **Intents**, not occupancy. |

Disconnect ≠ Leave ≠ drop `control` ≠ immunity.

---

## 7. vs Events

Events **create conditions** (access, Site exists, vacancy) and **may Intent World**. They **never** assign `control` internally.

---

## 8. Offline-legitimate changes

While the controller issues **no new** Intents, `control` may still change because:

- another issuer’s World/Conflict Intents succeed;  
- an Event’s World Intent succeeds;  
- in-flight Intents (theirs or others) resolve;  
- the **subject is removed**.

Not because a session ended.

---

## 9. Invariants

1. World can answer **who** (or **none**) has operational authority on a subject.  
2. **No silent duplicate** exclusive `control`.  
3. **Reject ≠ write.**  
4. **Only World** mutates `control`.  
5. Material changes **Occurrence**; knowing it is Information.  
6. `control` **≠** title, presence, access, invulnerability, discovery.  
7. Logout **≠** transition.

---

## 10. Minimal model

`control` Relation in World; change = accepted **Intent to World**; notice = **Occurrence**. Done.

---

## Close

### A. Established

Transitions are World writes from accepted Intents. Discovery/presence/title/logout are **not** causes.

### B. Gain (conceptual)

Vacant (or allowed) **establish** Intent; **construct** if policy attaches `control`; **grant**; **opposition** World honors; **Event-requested** World write. Delegation/contract = same, **provisional**.

### C. Lose (conceptual)

Opposed replace; relinquish; subject gone; Event-requested clear/replace. Inoperable **≠** auto-lose. Transform **OPEN**.

### D. Conflict

Only for **incompatible** claims. Writes still World. Contest optional.

### E. Intent

Sole causal shape into World.

### F. Events

Indirect only.

### G. Presence / offline

Independent; absence does not write; others still can.

### H. Invariants

§9.

### I. Unresolved

Whether establish **requires** presence/access; construct **always** sets constructor; inoperable vs vacancy; transform; share/delegate; worldgen’s first `control`; operational kinds list.

### J. Tensions

- Vacant grab vs P12 remainder (first arriver vs Event).  
- Construct-implies-control vs title-holder.  
- Broken Site still “controlled.”  
- Absent lose vs “I didn’t click.”  

### K. Proposed cross-refs — **not applied**

| Doc | Note |
| --- | --- |
| `control.md` | Point O5 remainder here: **how** = World Intents only; discovery/presence out. |
| `conflict.md` | Contested transitions only. |
| `world.md` | Only World writes `control`. |

No other files should be edited until this is accepted.
