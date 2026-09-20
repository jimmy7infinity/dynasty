import type { CanonicalSnapshot, Intent, Observation, Result } from "./kernel.js";
import { InformationDomain } from "./information-domain.js";
import { WorldDomain, type WorldSeed } from "./world-domain.js";

export function minimalWorldFixture(): WorldSeed {
  return {
    places: ["place-a", "place-b"],
    contains: [],
    connects: [["place-a", "place-b"]],
    sites: [{ id: "site-mill", situatedAt: "place-a" }],
    actors: ["actor-1", "actor-2"],
    presentAt: {
      "actor-1": "place-a",
      "actor-2": "place-b",
    },
    access: {
      "actor-1": [],
      "actor-2": ["site-mill"],
    },
    control: {
      "site-mill": null,
    },
    capabilities: {
      "actor-1": ["Extract", "Transform"],
      "actor-2": [],
    },
    depositRemaining: {
      "site-mill": 1,
    },
    siteAggregate: {
      "site-mill": "deposit",
    },
  };
}

export function interdependenceFixture(): WorldSeed {
  return {
    places: ["place-a", "place-b"],
    contains: [],
    connects: [["place-a", "place-b"]],
    sites: [{ id: "site-mill", situatedAt: "place-a" }],
    actors: ["actor-1", "actor-2"],
    presentAt: {
      "actor-1": "place-a",
      "actor-2": "place-b",
    },
    access: {
      "actor-1": [],
      "actor-2": [],
    },
    control: {
      "site-mill": null,
    },
    capabilities: {
      "actor-1": ["Extract"],
      "actor-2": ["Erect"],
    },
    depositRemaining: {
      "site-mill": 1,
    },
    siteAggregate: {
      "site-mill": "deposit",
    },
  };
}

export function playableWorldFixture(): WorldSeed {
  return {
    places: ["place-a", "place-b"],
    contains: [],
    connects: [["place-a", "place-b"]],
    sites: [{ id: "site-mill", situatedAt: "place-a" }],
    actors: ["actor-1", "actor-2"],
    presentAt: {
      "actor-1": "place-a",
      "actor-2": "place-b",
    },
    access: {
      "actor-1": [],
      "actor-2": [],
    },
    control: {
      "site-mill": null,
    },
    capabilities: {
      "actor-1": ["Extract", "Transform"],
      "actor-2": ["Erect"],
    },
    depositRemaining: {
      "site-mill": 1,
    },
    siteAggregate: {
      "site-mill": "deposit",
    },
  };
}

export function gateWorldFixture(): WorldSeed {
  return {
    places: ["place-a", "place-b"],
    contains: [],
    connects: [["place-a", "place-b"]],
    sites: [{ id: "site-gate", situatedAt: "place-a" }],
    actors: ["actor-1", "actor-2"],
    presentAt: {
      "actor-1": "place-a",
      "actor-2": "place-b",
    },
    access: {
      "actor-1": [],
      "actor-2": [],
    },
    control: {
      "site-gate": null,
    },
    capabilities: {
      "actor-1": ["Direct"],
      "actor-2": ["Direct"],
    },
    depositRemaining: {},
    siteAggregate: {},
    gate: { siteId: "site-gate", state: "open" },
  };
}

export function occupiedGateFixture(): WorldSeed {
  return {
    places: ["place-a", "place-b"],
    contains: [],
    connects: [["place-a", "place-b"]],
    sites: [{ id: "site-gate", situatedAt: "place-a" }],
    actors: ["actor-1", "actor-2"],
    presentAt: {
      "actor-1": "place-a",
      "actor-2": "place-a",
    },
    access: {
      "actor-1": [],
      "actor-2": [],
    },
    control: {
      "site-gate": "actor-1",
    },
    capabilities: {
      "actor-1": ["Direct"],
      "actor-2": ["Direct"],
    },
    depositRemaining: {},
    siteAggregate: {},
    gate: { siteId: "site-gate", state: "open" },
  };
}

