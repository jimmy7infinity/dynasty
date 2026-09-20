import { describe, expect, test } from "vitest";
import { createSession, postBridgeWorksFixture } from "./session.js";

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

function lotsOfKind(
  session: ReturnType<typeof createSession>,
  kind: string,
) {
  return session.inspectCanonicalForTests().lots.filter((lot) => lot.kind === kind);
}

function extractAndHaulVeinToB(session: ReturnType<typeof createSession>) {
  expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
  const lot =
    lotsOfKind(session, "site-vein").find((item) => item.at === "place-a")?.id ??
    "";
  expect(session.submit(haulLot("actor-1", lot, "place-b")).status).toBe(
    "accepted",
  );
  return lot;
}

function seatBridgeWithSpareVein(session: ReturnType<typeof createSession>) {
  session.submit(assimilate("actor-1", "site-vein"));
  extractAndHaulVeinToB(session);
  extractAndHaulVeinToB(session);
  expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
  session.submit(assimilate("actor-1", "site-works-b"));
  expect(session.submit(processWorks("actor-1", "site-works-b")).status).toBe(
    "accepted",
  );
  expect(lotsOfKind(session, "lot-ingot")).toHaveLength(1);
  expect(lotsOfKind(session, "site-vein")).toHaveLength(1);
  session.submit(assimilate("actor-1", "site-post"));
  expect(session.submit(seatPost("actor-1")).status).toBe("accepted");
}

