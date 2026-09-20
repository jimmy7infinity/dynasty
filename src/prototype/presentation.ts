import type {
  Capability,
  EntityId,
  GateState,
  Observation,
  Result,
} from "../kernel.js";
import type { Intent } from "../kernel.js";

export const ACTOR_ONE = "actor-1";
export const ACTOR_TWO = "actor-2";

export type Selection =
  | { kind: "place"; id: EntityId }
  | { kind: "site"; id: EntityId }
  | { kind: "lot"; id: EntityId };

export type PresentedAction = {
  label: string;
  intent: Intent;
};

function exhaustive(value: never): never {
  return value;
}

export function placeName(id: EntityId): string {
  switch (id) {
    case "place-a":
      return "the Cut";
    case "place-b":
      return "the Yard";
    case "place-c":
      return "the Crossing";
    case "place-d":
      return "the Hollow";
    default:
      return "this ground";
  }
}

export function titleCasePlace(id: EntityId): string {
  const name = placeName(id);
  if (name.startsWith("the ")) {
    return `The ${name.slice(4)}`;
  }
  return name;
}

export function actorName(id: EntityId): string {
  switch (id) {
    case ACTOR_ONE:
      return "First";
    case ACTOR_TWO:
      return "Second";
    default:
      return "someone";
  }
}

export function siteName(id: EntityId): string {
  switch (id) {
    case "site-vein":
      return "Vein";
    case "site-works-b":
      return "Works";
    case "site-post":
      return "Post";
    case "site-gate":
      return "Gate";
    case "site-mill":
      return "Mill";
    default:
      return "a feature of this ground";
  }
}

export function lotName(kind: EntityId): string {
  switch (kind) {
    case "site-vein":
      return "ore";
    case "lot-ingot":
      return "ingot";
    case "lot-bloom":
      return "bloom";
    case "lot-plate":
      return "plate";
    case "site-mill":
      return "mill stone";
    default:
      return "material";
  }
}

export function depositCopy(remaining: number): string {
  if (remaining <= 0) {
    return "Nothing left in it.";
  }
  if (remaining === 1) {
    return "A small remaining deposit.";
  }
  return "A remaining deposit.";
}

export function gateCopy(state: GateState): string {
  switch (state) {
    case "open":
      return "open";
    case "eased":
      return "eased";
    case "held":
      return "held";
    case "scarred":
      return "scarred";
    default: {
      const neverState: never = state;
      return exhaustive(neverState);
    }
  }
}

export function neighborsOf(
  place: EntityId,
  connects: Array<[EntityId, EntityId]>,
): EntityId[] {
  const found: EntityId[] = [];
  for (const [left, right] of connects) {
    if (left === place) {
      found.push(right);
    } else if (right === place) {
      found.push(left);
    }
  }
  return found.sort();
}

export function edgeKey(left: EntityId, right: EntityId): string {
  return [left, right].sort().join("::");
}

export function parseEdge(key: string): [EntityId, EntityId] {
  const [left, right] = key.split("::") as [EntityId, EntityId];
  return [left, right];
}

export function resultCopy(result: Result): string {
  if (result.status === "accepted") {
    return "The World changed.";
  }
  return rejectCopy(result.reason);
}

export function rejectCopy(reason: string): string {
  switch (reason) {
    case "places are not connected":
      return "There is no way through from here.";
    case "gate is held":
      return "The way is held shut.";
    case "issuer lacks knowledge-of subject":
      return "You have not looked closely enough.";
    case "missing Extract capability":
      return "You cannot draw from this.";
    case "missing Transform capability":
      return "You cannot work this.";
    case "missing Erect capability":
      return "You cannot set this.";
    case "missing Haul capability":
      return "You cannot move this.";
    case "missing Direct capability":
      return "You cannot set this gate.";
    case "required lot not present":
      return "The needed material is not here.";
    case "issuer not present at site":
      return "You are not standing here.";
    case "issuer not present at lot":
      return "You are not with that material.";
    case "deposit exhausted":
      return "There is nothing left.";
    case "subject not observable to issuer":
      return "You cannot look at that from here.";
    case "already assimilated":
      return "You already know this.";
    case "site is not controllable":
      return "This cannot be taken in hand.";
    case "control is occupied":
      return "Someone already holds this.";
    case "issuer does not control site":
      return "You do not hold this.";
    case "illegal gate stance":
      return "The gate will not take that.";
    case "aggregate is not extracted":
      return "This is not ready.";
    case "unknown destination":
      return "That ground is not here.";
    default:
      return "That did not take.";
  }
}

export function hasCapability(
  observation: Observation,
  capability: Capability,
): boolean {
  return observation.capabilities.includes(capability);
}