export function gateMillFixture(): WorldSeed {
  return {
    places: ["place-a", "place-b"],
    contains: [],
    connects: [["place-a", "place-b"]],
    sites: [
      { id: "site-gate", situatedAt: "place-a" },
      { id: "site-mill", situatedAt: "place-a" },
    ],
    actors: ["actor-1", "actor-2"],
    presentAt: {
      "actor-1": "place-a",
      "actor-2": "place-b",
    },
    access: {
      "actor-1": [],
      "actor-2": [],
    },
    control: {
      "site-gate": null,
      "site-mill": null,
    },
    capabilities: {
      "actor-1": ["Direct", "Extract"],
      "actor-2": ["Direct", "Transform"],
    },
    depositRemaining: {
      "site-mill": 1,
    },
    siteAggregate: {
      "site-mill": "deposit",
    },
    gate: {
      siteId: "site-gate",
      state: "open",
      millSiteId: "site-mill",
    },
  };
}

export function contestedMillFixture(): WorldSeed {
  return {
    places: ["place-a", "place-b"],
    contains: [],
    connects: [["place-a", "place-b"]],
    sites: [
      { id: "site-gate", situatedAt: "place-a" },
      { id: "site-mill", situatedAt: "place-a" },
    ],
    actors: ["actor-1", "actor-2"],
    presentAt: {
      "actor-1": "place-a",
      "actor-2": "place-b",
    },
    access: {
      "actor-1": [],
      "actor-2": [],
    },
    control: {
      "site-gate": null,
      "site-mill": null,
    },
    capabilities: {
      "actor-1": ["Direct", "Erect", "Extract"],
      "actor-2": ["Direct", "Transform"],
    },
    depositRemaining: {
      "site-mill": 1,
    },
    siteAggregate: {
      "site-mill": "deposit",
    },
    gate: {
      siteId: "site-gate",
      state: "open",
      millSiteId: "site-mill",
    },
  };
}

export function twoOpportunityFixture(): WorldSeed {
  return {
    places: ["place-a", "place-b", "place-c"],
    contains: [],
    connects: [
      ["place-a", "place-b"],
      ["place-b", "place-c"],
    ],
    sites: [
      { id: "site-gate-a", situatedAt: "place-a" },
      { id: "site-mill-a", situatedAt: "place-a" },
      { id: "site-gate-c", situatedAt: "place-c" },
      { id: "site-mill-c", situatedAt: "place-c" },
    ],
    actors: ["actor-1", "actor-2"],
    presentAt: {
      "actor-1": "place-b",
      "actor-2": "place-b",
    },
    access: {
      "actor-1": [],
      "actor-2": [],
    },
    control: {
      "site-gate-a": null,
      "site-mill-a": null,
      "site-gate-c": null,
      "site-mill-c": null,
    },
    capabilities: {
      "actor-1": ["Direct", "Erect", "Extract"],
      "actor-2": ["Direct", "Transform"],
    },
    depositRemaining: {
      "site-mill-a": 1,
      "site-mill-c": 1,
    },
    siteAggregate: {
      "site-mill-a": "deposit",
      "site-mill-c": "deposit",
    },
    gates: [
      {
        siteId: "site-gate-a",
        state: "open",
        millSiteId: "site-mill-a",
      },
      {
        siteId: "site-gate-c",
        state: "open",
        millSiteId: "site-mill-c",
      },
    ],
  };
}

export function lotHaulFixture(): WorldSeed {
  return {
    places: ["place-a", "place-b", "place-c"],
    contains: [],
    connects: [
      ["place-a", "place-b"],
      ["place-b", "place-c"],
    ],
    sites: [{ id: "site-mill", situatedAt: "place-a" }],
    actors: ["actor-1", "actor-2"],
    presentAt: {
      "actor-1": "place-a",
      "actor-2": "place-b",
    },
    access: {
      "actor-1": [],
      "actor-2": [],
    },
    control: {
      "site-mill": null,
    },
    capabilities: {
      "actor-1": ["Direct", "Extract", "Haul"],
      "actor-2": ["Direct", "Extract"],
    },
    depositRemaining: {
      "site-mill": 1,
    },
    siteAggregate: {
      "site-mill": "deposit",
    },
  };
}

