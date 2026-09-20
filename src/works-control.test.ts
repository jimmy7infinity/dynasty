import { describe, expect, test } from "vitest";
import {
  createSession,
  fedWorksFixture,
  gatedWorksFixture,
  playableWorldFixture,
} from "./session.js";

function assimilate(issuer: string, subject: string) {
  return {
    issuer,
    home: "Information" as const,
    kind: "Assimilate" as const,
    subjects: { subject },
  };
}

function extractVein(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: "site-vein", mode: "extract" },
  };
}

function processWorks(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: "site-works", mode: "process" },
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

function establish(issuer: string, site: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeControl" as const,
    subjects: { site, mode: "establish" },
  };
}

function relinquish(issuer: string, site: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeControl" as const,
    subjects: { site, mode: "relinquish" },
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

function travel(issuer: string, destination: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangePresence" as const,
    subjects: { destination },
  };
}

function feedWorks(session: ReturnType<typeof createSession>) {
  expect(session.submit(assimilate("actor-1", "site-vein")).status).toBe(
    "accepted",
  );
  expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
  const lot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
  expect(session.submit(haulLot("actor-1", lot, "place-works")).status).toBe(
    "accepted",
  );
  return lot;
}

describe("Dynasty Works Control in play", () => {
  test("vacant Works can be Established", () => {
    const session = createSession(fedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    const result = session.submit(establish("actor-2", "site-works"));
    expect(result.status).toBe("accepted");
    expect(session.inspectCanonicalForTests().control["site-works"]).toBe(
      "actor-2",
    );
    expect(session.inspectCanonicalForTests().occurrenceKinds).toContain(
      "ControlChanged",
    );
  });

  test("Establish writes only Works Control", () => {
    const session = createSession(gatedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    const truth = session.inspectCanonicalForTests();
    expect(truth.control["site-works"]).toBe("actor-2");
    expect(truth.control["site-gate"]).toBeNull();
    expect(truth.control["site-vein"]).toBeNull();
  });

  test("Gate Establish leaves Works Control vacant", () => {
    const session = createSession(gatedWorksFixture());
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    const truth = session.inspectCanonicalForTests();
    expect(truth.control["site-gate"]).toBe("actor-1");
    expect(truth.control["site-works"]).toBeNull();
  });

  test("occupied Works rejects Establish by another actor and by the controller", () => {
    const session = createSession(fedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(assimilate("actor-1", "site-works")).status).toBe(
      "accepted",
    );
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(establish("actor-1", "site-works")).status).toBe(
      "rejected",
    );
    expect(session.submit(establish("actor-2", "site-works")).status).toBe(
      "rejected",
    );
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("controller Relinquish clears Works; non-controller and vacant Relinquish reject", () => {
    const session = createSession(fedWorksFixture());
    expect(session.submit(relinquish("actor-2", "site-works")).status).toBe(
      "rejected",
    );
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(relinquish("actor-1", "site-works")).status).toBe(
      "rejected",
    );
    expect(session.inspectCanonicalForTests().control["site-works"]).toBe(
      "actor-2",
    );
    expect(session.submit(relinquish("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().control["site-works"]).toBeNull();
  });

  test("Works Control persists after the controller leaves", () => {
    const session = createSession(fedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-2", "place-vein")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().control["site-works"]).toBe(
      "actor-2",
    );
  });

  test("Process respects live Works Control and does not mutate it", () => {
    const session = createSession(fedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    feedWorks(session);
    const seed = fedWorksFixture();
    seed.actors.push("actor-3");
    seed.presentAt["actor-3"] = "place-works";
    seed.access["actor-3"] = [];
    seed.capabilities["actor-3"] = ["Transform"];
    const occupied = createSession(seed);
    expect(occupied.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(occupied.submit(assimilate("actor-3", "site-works")).status).toBe(
      "accepted",
    );
    expect(occupied.submit(establish("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(occupied.submit(assimilate("actor-1", "site-vein")).status).toBe(
      "accepted",
    );
    expect(occupied.submit(extractVein("actor-1")).status).toBe("accepted");
    const lot = occupied.inspectCanonicalForTests().lots[0]?.id ?? "";
    expect(
      occupied.submit(haulLot("actor-1", lot, "place-works")).status,
    ).toBe("accepted");
    expect(occupied.submit(processWorks("actor-3")).status).toBe("rejected");
    expect(occupied.submit(processWorks("actor-2")).status).toBe("accepted");
    expect(occupied.inspectCanonicalForTests().control["site-works"]).toBe(
      "actor-2",
    );

    expect(session.submit(processWorks("actor-2")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().control["site-works"]).toBe(
      "actor-2",
    );
  });

  test("Assimilate, Direct, and Haul do not Establish Works Control", () => {
    const session = createSession(gatedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().control["site-works"]).toBeNull();
    expect(session.submit(travel("actor-2", "place-b")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-2", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("accepted");
    expect(session.submit(gateMode("actor-2", "release")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().control["site-works"]).toBeNull();
    expect(session.submit(assimilate("actor-1", "site-vein")).status).toBe(
      "accepted",
    );
    expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
    const lot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    expect(session.submit(haulLot("actor-1", lot, "place-b")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().control["site-works"]).toBeNull();
  });

  test("a mill is not controllable", () => {
    const session = createSession(playableWorldFixture());
    expect(session.submit(assimilate("actor-1", "site-mill")).status).toBe(
      "accepted",
    );
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(establish("actor-1", "site-mill")).status).toBe(
      "rejected",
    );
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(before.control["site-mill"]).toBeNull();
  });

  test("Gate and Works Control can be Established independently in play", () => {
    const session = createSession(gatedWorksFixture());
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    const truth = session.inspectCanonicalForTests();
    expect(truth.control["site-gate"]).toBe("actor-1");
    expect(truth.control["site-works"]).toBe("actor-2");
    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("rejected");
    expect(session.submit(processWorks("actor-1")).status).toBe("rejected");
  });

  test("split authority in play: Works holder cannot Hold, gate holder cannot Process", () => {
    const session = createSession(gatedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(assimilate("actor-1", "site-vein")).status).toBe(
      "rejected",
    );
    expect(session.submit(travel("actor-1", "place-a")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-vein")).status).toBe(
      "accepted",
    );
    expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
    const lot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    expect(session.submit(haulLot("actor-1", lot, "place-b")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    expect(session.submit(haulLot("actor-1", lot, "place-c")).status).toBe(
      "accepted",
    );
    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("rejected");
    expect(session.submit(processWorks("actor-1")).status).toBe("rejected");
    expect(session.submit(processWorks("actor-2")).status).toBe("accepted");
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    const truth = session.inspectCanonicalForTests();
    expect(truth.control["site-works"]).toBe("actor-2");
    expect(truth.control["site-gate"]).toBe("actor-1");
  });

  test("Relinquish Works then another actor Establishes", () => {
    const session = createSession(fedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(relinquish("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(assimilate("actor-1", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-1", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().control["site-works"]).toBe(
      "actor-1",
    );
  });
});
