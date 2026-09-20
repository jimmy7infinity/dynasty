# Offline (O18)

**Status:** Conceptual policy for absence. Not a protection product, timer, or session-energy system.  
**Kernel:** Entity · Relation · Intent · Occurrence · Domain. **No sixth primitive. No Offline domain.**  
**Depends on:** `time.md`, `control.md`, `world.md`, `play.md`, `events.md`, `conflict.md`, `information.md`.  
**Does not close:** exact linger/displace rules, operate-from-afar, production-while-away, grief targeting, catch-up UX.

O18: what absence means for Presence, Control, in-flight Intents, Events, Conflict, and exposure.

**Reject:** timers, login rewards, offline bonuses, energy, shields, maintenance meters, inactivity decay as the *definition* of absence.

---

## 1. What “offline” is

These are **distinct**:

| Phrase | Meaning |
| --- | --- |
| **Offline / absent** | The issuer is **not issuing new Intents** (no active play session). |
| **Not existing** | False. Entity and persistent records remain (P24). |
| **Not `present-at`** | A World relation. **Not** implied by offline. |
| **Not `control`** | A World relation. **Not** implied by offline. |
| **Not acting** | No **new** Intents. **Previously accepted** Intents may still be in-flight. |

Offline is **lack of agency for new decisions**, not a World flag that rewrites geography.

**What remains true until some home actually changes it:** `present-at`, `control`, custody, `opposed-over`, in-flight Actions, Event processes in the world, Intel/`knowledge-of` (which may **stale**), exposure **from situation**.

**What stopping play removes:** Observe/Choose/Act **now**; live Respond to new Occurrences. Not the relations themselves.

Closing the client is **not** an Intent unless the player issued one (e.g. leave).

---

## 2. Presence after disconnect

| Model | Consequence |
| --- | --- |
| **A. Presence ends immediately** | Logout = **leave**. Closing the game **is** a move: vanish from a fight **or** abandon a Place. Contradicts “close ≠ surrender everything” *if* we treat presence as the stake. Also a **free teleport/vanish**. |
| **B. Presence persists (naive)** | Ghost body occupies space forever. Easy 24/7 camping if presence were exclusive (it is **not** — many may be `present-at`). Still a **sitting target** if linger = raid-me. |
| **C. Session ≠ presence** | Ontology already in `time.md`. `present-at` is World state. Connection is not. |

**C is the ontology.** A and B are *policies* on whether disconnect **writes** `present-at`.

**Choice (conceptual, not a timer):** Disconnect **does not itself** clear `present-at`. Leaving is an **Intent** to World. Otherwise close-game is a hidden Leave.

Lingering `present-at` **without new Intents** is **not** a ghost defender. It is a **body that cannot issue new Intents** — **exposure**, not a 24/7 claim on `control` (control is a different slot; presence is not exclusive).

**Ghost presence** as *active play* is rejected. **Persisting the relation** until a World Result says otherwise is accepted so logout ≠ leave.

---

## 3. Control while offline (center)

| Model | Verdict |
| --- | --- |
| **A. Control requires active presence** | Logout (or linger-fail) **drops keys**. Close-game surrenders the mill. **Reject** as default. |
| **B. Control requires connection** | Control = attention meter. **Reject.** |
| **C. Persists until another World Result changes it** | Logout does not write `control`. Others/Events/Conflict **may**. **Not immune, not self-surrender.** |
| **D. Persists; some capabilities unavailable** | Cannot issue **new** operational Intents without agency. Relation still names who World **would** accept. Avoids idle-claim auto-play. |
| **E. Maintained by something else** | Org as **issuer** of `control` (O36) — individual absence ≠ org absence. Infra is Site state, not a babysitter AI. **No guild design.** |
| **F. Different scopes** | OPEN (exclusive vs share). Not required to pick O18. |

**Middle: C + D.**