export function materialDependencyFixture(): WorldSeed {
  return {
    places: ["place-a", "place-b", "place-c"],
    contains: [],
    connects: [
      ["place-a", "place-b"],
      ["place-b", "place-c"],
    ],
    sites: [
      { id: "site-mill-a", situatedAt: "place-a" },
      { id: "site-mill-other", situatedAt: "place-a" },
      { id: "site-mill-b", situatedAt: "place-b" },
    ],
    actors: ["actor-1", "actor-2"],
    presentAt: {
      "actor-1": "place-a",
      "actor-2": "place-b",
    },
    access: {
      "actor-1": [],
      "actor-2": [],
    },
    control: {
      "site-mill-a": null,
      "site-mill-other": null,
      "site-mill-b": null,
    },
    capabilities: {
      "actor-1": ["Direct", "Extract", "Transform", "Haul"],
      "actor-2": ["Direct", "Erect"],
    },
    depositRemaining: {
      "site-mill-a": 1,
      "site-mill-other": 1,
      "site-mill-b": 0,
    },
    siteAggregate: {
      "site-mill-a": "deposit",
      "site-mill-other": "deposit",
      "site-mill-b": "deposit",
    },
  };
}

export function materialSemanticsFixture(): WorldSeed {
  return materialDependencyFixture();
}

export function fedWorksFixture(): WorldSeed {
  return {
    places: ["place-vein", "place-works"],
    contains: [],
    connects: [["place-vein", "place-works"]],
    sites: [
      { id: "site-vein", situatedAt: "place-vein" },
      { id: "site-works", situatedAt: "place-works" },
    ],
    actors: ["actor-1", "actor-2"],
    presentAt: {
      "actor-1": "place-vein",
      "actor-2": "place-works",
    },
    access: {
      "actor-1": [],
      "actor-2": [],
    },
    control: {
      "site-vein": null,
      "site-works": null,
    },
    capabilities: {
      "actor-1": ["Extract", "Haul"],
      "actor-2": ["Transform"],
    },
    depositRemaining: {
      "site-vein": 2,
    },
    siteAggregate: {
      "site-vein": "deposit",
    },
    works: { siteId: "site-works", inputKind: "site-vein" },
  };
}

export function gatedWorksFixture(): WorldSeed {
  return {
    places: ["place-a", "place-b", "place-c"],
    contains: [],
    connects: [
      ["place-a", "place-b"],
      ["place-b", "place-c"],
    ],
    sites: [
      { id: "site-vein", situatedAt: "place-a" },
      { id: "site-gate", situatedAt: "place-b" },
      { id: "site-works", situatedAt: "place-c" },
    ],
    actors: ["actor-1", "actor-2"],
    presentAt: {
      "actor-1": "place-a",
      "actor-2": "place-c",
    },
    access: {
      "actor-1": [],
      "actor-2": [],
    },
    control: {
      "site-vein": null,
      "site-gate": null,
      "site-works": null,
    },
    capabilities: {
      "actor-1": ["Extract", "Haul", "Direct"],
      "actor-2": ["Transform", "Haul", "Direct"],
    },
    depositRemaining: {
      "site-vein": 2,
    },
    siteAggregate: {
      "site-vein": "deposit",
    },
    gate: { siteId: "site-gate", state: "open" },
    works: { siteId: "site-works", inputKind: "site-vein" },
  };
}

