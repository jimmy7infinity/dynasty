import { describe, expect, test } from "vitest";
import { createSession, materialSemanticsFixture } from "./session.js";

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

function transform(issuer: string, site: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site, mode: "transform" },
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

function extractMillA(session: ReturnType<typeof createSession>) {
  session.submit(assimilate("actor-1", "site-mill-a"));
  expect(session.submit(extract("actor-1", "site-mill-a")).status).toBe(
    "accepted",
  );
}

describe("Dynasty Extract → Lot → Seat law", () => {
  test("extract creates source extracted state and one Lot at the mill Place", () => {
    const session = createSession(materialSemanticsFixture());
    extractMillA(session);
    const truth = session.inspectCanonicalForTests();
    expect(truth.siteAggregate["site-mill-a"]).toBe("extracted");
    expect(truth.depositRemaining["site-mill-a"]).toBe(0);
    expect(truth.lots).toHaveLength(1);
    expect(truth.lots[0]?.kind).toBe("site-mill-a");
    expect(truth.lots[0]?.at).toBe("place-a");
    expect(truth.siteAggregate["site-mill-b"]).toBe("deposit");
  });

  test("local Seat succeeds because the producing Lot is at the mill Place", () => {
    const session = createSession(materialSemanticsFixture());
    extractMillA(session);
    expect(session.submit(travel("actor-2", "place-a")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-2", "site-mill-a")).status).toBe(
      "accepted",
    );
    const result = session.submit(seat("actor-2", "site-mill-a"));
    expect(result.status).toBe("accepted");
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill-a"]).toBe(
      "seated",
    );
    expect(session.inspectCanonicalForTests().lots).toEqual([]);
  });

  test("hauling the Lot away leaves the mill extracted and rejects Seat", () => {
    const session = createSession(materialSemanticsFixture());
    extractMillA(session);
    const lot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    expect(session.submit(haulLot("actor-1", lot, "place-b")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-2", "place-a")).status).toBe("accepted");
    session.submit(assimilate("actor-2", "site-mill-a"));
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(seat("actor-2", "site-mill-a")).status).toBe(
      "rejected",
    );
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill-a"]).toBe(
      "extracted",
    );
    expect(session.inspectCanonicalForTests().lots[0]?.at).toBe("place-b");
  });

  test("hauling the Lot back restores Seat", () => {
    const session = createSession(materialSemanticsFixture());
    extractMillA(session);
    const lot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    session.submit(haulLot("actor-1", lot, "place-b"));
    session.submit(travel("actor-1", "place-b"));
    expect(session.submit(haulLot("actor-1", lot, "place-a")).status).toBe(
      "accepted",
    );
    session.submit(travel("actor-2", "place-a"));
    session.submit(assimilate("actor-2", "site-mill-a"));
    expect(session.submit(seat("actor-2", "site-mill-a")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill-a"]).toBe(
      "seated",
    );
    expect(session.inspectCanonicalForTests().lots).toEqual([]);
  });

  test("imported Seat uses Lot-A at B without making mill B extracted", () => {
    const session = createSession(materialSemanticsFixture());
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill-b"]).toBe(
      "deposit",
    );
    extractMillA(session);
    const lot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    session.submit(haulLot("actor-1", lot, "place-b"));
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill-b"]).toBe(
      "deposit",
    );
    session.submit(assimilate("actor-2", "site-mill-b"));
    const result = session.submit(seat("actor-2", "site-mill-b"));
    expect(result.status).toBe("accepted");
    const truth = session.inspectCanonicalForTests();
    expect(truth.siteAggregate["site-mill-a"]).toBe("extracted");
    expect(truth.siteAggregate["site-mill-b"]).toBe("seated");
    expect(truth.lots).toEqual([]);
  });

  test("transform creates no Lot and Seat rejects", () => {
    const session = createSession(materialSemanticsFixture());
    session.submit(assimilate("actor-1", "site-mill-a"));
    expect(session.submit(transform("actor-1", "site-mill-a")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().lots).toEqual([]);
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill-a"]).toBe(
      "transformed",
    );
    session.submit(travel("actor-2", "place-a"));
    session.submit(assimilate("actor-2", "site-mill-a"));
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(seat("actor-2", "site-mill-a")).status).toBe(
      "rejected",
    );
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("a Lot from another mill does not satisfy Seat of an extracted mill", () => {
    const session = createSession(materialSemanticsFixture());
    extractMillA(session);
    session.submit(assimilate("actor-1", "site-mill-other"));
    expect(session.submit(extract("actor-1", "site-mill-other")).status).toBe(
      "accepted",
    );
    const lotA =
      session.inspectCanonicalForTests().lots.find((item) => item.kind === "site-mill-a")
        ?.id ?? "";
    session.submit(haulLot("actor-1", lotA, "place-b"));
    session.submit(travel("actor-2", "place-a"));
    session.submit(assimilate("actor-2", "site-mill-a"));
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(seat("actor-2", "site-mill-a")).status).toBe(
      "rejected",
    );
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill-a"]).toBe(
      "extracted",
    );
  });

  test("successful local Seat cannot be repeated", () => {
    const session = createSession(materialSemanticsFixture());
    extractMillA(session);
    session.submit(travel("actor-2", "place-a"));
    session.submit(assimilate("actor-2", "site-mill-a"));
    expect(session.submit(seat("actor-2", "site-mill-a")).status).toBe(
      "accepted",
    );
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(seat("actor-2", "site-mill-a")).status).toBe(
      "rejected",
    );
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(session.inspectCanonicalForTests().lots).toEqual([]);
  });

  test("one Lot cannot Seat two Sites", () => {
    const session = createSession(materialSemanticsFixture());
    extractMillA(session);
    const lot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    session.submit(haulLot("actor-1", lot, "place-b"));
    session.submit(assimilate("actor-2", "site-mill-b"));
    expect(session.submit(seat("actor-2", "site-mill-b")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().lots).toEqual([]);
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill-a"]).toBe(
      "extracted",
    );
    expect(
      session.submit(haulLot("actor-1", lot, "place-a")).status,
    ).toBe("rejected");
    session.submit(travel("actor-2", "place-a"));
    session.submit(assimilate("actor-2", "site-mill-a"));
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(seat("actor-2", "site-mill-a")).status).toBe(
      "rejected",
    );
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });
});
