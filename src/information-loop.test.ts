import { describe, expect, test } from "vitest";
import { createSession, minimalWorldFixture } from "./session.js";

describe("Dynasty Information / Intel", () => {
  test("actor 1 can acquire an Intel record about a World Site", () => {
    const session = createSession(minimalWorldFixture());
    const before = session.observe("actor-1");
    expect(before.knowledgeOf).toEqual([]);
    expect(before.siteIdsHere).toContain("site-mill");

    const result = session.submit({
      issuer: "actor-1",
      home: "Information",
      kind: "Assimilate",
      subjects: { subject: "site-mill" },
    });
    expect(result.status).toBe("accepted");
    expect(result.home).toBe("Information");

    const after = session.observe("actor-1");
    expect(after.knowledgeOf).toEqual(["site-mill"]);
    expect(after.heldIntelIds.length).toBe(1);
  });

  test("actor 2 does not automatically receive actor 1's private record", () => {
    const session = createSession(minimalWorldFixture());
    session.submit({
      issuer: "actor-1",
      home: "Information",
      kind: "Assimilate",
      subjects: { subject: "site-mill" },
    });
    expect(session.observe("actor-1").knowledgeOf).toEqual(["site-mill"]);
    expect(session.observe("actor-2").knowledgeOf).toEqual([]);
    expect(session.observe("actor-2").heldIntelIds).toEqual([]);
  });

  test("information refers to a World object without becoming that object", () => {
    const session = createSession(minimalWorldFixture());
    session.submit({
      issuer: "actor-1",
      home: "Information",
      kind: "Assimilate",
      subjects: { subject: "site-mill" },
    });
    const observation = session.observe("actor-1");
    expect(observation.heldIntelIds).not.toContain("site-mill");
    expect(observation.knowledgeOf).toEqual(["site-mill"]);
    expect(session.inspectCanonicalForTests().siteAt["site-mill"]).toBe(
      "place-a",
    );
  });

  test("Information does not mutate canonical World state", () => {
    const session = createSession(minimalWorldFixture());
    const before = structuredClone(session.inspectCanonicalForTests());
    session.submit({
      issuer: "actor-1",
      home: "Information",
      kind: "Assimilate",
      subjects: { subject: "site-mill" },
    });
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("Information does not create control, access, or presence", () => {
    const session = createSession(minimalWorldFixture());
    session.submit({
      issuer: "actor-1",
      home: "Information",
      kind: "Assimilate",
      subjects: { subject: "site-mill" },
    });
    const truth = session.inspectCanonicalForTests();
    expect(truth.control["site-mill"]).toBeNull();
    expect(truth.access["actor-1"]).not.toContain("site-mill");
    expect(truth.presentAt["actor-1"]).toBe("place-a");
  });

  test("observation differs because of knowledge state", () => {
    const session = createSession(minimalWorldFixture());
    const actor1Before = session.observe("actor-1");
    const actor2Before = session.observe("actor-2");
    expect(actor1Before.knowledgeOf).toEqual([]);
    expect(actor2Before.knowledgeOf).toEqual([]);
    expect(actor1Before.siteIdsHere).toContain("site-mill");
    expect(actor2Before.siteIdsHere).not.toContain("site-mill");

    session.submit({
      issuer: "actor-1",
      home: "Information",
      kind: "Assimilate",
      subjects: { subject: "site-mill" },
    });

    const actor1After = session.observe("actor-1");
    const actor2After = session.observe("actor-2");
    expect(actor1After.knowledgeOf).toEqual(["site-mill"]);
    expect(actor2After.knowledgeOf).toEqual([]);
    expect(actor1After.siteIdsHere).toEqual(actor1Before.siteIdsHere);
  });

  test("information records remain issuer-scoped", () => {
    const session = createSession(minimalWorldFixture());
    session.submit({
      issuer: "actor-1",
      home: "Information",
      kind: "Assimilate",
      subjects: { subject: "site-mill" },
    });
    const observation = session.observe("actor-1");
    expect(Object.isFrozen(observation)).toBe(true);
    expect(observation.occurrences.map((item) => item.kind)).toContain(
      "Discovered",
    );
    expect(observation.occurrences[0]?.source).toBe("Information");
    expect(session.observe("actor-2").occurrences).toEqual([]);
  });

  test("a World Intent cannot mutate Information state", () => {
    const session = createSession(minimalWorldFixture());
    session.submit({
      issuer: "actor-1",
      home: "World",
      kind: "ChangePresence",
      subjects: { destination: "place-b" },
    });
    expect(session.observe("actor-1").knowledgeOf).toEqual([]);
    expect(session.observe("actor-1").heldIntelIds).toEqual([]);
  });

  test("Assimilate addressed to World is rejected without Information writes", () => {
    const session = createSession(minimalWorldFixture());
    const result = session.submit({
      issuer: "actor-1",
      home: "World",
      kind: "Assimilate",
      subjects: { subject: "site-mill" },
    });
    expect(result.status).toBe("rejected");
    expect(session.observe("actor-1").knowledgeOf).toEqual([]);
    expect(session.inspectCanonicalForTests().presentAt["actor-1"]).toBe(
      "place-a",
    );
  });
});
