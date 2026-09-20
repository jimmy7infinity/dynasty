import { describe, expect, test } from "vitest";
import { createSession, gatedWorksFixture } from "./session.js";

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

function veinLotId(session: ReturnType<typeof createSession>) {
  return (
    session.inspectCanonicalForTests().lots.find((lot) => lot.kind === "site-vein")
      ?.id ?? ""
  );
}

function haulVeinToWorks(session: ReturnType<typeof createSession>) {
  expect(session.submit(assimilate("actor-1", "site-vein")).status).toBe(
    "accepted",
  );
  expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
  const lot = veinLotId(session);
  expect(session.submit(haulLot("actor-1", lot, "place-b")).status).toBe(
    "accepted",
  );
  expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
  expect(session.submit(haulLot("actor-1", lot, "place-c")).status).toBe(
    "accepted",
  );
  return lot;
}

describe("Dynasty Works × Gate × competition", () => {
  test("a Lot can move A → B → C while the gate permits traversal", () => {
    const session = createSession(gatedWorksFixture());
    const lot = haulVeinToWorks(session);
    const truth = session.inspectCanonicalForTests();
    expect(truth.lots.find((item) => item.id === lot)?.at).toBe("place-c");
    expect(truth.gateState["site-gate"]).toBe("open");
  });

  test("a held gate blocks Haul and travel toward Works", () => {
    const session = createSession(gatedWorksFixture());
    expect(session.submit(travel("actor-2", "place-b")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-2", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-vein")).status).toBe(
      "accepted",
    );
    expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
    const lot = veinLotId(session);
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(haulLot("actor-1", lot, "place-b")).status).toBe(
      "rejected",
    );
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(before.lots[0]?.at).toBe("place-a");
  });

  test("an actor with Direct can change gate stance without gaining Works Control", () => {
    const session = createSession(gatedWorksFixture());
    expect(session.submit(travel("actor-2", "place-b")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-2", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("accepted");
    expect(session.submit(gateMode("actor-2", "release")).status).toBe(
      "accepted",
    );
    const truth = session.inspectCanonicalForTests();
    expect(truth.gateState["site-gate"]).toBe("open");
    expect(truth.control["site-gate"]).toBeNull();
    expect(truth.control["site-works"]).toBeNull();
  });

  test("Works Process succeeds only when a matching Lot is at C", () => {
    const session = createSession(gatedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    haulVeinToWorks(session);
    expect(session.submit(processWorks("actor-2")).status).toBe("accepted");
    const truth = session.inspectCanonicalForTests();
    expect(truth.lots).toHaveLength(1);
    expect(truth.lots[0]?.kind).toBe("site-works");
    expect(truth.lots[0]?.at).toBe("place-c");
  });

  test("establishing Gate Control does not write Works Control", () => {
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

  test("Process does not write Gate Control", () => {
    const session = createSession(gatedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    haulVeinToWorks(session);
    expect(session.submit(processWorks("actor-2")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().control["site-gate"]).toBeNull();
    expect(session.inspectCanonicalForTests().control["site-works"]).toBeNull();
  });

  test("output remains at C after Process", () => {
    const session = createSession(gatedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    haulVeinToWorks(session);
    expect(session.submit(processWorks("actor-2")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().lots[0]?.at).toBe("place-c");
  });

  test("another actor with Haul can move the unowned output Lot", () => {
    const session = createSession(gatedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    haulVeinToWorks(session);
    expect(session.submit(processWorks("actor-2")).status).toBe("accepted");
    const output = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(haulLot("actor-1", output, "place-b")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().lots[0]?.at).toBe("place-b");
  });

  test("Gate Control and Works Control can be held by different actors", () => {
    const seed = gatedWorksFixture();
    seed.presentAt["actor-2"] = "place-b";
    seed.control["site-gate"] = "actor-2";
    seed.control["site-works"] = "actor-1";
    seed.capabilities["actor-1"] = ["Extract", "Haul", "Transform", "Direct"];
    const session = createSession(seed);
    expect(session.submit(assimilate("actor-2", "site-gate")).status).toBe(
      "accepted",
    );
    haulVeinToWorks(session);
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("rejected");
    expect(session.submit(gateMode("actor-2", "hold")).status).toBe("accepted");
    expect(session.submit(gateMode("actor-2", "release")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-c")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(processWorks("actor-2")).status).toBe("rejected");
    expect(session.submit(processWorks("actor-1")).status).toBe("accepted");
    const truth = session.inspectCanonicalForTests();
    expect(truth.control["site-gate"]).toBe("actor-2");
    expect(truth.control["site-works"]).toBe("actor-1");
  });

  test("holding the gate before haul traps the Lot; hauling first then holding does not", () => {
    const trapped = createSession(gatedWorksFixture());
    expect(trapped.submit(travel("actor-2", "place-b")).status).toBe("accepted");
    expect(trapped.submit(assimilate("actor-2", "site-gate")).status).toBe(
      "accepted",
    );
    expect(trapped.submit(gateMode("actor-2", "hold")).status).toBe("accepted");
    expect(trapped.submit(assimilate("actor-1", "site-vein")).status).toBe(
      "accepted",
    );
    expect(trapped.submit(extractVein("actor-1")).status).toBe("accepted");
    const trappedLot = veinLotId(trapped);
    expect(
      trapped.submit(haulLot("actor-1", trappedLot, "place-b")).status,
    ).toBe("rejected");
    expect(trapped.inspectCanonicalForTests().lots[0]?.at).toBe("place-a");
    expect(trapped.submit(assimilate("actor-2", "site-works")).status).toBe(
      "rejected",
    );
    expect(trapped.submit(processWorks("actor-2")).status).toBe("rejected");

    const through = createSession(gatedWorksFixture());
    expect(through.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    haulVeinToWorks(through);
    expect(through.submit(processWorks("actor-2")).status).toBe("accepted");
    expect(through.submit(travel("actor-2", "place-b")).status).toBe("accepted");
    expect(through.submit(assimilate("actor-2", "site-gate")).status).toBe(
      "accepted",
    );
    expect(through.submit(gateMode("actor-2", "hold")).status).toBe("accepted");
    expect(through.inspectCanonicalForTests().lots[0]?.kind).toBe("site-works");
    expect(through.inspectCanonicalForTests().lots[0]?.at).toBe("place-c");
    expect(through.submit(travel("actor-1", "place-b")).status).toBe("rejected");
  });

  test("Process and the gated route do not refill the vein", () => {
    const session = createSession(gatedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    haulVeinToWorks(session);
    expect(session.submit(processWorks("actor-2")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().depositRemaining["site-vein"]).toBe(
      1,
    );
    expect(session.submit(travel("actor-1", "place-a")).status).toBe("accepted");
    expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
    const second = veinLotId(session);
    expect(session.submit(haulLot("actor-1", second, "place-b")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    expect(session.submit(haulLot("actor-1", second, "place-c")).status).toBe(
      "accepted",
    );
    expect(session.submit(processWorks("actor-2")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().depositRemaining["site-vein"]).toBe(
      0,
    );
    expect(session.submit(travel("actor-1", "place-a")).status).toBe("accepted");
    expect(session.submit(extractVein("actor-1")).status).toBe("rejected");
  });

  test("Lots are contestable by location and Haul without a theft rule", () => {
    const session = createSession(gatedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    haulVeinToWorks(session);
    const input = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    expect(
      session.submit(haulLot("actor-2", input, "place-b")).status,
    ).toBe("accepted");
    expect(session.inspectCanonicalForTests().lots[0]?.at).toBe("place-b");
    expect(session.submit(processWorks("actor-2")).status).toBe("rejected");
  });
});
