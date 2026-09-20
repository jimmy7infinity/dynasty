import { describe, expect, test } from "vitest";
import { createSession, minimalWorldFixture } from "./session.js";

function extractMill(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: "site-mill", mode: "extract" },
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

describe("Dynasty capability → ChangeAggregate extract", () => {
  test("capability is actor-bound", () => {
    const session = createSession(minimalWorldFixture());
    expect(session.observe("actor-1").capabilities).toEqual([
      "Extract",
      "Transform",
    ]);
    expect(session.observe("actor-2").capabilities).toEqual([]);
  });

  test("actor without Extract cannot successfully extract", () => {
    const session = createSession(minimalWorldFixture());
    session.submit(assimilateMill("actor-1"));
    const result = session.submit(extractMill("actor-2"));
    expect(result.status).toBe("rejected");
    expect(session.inspectCanonicalForTests().depositRemaining["site-mill"]).toBe(
      1,
    );
  });

  test("capability does not grant control", () => {
    const session = createSession(minimalWorldFixture());
    expect(session.observe("actor-1").capabilities).toEqual([
      "Extract",
      "Transform",
    ]);
    expect(session.inspectCanonicalForTests().control["site-mill"]).toBeNull();
  });

  test("knowledge does not grant control", () => {
    const session = createSession(minimalWorldFixture());
    session.submit(assimilateMill("actor-1"));
    expect(session.observe("actor-1").knowledgeOf).toEqual(["site-mill"]);
    expect(session.inspectCanonicalForTests().control["site-mill"]).toBeNull();
  });

  test("a valid extract Intent routes to World only", () => {
    const session = createSession(minimalWorldFixture());
    session.submit(assimilateMill("actor-1"));
    const result = session.submit(extractMill("actor-1"));
    expect(result.status).toBe("accepted");
    expect(result.home).toBe("World");
    expect(result.kind).toBe("ChangeAggregate");
  });

  test("extract without knowledge is rejected and does not mutate World", () => {
    const session = createSession(minimalWorldFixture());
    const before = structuredClone(session.inspectCanonicalForTests());
    const result = session.submit(extractMill("actor-1"));
    expect(result.status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("accepted extract depletes the Site deposit", () => {
    const session = createSession(minimalWorldFixture());
    session.submit(assimilateMill("actor-1"));
    const result = session.submit(extractMill("actor-1"));
    expect(result.status).toBe("accepted");
    expect(session.inspectCanonicalForTests().depositRemaining["site-mill"]).toBe(
      0,
    );
    expect(session.inspectCanonicalForTests().control["site-mill"]).toBeNull();
    expect(session.inspectCanonicalForTests().presentAt["actor-1"]).toBe(
      "place-a",
    );
  });

  test("accepted extract produces a Result and Occurrence", () => {
    const session = createSession(minimalWorldFixture());
    session.submit(assimilateMill("actor-1"));
    const result = session.submit(extractMill("actor-1"));
    expect(result.status).toBe("accepted");
    if (result.status !== "accepted") {
      return;
    }
    expect(result.occurrenceIds.length).toBe(1);
    expect(session.inspectCanonicalForTests().occurrenceKinds).toContain(
      "DepositChanged",
    );
  });

  test("subsequent observation sees the changed deposit", () => {
    const session = createSession(minimalWorldFixture());
    expect(session.observe("actor-1").depositRemainingHere["site-mill"]).toBe(1);
    session.submit(assimilateMill("actor-1"));
    session.submit(extractMill("actor-1"));
    const observation = session.observe("actor-1");
    expect(observation.depositRemainingHere["site-mill"]).toBe(0);
    expect(observation.occurrences.map((item) => item.kind)).toContain(
      "DepositChanged",
    );
  });

  test("extract does not create DLP, DYN, or a price", () => {
    const session = createSession(minimalWorldFixture());
    session.submit(assimilateMill("actor-1"));
    session.submit(extractMill("actor-1"));
    const truth = session.inspectCanonicalForTests();
    const observation = session.observe("actor-1");
    expect(truth).not.toHaveProperty("dlp");
    expect(truth).not.toHaveProperty("dyn");
    expect(observation).not.toHaveProperty("dlp");
    expect(JSON.stringify({ truth, observation })).not.toMatch(
      /"price"|"DLP"|"DYN"/,
    );
  });
});
