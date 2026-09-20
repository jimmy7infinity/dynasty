# Time, presence, and offline

**Status:** Conceptual. Not a clock, scheduler, or duration table.  
**Kernel:** Entity · Relation · Intent · Occurrence · Domain. **No sixth primitive. No Time domain.**  
**Depends on:** `domain.md`, `world.md`, `information.md`, `play.md`, `events.md`, `conflict.md`, `control.md`.  
**Does not close:** O2 (clock kind), O18 (offline rules), season length, numerical durations, maintenance timers.

Central question:

> How can the world keep changing when a player is away — without login-wait-claim, without offline = safe, and without offline = forfeiture?

---

## 1. What Time is

Time is **not** a kernel primitive. It is **not** a World property blob. It is **not** a relation.

Try the kernel first:

| Temporal fact | Kernel expression |
| --- | --- |
| A happened before B | Order of **Occurrences** (and in-flight accept vs resolve) |
| Something is not finished | **In-flight Action** (accepted Intent) in a **home domain** |
| A process is ongoing | **Event** or **Contest** entity still issuing Intents |
| Intel is from “then” | Information **`as-of`** tied to an Occurrence / world instance |
| The season is this world | World-instance **identity scope** (`world.md`) |

**External / real elapsed time** may exist as a **fact homes can query** (OPEN whether they should). That does not make Time a Domain.

**If Time were a sixth primitive:** we would duplicate Occurrence order and in-flight state. **Unnecessary.**

**If Time were a Domain:** it would become a scheduler god-engine (hostile: Events duplication). **Refuse.** Duration lives **in the home** that accepted the Intent (`play.md`).

**Verdict:** temporal behavior is **ordering + in-flight + optional elapsed-time queries**. No Time domain.

---

## 2. Kinds of “time” (do not collapse)

| Kind | Role | Lock? |
| --- | --- | --- |
| **Occurrence order** | Shared “what already happened” | Required conceptually |
| **Real elapsed time** | World can change while you sleep; other issuers act | Likely needed for live multiplayer; **not** a claim-timer |
| **Simulation clock** | Separate tick from wall-clock | **Not required** unless we must pause/desync from reality (OPEN) |
| **Action/Event duration** | In-flight until Result | Home aggregate; must pass §3 |
| **Season span** | World-instance lifetime | Exists as scope; **length OPEN** |

Dynasty needs a **shared world timeline** (everyone’s Occurrences compose one history). A **player-private** clock that pauses the world is incompatible with other players, Events, and a live economy.

A **separate sim clock** is optional. Default stance: **do not invent one** until wall-clock + Occurrence order fail a specific test.

Season clock must **not** become the gameplay loop (wait for wipe as content).

---

## 3. Duration (pressure-test P9)

**Keep:** duration only if it **creates a decision** — exposure, commitment, opportunity cost, intercept, logistics, coordination, changing conditions — not because a bar fills.

**Meaningful (candidates, not rules):**

| Case | Why duration can be a decision |
| --- | --- |
| Transport | Exposed in transit; intercept; route choice |
| Scout | Time in place vs unknown; not a fog ping cooldown |
| Construct | Commitment of site/resources; window for opposition |
| Research | OPEN — easy to become wait-claim; only if it creates choices |
| Event unfolding | World changes; respond or ignore |
| Conflict developing | Window to Respond (`play.md`) |
| Intercept | Being there *when* |
| Production | **Dangerous.** If it only accrues while gone, it is idle-claim. If it changes World state **without a claim button** but **requires later operational Intents** (control), it may be World evolution, not a wait game — **OPEN, hostile** |
| Market/settlement | Must not be “deposit → wait → claim” (§15) |

**Reject as design:** login timers; arbitrary waiting; claim timers; energy; cooldown spam; come-back-tomorrow as the loop.

If the player’s **only** interaction with duration is “check if it finished,” it **fails P9**.

---

## 4. Presence

**Definition (same slot as `world.md`, tightened):**

> **Presence** is the World relation **`present-at`**: this **entity** is **co-located** at this **Place**.

It is **not** a Domain, not attention, not an activity meter, not control.

| Question | Conceptual answer |
| --- | --- |
| Named concept? | **The relation**, not a new type. This doc does not add Presence-as-primitive. |
| Require active attention? | **No.** Attention is **session/online** (Identity/client), **not** `present-at`. |
| Remain present while offline? | **Allowed as a relation state.** Whether it **lingers, snaps, or converts** is **O18**. Do not assume either “ghost forever” or “logout teleports you out.” |
| Org presence? | An **org entity** may be `present-at` **if** Identity says that entity can be an issuer/situated — **O36**. Not required. Individuals’ `present-at` stay theirs. |
| Infrastructure as presence? | **No.** Infra is Site/`situated-at`. “Effective presence” must not alias `control` or `influence`. |
| Temporary? | Classification on the relation (ephemeral vs longer). |
| Hidden? | Observability on the relation; others may not `knowledge-of` it. |

**Online ≠ present.** You can be connected and `present-at` nowhere interesting. You can be disconnected with `present-at` still true **if** World still holds that relation (O18).

