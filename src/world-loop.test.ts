import { describe, expect, test } from "vitest";
import { createSession, minimalWorldFixture } from "./session.js";
import type { Intent } from "./kernel.js";

describe("Dynasty world + Intent loop", () => {
  test("instantiates a World with Places, a Site, and Actors", () => {
    const session = createSession(minimalWorldFixture());
    const truth = session.inspectCanonicalForTests();
    expect(truth.placeIds).toEqual(["place-a", "place-b"]);
    expect(truth.siteAt).toEqual({ "site-mill": "place-a" });
    expect(truth.actorIds).toEqual(["actor-1", "actor-2"]);
  });

  test("presence is independent from access", () => {
    const session = createSession(minimalWorldFixture());
    const truth = session.inspectCanonicalForTests();
    expect(truth.presentAt["actor-1"]).toBe("place-a");
    expect(truth.access["actor-1"] ?? []).not.toContain("site-mill");
  });

  test("control is independent from presence and access", () => {
    const session = createSession(minimalWorldFixture());
    const truth = session.inspectCanonicalForTests();
    expect(truth.presentAt["actor-1"]).toBe("place-a");
    expect(truth.control["site-mill"]).toBeNull();
    expect(truth.access["actor-1"] ?? []).not.toContain("site-mill");
  });

  test("issuer-scoped observation is not a mutable canonical World object", () => {
    const session = createSession(minimalWorldFixture());
    const observation = session.observe("actor-1");
    expect(Object.isFrozen(observation)).toBe(true);
    expect(observation.issuerId).toBe("actor-1");
    expect(observation.at).toBe("place-a");
    expect(observation.presentHere).toEqual(["actor-1"]);
    expect(observation.presentHere).not.toContain("actor-2");
    const asMutable = observation as { at?: string };
    expect(() => {
      asMutable.at = "place-b";
    }).toThrow();
    expect(session.inspectCanonicalForTests().presentAt["actor-1"]).toBe("place-a");
    expect(session.inspectCanonicalForTests()).not.toBe(observation);
  });

  test("a valid Intent routes to exactly one owning Domain", () => {
    const session = createSession(minimalWorldFixture());
    const result = session.submit({
      issuer: "actor-1",
      home: "World",
      kind: "ChangePresence",
      subjects: { destination: "place-b" },
    });
    expect(result.home).toBe("World");
    expect(result.status).toBe("accepted");
    expect(result.kind).toBe("ChangePresence");
  });

  test("the owning Domain can reject an Intent", () => {
    const session = createSession(minimalWorldFixture());
    const result = session.submit({
      issuer: "actor-1",
      home: "World",
      kind: "ChangePresence",
      subjects: { destination: "place-a" },
    });
    expect(result.status).toBe("rejected");
    expect(result.home).toBe("World");
  });

  test("rejected Intent does not mutate canonical World state", () => {
    const session = createSession(minimalWorldFixture());
    const before = structuredClone(session.inspectCanonicalForTests());
    session.submit({
      issuer: "actor-1",
      home: "World",
      kind: "ChangePresence",
      subjects: { destination: "place-a" },
    });
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("accepted Intent mutates the correct canonical World state", () => {
    const session = createSession(minimalWorldFixture());
    const result = session.submit({
      issuer: "actor-1",
      home: "World",
      kind: "ChangePresence",
      subjects: { destination: "place-b" },
    });
    expect(result.status).toBe("accepted");
    const truth = session.inspectCanonicalForTests();
    expect(truth.presentAt["actor-1"]).toBe("place-b");
    expect(truth.presentAt["actor-2"]).toBe("place-b");
    expect(truth.control["site-mill"]).toBeNull();
  });

  test("accepted consequential Intent produces an Occurrence", () => {
    const session = createSession(minimalWorldFixture());
    const result = session.submit({
      issuer: "actor-1",
      home: "World",
      kind: "ChangePresence",
      subjects: { destination: "place-b" },
    });
    expect(result.status).toBe("accepted");
    if (result.status !== "accepted") {
      return;
    }
    expect(result.occurrenceIds.length).toBe(1);
    expect(session.inspectCanonicalForTests().occurrenceKinds).toEqual([
      "PresenceChanged",
    ]);
  });

  test("the Occurrence is observable afterward", () => {
    const session = createSession(minimalWorldFixture());
    session.submit({
      issuer: "actor-1",
      home: "World",
      kind: "ChangePresence",
      subjects: { destination: "place-b" },
    });
    const observation = session.observe("actor-1");
    expect(observation.occurrences.map((item) => item.kind)).toEqual([
      "PresenceChanged",
    ]);
    expect(observation.occurrences[0]?.source).toBe("World");
  });

  test("public session API has no direct World mutation surface", () => {
    const session = createSession(minimalWorldFixture());
    expect(Object.getOwnPropertyNames(session).sort()).toEqual(
      ["inspectCanonicalForTests", "observe", "submit"].sort(),
    );
    expect("world" in session).toBe(false);
  });

  test("an Intent cannot silently write to two domains", () => {
    const session = createSession(minimalWorldFixture());
    const twoHomes = {
      issuer: "actor-1",
      home: "World",
      kind: "ChangePresence",
      subjects: { destination: "place-b" },
      extraHome: "Information",
    } as Intent & { extraHome: string };
    const result = session.submit(twoHomes);
    expect(result.home).toBe("World");
    expect(result.status).toBe("accepted");
    expect(session.inspectCanonicalForTests().occurrenceSources).toEqual([
      "World",
    ]);
  });

  test("an Information Intent does not mutate World state", () => {
    const session = createSession(minimalWorldFixture());
    const before = structuredClone(session.inspectCanonicalForTests());
    const result = session.submit({
      issuer: "actor-1",
      home: "Information",
      kind: "Assimilate",
      subjects: { subject: "site-mill" },
    });
    expect(result.status).toBe("accepted");
    expect(result.home).toBe("Information");
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });
});
