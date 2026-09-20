import { describe, expect, test } from "vitest";
import { createSession, gateWorldFixture } from "./session.js";

function assimilateGate(issuer: string) {
  return {
    issuer,
    home: "Information" as const,
    kind: "Assimilate" as const,
    subjects: { subject: "site-gate" },
  };
}

function gateMode(issuer: string, mode: "hold" | "ease" | "release") {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: "site-gate", mode },
  };
}

function travelToA(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangePresence" as const,
    subjects: { destination: "place-a" },
  };
}

describe("Dynasty live gate condition", () => {
  test("initial gate is open, Direct is actor-bound, control is vacant", () => {
    const session = createSession(gateWorldFixture());
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "open",
    );
    expect(session.observe("actor-1").gateStateHere["site-gate"]).toBe("open");
    expect(session.observe("actor-1").capabilities).toEqual(["Direct"]);
    expect(session.observe("actor-2").capabilities).toEqual(["Direct"]);
    expect(session.observe("actor-2").gateStateHere["site-gate"]).toBeUndefined();
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBeNull();
    expect(session.inspectCanonicalForTests().presentAt["actor-1"]).toBe(
      "place-a",
    );
    expect(session.inspectCanonicalForTests().presentAt["actor-2"]).toBe(
      "place-b",
    );
  });

  test("hold requires Direct, knowledge, and presence", () => {
    const session = createSession(gateWorldFixture());
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);

    session.submit(assimilateGate("actor-2"));
    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests().presentAt["actor-2"]).toBe(
      "place-b",
    );
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "open",
    );
  });

  test("the required two-actor loop writes and rewrites the gate", () => {
    const session = createSession(gateWorldFixture());
    expect(session.submit(assimilateGate("actor-1")).status).toBe("accepted");
    expect(session.observe("actor-1").gateStateHere["site-gate"]).toBe("open");

    const hold = session.submit(gateMode("actor-1", "hold"));
    expect(hold.status).toBe("accepted");
    expect(hold.home).toBe("World");
    expect(hold.kind).toBe("ChangeAggregate");
    if (hold.status !== "accepted") {
      return;
    }
    expect(hold.occurrenceIds.length).toBe(1);
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "held",
    );
    expect(session.inspectCanonicalForTests().occurrenceKinds).toContain(
      "GateChanged",
    );

    const blocked = session.submit(travelToA("actor-2"));
    expect(blocked.status).toBe("rejected");
    expect(session.inspectCanonicalForTests().presentAt["actor-2"]).toBe(
      "place-b",
    );
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "held",
    );
    expect(session.observe("actor-2").knowledgeOf).toEqual([]);
    expect(session.observe("actor-2").gateStateHere["site-gate"]).toBeUndefined();

    expect(session.submit(gateMode("actor-1", "release")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "open",
    );

    expect(session.submit(travelToA("actor-2")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().presentAt["actor-2"]).toBe(
      "place-a",
    );

    expect(session.submit(assimilateGate("actor-2")).status).toBe("accepted");
    expect(session.submit(gateMode("actor-2", "ease")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "eased",
    );

    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "scarred",
    );

    const easeAfterScar = session.submit(gateMode("actor-1", "ease"));
    expect(easeAfterScar.status).toBe("rejected");
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "scarred",
    );

    expect(session.submit(gateMode("actor-2", "release")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "scarred",
    );

    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "held",
    );

    expect(session.submit(gateMode("actor-1", "release")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "open",
    );
    expect(session.submit(gateMode("actor-2", "ease")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "open",
    );
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBeNull();
  });

  test("open → ease → eased, and eased → hold → scarred", () => {
    const session = createSession(gateWorldFixture());
    session.submit(assimilateGate("actor-1"));
    expect(session.submit(gateMode("actor-1", "ease")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "eased",
    );
    expect(session.submit(travelToA("actor-2")).status).toBe("accepted");
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "scarred",
    );
  });

  test("held rejects ease and does not mutate on that reject", () => {
    const session = createSession(gateWorldFixture());
    session.submit(assimilateGate("actor-1"));
    session.submit(gateMode("actor-1", "hold"));
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(gateMode("actor-1", "ease")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("the gate loop manufactures no DLP, DYN, score, or reward", () => {
    const session = createSession(gateWorldFixture());
    session.submit(assimilateGate("actor-1"));
    session.submit(gateMode("actor-1", "hold"));
    session.submit(gateMode("actor-1", "release"));
    const payload = JSON.stringify({
      truth: session.inspectCanonicalForTests(),
      a: session.observe("actor-1"),
      b: session.observe("actor-2"),
    });
    expect(session.inspectCanonicalForTests()).not.toHaveProperty("dlp");
    expect(payload).not.toMatch(/"price"|"DLP"|"DYN"|"score"|"reward"|"xp"/);
  });
});