- **Closing the game does not surrender `control`.**  
- **Being offline is not immunity:** `control` changes only via **World** (others’ Intents, Events, Conflict requests World honors).  
- **Control is not attention:** the relation stays; **new operational decisions do not play themselves** (no deposit-wait-claim, no unattended mastery).  
- What **causes** change: successful opposing/operational Intents, Event-issued Intents — **not** a decay clock.

If control **dropped** when you stopped clicking, it would be an **activity meter**, contradicting `control.md`.

---

## 4. Agency vs persistence

| Still there | Gone until they play |
| --- | --- |
| Entity; `control`; `present-at` (until World changes); custody; contracts-as-records; `opposed-over`; in-flight Actions; world Events | **New** Intents; live Observe/Choose/Respond |

Stopping play removes **authorship of new attempts**. It does not delete the save file.

---

## 5. In-flight Intents

Already accepted → **continue in the home**. May **resolve**, **fail**, **partial**, **interrupt** (Conflict → home). Conditions may change. Actor **need not** be online for that Result.

They **Respond after** — next session’s Observe. Not a formula.

Do not freeze all in-flight on logout (world would be fake). Do not require presence at resolve **globally** (`time.md`: per-kind OPEN).

---

## 6. Events

Events **continue**, **issue Intents**, change World **indirectly**. Player may **not know**. Occurrences **accumulate**. Intel **stales**. No scheduler/notification design. Catch-up is an Information **problem**, not a toast stack.

---

## 7. Conflict

Others **may** `opposed-over` / Contest while you are absent. Your **existing** Site, `access`, infra, `control` **still count** as World state (not a dummy). Conflict **need not** be simultaneous-online.

You **cannot** issue new counter-Intents until you play. That **is** delayed Respond = **situational exposure**. Returning: Observe a **changed** world, then Act. Not a combat spec.

Defenses that “matter” = **state already on the map**, not a logged-in bonus.

---

## 8. Exposure

**Exposure** (`domain.md` / `play.md`): in a **context**, certain Intents/Occurrences **may** affect a record. It is **not** `offline = vulnerable`.

Created by **situation**, for example: `present-at` linger; contested `control`; in-flight / in-transit; routes; infra; Intel others `knowledge-of`; `opposed-over`; Event conditions; unowned remainder you hoped to take.

**Offline is not an exposure type.** It only **removes live Respond**, so the **same** situation is harder to answer. Punishment-for-inactivity is rejected.

---

## 9. Rust without 24/7

**Keep:** you built seasonal things; the world **moves**; loss of **those things** can matter.

**Refuse:** play 24/7 or lose **identity, deposits, all capability**. Refuse must-login-daily. Refuse absence = total seasonal wipe **by itself**.

Loss is **because the situation was exposed and someone/Event changed World** — not because a login window expired.

---

## 10. New players

**Risk:** new/poor/casual `present-at` + weak `control` + no Respond = farmed. Veterans/wealthy/active: more Sites, more Intel, more ability to **be the someone** who changes World.

**Structure, not a solution:** remainder still unowned (P12); deposits not loot (P15); P13 after loss; farming **people** as resource nodes is grief (O18 remainder). Protection mechanics **not designed**.

Casual ≠ forfeited. Casual ≠ immune.

---

## 11. Are offline operational Intents still “authoritative”?

- **Standing `control`:** still the issuer World **would** accept for **new** operational Intents.  
- **Those new Intents are not issued** without agency.  
- **Already accepted** operational Intents: still Actions in flight.  
- Change of `control`:** other Results, not timeout.

If we required connection to keep `control`, it would be **attention**, not operational authority.

---

## 12. Organizations (no taxonomy)

Conceptually: **individual** offline; **`control` issuer** may be another entity (org) that still “exists”; Site still has `control`; infra still **is**. No DAO/guild spec. If no such issuer, C+D still holds for the player entity.

---

## 13. Information after absence

World moved; others discovered; `control` may have changed; Intel **stale**; opportunities missed (remainder went to someone else — not a prize for *them waiting*, a Result of **their play** + your lack of Respond). Hidden developments remain hidden until Observe.

