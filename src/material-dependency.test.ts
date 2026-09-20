import { describe, expect, test } from "vitest";
import { createSession, materialDependencyFixture } from "./session.js";

function assimilate(issuer: string, subject: string) {
  return {
    issuer,
    home: "Information" as const,
    kind: "Assimilate" as const,
    subjects: { subject },
  };
}

function extract(issuer: string, site: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site, mode: "extract" },
  };
}

function seat(issuer: string, site: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site, mode: "seat" },
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

function haulLot(issuer: string, lot: string, destination: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangePresence" as const,
    subjects: { lot, destination },
  };
}

describe("Dynasty first material dependency", () => {
  test("seat without the required Lot is rejected", () => {
    const session = createSession(materialDependencyFixture());
    expect(session.submit(assimilate("actor-2", "site-mill-b")).status).toBe(
      "accepted",
    );
    const before = structuredClone(session.inspectCanonicalForTests());
    const result = session.submit(seat("actor-2", "site-mill-b"));
    expect(result.status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill-b"]).toBe(
      "deposit",
    );
    expect(session.inspectCanonicalForTests().lots).toEqual([]);
  });

  test("extract at the source mill creates the required Lot", () => {
    const session = createSession(materialDependencyFixture());
    session.submit(assimilate("actor-1", "site-mill-a"));
    const result = session.submit(extract("actor-1", "site-mill-a"));
    expect(result.status).toBe("accepted");
    const truth = session.inspectCanonicalForTests();
    expect(truth.siteAggregate["site-mill-a"]).toBe("extracted");
    expect(truth.depositRemaining["site-mill-a"]).toBe(0);
    expect(truth.lots).toHaveLength(1);
    expect(truth.lots[0]?.kind).toBe("site-mill-a");
    expect(truth.lots[0]?.at).toBe("place-a");
    expect(truth.siteAggregate["site-mill-b"]).toBe("deposit");
  });

  test("haul then seat succeeds on one shared World", () => {
    const session = createSession(materialDependencyFixture());
    session.submit(assimilate("actor-1", "site-mill-a"));
    session.submit(extract("actor-1", "site-mill-a"));
    const lot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    expect(session.submit(haulLot("actor-1", lot, "place-b")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().lots[0]?.at).toBe("place-b");
    session.submit(assimilate("actor-2", "site-mill-b"));
    const result = session.submit(seat("actor-2", "site-mill-b"));
    expect(result.status).toBe("accepted");
    expect(result.kind).toBe("ChangeAggregate");
    const truth = session.inspectCanonicalForTests();
    expect(truth.siteAggregate["site-mill-a"]).toBe("extracted");
    expect(truth.siteAggregate["site-mill-b"]).toBe("seated");
    expect(truth.occurrenceKinds).toContain("SiteSeated");
    expect(truth.lots).toEqual([]);
    expect(JSON.stringify(truth)).not.toMatch(/"price"|"DLP"|"DYN"|"owner"/);
    expect(session.observe("actor-2").siteAggregateHere["site-mill-b"]).toBe(
      "seated",
    );
  });

  test("geography constrains haul of the required Lot", () => {
    const session = createSession(materialDependencyFixture());
    session.submit(assimilate("actor-1", "site-mill-a"));
    session.submit(extract("actor-1", "site-mill-a"));
    const lot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    const skipped = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(haulLot("actor-1", lot, "place-c")).status).toBe(
      "rejected",
    );
    expect(session.inspectCanonicalForTests()).toEqual(skipped);
    expect(session.submit(haulLot("actor-1", lot, "place-b")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    expect(session.submit(haulLot("actor-1", lot, "place-c")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().lots[0]?.at).toBe("place-c");
  });

  test("hauling the Lot away from B restores mill-B Seat rejection", () => {
    const session = createSession(materialDependencyFixture());
    session.submit(assimilate("actor-1", "site-mill-a"));
    session.submit(extract("actor-1", "site-mill-a"));
    const lot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    session.submit(haulLot("actor-1", lot, "place-b"));
    session.submit(travel("actor-1", "place-b"));
    session.submit(haulLot("actor-1", lot, "place-a"));
    expect(session.inspectCanonicalForTests().lots[0]?.at).toBe("place-a");
    session.submit(assimilate("actor-2", "site-mill-b"));
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(seat("actor-2", "site-mill-b")).status).toBe(
      "rejected",
    );
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill-b"]).toBe(
      "deposit",
    );
  });
});
