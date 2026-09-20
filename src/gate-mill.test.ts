import { describe, expect, test } from "vitest";
import { createSession, gateMillFixture } from "./session.js";

function assimilate(issuer: string, subject: string) {
  return {
    issuer,
    home: "Information" as const,
    kind: "Assimilate" as const,
    subjects: { subject },
  };
}

function millMode(issuer: string, mode: "extract" | "transform") {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: "site-mill", mode },
  };
}

function gateMode(issuer: string, mode: "hold" | "ease" | "release") {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: "site-gate", mode },
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

describe("Dynasty gate × mill", () => {
  test("open gate rejects both mill operations", () => {
    const session = createSession(gateMillFixture());
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "open",
    );
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "deposit",
    );
    session.submit(assimilate("actor-1", "site-gate"));
    session.submit(assimilate("actor-1", "site-mill"));
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(millMode("actor-1", "extract")).status).toBe(
      "rejected",
    );
    expect(session.submit(millMode("actor-1", "transform")).status).toBe(
      "rejected",
    );
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("eased permits extract and rejects transform", () => {
    const session = createSession(gateMillFixture());
    session.submit(assimilate("actor-1", "site-gate"));
    session.submit(assimilate("actor-1", "site-mill"));
    expect(session.submit(gateMode("actor-1", "ease")).status).toBe("accepted");
    const transformBefore = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(millMode("actor-1", "transform")).status).toBe(
      "rejected",
    );
    expect(session.inspectCanonicalForTests()).toEqual(transformBefore);
    const extract = session.submit(millMode("actor-1", "extract"));
    expect(extract.status).toBe("accepted");
    if (extract.status !== "accepted") {
      return;
    }
    expect(extract.occurrenceIds.length).toBe(1);
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "extracted",
    );
    expect(session.inspectCanonicalForTests().occurrenceKinds).toContain(
      "DepositChanged",
    );
  });

  test("held permits transform, rejects extract, and still blocks B→A", () => {
    const session = createSession(gateMillFixture());
    session.submit(assimilate("actor-1", "site-gate"));
    session.submit(assimilate("actor-1", "site-mill"));
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    expect(session.submit(millMode("actor-1", "extract")).status).toBe(
      "rejected",
    );
    expect(session.submit(travelToA("actor-2")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests().presentAt["actor-2"]).toBe(
      "place-b",
    );
    expect(session.submit(gateMode("actor-1", "release")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "open",
    );
    expect(session.submit(millMode("actor-1", "extract")).status).toBe(
      "rejected",
    );
    expect(session.submit(millMode("actor-1", "transform")).status).toBe(
      "rejected",
    );
    expect(session.submit(travelToA("actor-2")).status).toBe("accepted");
    session.submit(assimilate("actor-2", "site-gate"));
    session.submit(assimilate("actor-2", "site-mill"));
    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("accepted");
    const transform = session.submit(millMode("actor-2", "transform"));
    expect(transform.status).toBe("accepted");
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "transformed",
    );
  });

  test("release then ease restores extract; scarred permits extract not transform", () => {
    const session = createSession(gateMillFixture());
    session.submit(assimilate("actor-1", "site-gate"));
    session.submit(assimilate("actor-1", "site-mill"));
    session.submit(gateMode("actor-1", "hold"));
    session.submit(gateMode("actor-1", "release"));
    session.submit(gateMode("actor-1", "ease"));
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "eased",
    );
    expect(session.submit(millMode("actor-1", "extract")).status).toBe(
      "accepted",
    );
  });

  test("scarred mill: extract legal, transform rejected, ease dead", () => {
    const session = createSession(gateMillFixture());
    session.submit(assimilate("actor-1", "site-gate"));
    session.submit(assimilate("actor-1", "site-mill"));
    session.submit(gateMode("actor-1", "ease"));
    session.submit(gateMode("actor-1", "hold"));
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "scarred",
    );
    expect(session.submit(gateMode("actor-1", "ease")).status).toBe("rejected");
    expect(session.submit(millMode("actor-1", "transform")).status).toBe(
      "rejected",
    );
    expect(session.submit(millMode("actor-1", "extract")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "extracted",
    );
  });

  test("two-actor fork: ease-extract vs hold-then-B-transform", () => {
    const extractPath = createSession(gateMillFixture());
    extractPath.submit(assimilate("actor-1", "site-gate"));
    extractPath.submit(assimilate("actor-1", "site-mill"));
    extractPath.submit(gateMode("actor-1", "ease"));
    extractPath.submit(millMode("actor-1", "extract"));
    extractPath.submit(gateMode("actor-1", "release"));
    extractPath.submit(travelToA("actor-2"));
    expect(extractPath.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "extracted",
    );
    expect(extractPath.inspectCanonicalForTests().presentAt["actor-2"]).toBe(
      "place-a",
    );

    const transformPath = createSession(gateMillFixture());
    transformPath.submit(assimilate("actor-1", "site-gate"));
    transformPath.submit(assimilate("actor-1", "site-mill"));
    transformPath.submit(gateMode("actor-1", "hold"));
    expect(transformPath.submit(travelToA("actor-2")).status).toBe("rejected");
    expect(transformPath.submit(millMode("actor-1", "extract")).status).toBe(
      "rejected",
    );
    transformPath.submit(gateMode("actor-1", "release"));
    transformPath.submit(travelToA("actor-2"));
    transformPath.submit(assimilate("actor-2", "site-gate"));
    transformPath.submit(assimilate("actor-2", "site-mill"));
    transformPath.submit(gateMode("actor-2", "hold"));
    transformPath.submit(millMode("actor-2", "transform"));
    expect(
      transformPath.inspectCanonicalForTests().siteAggregate["site-mill"],
    ).toBe("transformed");
    expect(extractPath.inspectCanonicalForTests()).not.toEqual(
      transformPath.inspectCanonicalForTests(),
    );
    expect(extractPath.inspectCanonicalForTests().control["site-mill"]).toBeNull();
    expect(transformPath.inspectCanonicalForTests().control["site-gate"]).toBeNull();
  });

  test("coupling manufactures no DLP, DYN, or price", () => {
    const session = createSession(gateMillFixture());
    session.submit(assimilate("actor-1", "site-gate"));
    session.submit(assimilate("actor-1", "site-mill"));
    session.submit(gateMode("actor-1", "ease"));
    session.submit(millMode("actor-1", "extract"));
    const payload = JSON.stringify({
      truth: session.inspectCanonicalForTests(),
      a: session.observe("actor-1"),
    });
    expect(payload).not.toMatch(/"price"|"DLP"|"DYN"|"score"/);
  });
});