describe("Dynasty new geography enables downstream Works", () => {
  test("Extract creates a site-vein Lot at A", () => {
    const session = createSession(postBridgeWorksFixture());
    session.submit(assimilate("actor-1", "site-vein"));
    expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
    const lots = lotsOfKind(session, "site-vein");
    expect(lots).toHaveLength(1);
    expect(lots[0]?.at).toBe("place-a");
  });

  test("Works-B can produce lot-ingot from a hauled vein Lot", () => {
    const session = createSession(postBridgeWorksFixture());
    session.submit(assimilate("actor-1", "site-vein"));
    extractAndHaulVeinToB(session);
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    session.submit(assimilate("actor-1", "site-works-b"));
    expect(session.submit(processWorks("actor-1", "site-works-b")).status).toBe(
      "accepted",
    );
    const ingot = lotsOfKind(session, "lot-ingot");
    expect(ingot).toHaveLength(1);
    expect(ingot[0]?.at).toBe("place-b");
    expect(lotsOfKind(session, "site-vein")).toHaveLength(0);
  });

  test("post cannot Seat without ingot; failed Seat does not create B—C", () => {
    const session = createSession(postBridgeWorksFixture());
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    session.submit(assimilate("actor-1", "site-post"));
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(seatPost("actor-1")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(hasEdge(session, "place-b", "place-c")).toBe(false);
  });

  test("before bridge, B→C movement and Haul of a vein Lot reject", () => {
    const session = createSession(postBridgeWorksFixture());
    session.submit(assimilate("actor-1", "site-vein"));
    extractAndHaulVeinToB(session);
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    const vein = lotsOfKind(session, "site-vein")[0]?.id ?? "";
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("rejected");
    expect(session.submit(haulLot("actor-1", vein, "place-c")).status).toBe(
      "rejected",
    );
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("ingot can be present at B and Seat consumes it exactly once", () => {
    const session = createSession(postBridgeWorksFixture());
    session.submit(assimilate("actor-1", "site-vein"));
    extractAndHaulVeinToB(session);
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    session.submit(assimilate("actor-1", "site-works-b"));
    expect(session.submit(processWorks("actor-1", "site-works-b")).status).toBe(
      "accepted",
    );
    expect(lotsOfKind(session, "lot-ingot")).toHaveLength(1);
    session.submit(assimilate("actor-1", "site-post"));
    expect(session.submit(seatPost("actor-1")).status).toBe("accepted");
    expect(lotsOfKind(session, "lot-ingot")).toHaveLength(0);
    expect(session.submit(seatPost("actor-1")).status).toBe("rejected");
  });

  test("successful Seat creates B—C; movement and Haul then succeed", () => {
    const session = createSession(postBridgeWorksFixture());
    seatBridgeWithSpareVein(session);
    expect(hasEdge(session, "place-a", "place-b")).toBe(true);
    expect(hasEdge(session, "place-b", "place-c")).toBe(true);
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    const spare = lotsOfKind(session, "site-vein")[0]?.id ?? "";
    expect(session.submit(haulLot("actor-1", spare, "place-c")).status).toBe(
      "accepted",
    );
    expect(lotsOfKind(session, "site-vein")[0]?.at).toBe("place-c");
  });

  test("Works-C Process rejects before the vein Lot arrives at C", () => {
    const session = createSession(postBridgeWorksFixture());
    seatBridgeWithSpareVein(session);
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-works-c")).status).toBe(
      "accepted",
    );
    expect(session.submit(processWorks("actor-1", "site-works-c")).status).toBe(
      "rejected",
    );
    expect(lotsOfKind(session, "lot-plate")).toHaveLength(0);
    expect(lotsOfKind(session, "site-vein")[0]?.at).toBe("place-b");
  });

  test("Works-C Process rejects without knowledge-of even when the Lot is at C", () => {
    const session = createSession(postBridgeWorksFixture());
    seatBridgeWithSpareVein(session);
    const spare = lotsOfKind(session, "site-vein")[0]?.id ?? "";
    expect(session.submit(haulLot("actor-1", spare, "place-c")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(processWorks("actor-1", "site-works-c")).status).toBe(
      "rejected",
    );
    expect(lotsOfKind(session, "site-vein")).toHaveLength(1);
    expect(session.submit(assimilate("actor-1", "site-works-c")).status).toBe(
      "accepted",
    );
    expect(session.observe("actor-1").knowledgeOf).toContain("site-works-c");
  });

  test("Assimilate at C then Process consumes the vein Lot and emits lot-plate at C", () => {
    const session = createSession(postBridgeWorksFixture());
    seatBridgeWithSpareVein(session);
    const spare = lotsOfKind(session, "site-vein")[0]?.id ?? "";
    expect(session.submit(haulLot("actor-1", spare, "place-c")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-works-c")).status).toBe(
      "accepted",
    );
    expect(session.submit(processWorks("actor-1", "site-works-c")).status).toBe(
      "accepted",
    );
    expect(lotsOfKind(session, "site-vein")).toHaveLength(0);
    const plate = lotsOfKind(session, "lot-plate");
    expect(plate).toHaveLength(1);
    expect(plate[0]?.at).toBe("place-c");
    expect(session.submit(processWorks("actor-1", "site-works-c")).status).toBe(
      "rejected",
    );
  });

  test("the bridge persists after the actor leaves; Seat does not create Control or title", () => {
    const session = createSession(postBridgeWorksFixture());
    seatBridgeWithSpareVein(session);
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(travel("actor-1", "place-a")).status).toBe("rejected");
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    expect(session.submit(travel("actor-1", "place-a")).status).toBe("accepted");
    expect(hasEdge(session, "place-b", "place-c")).toBe(true);
    const truth = session.inspectCanonicalForTests();
    expect(truth.control["site-post"]).toBeNull();
    expect(truth.control["site-works-c"]).toBeNull();
    expect(session.submit(establish("actor-1", "site-post")).status).toBe(
      "rejected",
    );
  });

  test("Assimilate at C does not write Control; vacant Works-C can still Process", () => {
    const session = createSession(postBridgeWorksFixture());
    seatBridgeWithSpareVein(session);
    const spare = lotsOfKind(session, "site-vein")[0]?.id ?? "";
    expect(session.submit(haulLot("actor-1", spare, "place-c")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-works-c")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().control["site-works-c"]).toBeNull();
    expect(session.submit(processWorks("actor-1", "site-works-c")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().control["site-works-c"]).toBeNull();
  });

  test("no DLP, DYN, or economic mutation", () => {
    const session = createSession(postBridgeWorksFixture());
    seatBridgeWithSpareVein(session);
    const spare = lotsOfKind(session, "site-vein")[0]?.id ?? "";
    expect(session.submit(haulLot("actor-1", spare, "place-c")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-works-c")).status).toBe(
      "accepted",
    );
    expect(session.submit(processWorks("actor-1", "site-works-c")).status).toBe(
      "accepted",
    );
    const truth = JSON.stringify(session.inspectCanonicalForTests());
    expect(truth).not.toMatch(/"DLP"|"DYN"|"price"|"owner"|"title"/);
    expect(JSON.stringify(session.observe("actor-1"))).not.toMatch(
      /"DLP"|"DYN"|"price"/,
    );
  });

  test("PATH A bloom: no bridge, vein Lot cannot reach C, Works-C cannot Process", () => {
    const session = createSession(postBridgeWorksFixture());
    session.submit(assimilate("actor-1", "site-vein"));
    session.submit(assimilate("actor-1", "site-works-a"));
    expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
    expect(session.submit(processWorks("actor-1", "site-works-a")).status).toBe(
      "accepted",
    );
    const bloom = lotsOfKind(session, "lot-bloom")[0]?.id ?? "";
    expect(session.submit(haulLot("actor-1", bloom, "place-b")).status).toBe(
      "accepted",
    );
    expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
    const spare = lotsOfKind(session, "site-vein")[0]?.id ?? "";
    expect(session.submit(haulLot("actor-1", spare, "place-b")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    session.submit(assimilate("actor-1", "site-post"));
    expect(session.submit(seatPost("actor-1")).status).toBe("rejected");
    expect(hasEdge(session, "place-b", "place-c")).toBe(false);
    expect(session.submit(haulLot("actor-1", spare, "place-c")).status).toBe(
      "rejected",
    );
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("rejected");
    expect(session.submit(processWorks("actor-1", "site-works-c")).status).toBe(
      "rejected",
    );
    expect(lotsOfKind(session, "lot-plate")).toHaveLength(0);
  });

  test("PATH B ingot: Seat → bridge → Haul vein to C → Process emits lot-plate", () => {
    const session = createSession(postBridgeWorksFixture());
    seatBridgeWithSpareVein(session);
    const spare = lotsOfKind(session, "site-vein")[0]?.id ?? "";
    expect(session.submit(haulLot("actor-1", spare, "place-c")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-works-c")).status).toBe(
      "accepted",
    );
    expect(session.submit(processWorks("actor-1", "site-works-c")).status).toBe(
      "accepted",
    );
    expect(lotsOfKind(session, "site-vein")).toHaveLength(0);
    expect(lotsOfKind(session, "lot-plate")[0]?.at).toBe("place-c");
    expect(hasEdge(session, "place-b", "place-c")).toBe(true);
  });

  test("remote Process and remote Haul remain illegal", () => {
    const session = createSession(postBridgeWorksFixture());
    seatBridgeWithSpareVein(session);
    expect(session.submit(processWorks("actor-1", "site-works-c")).status).toBe(
      "rejected",
    );
    expect(session.submit(travel("actor-1", "place-a")).status).toBe("accepted");
    const spare = lotsOfKind(session, "site-vein")[0]?.id ?? "";
    expect(session.submit(haulLot("actor-1", spare, "place-c")).status).toBe(
      "rejected",
    );
  });
});
