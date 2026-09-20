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

function transformMill(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: "site-mill", mode: "transform" },
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

describe("Dynasty first strategic choice — extract vs transform", () => {
  test("the World initially permits two legitimate ChangeAggregate modes", () => {
    const extractSession = createSession(minimalWorldFixture());
    const transformSession = createSession(minimalWorldFixture());
    extractSession.submit(assimilateMill("actor-1"));
    transformSession.submit(assimilateMill("actor-1"));

    const extractTruth = extractSession.inspectCanonicalForTests();
    const transformTruth = transformSession.inspectCanonicalForTests();
    expect(extractTruth.depositRemaining["site-mill"]).toBe(1);
    expect(extractTruth.siteAggregate["site-mill"]).toBe("deposit");
    expect(transformTruth.siteAggregate["site-mill"]).toBe("deposit");
    expect(extractSession.observe("actor-1").capabilities).toEqual([
      "Extract",
      "Transform",
    ]);

    const extractResult = extractSession.submit(extractMill("actor-1"));
    const transformResult = transformSession.submit(transformMill("actor-1"));
    expect(extractResult.status).toBe("accepted");
    expect(transformResult.status).toBe("accepted");
    expect(extractResult.kind).toBe("ChangeAggregate");
    expect(transformResult.kind).toBe("ChangeAggregate");
    expect(extractResult.home).toBe("World");
    expect(transformResult.home).toBe("World");
  });

  test("choosing extract changes World and makes transform ineligible", () => {
    const session = createSession(minimalWorldFixture());
    session.submit(assimilateMill("actor-1"));
    const extractResult = session.submit(extractMill("actor-1"));
    expect(extractResult.status).toBe("accepted");
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "extracted",
    );
    expect(session.inspectCanonicalForTests().depositRemaining["site-mill"]).toBe(
      0,
    );

    const before = structuredClone(session.inspectCanonicalForTests());
    const transformResult = session.submit(transformMill("actor-1"));
    expect(transformResult.status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("choosing transform changes World and makes extract ineligible", () => {
    const session = createSession(minimalWorldFixture());
    session.submit(assimilateMill("actor-1"));
    const transformResult = session.submit(transformMill("actor-1"));
    expect(transformResult.status).toBe("accepted");
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "transformed",
    );
    expect(session.inspectCanonicalForTests().depositRemaining["site-mill"]).toBe(
      0,
    );

    const before = structuredClone(session.inspectCanonicalForTests());
    const extractResult = session.submit(extractMill("actor-1"));
    expect(extractResult.status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("the two paths produce distinguishable World outcomes", () => {
    const extracted = createSession(minimalWorldFixture());
    const transformed = createSession(minimalWorldFixture());
    extracted.submit(assimilateMill("actor-1"));
    transformed.submit(assimilateMill("actor-1"));
    extracted.submit(extractMill("actor-1"));
    transformed.submit(transformMill("actor-1"));

    expect(extracted.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "extracted",
    );
    expect(
      transformed.inspectCanonicalForTests().siteAggregate["site-mill"],
    ).toBe("transformed");
    expect(extracted.inspectCanonicalForTests()).not.toEqual(
      transformed.inspectCanonicalForTests(),
    );
  });

  test("accepted transform produces a Result and Occurrence", () => {
    const session = createSession(minimalWorldFixture());
    session.submit(assimilateMill("actor-1"));
    const result = session.submit(transformMill("actor-1"));
    expect(result.status).toBe("accepted");
    if (result.status !== "accepted") {
      return;
    }
    expect(result.kind).toBe("ChangeAggregate");
    expect(result.occurrenceIds.length).toBe(1);
    expect(session.inspectCanonicalForTests().occurrenceKinds).toContain(
      "AggregateChanged",
    );
  });

  test("subsequent observation sees the chosen aggregate", () => {
    const session = createSession(minimalWorldFixture());
    expect(session.observe("actor-1").siteAggregateHere["site-mill"]).toBe(
      "deposit",
    );
    session.submit(assimilateMill("actor-1"));
    session.submit(transformMill("actor-1"));
    const observation = session.observe("actor-1");
    expect(observation.siteAggregateHere["site-mill"]).toBe("transformed");
    expect(observation.depositRemainingHere["site-mill"]).toBe(0);
    expect(observation.occurrences.map((item) => item.kind)).toContain(
      "AggregateChanged",
    );
  });

  test("the strategic difference does not depend on DLP, DYN, price, or XP", () => {
    const extracted = createSession(minimalWorldFixture());
    const transformed = createSession(minimalWorldFixture());
    extracted.submit(assimilateMill("actor-1"));
    transformed.submit(assimilateMill("actor-1"));
    extracted.submit(extractMill("actor-1"));
    transformed.submit(transformMill("actor-1"));
    const payload = JSON.stringify({
      extracted: extracted.inspectCanonicalForTests(),
      transformed: transformed.inspectCanonicalForTests(),
      extractedView: extracted.observe("actor-1"),
      transformedView: transformed.observe("actor-1"),
    });
    expect(payload).not.toMatch(/"price"|"DLP"|"DYN"|"xp"|"XP"/);
    expect(extracted.inspectCanonicalForTests()).not.toHaveProperty("dlp");
    expect(transformed.inspectCanonicalForTests()).not.toHaveProperty("dyn");
  });
});