---

## 5. Presence vs Control

`control.md`: operational authority. Presence is co-location.

| Case | Allowed? |
| --- | --- |
| Present, not in control | **Yes** (visitor, raider, worker). |
| Control without physical presence | **OPEN** (`control.md` operate-from-afar). Must **not** be named presence. |
| Absent, `control` persists | **Yes conceptually** — control is a standing relation, not a beam. Whether it **lapses** from absence is **O18**, not a hidden timer in this doc. |
| Many present, one `control` | **Yes.** |
| Presence enables later control | Eligibility **may** query `present-at` — **not** automatic `control`. |
| Presence disrupts control | Via **Intents** (Conflict/World), not by standing there magically. |

---

## 6–7. Offline (first-class)

**Online/session** is not World geography. The player’s **entity remains valid** disconnected (P24). They need not stay connected to “exist.”

**Reject A:** offline = invulnerable.  
**Reject B:** offline = lose everything.  
**Reject:** always-online as a condition of keeping Sites/`control`.

### What may continue without the player’s session

The **world** is not paused: other issuers; Events issuing Intents; Occurrences; Information becoming stale; new unowned potential; in-flight Intents **resolving or failing** in their homes; `control` **can** change via those Results.

### What must not continue as the game loop

**Unattended claim.** Operational **decisions** (the Intents that *are* control-as-agency) must not fire themselves as a farm. The player should not be a daemon.

### Spectrum (principles, not mechanics)

| While away | Principle |
| --- | --- |
| World / Events / others | **Continue.** Rust uncertainty: the map can change. |
| In-flight, already accepted | **May resolve** (success, fail, partial, interrupt). Commitment already made. |
| Standing `control` | **May persist or change** — not auto-forfeit solely because the session ended; **not** immortal. **How** is O18. |
| Total stack wipe for absence | **Forbidden** as the meaning of offline (identity persists; P13). |
| New opportunities | **May appear** (P12). Veterans cannot pause the frontier by idling on it. |

**Emotional target:** “I left something that *matters* in a live world.” **Not:** “I missed a login window so I am deleted.”

Protection products (NPC guards, etc.) are **not designed** here.

---

## 8. In-flight Intents

Accepted Intent **may span** real elapsed time as home **ephemeral** state. Not a Play timer service.

| | |
| --- | --- |
| Conditions change | Home may fail / partial / continue (`play.md`) |
| Interrupt | Conflict → **home** Intent (`conflict.md`) |
| Fail | Yes |
| Must remain present? | **Query/policy OPEN**, per kind — not global |
| Must remain in control? | Operational kinds **may** require `control` still true at resolve — OPEN |
| Other actors / Events | Yes, via Intents to the home |
| Actor offline | In-flight **does not freeze** solely because session ended (or the world is not live). Exact freeze = wait-wall risk |

Intent ≠ Event ≠ Occurrence.

---

## 9. Events and time

Events **begin/end**, issue **multiple Intents over the world’s timeline**, **continue while players are offline**, may **open remainder**, may become **invalid** if World refuses Intents.

No scheduler architecture. “Over time” = successive Intents + Occurrences, not a Time domain tick list.

In-flight Event duration must still pass §3 (P9).

---

## 10. Conflict and time

Opposition **need not** be instant: `opposed-over` can exist; Contest **may** persist as a process.

Opposition **before** shots: yes (`conflict.md` — incompatible claims / declared oppose).

`control` can change **during** Contest (World Results).

**Respond after opposing Intent begun:** in-flight + other issuers’ Intents — **if the victim is offline, response is delayed** → **exposure**. That is the Rust edge. It must **not** equal “undefended = total loss of all capital” (P15, P13).

Absence **changes exposure** (context). It does not by itself define combat.

---

## 11. Control and time

Standing relation: **persists until World changes it**. Not a hold-to-maintain minigame **by default**.

**Actively maintained?** Optional later policy (O18). **No maintenance timer in this document.**

**Evaluated continuously?** Prefer **when relevant Intents/Events occur** (event-driven), not a hidden per-second control tick (scheduler duplication + always-online pressure).

**Lapse from absence:** OPEN (O18). Must not be an energy bar.

**Without presence:** OPEN (`control.md`).

---

## 12. Information and time

Already: stale ≠ false; `as-of`; dangling Site refs.

Temporal play: World moved; Intel old; `control` changed unseen; discover the Result **after**; know a kind of thing that **no longer exists**.

No confidence scores. No auto-update of brains (`information.md`).

---

## 13. New players / veterans and time

**Risk:** always-present veterans occupy every Site, intercept every in-flight, starve remainder.

**Structure:** control is of **existing** subjects; **unowned potential** can still appear (Events/worldgen O6). Continuous presence is **power**, not ownership of the future (P12).

If remainder does not actually spawn, real-time **is** a monopoly engine. That is worldgen/Event failure, not a reason to pause the world.

---

## 14. Seasons

During a season: **shared timeline continues** with offline players.  
At end: world-instance **ends**; player persists.  

Season length / wipe / conversion **OPEN**. Offline principles **still apply** inside the season. The wipe is not the substitute for an offline rule.

