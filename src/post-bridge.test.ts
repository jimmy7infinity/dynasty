import { describe, expect, test } from "vitest";
import { createSession, gateWorldFixture, postBridgeFixture } from "./session.js";

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
  session.submit(assimilate("actor-2", "site-post"));
  expect(session.submit(seatPost("actor-2")).status).toBe("accepted");
}

describe("Dynasty seated post creates a connection", () => {
  test("before Seat, B→C movement and Haul reject", () => {
    const session = createSession(postBridgeFixture());
    session.submit(assimilate("actor-1", "site-vein"));
    expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
    const lot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    expect(session.submit(haulLot("actor-1", lot, "place-b")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("rejected");
    expect(session.submit(haulLot("actor-1", lot, "place-c")).status).toBe(
      "rejected",
    );
    expect(session.submit(travel("actor-3", "place-b")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(hasEdge(session, "place-b", "place-c")).toBe(false);
  });

  test("ingot Seat creates B↔C in canonical connects", () => {
    const session = createSession(postBridgeFixture());
    expect(hasEdge(session, "place-a", "place-b")).toBe(true);
    expect(hasEdge(session, "place-b", "place-c")).toBe(false);
    seatBridge(session);
    expect(hasEdge(session, "place-b", "place-c")).toBe(true);
    expect(hasEdge(session, "place-a", "place-b")).toBe(true);
    expect(session.inspectCanonicalForTests().siteAggregate["site-post"]).toBe(
      "seated",
    );
    expect(session.inspectCanonicalForTests().lots).toHaveLength(0);
  });

  test("after Seat, B→C movement and Haul succeed", () => {
    const session = createSession(postBridgeFixture());
    session.submit(assimilate("actor-1", "site-vein"));
    expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
    const first =
      session.inspectCanonicalForTests().lots.find((lot) => lot.kind === "site-vein")
        ?.id ?? "";
    expect(session.submit(haulLot("actor-1", first, "place-b")).status).toBe(
      "accepted",
    );
    session.submit(assimilate("actor-2", "site-works-b"));
    expect(session.submit(processWorks("actor-2", "site-works-b")).status).toBe(
      "accepted",
    );
    expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
    const spare =
      session.inspectCanonicalForTests().lots.find((lot) => lot.kind === "site-vein")
        ?.id ?? "";
    expect(session.submit(haulLot("actor-1", spare, "place-b")).status).toBe(
      "accepted",
    );
    session.submit(assimilate("actor-2", "site-post"));
    expect(session.submit(seatPost("actor-2")).status).toBe("accepted");
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().presentAt["actor-1"]).toBe(
      "place-c",
    );
    expect(session.submit(haulLot("actor-2", spare, "place-c")).status).toBe(
      "accepted",
    );
    expect(
      session.inspectCanonicalForTests().lots.find((lot) => lot.id === spare)?.at,
    ).toBe("place-c");
  });

  test("the new connection persists after the seater leaves and another actor uses it", () => {
    const session = createSession(postBridgeFixture());
    seatBridge(session);
    expect(session.submit(travel("actor-2", "place-c")).status).toBe("accepted");
    expect(session.submit(travel("actor-2", "place-a")).status).toBe("rejected");
    expect(hasEdge(session, "place-b", "place-c")).toBe(true);
    expect(session.submit(travel("actor-3", "place-b")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().presentAt["actor-3"]).toBe(
      "place-b",
    );
    expect(session.inspectCanonicalForTests().control["site-post"]).toBeNull();
  });

  test("lookout at C is only assimilable after the bridge exists", () => {
    const session = createSession(postBridgeFixture());
    expect(session.submit(assimilate("actor-1", "site-lookout")).status).toBe(
      "rejected",
    );
    seatBridge(session);
    expect(session.submit(travel("actor-2", "place-c")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-2", "site-lookout")).status).toBe(
      "accepted",
    );
    expect(session.observe("actor-2").knowledgeOf).toContain("site-lookout");
  });

  test("bloom cannot Seat; failed Seat does not create the connection", () => {
    const session = createSession(postBridgeFixture());
    session.submit(assimilate("actor-1", "site-vein"));
    session.submit(assimilate("actor-1", "site-works-a"));
    expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
    expect(session.submit(processWorks("actor-1", "site-works-a")).status).toBe(
      "accepted",
    );
    session.submit(assimilate("actor-2", "site-post"));
    const bloom = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    expect(session.submit(haulLot("actor-1", bloom, "place-b")).status).toBe(
      "accepted",
    );
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(seatPost("actor-2")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(hasEdge(session, "place-b", "place-c")).toBe(false);
    expect(session.submit(travel("actor-2", "place-c")).status).toBe("rejected");
  });

  test("missing ingot and reseat do not create or duplicate the bridge", () => {
    const session = createSession(postBridgeFixture());
    session.submit(assimilate("actor-2", "site-post"));
    expect(session.submit(seatPost("actor-2")).status).toBe("rejected");
    expect(hasEdge(session, "place-b", "place-c")).toBe(false);
    seatBridge(session);
    const after = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(seatPost("actor-2")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(after);
  });

  test("Seat does not grant Control or title of the connection or Place C", () => {
    const session = createSession(postBridgeFixture());
    seatBridge(session);
    const truth = session.inspectCanonicalForTests();
    expect(truth.control["site-post"]).toBeNull();
    expect(truth.control["site-lookout"]).toBeNull();
    expect(session.submit(establish("actor-2", "site-post")).status).toBe(
      "rejected",
    );
    expect(JSON.stringify(truth)).not.toMatch(/"DLP"|"DYN"|"price"|"owner"/);
  });

  test("Works-B Process is unchanged; Works Control still independent", () => {
    const session = createSession(postBridgeFixture());
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

  test("held-gate law is unchanged on a separate fixture", () => {
    const session = createSession(gateWorldFixture());
    session.submit(assimilate("actor-1", "site-gate"));
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    expect(session.submit(travel("actor-2", "place-a")).status).toBe("rejected");
  });

  test("pre-seat C remains isolated even if an actor at B has Erect", () => {
    const session = createSession(postBridgeFixture());
    session.submit(assimilate("actor-2", "site-post"));
    expect(session.submit(travel("actor-2", "place-c")).status).toBe("rejected");
    expect(session.submit(establish("actor-2", "site-lookout")).status).toBe(
      "rejected",
    );
  });

  test("PATH A bloom vs PATH B ingot: only ingot opens C", () => {
    const bloom = createSession(postBridgeFixture());
    bloom.submit(assimilate("actor-1", "site-vein"));
    bloom.submit(assimilate("actor-1", "site-works-a"));
    expect(bloom.submit(extractVein("actor-1")).status).toBe("accepted");
    expect(bloom.submit(processWorks("actor-1", "site-works-a")).status).toBe(
      "accepted",
    );
    bloom.submit(assimilate("actor-2", "site-post"));
    expect(bloom.submit(seatPost("actor-2")).status).toBe("rejected");
    expect(hasEdge(bloom, "place-b", "place-c")).toBe(false);

    const ingot = createSession(postBridgeFixture());
    seatBridge(ingot);
    expect(hasEdge(ingot, "place-b", "place-c")).toBe(true);
    expect(ingot.submit(travel("actor-3", "place-b")).status).toBe("accepted");
  });

  test("actor-3 can Haul from C to B only after the bridge exists", () => {
    const session = createSession(postBridgeFixture());
    expect(session.submit(haulLot("actor-3", "lot-1", "place-b")).status).toBe(
      "rejected",
    );
    seatBridge(session);
    expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
    const spare =
      session.inspectCanonicalForTests().lots.find((item) => item.kind === "site-vein")
        ?.id ?? "";
    expect(session.submit(haulLot("actor-1", spare, "place-b")).status).toBe(
      "accepted",
    );
    expect(session.submit(haulLot("actor-2", spare, "place-c")).status).toBe(
      "accepted",
    );
    expect(session.submit(haulLot("actor-3", spare, "place-b")).status).toBe(
      "accepted",
    );
    expect(
      session.inspectCanonicalForTests().lots.find((item) => item.id === spare)?.at,
    ).toBe("place-b");
  });
});
