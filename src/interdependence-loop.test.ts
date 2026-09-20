import { describe, expect, test } from "vitest";
import { createSession, interdependenceFixture } from "./session.js";

function extractMill(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: "site-mill", mode: "extract" },
  };
}

function seatMill(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: "site-mill", mode: "seat" },
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

function travelToA(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangePresence" as const,
    subjects: { destination: "place-a" },
  };
}

describe("Dynasty first interdependence — Extract then Erect", () => {
  test("actor capabilities differ", () => {
    const session = createSession(interdependenceFixture());
    expect(session.observe("actor-1").capabilities).toEqual(["Extract"]);
    expect(session.observe("actor-2").capabilities).toEqual(["Erect"]);
  });

  test("the mill deposit is initially present and control is vacant", () => {
    const session = createSession(interdependenceFixture());
    const truth = session.inspectCanonicalForTests();
    expect(truth.siteAggregate["site-mill"]).toBe("deposit");
    expect(truth.depositRemaining["site-mill"]).toBe(1);
    expect(truth.presentAt["actor-1"]).toBe("place-a");
    expect(truth.presentAt["actor-2"]).toBe("place-b");
    expect(truth.control["site-mill"]).toBeNull();
  });

  test("extractor alone cannot seat infrastructure", () => {
    const session = createSession(interdependenceFixture());
    session.submit(assimilateMill("actor-1"));
    expect(session.submit(extractMill("actor-1")).status).toBe("accepted");
    const before = structuredClone(session.inspectCanonicalForTests());
    const result = session.submit(seatMill("actor-1"));
    expect(result.status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "extracted",
    );
  });

  test("erector alone cannot extract or seat", () => {
    const session = createSession(interdependenceFixture());
    session.submit(travelToA("actor-2"));
    session.submit(assimilateMill("actor-2"));
    const extractResult = session.submit(extractMill("actor-2"));
    expect(extractResult.status).toBe("rejected");
    const beforeSeat = structuredClone(session.inspectCanonicalForTests());
    const seatResult = session.submit(seatMill("actor-2"));
    expect(seatResult.status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(beforeSeat);
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "deposit",
    );
  });

  test("extract then travel-and-seat produces seated infrastructure", () => {
    const session = createSession(interdependenceFixture());
    session.submit(assimilateMill("actor-1"));
    const extractResult = session.submit(extractMill("actor-1"));
    expect(extractResult.status).toBe("accepted");
    expect(extractResult.home).toBe("World");
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "extracted",
    );

    session.submit(travelToA("actor-2"));
    session.submit(assimilateMill("actor-2"));
    const seatResult = session.submit(seatMill("actor-2"));
    expect(seatResult.status).toBe("accepted");
    expect(seatResult.home).toBe("World");
    expect(seatResult.kind).toBe("ChangeAggregate");
    if (seatResult.status !== "accepted") {
      return;
    }
    expect(seatResult.occurrenceIds.length).toBe(1);
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "seated",
    );
    expect(session.inspectCanonicalForTests().occurrenceKinds).toContain(
      "SiteSeated",
    );
  });

  test("seat depends on the extracted World state, not co-presence alone", () => {
    const session = createSession(interdependenceFixture());
    session.submit(travelToA("actor-2"));
    session.submit(assimilateMill("actor-2"));
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(seatMill("actor-2")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("subsequent observation sees seated infrastructure", () => {
    const session = createSession(interdependenceFixture());
    session.submit(assimilateMill("actor-1"));
    session.submit(extractMill("actor-1"));
    session.submit(travelToA("actor-2"));
    session.submit(assimilateMill("actor-2"));
    session.submit(seatMill("actor-2"));
    const view = session.observe("actor-2");
    expect(view.siteAggregateHere["site-mill"]).toBe("seated");
    expect(view.occurrences.map((item) => item.kind)).toContain("SiteSeated");
  });

  test("knowledge and capability still do not grant control", () => {
    const session = createSession(interdependenceFixture());
    session.submit(assimilateMill("actor-1"));
    session.submit(extractMill("actor-1"));
    session.submit(travelToA("actor-2"));
    session.submit(assimilateMill("actor-2"));
    session.submit(seatMill("actor-2"));
    expect(session.observe("actor-1").knowledgeOf).toEqual(["site-mill"]);
    expect(session.observe("actor-2").knowledgeOf).toEqual(["site-mill"]);
    expect(session.observe("actor-2").capabilities).toEqual(["Erect"]);
    expect(session.inspectCanonicalForTests().control["site-mill"]).toBeNull();
  });

  test("interdependence creates no DLP, DYN, wage, or price", () => {
    const session = createSession(interdependenceFixture());
    session.submit(assimilateMill("actor-1"));
    session.submit(extractMill("actor-1"));
    session.submit(travelToA("actor-2"));
    session.submit(assimilateMill("actor-2"));
    session.submit(seatMill("actor-2"));
    const truth = session.inspectCanonicalForTests();
    const payload = JSON.stringify({
      truth,
      a: session.observe("actor-1"),
      b: session.observe("actor-2"),
    });
    expect(truth).not.toHaveProperty("dlp");
    expect(payload).not.toMatch(
      /"price"|"DLP"|"DYN"|"wage"|"xp"|"dependencyScore"/,
    );
  });
});