export function divergentWorksFixture(): WorldSeed {
  return {
    places: ["place-a", "place-b", "place-c", "place-d"],
    contains: [],
    connects: [
      ["place-a", "place-b"],
      ["place-b", "place-c"],
      ["place-b", "place-d"],
    ],
    sites: [
      { id: "site-vein", situatedAt: "place-a" },
      { id: "site-gate", situatedAt: "place-b" },
      { id: "site-works-a", situatedAt: "place-c" },
      { id: "site-works-b", situatedAt: "place-d" },
    ],
    actors: ["actor-1", "actor-2", "actor-3"],
    presentAt: {
      "actor-1": "place-a",
      "actor-2": "place-c",
      "actor-3": "place-d",
    },
    access: {
      "actor-1": [],
      "actor-2": [],
      "actor-3": [],
    },
    control: {
      "site-vein": null,
      "site-gate": null,
      "site-works-a": null,
      "site-works-b": null,
    },
    capabilities: {
      "actor-1": ["Extract", "Haul", "Direct"],
      "actor-2": ["Transform", "Haul", "Direct"],
      "actor-3": ["Transform", "Direct"],
    },
    depositRemaining: {
      "site-vein": 2,
    },
    siteAggregate: {
      "site-vein": "deposit",
    },
    gate: { siteId: "site-gate", state: "open" },
    works: [
      {
        siteId: "site-works-a",
        inputKind: "site-vein",
        outputKind: "lot-bloom",
      },
      {
        siteId: "site-works-b",
        inputKind: "site-vein",
        outputKind: "lot-ingot",
      },
    ],
  };
}

export function ingotSeatFixture(): WorldSeed {
  return {
    places: ["place-a", "place-b", "place-c", "place-d"],
    contains: [],
    connects: [
      ["place-a", "place-b"],
      ["place-b", "place-c"],
      ["place-b", "place-d"],
    ],
    sites: [
      { id: "site-vein", situatedAt: "place-a" },
      { id: "site-gate", situatedAt: "place-b" },
      { id: "site-works-a", situatedAt: "place-c" },
      { id: "site-works-b", situatedAt: "place-d" },
      { id: "site-post", situatedAt: "place-d" },
    ],
    actors: ["actor-1", "actor-2", "actor-3"],
    presentAt: {
      "actor-1": "place-a",
      "actor-2": "place-c",
      "actor-3": "place-d",
    },
    access: {
      "actor-1": [],
      "actor-2": [],
      "actor-3": [],
    },
    control: {
      "site-vein": null,
      "site-gate": null,
      "site-works-a": null,
      "site-works-b": null,
      "site-post": null,
    },
    capabilities: {
      "actor-1": ["Extract", "Haul", "Direct"],
      "actor-2": ["Transform", "Haul", "Direct"],
      "actor-3": ["Transform", "Erect", "Direct"],
    },
    depositRemaining: {
      "site-vein": 1,
      "site-post": 0,
    },
    siteAggregate: {
      "site-vein": "deposit",
      "site-post": "deposit",
    },
    gate: { siteId: "site-gate", state: "open" },
    works: [
      {
        siteId: "site-works-a",
        inputKind: "site-vein",
        outputKind: "lot-bloom",
      },
      {
        siteId: "site-works-b",
        inputKind: "site-vein",
        outputKind: "lot-ingot",
      },
    ],
    seatTarget: {
      siteId: "site-post",
      requiresLotKind: "lot-ingot",
    },
  };
}

