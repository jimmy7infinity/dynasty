import { describe, expect, test } from "vitest";
import { createSession, contestedMillFixture } from "./session.js";

function assimilate(issuer: string, subject: string) {
  return {
    issuer,
    home: "Information" as const,
    kind: "Assimilate" as const,
    subjects: { subject },
  };
}

function millMode(issuer: string, mode: "extract" | "transform" | "seat") {
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

function travel(issuer: string, destination: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangePresence" as const,
    subjects: { destination },
  };
}

function prepareActor1(session: ReturnType<typeof createSession>) {
  session.submit(assimilate("actor-1", "site-gate"));
  session.submit(assimilate("actor-1", "site-mill"));
}

describe("Dynasty contested mill — extracted preserves seat, transformed does not", () => {
  test("PRESERVE: A eases, extracts, and seats on one World", () => {
    const session = createSession(contestedMillFixture());
    prepareActor1(session);
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "open",
    );

    const ease = session.submit(gateMode("actor-1", "ease"));
    expect(ease.status).toBe("accepted");
    const extract = session.submit(millMode("actor-1", "extract"));
    expect(extract.status).toBe("accepted");
    if (extract.status !== "accepted") {
      return;
    }
    expect(extract.occurrenceIds.length).toBe(1);
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "extracted",
    );

    const seat = session.submit(millMode("actor-1", "seat"));
    expect(seat.status).toBe("accepted");
    if (seat.status !== "accepted") {
      return;
    }
    expect(seat.occurrenceIds.length).toBe(1);
    const truth = session.inspectCanonicalForTests();
    expect(truth.gateState["site-gate"]).toBe("eased");
    expect(truth.siteAggregate["site-mill"]).toBe("seated");
    expect(truth.occurrenceKinds).toContain("SiteSeated");
    expect(truth.control["site-mill"]).toBeNull();
    expect(JSON.stringify(truth)).not.toMatch(/"DLP"|"DYN"|"price"/);
  });

  test("FORECLOSE: B enters, reaches held, transforms; A's seat is gone", () => {
    const session = createSession(contestedMillFixture());
    prepareActor1(session);
    session.submit(gateMode("actor-1", "ease"));
    expect(session.submit(travel("actor-2", "place-a")).status).toBe("accepted");
    session.submit(assimilate("actor-2", "site-gate"));
    session.submit(assimilate("actor-2", "site-mill"));

    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "scarred",
    );
    const transformWhileScarred = session.submit(
      millMode("actor-2", "transform"),
    );
    expect(transformWhileScarred.status).toBe("rejected");

    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "held",
    );
    const transform = session.submit(millMode("actor-2", "transform"));
    expect(transform.status).toBe("accepted");
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "transformed",
    );

    const beforeSeat = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(millMode("actor-1", "seat")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(beforeSeat);
  });

  test("PRESERVE BUT LOSE ACCESS: extracted mill, A is cut off by held gate", () => {
    const session = createSession(contestedMillFixture());
    prepareActor1(session);
    session.submit(gateMode("actor-1", "ease"));
    session.submit(millMode("actor-1", "extract"));
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "extracted",
    );

    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    expect(session.submit(travel("actor-2", "place-a")).status).toBe("accepted");
    session.submit(assimilate("actor-2", "site-gate"));

    session.submit(gateMode("actor-2", "hold"));
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "scarred",
    );
    session.submit(gateMode("actor-2", "hold"));
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "held",
    );

    const beforeReturn = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(travel("actor-1", "place-a")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(beforeReturn);
    expect(session.inspectCanonicalForTests().presentAt["actor-1"]).toBe(
      "place-b",
    );
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "extracted",
    );
    expect(session.inspectCanonicalForTests().gateState["site-gate"]).toBe(
      "held",
    );

    const seatFromB = session.submit(millMode("actor-1", "seat"));
    expect(seatFromB.status).toBe("rejected");
    expect(session.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "extracted",
    );
  });
});
