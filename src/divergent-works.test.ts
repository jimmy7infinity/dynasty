import { describe, expect, test } from "vitest";
import {
  createSession,
  divergentWorksFixture,
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

function processWorks(issuer: string, site: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site, mode: "process" },
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

function millMode(issuer: string, mode: "extract" | "transform" | "seat") {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: "site-mill", mode },
  };
}

function extractAndHaulTo(session: ReturnType<typeof createSession>, dest: string) {
  session.submit(assimilate("actor-1", "site-vein"));
  expect(session.submit(extractVein("actor-1")).status).toBe("accepted");
  const lot =
    session.inspectCanonicalForTests().lots.find((item) => item.kind === "site-vein")
      ?.id ?? "";
  expect(session.submit(haulLot("actor-1", lot, "place-b")).status).toBe(
    "accepted",
  );
  expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
  expect(session.submit(haulLot("actor-1", lot, dest)).status).toBe("accepted");
  return lot;
}

describe("Dynasty divergent Works", () => {
  test("the same input Lot can be routed to Works-A", () => {
    const session = createSession(divergentWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    const input = extractAndHaulTo(session, "place-c");
    expect(
      session.inspectCanonicalForTests().lots.find((lot) => lot.id === input)?.at,
    ).toBe("place-c");
    expect(session.submit(processWorks("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
  });

  test("the same input Lot can be routed to Works-B", () => {
    const session = createSession(divergentWorksFixture());
    expect(session.submit(assimilate("actor-3", "site-works-b")).status).toBe(
      "accepted",
    );
    const input = extractAndHaulTo(session, "place-d");
    expect(
      session.inspectCanonicalForTests().lots.find((lot) => lot.id === input)?.at,
    ).toBe("place-d");
    expect(session.submit(processWorks("actor-3", "site-works-b")).status).toBe(
      "accepted",
    );
  });

  test("Process at Works-A creates lot-bloom and consumes the input", () => {
    const session = createSession(divergentWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    const input = extractAndHaulTo(session, "place-c");
    expect(session.submit(processWorks("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    const lots = session.inspectCanonicalForTests().lots;
    expect(lots.some((lot) => lot.id === input)).toBe(false);
    expect(lots).toHaveLength(1);
    expect(lots[0]?.kind).toBe("lot-bloom");
    expect(lots[0]?.at).toBe("place-c");
  });

  test("Process at Works-B creates lot-ingot and consumes the input", () => {
    const session = createSession(divergentWorksFixture());
    expect(session.submit(assimilate("actor-3", "site-works-b")).status).toBe(
      "accepted",
    );
    extractAndHaulTo(session, "place-d");
    expect(session.submit(processWorks("actor-3", "site-works-b")).status).toBe(
      "accepted",
    );
    const lots = session.inspectCanonicalForTests().lots;
    expect(lots[0]?.kind).toBe("lot-ingot");
    expect(lots[0]?.at).toBe("place-d");
  });

  test("an input Lot processed at A cannot also be processed at B", () => {
    const session = createSession(divergentWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    expect(session.submit(assimilate("actor-3", "site-works-b")).status).toBe(
      "accepted",
    );
    extractAndHaulTo(session, "place-c");
    expect(session.submit(processWorks("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    expect(session.submit(processWorks("actor-3", "site-works-b")).status).toBe(
      "rejected",
    );
    expect(
      session.inspectCanonicalForTests().lots.map((lot) => lot.kind),
    ).toEqual(["lot-bloom"]);
  });

  test("routing the scarce input to A vs B yields different World lots", () => {
    const toA = createSession(divergentWorksFixture());
    expect(toA.submit(assimilate("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    extractAndHaulTo(toA, "place-c");
    expect(toA.submit(processWorks("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    const toB = createSession(divergentWorksFixture());
    expect(toB.submit(assimilate("actor-3", "site-works-b")).status).toBe(
      "accepted",
    );
    extractAndHaulTo(toB, "place-d");
    expect(toB.submit(processWorks("actor-3", "site-works-b")).status).toBe(
      "accepted",
    );
    expect(toA.inspectCanonicalForTests().lots[0]?.kind).toBe("lot-bloom");
    expect(toB.inspectCanonicalForTests().lots[0]?.kind).toBe("lot-ingot");
    expect(toA.inspectCanonicalForTests().lots[0]?.kind).not.toBe(
      toB.inspectCanonicalForTests().lots[0]?.kind,
    );
  });

  test("output Lots can be Hauled independently", () => {
    const session = createSession(divergentWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    expect(session.submit(assimilate("actor-3", "site-works-b")).status).toBe(
      "accepted",
    );
    extractAndHaulTo(session, "place-c");
    expect(session.submit(processWorks("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-a")).status).toBe("accepted");
    extractAndHaulTo(session, "place-d");
    expect(session.submit(processWorks("actor-3", "site-works-b")).status).toBe(
      "accepted",
    );
    const bloom =
      session.inspectCanonicalForTests().lots.find((lot) => lot.kind === "lot-bloom")
        ?.id ?? "";
    const ingot =
      session.inspectCanonicalForTests().lots.find((lot) => lot.kind === "lot-ingot")
        ?.id ?? "";
    expect(
      session.submit(haulLot("actor-2", bloom, "place-b")).status,
    ).toBe("accepted");
    expect(session.submit(travel("actor-2", "place-b")).status).toBe("accepted");
    expect(session.submit(travel("actor-2", "place-d")).status).toBe("accepted");
    expect(
      session.submit(haulLot("actor-2", ingot, "place-b")).status,
    ).toBe("accepted");
    const lots = session.inspectCanonicalForTests().lots;
    expect(lots.find((lot) => lot.id === bloom)?.at).toBe("place-b");
    expect(lots.find((lot) => lot.id === ingot)?.at).toBe("place-b");
  });

  test("Works-A Control is independent of Works-B and of the gate", () => {
    const session = createSession(divergentWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    expect(session.submit(assimilate("actor-3", "site-works-b")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-3", "site-works-b")).status).toBe(
      "accepted",
    );
    extractAndHaulTo(session, "place-c");
    expect(session.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(processWorks("actor-3", "site-works-a")).status).toBe(
      "rejected",
    );
    expect(session.submit(processWorks("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    const truth = session.inspectCanonicalForTests();
    expect(truth.control["site-works-a"]).toBe("actor-2");
    expect(truth.control["site-works-b"]).toBe("actor-3");
    expect(truth.control["site-gate"]).toBe("actor-1");
  });

  test("a held gate can deny both Works the scarce input", () => {
    const session = createSession(divergentWorksFixture());
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-1", "site-gate")).status).toBe(
      "accepted",
    );
    expect(session.submit(gateMode("actor-1", "hold")).status).toBe("accepted");
    expect(session.submit(travel("actor-1", "place-a")).status).toBe("rejected");
    expect(session.submit(assimilate("actor-1", "site-vein")).status).toBe(
      "rejected",
    );
  });

  test("wrong Lot kind at a Works rejects Process", () => {
    const seed: WorldSeed = divergentWorksFixture();
    seed.sites.push({ id: "site-other", situatedAt: "place-a" });
    seed.control["site-other"] = null;
    seed.depositRemaining["site-other"] = 1;
    seed.siteAggregate["site-other"] = "deposit";
    const session = createSession(seed);
    expect(session.submit(assimilate("actor-1", "site-other")).status).toBe(
      "accepted",
    );
    expect(session.submit(assimilate("actor-2", "site-works-a")).status).toBe(
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
    const other = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    expect(session.submit(haulLot("actor-1", other, "place-b")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-1", "place-b")).status).toBe("accepted");
    expect(session.submit(haulLot("actor-1", other, "place-c")).status).toBe(
      "accepted",
    );
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(processWorks("actor-2", "site-works-a")).status).toBe(
      "rejected",
    );
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("mill Extract/Transform/Seat remain a fuse, not Works Process", () => {
    const mill = createSession(playableWorldFixture());
    mill.submit(assimilate("actor-1", "site-mill"));
    expect(mill.submit(millMode("actor-1", "transform")).status).toBe(
      "accepted",
    );
    expect(mill.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "transformed",
    );
    expect(mill.inspectCanonicalForTests().lots).toHaveLength(0);
    expect(
      mill.submit(processWorks("actor-1", "site-mill")).status,
    ).toBe("rejected");
  });

  test("the vein is not refilled by either Works", () => {
    const session = createSession(divergentWorksFixture());
    expect(session.submit(assimilate("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    extractAndHaulTo(session, "place-c");
    expect(session.submit(processWorks("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().depositRemaining["site-vein"]).toBe(
      1,
    );
    expect(session.submit(travel("actor-1", "place-a")).status).toBe("accepted");
    extractAndHaulTo(session, "place-c");
    expect(session.submit(processWorks("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    expect(session.inspectCanonicalForTests().depositRemaining["site-vein"]).toBe(
      0,
    );
    expect(session.submit(travel("actor-1", "place-a")).status).toBe("accepted");
    expect(session.submit(extractVein("actor-1")).status).toBe("rejected");
  });
});