export function postBridgeFixture(): WorldSeed {
  return {
    places: ["place-a", "place-b", "place-c"],
    contains: [],
    connects: [["place-a", "place-b"]],
    sites: [
      { id: "site-vein", situatedAt: "place-a" },
      { id: "site-works-a", situatedAt: "place-a" },
      { id: "site-works-b", situatedAt: "place-b" },
      { id: "site-post", situatedAt: "place-b" },
      { id: "site-lookout", situatedAt: "place-c" },
    ],
    actors: ["actor-1", "actor-2", "actor-3"],
    presentAt: {
      "actor-1": "place-a",
      "actor-2": "place-b",
      "actor-3": "place-c",
    },
    access: {
      "actor-1": [],
      "actor-2": [],
      "actor-3": [],
    },
    control: {
      "site-vein": null,
      "site-works-a": null,
      "site-works-b": null,
      "site-post": null,
      "site-lookout": null,
    },
    capabilities: {
      "actor-1": ["Extract", "Transform", "Haul", "Direct"],
      "actor-2": ["Transform", "Haul", "Erect"],
      "actor-3": ["Haul"],
    },
    depositRemaining: {
      "site-vein": 2,
      "site-post": 0,
    },
    siteAggregate: {
      "site-vein": "deposit",
      "site-post": "deposit",
    },
    works: [
      {
        siteId: "site-works-a",
        inputKind: "site-vein",
        outputKind: "lot-bloom",
      },
      {
        siteId: "site-works-b",
        inputKind: "site-vein",
        outputKind: "lot-ingot",
      },
    ],
    seatTarget: {
      siteId: "site-post",
      requiresLotKind: "lot-ingot",
      createsConnection: ["place-b", "place-c"],
    },
  };
}

export function postBridgeRaceFixture(): WorldSeed {
  return {
    places: ["place-a", "place-b", "place-c"],
    contains: [],
    connects: [["place-a", "place-b"]],
    sites: [
      { id: "site-vein", situatedAt: "place-a" },
      { id: "site-works-a", situatedAt: "place-a" },
      { id: "site-works-b", situatedAt: "place-b" },
      { id: "site-post", situatedAt: "place-b" },
      { id: "site-gate", situatedAt: "place-c" },
    ],
    actors: ["actor-1", "actor-2"],
    presentAt: {
      "actor-1": "place-a",
      "actor-2": "place-b",
    },
    access: {
      "actor-1": [],
      "actor-2": [],
    },
    control: {
      "site-vein": null,
      "site-works-a": null,
      "site-works-b": null,
      "site-post": null,
      "site-gate": null,
    },
    capabilities: {
      "actor-1": ["Extract", "Transform", "Haul", "Direct", "Erect"],
      "actor-2": ["Transform", "Haul", "Erect", "Direct"],
    },
    depositRemaining: {
      "site-vein": 2,
      "site-post": 0,
    },
    siteAggregate: {
      "site-vein": "deposit",
      "site-post": "deposit",
    },
    works: [
      {
        siteId: "site-works-a",
        inputKind: "site-vein",
        outputKind: "lot-bloom",
      },
      {
        siteId: "site-works-b",
        inputKind: "site-vein",
        outputKind: "lot-ingot",
      },
    ],
    seatTarget: {
      siteId: "site-post",
      requiresLotKind: "lot-ingot",
      createsConnection: ["place-b", "place-c"],
    },
    gate: { siteId: "site-gate", state: "open" },
  };
}

export function postBridgeWorksFixture(): WorldSeed {
  return {
    places: ["place-a", "place-b", "place-c"],
    contains: [],
    connects: [["place-a", "place-b"]],
    sites: [
      { id: "site-vein", situatedAt: "place-a" },
      { id: "site-works-a", situatedAt: "place-a" },
      { id: "site-works-b", situatedAt: "place-b" },
      { id: "site-post", situatedAt: "place-b" },
      { id: "site-works-c", situatedAt: "place-c" },
    ],
    actors: ["actor-1"],
    presentAt: {
      "actor-1": "place-a",
    },
    access: {
      "actor-1": [],
    },
    control: {
      "site-vein": null,
      "site-works-a": null,
      "site-works-b": null,
      "site-post": null,
      "site-works-c": null,
    },
    capabilities: {
      "actor-1": ["Extract", "Transform", "Haul", "Erect"],
    },
    depositRemaining: {
      "site-vein": 2,
      "site-post": 0,
    },
    siteAggregate: {
      "site-vein": "deposit",
      "site-post": "deposit",
    },
    works: [
      {
        siteId: "site-works-a",
        inputKind: "site-vein",
        outputKind: "lot-bloom",
      },
      {
        siteId: "site-works-b",
        inputKind: "site-vein",
        outputKind: "lot-ingot",
      },
      {
        siteId: "site-works-c",
        inputKind: "site-vein",
        outputKind: "lot-plate",
      },
    ],
    seatTarget: {
      siteId: "site-post",
      requiresLotKind: "lot-ingot",
      createsConnection: ["place-b", "place-c"],
    },
  };
}