export function inspectLines(
  selection: Selection,
  issuer: EntityId,
  observation: Observation,
): string[] {
  switch (selection.kind) {
    case "place": {
      if (observation.at === selection.id) {
        const others = observation.presentHere.filter((id) => id !== issuer);
        if (others.length === 0) {
          return ["You are here.", "You are alone."];
        }
        return [
          "You are here.",
          `Also here: ${others.map((id) => actorName(id)).join(", ")}.`,
        ];
      }
      return ["A way leads here."];
    }
    case "site": {
      const site = selection.id;
      const known = observation.knowledgeOf.includes(site);
      if (!known) {
        return ["Something stands here.", "You have not looked closely."];
      }
      const lines = [siteName(site)];
      const remaining = observation.depositRemainingHere[site];
      if (
        remaining !== undefined &&
        site !== "site-gate" &&
        site !== "site-works-b" &&
        site !== "site-post"
      ) {
        lines.push(depositCopy(remaining));
      }
      const gate = observation.gateStateHere[site];
      if (gate !== undefined) {
        lines.push(`The way through is ${gateCopy(gate)}.`);
      }
      const controller = observation.controlHere[site];
      if (controller === issuer) {
        lines.push("You hold this.");
      } else if (controller) {
        lines.push(`${actorName(controller)} holds this.`);
      }
      return lines;
    }
    case "lot": {
      const lot = observation.lotsHere.find((item) => item.id === selection.id);
      if (lot === undefined) {
        return ["The material is gone."];
      }
      return [
        `${lotName(lot.kind)} on the ground.`,
        "If you take a way out, this can go with you.",
      ];
    }
    default: {
      const neverSel: never = selection;
      return exhaustive(neverSel);
    }
  }
}

export function contextActions(
  selection: Selection,
  issuer: EntityId,
  observation: Observation,
): PresentedAction[] {
  switch (selection.kind) {
    case "place":
      return [];
    case "lot":
      return [];
    case "site": {
      const site = selection.id;
      if (!observation.siteIdsHere.includes(site)) {
        return [];
      }
      if (!observation.knowledgeOf.includes(site)) {
        return [
          {
            label: "Look closer",
            intent: {
              issuer,
              home: "Information",
              kind: "Assimilate",
              subjects: { subject: site },
            },
          },
        ];
      }
      const actions: PresentedAction[] = [];
      const remaining = observation.depositRemainingHere[site] ?? 0;
      if (hasCapability(observation, "Extract") && remaining > 0) {
        actions.push({
          label: "Work it",
          intent: {
            issuer,
            home: "World",
            kind: "ChangeAggregate",
            subjects: { site, mode: "extract" },
          },
        });
      } else if (hasCapability(observation, "Transform") && remaining > 0) {
        actions.push({
          label: "Work it",
          intent: {
            issuer,
            home: "World",
            kind: "ChangeAggregate",
            subjects: { site, mode: "transform" },
          },
        });
      }
      if (
        hasCapability(observation, "Erect") &&
        (site === "site-post" || site === "site-mill")
      ) {
        actions.push({
          label: "Set it",
          intent: {
            issuer,
            home: "World",
            kind: "ChangeAggregate",
            subjects: { site, mode: "seat" },
          },
        });
      }
      if (hasCapability(observation, "Transform") && site === "site-works-b") {
        actions.push({
          label: "Work it",
          intent: {
            issuer,
            home: "World",
            kind: "ChangeAggregate",
            subjects: { site, mode: "process" },
          },
        });
      }
      const gate = observation.gateStateHere[site];
      if (gate !== undefined && hasCapability(observation, "Direct")) {
        if (gate === "open" || gate === "eased" || gate === "scarred") {
          actions.push({
            label: "Hold",
            intent: {
              issuer,
              home: "World",
              kind: "ChangeAggregate",
              subjects: { site, mode: "hold" },
            },
          });
        }
        if (gate === "open") {
          actions.push({
            label: "Ease",
            intent: {
              issuer,
              home: "World",
              kind: "ChangeAggregate",
              subjects: { site, mode: "ease" },
            },
          });
        }
        if (gate === "held" || gate === "eased") {
          actions.push({
            label: "Release",
            intent: {
              issuer,
              home: "World",
              kind: "ChangeAggregate",
              subjects: { site, mode: "release" },
            },
          });
        }
      }
      const controller = observation.controlHere[site];
      if (site === "site-gate" || site === "site-works-b") {
        if (controller === null) {
          actions.push({
            label: "Take in hand",
            intent: {
              issuer,
              home: "World",
              kind: "ChangeControl",
              subjects: { site, mode: "establish" },
            },
          });
        } else if (controller === issuer) {
          actions.push({
            label: "Let go",
            intent: {
              issuer,
              home: "World",
              kind: "ChangeControl",
              subjects: { site, mode: "relinquish" },
            },
          });
        }
      }
      return actions;
    }
    default: {
      const neverSel: never = selection;
      return exhaustive(neverSel);
    }
  }
}

export function travelIntent(issuer: EntityId, destination: EntityId): Intent {
  return {
    issuer,
    home: "World",
    kind: "ChangePresence",
    subjects: { destination },
  };
}

export function haulIntent(
  issuer: EntityId,
  lot: EntityId,
  destination: EntityId,
): Intent {
  return {
    issuer,
    home: "World",
    kind: "ChangePresence",
    subjects: { lot, destination },
  };
}
