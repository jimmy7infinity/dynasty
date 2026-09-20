import { describe, expect, test } from "vitest";
import {
  createSession,
  gateMillFixture,
  gateWorldFixture,
  lotHaulFixture,
  occupiedGateFixture,
  playableWorldFixture,
} from "./session.js";

function assimilateGate(issuer: string) {
  return {
    issuer,
    home: "Information" as const,
    kind: "Assimilate" as const,
    subjects: { subject: "site-gate" },
  };
}

function assimilateMill(issuer: string) {
  return {
    issuer,
    home: "Information" as const,
    kind: "Assimilate" as const,
    subjects: { subject: "site-mill" },
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

function millMode(issuer: string, mode: "extract" | "transform" | "seat") {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: "site-mill", mode },
  };
}

function travel(issuer: string, destination: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangePresence" as const,
    subjects: { destination },
  };
}

function establishGate(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeControl" as const,
    subjects: { site: "site-gate", mode: "establish" },
  };
}

function relinquishGate(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeControl" as const,
    subjects: { site: "site-gate", mode: "relinquish" },
  };
}

describe("Dynasty Control establish and relinquish", () => {
  test("vacant Establish writes Control to the issuer", () => {
    const session = createSession(gateWorldFixture());
    expect(session.submit(assimilateGate("actor-1")).status).toBe("accepted");
    const before = structuredClone(session.inspectCanonicalForTests());
    const result = session.submit(establishGate("actor-1"));
    expect(result.status).toBe("accepted");
    if (result.status !== "accepted") {
      return;
    }
    expect(result.home).toBe("World");
    expect(result.kind).toBe("ChangeControl");
    expect(result.occurrenceIds.length).toBe(1);
    const truth = session.inspectCanonicalForTests();
    expect(truth.control["site-gate"]).toBe("actor-1");
    expect(truth.occurrenceKinds).toContain("ControlChanged");
    expect(truth.gateState["site-gate"]).toBe(before.gateState["site-gate"]);
    expect(truth.presentAt).toEqual(before.presentAt);
    expect(session.observe("actor-1").knowledgeOf).toEqual(["site-gate"]);
  });

  test("travel, Assimilate, Direct, and gate stance do not write Control", () => {
    const session = createSession(gateWorldFixture());
    expect(session.submit(travel("actor-2", "place-a")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBeNull();
    expect(session.submit(assimilateGate("actor-1")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBeNull();
    expect(session.submit(gateMode("actor-1", "ease")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBeNull();
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBeNull();
    expect(session.submit(gateMode("actor-1", "release")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBeNull();
    expect(session.observe("actor-1").capabilities).toEqual(["Direct"]);
  });

  test("occupied Relinquish clears Control and leaves gate stance", () => {
    const session = createSession(occupiedGateFixture());
    expect(session.submit(assimilateGate("actor-1")).status).toBe("accepted");
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    const result = session.submit(relinquishGate("actor-1"));
    expect(result.status).toBe("accepted");
    const truth = session.inspectCanonicalForTests();
    expect(truth.control["site-gate"]).toBeNull();
    expect(truth.gateState["site-gate"]).toBe("held");
    expect(truth.occurrenceKinds).toContain("ControlChanged");
  });

  test("non-controller Relinquish is rejected with no mutation", () => {
    const session = createSession(occupiedGateFixture());
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(relinquishGate("actor-2")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(before.occurrenceKinds).not.toContain("ControlChanged");
  });

  test("vacant Relinquish is rejected with no mutation", () => {
    const session = createSession(gateWorldFixture());
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(relinquishGate("actor-1")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("Relinquish then Establish is two Intents, not transfer", () => {
    const session = createSession(gateWorldFixture());
    expect(session.submit(assimilateGate("actor-1")).status).toBe("accepted");
    expect(session.submit(establishGate("actor-1")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBe(
      "actor-1",
    );
    expect(session.submit(relinquishGate("actor-1")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBeNull();
    expect(session.submit(travel("actor-2", "place-a")).status).toBe("accepted");
    expect(session.submit(assimilateGate("actor-2")).status).toBe("accepted");
    const result = session.submit(establishGate("actor-2"));
    expect(result.status).toBe("accepted");
    expect(result.kind).toBe("ChangeControl");
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBe(
      "actor-2",
    );
  });

  test("occupied fixture still forbids non-controller gate ops after Establish exists", () => {
    const session = createSession(occupiedGateFixture());
    expect(session.submit(assimilateGate("actor-1")).status).toBe("accepted");
    expect(session.submit(assimilateGate("actor-2")).status).toBe("accepted");
    expect(session.submit(gateMode("actor-2", "ease")).status).toBe("rejected");
    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("rejected");
    expect(session.submit(gateMode("actor-2", "release")).status).toBe(
      "rejected",
    );
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBe(
      "actor-1",
    );
  });

  test("occupied Establish is rejected and does not displace the controller", () => {
    const session = createSession(occupiedGateFixture());
    expect(session.submit(assimilateGate("actor-2")).status).toBe("accepted");
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(establishGate("actor-2")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBe(
      "actor-1",
    );
  });

  test("Direct is not required to Establish or Relinquish, and its absence does not clear Control", () => {
    const vacant = gateWorldFixture();
    vacant.capabilities["actor-1"] = [];
    const session = createSession(vacant);
    expect(session.submit(assimilateGate("actor-1")).status).toBe("accepted");
    expect(session.submit(establishGate("actor-1")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBe(
      "actor-1",
    );
    expect(session.observe("actor-1").capabilities).toEqual([]);
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBe(
      "actor-1",
    );
    expect(session.submit(relinquishGate("actor-1")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBeNull();
  });

  test("Extract, Transform, Seat, and Haul do not write Control", () => {
    const extracted = createSession(gateMillFixture());
    expect(extracted.submit(assimilateGate("actor-1")).status).toBe("accepted");
    expect(extracted.submit(assimilateMill("actor-1")).status).toBe("accepted");
    expect(extracted.submit(gateMode("actor-1", "ease")).status).toBe(
      "accepted",
    );
    expect(extracted.submit(millMode("actor-1", "extract")).status).toBe(
      "accepted",
    );
    expect(extracted.inspectCanonicalForTests().control["site-gate"]).toBeNull();
    expect(extracted.inspectCanonicalForTests().control["site-mill"]).toBeNull();

    const transformed = createSession(gateMillFixture());
    expect(transformed.submit(travel("actor-2", "place-a")).status).toBe(
      "accepted",
    );
    expect(transformed.submit(assimilateMill("actor-2")).status).toBe(
      "accepted",
    );
    expect(transformed.submit(assimilateGate("actor-1")).status).toBe(
      "accepted",
    );
    expect(transformed.submit(gateMode("actor-1", "hold")).status).toBe(
      "accepted",
    );
    expect(transformed.submit(millMode("actor-2", "transform")).status).toBe(
      "accepted",
    );
    expect(transformed.inspectCanonicalForTests().control["site-gate"]).toBeNull();

    const seated = createSession(playableWorldFixture());
    seated.submit({
      issuer: "actor-1",
      home: "Information" as const,
      kind: "Assimilate" as const,
      subjects: { subject: "site-mill" },
    });
    seated.submit(millMode("actor-1", "extract"));
    seated.submit(travel("actor-2", "place-a"));
    seated.submit({
      issuer: "actor-2",
      home: "Information" as const,
      kind: "Assimilate" as const,
      subjects: { subject: "site-mill" },
    });
    expect(seated.submit(millMode("actor-2", "seat")).status).toBe("accepted");
    expect(seated.inspectCanonicalForTests().control["site-mill"]).toBeNull();

    const hauled = createSession(lotHaulFixture());
    hauled.submit(assimilateMill("actor-1"));
    hauled.submit(millMode("actor-1", "extract"));
    const lot = hauled.inspectCanonicalForTests().lots[0]?.id ?? "";
    expect(
      hauled.submit({
        issuer: "actor-1",
        home: "World" as const,
        kind: "ChangePresence" as const,
        subjects: { lot, destination: "place-b" },
      }).status,
    ).toBe("accepted");
    expect(hauled.inspectCanonicalForTests().control["site-mill"]).toBeNull();
  });

  test("Control persists after the controller leaves the Place", () => {
    const session = createSession(gateWorldFixture());
    expect(session.submit(assimilateGate("actor-1")).status).toBe("accepted");
    expect(session.submit(establishGate("actor-1")).status).toBe("accepted");
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBe(
      "actor-1",
    );
    expect(session.inspectCanonicalForTests().presentAt["actor-1"]).toBe(
      "place-b",
    );
    expect(session.inspectCanonicalForTests().control["site-gate"]).not.toBe(
      "actor-2",
    );
  });
});
