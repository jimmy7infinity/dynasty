import { describe, expect, test } from "vitest";
import { createSession, playableWorldFixture } from "./session.js";

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

function bringErectorToMill(session: ReturnType<typeof createSession>) {
  session.submit(travelToA("actor-2"));
  session.submit(assimilateMill("actor-2"));
}

describe("Dynasty playable World situation — solo transform vs extract-for-Erect", () => {
  test("initial World: two Places, one mill deposit, vacant control", () => {
    const session = createSession(playableWorldFixture());
    const truth = session.inspectCanonicalForTests();
    expect(truth.placeIds).toEqual(["place-a", "place-b"]);
    expect(truth.connects).toEqual([["place-a", "place-b"]]);
    expect(truth.siteAt["site-mill"]).toBe("place-a");
    expect(truth.siteAggregate["site-mill"]).toBe("deposit");
    expect(truth.depositRemaining["site-mill"]).toBe(1);
    expect(truth.presentAt["actor-1"]).toBe("place-a");
    expect(truth.presentAt["actor-2"]).toBe("place-b");
    expect(truth.control["site-mill"]).toBeNull();
  });

  test("capabilities are asymmetric", () => {
    const session = createSession(playableWorldFixture());
    expect(session.observe("actor-1").capabilities).toEqual([
      "Extract",
      "Transform",
    ]);
    expect(session.observe("actor-2").capabilities).toEqual(["Erect"]);
  });

  test("knowledge is asymmetric until the erector is present", () => {
    const session = createSession(playableWorldFixture());
    expect(session.observe("actor-1").siteIdsHere).toContain("site-mill");
    expect(session.observe("actor-2").siteIdsHere).not.toContain("site-mill");
    session.submit(assimilateMill("actor-1"));
    expect(session.submit(assimilateMill("actor-2")).status).toBe("rejected");
    expect(session.observe("actor-1").knowledgeOf).toEqual(["site-mill"]);
    expect(session.observe("actor-2").knowledgeOf).toEqual([]);
    expect(session.inspectCanonicalForTests().control["site-mill"]).toBeNull();
  });

  test("after knowing the mill, extract and transform are both legal", () => {
    const extractPath = createSession(playableWorldFixture());
    const transformPath = createSession(playableWorldFixture());
    extractPath.submit(assimilateMill("actor-1"));
    transformPath.submit(assimilateMill("actor-1"));
    expect(extractPath.submit(extractMill("actor-1")).status).toBe("accepted");
    expect(transformPath.submit(transformMill("actor-1")).status).toBe(
      "accepted",
    );
  });

  test("transform produces a processed mill and makes Erect useless", () => {
    const session = createSession(playableWorldFixture());
    session.submit(assimilateMill("actor-1"));
    const result = session.submit(transformMill("actor-1"));
    expect(result.status).toBe("accepted");
    expect(result.home).toBe("World");
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "transformed",
    );

    bringErectorToMill(session);
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(seatMill("actor-2")).status).toBe("rejected");
    expect(session.submit(extractMill("actor-2")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "transformed",
    );
  });

  test("extract produces material that makes Erect useful", () => {
    const session = createSession(playableWorldFixture());
    session.submit(assimilateMill("actor-1"));
    const extractResult = session.submit(extractMill("actor-1"));
    expect(extractResult.status).toBe("accepted");
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "extracted",
    );
    expect(session.submit(transformMill("actor-1")).status).toBe("rejected");

    bringErectorToMill(session);
    const seatResult = session.submit(seatMill("actor-2"));
    expect(seatResult.status).toBe("accepted");
    expect(seatResult.home).toBe("World");
    if (seatResult.status !== "accepted") {
      return;
    }
    expect(seatResult.occurrenceIds.length).toBe(1);
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "seated",
    );
  });

  test("the two branches leave distinguishable Worlds", () => {
    const transformed = createSession(playableWorldFixture());
    const seated = createSession(playableWorldFixture());
    transformed.submit(assimilateMill("actor-1"));
    seated.submit(assimilateMill("actor-1"));
    transformed.submit(transformMill("actor-1"));
    seated.submit(extractMill("actor-1"));
    bringErectorToMill(seated);
    seated.submit(seatMill("actor-2"));
    bringErectorToMill(transformed);

    expect(transformed.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "transformed",
    );
    expect(seated.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "seated",
    );
    expect(transformed.inspectCanonicalForTests()).not.toEqual(
      seated.inspectCanonicalForTests(),
    );
    expect(transformed.observe("actor-2").siteAggregateHere["site-mill"]).toBe(
      "transformed",
    );
    expect(seated.observe("actor-2").siteAggregateHere["site-mill"]).toBe(
      "seated",
    );
  });

  test("Erect is valuable only on the extract branch", () => {
    const transformPath = createSession(playableWorldFixture());
    const extractPath = createSession(playableWorldFixture());
    transformPath.submit(assimilateMill("actor-1"));
    extractPath.submit(assimilateMill("actor-1"));
    transformPath.submit(transformMill("actor-1"));
    extractPath.submit(extractMill("actor-1"));
    bringErectorToMill(transformPath);
    bringErectorToMill(extractPath);

    expect(transformPath.submit(seatMill("actor-2")).status).toBe("rejected");
    expect(extractPath.submit(seatMill("actor-2")).status).toBe("accepted");
    expect(transformPath.observe("actor-2").capabilities).toEqual(["Erect"]);
    expect(extractPath.observe("actor-2").capabilities).toEqual(["Erect"]);
  });

  test("the fork manufactures no DLP, DYN, score, or reward", () => {
    const session = createSession(playableWorldFixture());
    session.submit(assimilateMill("actor-1"));
    session.submit(extractMill("actor-1"));
    bringErectorToMill(session);
    session.submit(seatMill("actor-2"));
    const truth = session.inspectCanonicalForTests();
    const payload = JSON.stringify({
      truth,
      a: session.observe("actor-1"),
      b: session.observe("actor-2"),
    });
    expect(truth).not.toHaveProperty("dlp");
    expect(payload).not.toMatch(
      /"price"|"DLP"|"DYN"|"score"|"reward"|"xp"|"quest"/,
    );
  });
});