**Catch-up overload** is a real tension: many Occurrences, incomplete `knowledge-of`. Not a notification UX. Returning must not dump canonical World truth (fog).

---

## 14. Economy / protocol

| | |
| --- | --- |
| Seasonal **game** loss while away | Possible (Site/`control`/lots) |
| Opportunity for **others** | Their Intents, not your AFK generating their yield |
| Value **for you** because you waited | **Forbidden** as the loop |
| Deposit → wait → claim | **Still rejected** |
| Active play | Still where **decisions** (and thus mastery) live |

Real capital **does not** accrue by absence. Settlement-grade **not** PvP loot because you were offline.

---

## 15. Seasons

Same O18 **inside** a season: Events/conflict/world continue. Offline **at wipe** → mapping **O20**, not this file. New season: old `present-at`/`control` die with the instance; player persists. Offline **through** wipe is not extra punishment beyond whatever O20 is.

---

## 16. Minimum model

Expressible with: `present-at`, `control`, Intent/Action, Event, Conflict, Occurrence, Information, session-as-**not-a-World-relation**.

**No Offline primitive. No Offline domain.**

---

## 17. Hostile review

| Failure | Guard |
| --- | --- |
| Instant death | Logout ≠ wipe |
| Perfect immunity | World continues; others/Events/Conflict |
| Must log in every day | No decay/login window as O18 |
| Attention tax / 24/7 | Control not connection; duration not the loop |
| Fake persistence | In-flight and Events actually resolve |
| Ghost presence as play | Linger ≠ defender AI |
| Control = activity/timer | C+D; no maintenance meter |
| Inactivity decay | Rejected as definition |
| Wait rewards | §14 |
| Unread-state crush | Tension flagged; no god-log |
| Newbie farm | Risk flagged; P12/P13/P15 |
| Whale power by remaining online | Online helps **Respond**; does not own the future; remainder |

---

## Close

### A. Established

Offline = no **new** Intents. Logout is not Leave, not Drop Control, not Die. World keeps going. Exposure is **situational**.

### B. Definition

Absence of active play / new agency. Not non-existence.

### C. Presence

Ontology **C**: session ≠ `present-at`. Policy: **do not auto-clear on disconnect** (that would be hidden Leave). Linger without agency is **exposure**, not ghost play.

### D. Control offline

**C+D:** persists until **World** changes it; **new** operational Intents need agency. Not A/B.

### E. In-flight

Continues; may resolve/fail/interrupt; Respond later.

### F. Events

Continue; knowledge optional; stale Intel.

### G. Conflict

May start/progress without you; your **state** still real; delayed Respond.

### H. Exposure

Property of **situation**, amplified by inability to issue new Intents — not an offline tag.

### I. Information

Catch-up without omniscience; missed remainder; overload tension.

### J. Economy

Seasonal loss possible; no AFK yield; no wait-claim.

### K. Seasons

O18 during; O20 at boundary.

### L. Unresolved

Displace/kill `present-at` without a Leave Intent; production-while-away; operate-from-afar; org issuer; grief targeting of known-offline; how much in-flight **must** require control still true at resolve; catch-up without breaking fog.

### M. Tensions

- Linger presence = sitting duck **and** no vanish-logout.  
- Delayed Respond vs “I had a job.”  
- Unattended in-flight vs P9 (watching a bar when they return).  
- Veteran Respond advantage vs casual.  
- Info overload on return vs P22.

### N. Proposed changes — **not applied**

| Doc | Proposal |
| --- | --- |
| `time.md` | Cite this file as O18 policy: persist `present-at`/`control` until World Result; C+D control. |
| `control.md` | Offline: relation persists; new Intents need agency. |
| `world.md` | Logout ≠ Leave. |
| `status.md` | O18: **policy candidate**; remaining = displace, production-away, grief. |

**Recommended next:** Production-while-away (idle-claim test) **or** operational Intent families. Still no timers, no code.
