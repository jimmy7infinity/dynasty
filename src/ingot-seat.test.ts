import { describe, expect, test } from "vitest";
import {
  createSession,
  fedWorksFixture,
  ingotSeatFixture,
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

function processWorks(issuer: string, site: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site, mode: "process" },
  };
}

function seatPost(issuer: string) {
  return {
    issuer,
    home: "World" as const,
    kind: "ChangeAggregate" as const,
    subjects: { site: "site-post", mode: "seat" },
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

function routeVeinTo(session: ReturnType<typeof createSession>, dest: string) {
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

function bloomPath(session: ReturnType<typeof createSession>) {
  expect(session.submit(assimilate("actor-2", "site-works-a")).status).toBe(
    "accepted",
  );
  routeVeinTo(session, "place-c");
  expect(session.submit(processWorks("actor-2", "site-works-a")).status).toBe(
    "accepted",
  );
}

function ingotPath(session: ReturnType<typeof createSession>) {
  session.submit(assimilate("actor-3", "site-works-b"));
  routeVeinTo(session, "place-d");
  expect(session.submit(processWorks("actor-3", "site-works-b")).status).toBe(
    "accepted",
  );
}

describe("Dynasty Seat requires lot-ingot", () => {
  test("lot-ingot at the post allows Seat and is consumed", () => {
    const session = createSession(ingotSeatFixture());
    expect(session.submit(assimilate("actor-3", "site-post")).status).toBe(
      "accepted",
    );
    ingotPath(session);
    const ingot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    const result = session.submit(seatPost("actor-3"));
    expect(result.status).toBe("accepted");
    const truth = session.inspectCanonicalForTests();
    expect(truth.siteAggregate["site-post"]).toBe("seated");
    expect(truth.lots.some((lot) => lot.id === ingot)).toBe(false);
    expect(truth.lots).toHaveLength(0);
    expect(truth.occurrenceKinds).toContain("SiteSeated");
    expect(JSON.stringify(truth)).not.toMatch(/"DLP"|"DYN"|"price"/);
  });

  test("lot-bloom at the post does not satisfy Seat", () => {
    const session = createSession(ingotSeatFixture());
    expect(session.submit(assimilate("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    expect(session.submit(assimilate("actor-3", "site-post")).status).toBe(
      "accepted",
    );
    routeVeinTo(session, "place-c");
    expect(session.submit(processWorks("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    const bloom = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    expect(session.submit(haulLot("actor-2", bloom, "place-b")).status).toBe(
      "accepted",
    );
    expect(session.submit(travel("actor-2", "place-b")).status).toBe("accepted");
    expect(session.submit(haulLot("actor-2", bloom, "place-d")).status).toBe(
      "accepted",
    );
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(seatPost("actor-3")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
    expect(before.lots[0]?.kind).toBe("lot-bloom");
    expect(before.siteAggregate["site-post"]).toBe("deposit");
  });

  test("Seat with no Lot rejects", () => {
    const session = createSession(ingotSeatFixture());
    expect(session.submit(assimilate("actor-3", "site-post")).status).toBe(
      "accepted",
    );
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(seatPost("actor-3")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("Seat without Erect rejects", () => {
    const session = createSession(ingotSeatFixture());
    expect(session.submit(assimilate("actor-3", "site-post")).status).toBe(
      "accepted",
    );
    ingotPath(session);
    expect(session.submit(travel("actor-2", "place-b")).status).toBe("accepted");
    expect(session.submit(travel("actor-2", "place-d")).status).toBe("accepted");
    expect(session.submit(assimilate("actor-2", "site-post")).status).toBe(
      "accepted",
    );
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(seatPost("actor-2")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("Seat without presence rejects", () => {
    const session = createSession(ingotSeatFixture());
    expect(session.submit(assimilate("actor-3", "site-post")).status).toBe(
      "accepted",
    );
    ingotPath(session);
    expect(session.submit(travel("actor-3", "place-b")).status).toBe("accepted");
    expect(session.submit(seatPost("actor-3")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests().lots[0]?.kind).toBe("lot-ingot");
  });

  test("Seat without knowledge-of the post rejects", () => {
    const session = createSession(ingotSeatFixture());
    ingotPath(session);
    const before = structuredClone(session.inspectCanonicalForTests());
    expect(session.submit(seatPost("actor-3")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests()).toEqual(before);
  });

  test("PATH A: Works-A bloom leaves Seat unavailable", () => {
    const session = createSession(ingotSeatFixture());
    expect(session.submit(assimilate("actor-3", "site-post")).status).toBe(
      "accepted",
    );
    bloomPath(session);
    expect(session.submit(extractVein("actor-1")).status).toBe("rejected");
    expect(session.submit(seatPost("actor-3")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests().siteAggregate["site-post"]).toBe(
      "deposit",
    );
    expect(session.inspectCanonicalForTests().lots[0]?.kind).toBe("lot-bloom");
  });

  test("PATH B: Works-B ingot enables Seat", () => {
    const session = createSession(ingotSeatFixture());
    expect(session.submit(assimilate("actor-3", "site-post")).status).toBe(
      "accepted",
    );
    ingotPath(session);
    expect(session.submit(seatPost("actor-3")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().siteAggregate["site-post"]).toBe(
      "seated",
    );
  });

  test("the same finite input cannot produce both outputs", () => {
    const session = createSession(ingotSeatFixture());
    expect(session.submit(assimilate("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    expect(session.submit(assimilate("actor-3", "site-works-b")).status).toBe(
      "accepted",
    );
    routeVeinTo(session, "place-c");
    expect(session.submit(processWorks("actor-2", "site-works-a")).status).toBe(
      "accepted",
    );
    expect(session.submit(processWorks("actor-3", "site-works-b")).status).toBe(
      "rejected",
    );
    expect(session.submit(extractVein("actor-1")).status).toBe("rejected");
  });

  test("Haul can move an ingot onto the post Place; Seat then consumes it once", () => {
    const session = createSession(ingotSeatFixture());
    expect(session.submit(assimilate("actor-3", "site-works-b")).status).toBe(
      "accepted",
    );
    expect(session.submit(assimilate("actor-3", "site-post")).status).toBe(
      "accepted",
    );
    ingotPath(session);
    const ingot = session.inspectCanonicalForTests().lots[0]?.id ?? "";
    expect(session.submit(travel("actor-2", "place-b")).status).toBe("accepted");
    expect(session.submit(travel("actor-2", "place-d")).status).toBe("accepted");
    expect(session.submit(haulLot("actor-2", ingot, "place-b")).status).toBe(
      "accepted",
    );
    expect(session.submit(seatPost("actor-3")).status).toBe("rejected");
    expect(session.submit(haulLot("actor-2", ingot, "place-d")).status).toBe(
      "rejected",
    );
    expect(session.submit(travel("actor-2", "place-b")).status).toBe("accepted");
    expect(session.submit(haulLot("actor-2", ingot, "place-d")).status).toBe(
      "accepted",
    );
    expect(session.submit(seatPost("actor-3")).status).toBe("accepted");
    expect(session.submit(seatPost("actor-3")).status).toBe("rejected");
    expect(session.inspectCanonicalForTests().lots).toHaveLength(0);
  });

  test("the post is not controllable; Works Control is unchanged by Seat", () => {
    const session = createSession(ingotSeatFixture());
    expect(session.submit(assimilate("actor-3", "site-works-b")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-3", "site-works-b")).status).toBe(
      "accepted",
    );
    expect(session.submit(assimilate("actor-3", "site-post")).status).toBe(
      "accepted",
    );
    expect(session.submit(establish("actor-3", "site-post")).status).toBe(
      "rejected",
    );
    ingotPath(session);
    expect(session.submit(seatPost("actor-3")).status).toBe("accepted");
    expect(session.inspectCanonicalForTests().control["site-works-b"]).toBe(
      "actor-3",
    );
    expect(session.inspectCanonicalForTests().control["site-post"]).toBeNull();
  });

  test("existing mill Seat and Works Process are unchanged", () => {
    const mill = createSession(playableWorldFixture());
    mill.submit(assimilate("actor-1", "site-mill"));
    expect(mill.submit(millMode("actor-1", "extract")).status).toBe("accepted");
    mill.submit(travel("actor-2", "place-a"));
    mill.submit(assimilate("actor-2", "site-mill"));
    expect(mill.submit(millMode("actor-2", "seat")).status).toBe("accepted");
    expect(mill.inspectCanonicalForTests().siteAggregate["site-mill"]).toBe(
      "seated",
    );
    expect(mill.inspectCanonicalForTests().lots).toHaveLength(0);

    const works = createSession(fedWorksFixture());
    works.submit(assimilate("actor-1", "site-vein"));
    works.submit(extractVein("actor-1"));
    const veinLot = works.inspectCanonicalForTests().lots[0]?.id ?? "";
    works.submit(haulLot("actor-1", veinLot, "place-works"));
    works.submit(assimilate("actor-2", "site-works"));
    expect(works.submit(processWorks("actor-2", "site-works")).status).toBe(
      "accepted",
    );
    expect(works.inspectCanonicalForTests().lots[0]?.kind).toBe("site-works");
  });
});