---

## 15. Economic / protocol

World processes **may** run over elapsed time. Capital **reacts to Occurrences**, not to “hours staked.”

**Reject:** deposit → wait → claim as the **definition** of play or of REAL VALUE OUT.

Real capital must not be a **timer reward**. Settlement-grade must not accrue by absence (P17/P15).

---

## 16. Real-time vs turns vs hybrid

| Model | Strategic / Civ | Rust urgency | Offline | No-wait | Live economy | Scale |
| --- | --- | --- | --- | --- | --- | --- |
| Pure always-on twitch RT | Weak planning | High | Hostile | Easy wait-walls as queues | Yes | Hard |
| Pure turns (world pauses per player) | Strong | Weak | Easy | OK | **No shared live world** | Easier |
| **Shared world continues (elapsed) + event-driven Intent resolution** | Planning on in-flight/Events | Others/Events still move | Sane if O18 holds | Duration only if §3 | Occurrences while away | Homes resolve when needed, not per-frame god-tick |

**Assessment (not an implementation vote):** Dynasty’s *experience* wants a **live shared world** (urgency, others, Events, economy) and **event-driven** resolution of Intents (not mobile cooldowns, not a global turn lock). That is a **hybrid of timeline**, not “we picked Unity vs lockstep.”

**Not chosen:** tick rate, pause, whether sim ≠ wall clock.

---

## 17. Offline as conceptual truth

True whether or not the client is connected:

- Issuer entity **exists**.  
- World **is not paused for them**.  
- `present-at` / `control` are **World relations**, not session flags (session may *affect* them later — O18).  
- Observe/Choose/Act require **agency** when they play; the world does not require a socket to be **valid**.

---

## 18. Minimization

| Drop | Impossible? |
| --- | --- |
| Time primitive / Time domain | **No.** Order + in-flight + Event processes. |
| Named Presence type | **No.** `present-at` suffices. |
| Named Offline domain | **No.** Session vs World split + O18 policy. |
| In-flight | **Yes** — duration/intercept/offline resolve vanish. **Keep** as Play/home state. |

---

## 19. Hostile review

| Failure | Guard |
| --- | --- |
| Waiting as the game | §3, P9, reject claim timers |
| Offline = death | Reject B; P13; P15 |
| Offline = god mode | Reject A; world continues |
| Always-online | Entity valid offline; no socket-as-existence |
| Timer optimization | Duration must be a decision |
| Veteran time monopoly | P12 remainder; O6 |
| Capital wait-farm | §15 |
| Scheduler = Events | No Time domain |
| Presence = control | §5 |
| Presence = energy meter | §4 |
| Sixth primitive | Refused |
| Season as the mechanic | §2, §14 |
| Energy/cooldowns | Rejected |

---

## Close

### A. Established

Shared world **timeline** (Occurrence order + live others/Events). Duration only as **in-flight / process** that creates decisions. Presence = **`present-at`**. Offline ≠ pause, ≠ wipe, ≠ immunity. No Time domain.

### B. Time as named domain/primitive?

**No.**

### C. Presence

World relation: entity co-located at a Place. Not attention, not control, not infra.

### D. Presence vs Control

Independent slots. Far-control OPEN. Absence does not automatically delete `control` here; lapse is O18.

### E. Offline principles

World continues; committed in-flight may resolve; no unattended claim-loop; no session-as-existence; exposure without forfeiture-as-definition.

### F. In-flight

May span elapsed time; interruptible; not frozen only because logged out (default); presence/control-at-resolve OPEN per kind.

### G. Events

Continue offline; successive Intents; P9 still applies.

### H. Conflict

May persist; delayed Respond if absent = exposure, not ETH loot.

### I. Information

Stale/as-of; discover after the fact.

### J. Economy

No wait-claim as value engine; Capital follows Occurrences.

### K. RT / turns / hybrid

Live shared elapsed world + event-driven Intent resolution **fits the fantasy best**. Not a tech choice. Pure pause-turns and twitch-always-on **fail** parts of the brief.

### L. Unresolved

O2 (wall vs sim clock), O18 (linger presence, control lapse, protection), production-while-away, operate-from-afar, freeze-in-flight-if-offline (wait-wall vs helplessness).

### M. Tensions

- Rust “world moved” vs “I had a job.”  
- Production over time vs idle-claim.  
- Control without presence vs “I feel I run it.”  
- Veteran 24/7 vs remainder (O6).  
- In-flight continuing offline vs P9 (if they can only watch it finish).

### N. Proposed doc changes — **not applied**

| Doc | Proposal |
| --- | --- |
| `play.md` | Point O2 at this file: no Time domain; duration = in-flight in home. |
| `world.md` | Presence: online ≠ `present-at`; linger = O18. |
| `control.md` | Evaluation when Intents happen, not a control tick; lapse = O18. |
| `status.md` | O2 narrowed: clock *kind* still OPEN; Time-as-primitive **refused**. |

**Recommended next:** **O18 policy sketch** (still no timers) **or** operational Intent families for `control`. Still no code.