export function twoBasinsPlaytestFixture(): WorldSeed {
  return {
    places: ["place-a", "place-b", "place-c", "place-d"],
    contains: [],
    connects: [
      ["place-a", "place-b"],
      ["place-c", "place-d"],
    ],
    sites: [
      { id: "site-vein", situatedAt: "place-a" },
      { id: "site-works-b", situatedAt: "place-b" },
      { id: "site-post", situatedAt: "place-b" },
      { id: "site-gate", situatedAt: "place-c" },
      { id: "site-mill", situatedAt: "place-d" },
    ],
    actors: ["actor-1", "actor-2"],
    presentAt: {
      "actor-1": "place-a",
      "actor-2": "place-b",
    },
    access: {
      "actor-1": [],
      "actor-2": [],
    },
    control: {
      "site-vein": null,
      "site-works-b": null,
      "site-post": null,
      "site-gate": null,
      "site-mill": null,
    },
    capabilities: {
      "actor-1": ["Extract", "Haul", "Transform", "Erect", "Direct"],
      "actor-2": ["Transform", "Haul", "Erect", "Direct"],
    },
    depositRemaining: {
      "site-vein": 1,
      "site-post": 0,
      "site-mill": 1,
    },
    siteAggregate: {
      "site-vein": "deposit",
      "site-post": "deposit",
      "site-mill": "deposit",
    },
    works: [
      {
        siteId: "site-works-b",
        inputKind: "site-vein",
        outputKind: "lot-ingot",
      },
    ],
    seatTarget: {
      siteId: "site-post",
      requiresLotKind: "lot-ingot",
      createsConnection: ["place-b", "place-c"],
    },
    gate: { siteId: "site-gate", state: "open" },
  };
}

export function createSession(seed: WorldSeed) {
  const knowledge = {
    knows(_issuer: string, _subject: string) {
      return false;
    },
  };
  const world = new WorldDomain(seed, knowledge);
  const information = new InformationDomain({
    isSiteObservableTo: (issuer, subject) =>
      world.isSiteObservableTo(issuer, subject),
  });
  knowledge.knows = (issuer, subject) =>
    information.hasKnowledgeOf(issuer, subject);

  return {
    observe(issuer: string): Observation {
      const worldView = world.observe(issuer);
      const infoView = information.observe(issuer);
      return freezeDeep({
        issuerId: worldView.issuerId,
        at: worldView.at,
        presentHere: worldView.presentHere,
        siteIdsHere: worldView.siteIdsHere,
        accessHere: worldView.accessHere,
        controlHere: worldView.controlHere,
        knowledgeOf: infoView.knowledgeOf,
        heldIntelIds: infoView.heldIntelIds,
        capabilities: worldView.capabilities,
        depositRemainingHere: worldView.depositRemainingHere,
        siteAggregateHere: worldView.siteAggregateHere,
        gateStateHere: worldView.gateStateHere,
        lotsHere: worldView.lotsHere,
        occurrences: [...worldView.occurrences, ...infoView.occurrences],
      });
    },
    submit(intent: Intent): Result {
      switch (intent.home) {
        case "World":
          return world.submit(intent);
        case "Information":
          return information.submit(intent);
        default: {
          const exhaustive: never = intent.home;
          return exhaustive;
        }
      }
    },
    inspectCanonicalForTests(): CanonicalSnapshot {
      return world.snapshot();
    },
  };
}

function freezeDeep<T>(value: T): T {
  if (value !== null && typeof value === "object") {
    for (const nested of Object.values(value)) {
      freezeDeep(nested);
    }
    Object.freeze(value);
  }
  return value;
}
