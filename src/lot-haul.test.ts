import { describe, expect, test } from "vitest";
import { createSession, lotHaulFixture } from "./session.js";

function assimilateMill(issuer: string) {
  return {
    issuer,
    home: "Information" as const,
    kind: "Assimilate" as const,
    subjects: { subject: "site-mill" },
  };
}

function extractMill(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: "site-mill", mode: "extract" },
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

function haulLot(issuer: string, lot: string, destination: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangePresence" as const,
    subjects: { lot, destination },
  };
}

describe("Dynasty material lot + haul", () => {
  test("extract creates exactly one Lot at the mill Place", () => {
    const session = createSession(lotHaulFixture());
    session.submit(assimilateMill("actor-1"));
    const result = session.submit(extractMill("actor-1"));
    expect(result.status).toBe("accepted");
    const truth = session.inspectCanonicalForTests();
    expect(truth.depositRemaining["site-mill"]).toBe(0);
    expect(truth.siteAggregate["site-mill"]).toBe("extracted");
    expect(truth.lots).toHaveLength(1);
    expect(truth.lots[0]?.at).toBe("place-a");
    expect(truth.lots[0]?.quantity).toBe(1);
    expect(truth.lots[0]?.kind).toBe("site-mill");
    expect(truth.control["site-mill"]).toBeNull();
    expect(truth.lots[0]).not.toHaveProperty("owner");
  });

  test("Haul moves the Lot along one connects edge", () => {
    const session = createSession(lotHaulFixture());
    session.submit(assimilateMill("actor-1"));
    session.submit(extractMill("actor-1"));
    const lot = session.inspectCanonicalForTests().lots[0]?.id;
    expect(lot).toBeDefined();
    const result = session.submit(haulLot("actor-1", lot ?? "", "place-b"));
    expect(result.status).toBe("accepted");
    expect(session.inspectCanonicalForTests().lots[0]?.at).toBe("place-b");
    expect(session.inspectCanonicalForTests().presentAt["actor-1"]).toBe(
      "place-a",
    );
  });

  test("Haul A→C is rejected and does not move the Lot", () => {
    const session = createSession(lotHaulFixture());
    session.submit(assimilateMill("actor-1"));
    session.submit(extractMill("actor-1"));
    const lot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(haulLot("actor-1", lot, "place-c")).status).toBe(
      "rejected",
    );
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(session.inspectCanonicalForTests().lots[0]?.at).toBe("place-a");
  });

  test("actor without Haul cannot move the Lot", () => {
    const session = createSession(lotHaulFixture());
    session.submit(assimilateMill("actor-1"));
    session.submit(extractMill("actor-1"));
    const lot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    expect(session.submit(travelToA("actor-2")).status).toBe("accepted");
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(haulLot("actor-2", lot, "place-b")).status).toBe(
      "rejected",
    );
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("two actors share one World: Lot location is World truth", () => {
    const session = createSession(lotHaulFixture());
    session.submit(assimilateMill("actor-1"));
    session.submit(extractMill("actor-1"));
    const lot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    session.submit(haulLot("actor-1", lot, "place-b"));
    expect(session.inspectCanonicalForTests().lots[0]?.at).toBe("place-b");
    expect(session.observe("actor-2").at).toBe("place-b");
    expect(session.observe("actor-2").lotsHere.map((item) => item.id)).toEqual([
      lot,
    ]);
    expect(session.observe("actor-1").lotsHere).toEqual([]);
    expect(JSON.stringify(session.inspectCanonicalForTests())).not.toMatch(
      /"price"|"DLP"|"DYN"|"owner"/,
    );
  });
});
