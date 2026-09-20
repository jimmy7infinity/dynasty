import { describe, expect, test } from "vitest";
import {
  createSession,
  gateWorldFixture,
  postBridgeRaceFixture,
} from "./session.js";

function assimilate(issuer: string, subject: string) {
  return {
    issuer,
    home: "Information" as const,
    kind: "Assimilate" as const,
    subjects: { subject },
  };
}

function extractVein(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: "site-vein", mode: "extract" },
  };
}

function processWorks(issuer: string, site: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site, mode: "process" },
  };
}

function seatPost(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: "site-post", mode: "seat" },
  };
}

function establish(issuer: string, site: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeControl" as const,
    subjects: { site, mode: "establish" },
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

function haulLot(issuer: string, lot: string, destination: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangePresence" as const,
    subjects: { lot, destination },
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

function hasEdge(
  session: ReturnType<typeof createSession>,
  left: string,
  right: string,
) {
  return session
    .inspectCanonicalForTests()
    .connects.some(
      ([a, b]) =>
        (a === left && b === right) || (a === right && b === left),
    );
}

function seatBridge(session: ReturnType<typeof createSession>) {
  session.submit(assimilate("actor-1", "site-vein"));
  expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
  const vein =
    session.inspectCanonicalForTests().lots.find((lot) => lot.kind === "site-vein")
      ?.id ?? "";
  expect(session.submit(haulLot("actor-1", vein, "place-b")).status).toBe(
    "accepted",
  );
  session.submit(assimilate("actor-2", "site-works-b"));
  expect(session.submit(processWorks("actor-2", "site-works-b")).status).toBe(
    "accepted",
  );
  expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
  session.submit(assimilate("actor-1", "site-post"));
  expect(session.submit(seatPost("actor-1")).status).toBe("accepted");
}

describe("Dynasty new geography creates an information race", () => {
  test("pre-bridge: B→C is closed and the C gate is not assimilable from A or B", () => {
    const session = createSession(postBridgeRaceFixture());
    expect(hasEdge(session, "place-b", "place-c")).toBe(false);
    expect(session.submit(travel("actor-2", "place-c")).status).toBe("rejected");
    expect(session.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "rejected",
    );
    expect(session.submit(assimilate("actor-2", "site-gate")).status).toBe(
      "rejected",
    );
    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("rejected");
    expect(session.observe("actor-1").knowledgeOf).toEqual([]);
    expect(session.observe("actor-2").knowledgeOf).toEqual([]);
  });

  test("bloom cannot Seat; B—C stays closed and the gate stays unreachable", () => {
    const session = createSession(postBridgeRaceFixture());
    session.submit(assimilate("actor-1", "site-vein"));
    session.submit(assimilate("actor-1", "site-works-a"));
    expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
    expect(session.submit(processWorks("actor-1", "site-works-a")).status).toBe(
      "accepted",
    );
    const bloom = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    expect(session.submit(haulLot("actor-1", bloom, "place-b")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    session.submit(assimilate("actor-1", "site-post"));
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(seatPost("actor-1")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(hasEdge(session, "place-b", "place-c")).toBe(false);
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("rejected");
    expect(session.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "rejected",
    );
  });

  test("ingot Seat opens B—C as a canonical World fact", () => {
    const session = createSession(postBridgeRaceFixture());
    seatBridge(session);
    expect(hasEdge(session, "place-a", "place-b")).toBe(true);
    expect(hasEdge(session, "place-b", "place-c")).toBe(true);
    expect(session.inspectCanonicalForTests().siteAggregate["site-post"]).toBe(
      "seated",
    );
  });

  test("Actor 1 reaches C and Assimilates the gate; Actor 2 does not inherit knowledge", () => {
    const session = createSession(postBridgeRaceFixture());
    seatBridge(session);
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.observe("actor-1").knowledgeOf).toContain("site-gate");
    expect(session.observe("actor-2").knowledgeOf).not.toContain("site-gate");
    expect(session.inspectCanonicalForTests().presentAt["actor-2"]).toBe(
      "place-b",
    );
  });

  test("at C, Actor 2 Hold rejects for knowledge; Actor 1 Hold is accepted", () => {
    const session = createSession(postBridgeRaceFixture());
    seatBridge(session);
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-2", "place-c")).status).toBe("accepted");
    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "open",
    );
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "held",
    );
    expect(session.observe("actor-2").knowledgeOf).not.toContain("site-gate");
  });

  test("knowledge-of persists after Actor 1 leaves; it is not Presence, Haul, or Control", () => {
    const session = createSession(postBridgeRaceFixture());
    seatBridge(session);
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("rejected");
    expect(session.submit(gateMode("actor-1", "release")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    expect(session.observe("actor-1").knowledgeOf).toContain("site-gate");
    expect(session.inspectCanonicalForTests().presentAt["actor-1"]).toBe(
      "place-b",
    );
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBeNull();
    expect(session.observe("actor-1").capabilities).toContain("Direct");
  });

  test("no knowledge transfer: Actor 2 must Assimilate independently, then Hold succeeds", () => {
    const session = createSession(postBridgeRaceFixture());
    seatBridge(session);
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-2", "place-c")).status).toBe("accepted");
    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("rejected");
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    expect(session.submit(gateMode("actor-1", "release")).status).toBe(
      "accepted",
    );
    const actor1Intel = session.observe("actor-1").heldIntelIds;
    expect(actor1Intel.length).toBeGreaterThan(0);
    expect(session.observe("actor-2").knowledgeOf).not.toContain("site-gate");
    expect(session.submit(assimilate("actor-2", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.observe("actor-2").knowledgeOf).toContain("site-gate");
    expect(session.observe("actor-1").knowledgeOf).toContain("site-gate");
    const actor2Intel = session.observe("actor-2").heldIntelIds;
    expect(actor2Intel.some((id) => actor1Intel.includes(id))).toBe(false);
    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "held",
    );
  });

  test("co-present actors see the same live gate; knowledge remains asymmetric", () => {
    const session = createSession(postBridgeRaceFixture());
    seatBridge(session);
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-2", "place-c")).status).toBe("accepted");
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    expect(session.observe("actor-1").gateStateHere["site-gate"]).toBe("held");
    expect(session.observe("actor-2").gateStateHere["site-gate"]).toBe("held");
    expect(session.observe("actor-1").knowledgeOf).toContain("site-gate");
    expect(session.observe("actor-2").knowledgeOf).not.toContain("site-gate");
  });

  test("Assimilate and Hold do not write Control; Control is not transferred", () => {
    const session = createSession(postBridgeRaceFixture());
    seatBridge(session);
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBeNull();
    expect(session.submit(travel("actor-2", "place-c")).status).toBe("rejected");
    expect(session.submit(gateMode("actor-1", "release")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-2", "place-c")).status).toBe("accepted");
    expect(session.submit(establish("actor-2", "site-gate")).status).toBe(
      "rejected",
    );
    expect(session.submit(assimilate("actor-2", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-2", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBe(
      "actor-2",
    );
    expect(session.inspectCanonicalForTests().control["site-gate"]).not.toBe(
      "actor-1",
    );
  });

  test("knowledge-of the gate does not grant Haul or remote Hold", () => {
    const session = createSession(postBridgeRaceFixture());
    seatBridge(session);
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("rejected");
    expect(session.observe("actor-1").knowledgeOf).toContain("site-gate");
    expect(session.submit(haulLot("actor-1", "lot-1", "place-c")).status).toBe(
      "rejected",
    );
  });

  test("held gate on the new edge uses existing gate law", () => {
    const session = createSession(postBridgeRaceFixture());
    seatBridge(session);
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    expect(session.submit(travel("actor-2", "place-c")).status).toBe("rejected");
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("rejected");
  });

  test("Works-B Process is unchanged by the race fixture", () => {
    const session = createSession(postBridgeRaceFixture());
    session.submit(assimilate("actor-2", "site-works-b"));
    expect(session.submit(establish("actor-2", "site-works-b")).status).toBe(
      "accepted",
    );
    seatBridge(session);
    expect(session.inspectCanonicalForTests().control["site-works-b"]).toBe(
      "actor-2",
    );
    expect(session.inspectCanonicalForTests().control["site-post"]).toBeNull();
  });

  test("existing two-actor gate fixture is unchanged", () => {
    const session = createSession(gateWorldFixture());
    session.submit(assimilate("actor-1", "site-gate"));
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    expect(session.submit(travel("actor-2", "place-a")).status).toBe("rejected");
  });

  test("no DLP, DYN, or economic mutation from the race", () => {
    const session = createSession(postBridgeRaceFixture());
    seatBridge(session);
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    const truth = JSON.stringify(session.inspectCanonicalForTests());
    expect(truth).not.toMatch(/"DLP"|"DYN"|"price"|"owner"|"title"/);
    expect(JSON.stringify(session.observe("actor-1"))).not.toMatch(
      /"DLP"|"DYN"|"price"/,
    );
  });

  test("full race: ingot geography then first-mover knowledge then late Assimilate", () => {
    const session = createSession(postBridgeRaceFixture());
    seatBridge(session);
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-2", "place-c")).status).toBe("accepted");
    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("rejected");
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    expect(session.submit(gateMode("actor-1", "release")).status).toBe(
      "accepted",
    );
    expect(session.submit(assimilate("actor-2", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "held",
    );
    expect(session.observe("actor-1").knowledgeOf).toContain("site-gate");
    expect(session.observe("actor-2").knowledgeOf).toContain("site-gate");
  });
});
