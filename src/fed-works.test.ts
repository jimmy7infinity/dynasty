import { describe, expect, test } from "vitest";
import {
  createSession,
  fedWorksFixture,
  gateWorldFixture,
  occupiedGateFixture,
  playableWorldFixture,
} from "./session.js";
import type { WorldSeed } from "./world-domain.js";

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

function millTransform(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: "site-mill", mode: "transform" },
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

function establishGate(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeControl" as const,
    subjects: { site: "site-gate", mode: "establish" },
  };
}

function relinquishGate(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeControl" as const,
    subjects: { site: "site-gate", mode: "relinquish" },
  };
}

function prepareVeinLotAtWorks(session: ReturnType<typeof createSession>) {
  expect(session.submit(assimilate("actor-1", "site-vein")).status).toBe(
    "accepted",
  );
  expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
  const lot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
  expect(
    session.submit(haulLot("actor-1", lot, "place-works")).status,
  ).toBe("accepted");
  return lot;
}

describe("Dynasty fed works — Lot in → Lot out", () => {
  test("Extract leaves the Lot at the vein; Process rejects until it is Hauled", () => {
    const session = createSession(fedWorksFixture());
    expect(session.submit(assimilate("actor-1", "site-vein")).status).toBe(
      "accepted",
    );
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
    const truth = session.inspectCanonicalForTests();
    expect(truth.lots).toHaveLength(1);
    expect(truth.lots[0]?.at).toBe("place-vein");
    expect(truth.lots[0]?.kind).toBe("site-vein");
    const before = structuredClone(truth);
    expect(session.submit(processWorks("actor-2")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("Haul then Process consumes the input Lot and creates an output Lot", () => {
    const session = createSession(fedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    const inputId = prepareVeinLotAtWorks(session);
    const result = session.submit(processWorks("actor-2"));
    expect(result.status).toBe("accepted");
    if (result.status !== "accepted") {
      return;
    }
    expect(result.kind).toBe("ChangeAggregate");
    const truth = session.inspectCanonicalForTests();
    expect(truth.lots).toHaveLength(1);
    expect(truth.lots[0]?.id).not.toBe(inputId);
    expect(truth.lots[0]?.kind).toBe("site-works");
    expect(truth.lots[0]?.quantity).toBe(1);
    expect(truth.lots[0]?.at).toBe("place-works");
    expect(truth.lots.some((lot) => lot.id === inputId)).toBe(false);
    expect(truth.occurrenceKinds).toContain("LotProcessed");
    expect(truth.control["site-works"]).toBeNull();
    expect(truth.depositRemaining["site-vein"]).toBe(1);
    expect(truth.siteAggregate["site-vein"]).toBe("extracted");
    const processed = session
      .observe("actor-2")
      .occurrences.find((item) => item.kind === "LotProcessed");
    expect(processed?.subjects.actor).toBe("actor-2");
    expect(processed?.subjects.site).toBe("site-works");
    expect(processed?.subjects.consumed).toBe(inputId);
    expect(processed?.subjects.created).toBe(truth.lots[0]?.id);
  });

  test("a second Process rejects until another input Lot arrives", () => {
    const session = createSession(fedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    prepareVeinLotAtWorks(session);
    expect(session.submit(processWorks("actor-2")).status).toBe("accepted");
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(processWorks("actor-2")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("a second Extract and Haul allows Process again", () => {
    const session = createSession(fedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    prepareVeinLotAtWorks(session);
    expect(session.submit(processWorks("actor-2")).status).toBe("accepted");
    expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
    const input = session
      .inspectCanonicalForTests()
      .lots.find((lot) => lot.kind === "site-vein");
    expect(input).toBeDefined();
    expect(
      session.submit(haulLot("actor-1", input?.id ?? "", "place-works")).status,
    ).toBe("accepted");
    expect(session.submit(processWorks("actor-2")).status).toBe("accepted");
    const outputs = session
      .inspectCanonicalForTests()
      .lots.filter((lot) => lot.kind === "site-works");
    expect(outputs).toHaveLength(2);
  });

  test("after the vein is exhausted Process rejects", () => {
    const session = createSession(fedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    prepareVeinLotAtWorks(session);
    expect(session.submit(processWorks("actor-2")).status).toBe("accepted");
    expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
    const input = session
      .inspectCanonicalForTests()
      .lots.find((lot) => lot.kind === "site-vein");
    expect(
      session.submit(haulLot("actor-1", input?.id ?? "", "place-works")).status,
    ).toBe("accepted");
    expect(session.submit(processWorks("actor-2")).status).toBe("accepted");
    expect(session.submit(extractVein("actor-1")).status).toBe("rejected");
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(processWorks("actor-2")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(before.depositRemaining["site-vein"]).toBe(0);
  });

  test("Process without Transform is rejected", () => {
    const session = createSession(fedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    prepareVeinLotAtWorks(session);
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(processWorks("actor-1")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("Process without presence is rejected", () => {
    const session = createSession(fedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    prepareVeinLotAtWorks(session);
    expect(session.submit(travel("actor-2", "place-vein")).status).toBe(
      "accepted",
    );
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(processWorks("actor-2")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("Process without knowledge-of Works is rejected", () => {
    const session = createSession(fedWorksFixture());
    prepareVeinLotAtWorks(session);
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(processWorks("actor-2")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("occupied Works rejects a non-controller and accepts the controller", () => {
    const seed = fedWorksFixture();
    seed.actors.push("actor-3");
    seed.presentAt["actor-3"] = "place-works";
    seed.access["actor-3"] = [];
    seed.capabilities["actor-3"] = ["Transform"];
    seed.control["site-works"] = "actor-2";
    const session = createSession(seed);
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(session.submit(assimilate("actor-3", "site-works")).status).toBe(
      "accepted",
    );
    prepareVeinLotAtWorks(session);
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(processWorks("actor-3")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(session.submit(processWorks("actor-2")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().control["site-works"]).toBe(
      "actor-2",
    );
  });

  test("after Process the processor may leave; output and Control remain", () => {
    const session = createSession(fedWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    prepareVeinLotAtWorks(session);
    expect(session.submit(processWorks("actor-2")).status).toBe("accepted");
    expect(session.submit(travel("actor-2", "place-vein")).status).toBe(
      "accepted",
    );
    const truth = session.inspectCanonicalForTests();
    expect(truth.lots[0]?.at).toBe("place-works");
    expect(truth.lots[0]?.kind).toBe("site-works");
    expect(truth.control["site-works"]).toBeNull();
    expect(truth.presentAt["actor-2"]).toBe("place-vein");
  });

  test("another actor with Haul can move the output Lot away", () => {
    const seed = fedWorksFixture();
    seed.capabilities["actor-1"] = ["Extract", "Haul"];
    const session = createSession(seed);
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    prepareVeinLotAtWorks(session);
    expect(session.submit(processWorks("actor-2")).status).toBe("accepted");
    const output = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    expect(session.submit(travel("actor-1", "place-works")).status).toBe(
      "accepted",
    );
    expect(
      session.submit(haulLot("actor-1", output, "place-vein")).status,
    ).toBe("accepted");
    expect(session.inspectCanonicalForTests().lots[0]?.at).toBe("place-vein");
  });

  test("wrong Lot kind at Works does not satisfy Process", () => {
    const seed: WorldSeed = fedWorksFixture();
    seed.sites.push({ id: "site-other", situatedAt: "place-vein" });
    seed.control["site-other"] = null;
    seed.depositRemaining["site-other"] = 1;
    seed.siteAggregate["site-other"] = "deposit";
    const session = createSession(seed);
    expect(session.submit(assimilate("actor-1", "site-other")).status).toBe(
      "accepted",
    );
    expect(session.submit(assimilate("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(
      session.submit({
        issuer: "actor-1",
        home: "World" as const,
        kind: "ChangeAggregate" as const,
        subjects: { site: "site-other", mode: "extract" },
      }).status,
    ).toBe("accepted");
    const otherLot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    expect(
      session.submit(haulLot("actor-1", otherLot, "place-works")).status,
    ).toBe("accepted");
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(processWorks("actor-2")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(before.lots[0]?.kind).toBe("site-other");
  });

  test("Process on the vein mill is rejected; mill Transform is unchanged", () => {
    const works = createSession(fedWorksFixture());
    expect(works.submit(assimilate("actor-1", "site-vein")).status).toBe(
      "accepted",
    );
    const beforeWorks = structuredClone(works.inspectCanonicalForTests());
    expect(
      works.submit({
        issuer: "actor-1",
        home: "World" as const,
        kind: "ChangeAggregate" as const,
        subjects: { site: "site-vein", mode: "process" },
      }).status,
    ).toBe("rejected");
    expect(works.inspectCanonicalForTests()).toEqual(beforeWorks);

    const mill = createSession(playableWorldFixture());
    mill.submit(assimilate("actor-1", "site-mill"));
    expect(mill.submit(millTransform("actor-1")).status).toBe("accepted");
    expect(mill.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "transformed",
    );
    expect(mill.inspectCanonicalForTests().lots).toHaveLength(0);
  });

  test("gate Control establish and relinquish still work", () => {
    const vacant = createSession(gateWorldFixture());
    expect(vacant.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(vacant.submit(establishGate("actor-1")).status).toBe("accepted");
    expect(vacant.inspectCanonicalForTests().control["site-gate"]).toBe(
      "actor-1",
    );
    expect(vacant.submit(relinquishGate("actor-1")).status).toBe("accepted");
    expect(vacant.inspectCanonicalForTests().control["site-gate"]).toBeNull();

    const occupied = createSession(occupiedGateFixture());
    expect(occupied.submit(relinquishGate("actor-1")).status).toBe("accepted");
    expect(occupied.inspectCanonicalForTests().control["site-gate"]).toBeNull();
  });
});
