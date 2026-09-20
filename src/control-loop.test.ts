import { describe, expect, test } from "vitest";
import {
  createSession,
  gateWorldFixture,
  occupiedGateFixture,
} from "./session.js";

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

function travelToB(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangePresence" as const,
    subjects: { destination: "place-b" },
  };
}

function prepareBoth(session: ReturnType<typeof createSession>) {
  expect(session.submit(assimilateGate("actor-1")).status).toBe("accepted");
  expect(session.submit(assimilateGate("actor-2")).status).toBe("accepted");
}

describe("Dynasty occupied gate control", () => {
  test("occupied controller can hold", () => {
    const session = createSession(occupiedGateFixture());
    prepareBoth(session);
    const result = session.submit(gateMode("actor-1", "hold"));
    expect(result.status).toBe("accepted");
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "held",
    );
    expect(session.inspectCanonicalForTests().occurrenceKinds).toContain(
      "GateChanged",
    );
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBe(
      "actor-1",
    );
  });

  test("occupied non-controller cannot hold and causes no mutation", () => {
    const session = createSession(occupiedGateFixture());
    prepareBoth(session);
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "held",
    );
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBe(
      "actor-1",
    );
  });

  test("held gate still blocks the non-controller's movement", () => {
    const session = createSession(occupiedGateFixture());
    prepareBoth(session);
    session.submit(gateMode("actor-1", "hold"));
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(travelToB("actor-2")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(session.inspectCanonicalForTests().presentAt["actor-2"]).toBe(
      "place-a",
    );
  });

  test("occupied controller can release; non-controller cannot", () => {
    const session = createSession(occupiedGateFixture());
    prepareBoth(session);
    session.submit(gateMode("actor-1", "hold"));
    const beforeRelease = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(gateMode("actor-2", "release")).status).toBe(
      "rejected",
    );
    expect(session.inspectCanonicalForTests()).toEqual(beforeRelease);
    expect(session.submit(gateMode("actor-1", "release")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "open",
    );
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBe(
      "actor-1",
    );
  });

  test("occupied controller can ease; non-controller cannot", () => {
    const session = createSession(occupiedGateFixture());
    prepareBoth(session);
    const beforeEase = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(gateMode("actor-2", "ease")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(beforeEase);
    expect(session.submit(gateMode("actor-1", "ease")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "eased",
    );
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBe(
      "actor-1",
    );
  });

  test("vacant-control fixture still permits existing gate behavior", () => {
    const session = createSession(gateWorldFixture());
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBeNull();
    expect(session.submit(assimilateGate("actor-1")).status).toBe("accepted");
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "held",
    );
    expect(session.submit(gateMode("actor-1", "release")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBeNull();
  });
});
