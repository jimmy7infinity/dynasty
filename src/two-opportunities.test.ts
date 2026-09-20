import { describe, expect, test } from "vitest";
import { createSession, twoOpportunityFixture } from "./session.js";

function assimilate(issuer: string, subject: string) {
  return {
    issuer,
    home: "Information" as const,
    kind: "Assimilate" as const,
    subjects: { subject },
  };
}

function millMode(
  issuer: string,
  mill: string,
  mode: "extract" | "transform" | "seat",
) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: mill, mode },
  };
}

function gateMode(issuer: string, gate: string, mode: "hold" | "ease" | "release") {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: gate, mode },
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

function easeExtractSeat(
  session: ReturnType<typeof createSession>,
  actor: string,
  gate: string,
  mill: string,
) {
  session.submit(assimilate(actor, gate));
  session.submit(assimilate(actor, mill));
  expect(session.submit(gateMode(actor, gate, "ease")).status).toBe("accepted");
  expect(session.submit(millMode(actor, mill, "extract")).status).toBe(
    "accepted",
  );
  expect(session.submit(millMode(actor, mill, "seat")).status).toBe("accepted");
}

function enterHoldTransform(
  session: ReturnType<typeof createSession>,
  actor: string,
  gate: string,
  mill: string,
) {
  session.submit(assimilate(actor, gate));
  session.submit(assimilate(actor, mill));
  expect(session.submit(gateMode(actor, gate, "hold")).status).toBe("accepted");
  expect(session.submit(millMode(actor, mill, "transform")).status).toBe(
    "accepted",
  );
}

describe("Dynasty two opportunities, one World", () => {
  test("each Gate × Mill can independently ease-extract-seat", () => {
    const session = createSession(twoOpportunityFixture());
    expect(session.observe("actor-1").at).toBe("place-b");
    expect(session.submit(travel("actor-1", "place-a")).status).toBe("accepted");
    easeExtractSeat(session, "actor-1", "site-gate-a", "site-mill-a");
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill-a"]).toBe(
      "seated",
    );
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill-c"]).toBe(
      "deposit",
    );

    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    easeExtractSeat(session, "actor-1", "site-gate-c", "site-mill-c");
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill-c"]).toBe(
      "seated",
    );
    expect(session.inspectCanonicalForTests().control["site-mill-a"]).toBeNull();
  });

  test("A's first mill choice leaves B the other mill; reversing changes the World", () => {
    const aFirst = createSession(twoOpportunityFixture());
    aFirst.submit(travel("actor-1", "place-a"));
    easeExtractSeat(aFirst, "actor-1", "site-gate-a", "site-mill-a");
    aFirst.submit(travel("actor-2", "place-c"));
    enterHoldTransform(aFirst, "actor-2", "site-gate-c", "site-mill-c");

    const cFirst = createSession(twoOpportunityFixture());
    cFirst.submit(travel("actor-1", "place-c"));
    easeExtractSeat(cFirst, "actor-1", "site-gate-c", "site-mill-c");
    cFirst.submit(travel("actor-2", "place-a"));
    enterHoldTransform(cFirst, "actor-2", "site-gate-a", "site-mill-a");

    expect(aFirst.inspectCanonicalForTests().siteAggregate["site-mill-a"]).toBe(
      "seated",
    );
    expect(aFirst.inspectCanonicalForTests().siteAggregate["site-mill-c"]).toBe(
      "transformed",
    );
    expect(cFirst.inspectCanonicalForTests().siteAggregate["site-mill-a"]).toBe(
      "transformed",
    );
    expect(cFirst.inspectCanonicalForTests().siteAggregate["site-mill-c"]).toBe(
      "seated",
    );
    expect(aFirst.inspectCanonicalForTests()).not.toEqual(
      cFirst.inspectCanonicalForTests(),
    );
  });

  test("the choice is geography and World state, not a choice object", () => {
    const session = createSession(twoOpportunityFixture());
    const truth = session.inspectCanonicalForTests();
    expect(truth).not.toHaveProperty("objectives");
    expect(truth).not.toHaveProperty("actionPoints");
    expect(JSON.stringify(truth)).not.toMatch(
      /"quest"|"DLP"|"DYN"|"score"|"choiceMenu"/,
    );
    expect(session.observe("actor-1").at).toBe("place-b");
    expect(session.observe("actor-1").siteIdsHere).toEqual([]);
    expect(session.submit(travel("actor-1", "place-a")).status).toBe("accepted");
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("rejected");
  });
});
