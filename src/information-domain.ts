import type {
  EntityId,
  Intent,
  Occurrence,
  Result,
} from "./kernel.js";

export type WorldObservabilityQuery = {
  isSiteObservableTo(issuer: EntityId, subject: EntityId): boolean;
};

type InformationObservation = {
  knowledgeOf: EntityId[];
  heldIntelIds: EntityId[];
  occurrences: Occurrence[];
};

export class InformationDomain {
  private readonly knowledgeOf = new Map<EntityId, Set<EntityId>>();
  private readonly holds = new Map<EntityId, Set<EntityId>>();
  private readonly intelAbout = new Map<EntityId, EntityId>();
  private readonly occurrences: Occurrence[] = [];
  private nextIntel = 1;
  private nextOccurrence = 1;

  constructor(private readonly worldQuery: WorldObservabilityQuery) {}

  submit(intent: Intent): Result {
    if (intent.home !== "Information") {
      return reject(intent, "home is not Information");
    }
    switch (intent.kind) {
      case "Assimilate":
        return this.assimilate(intent);
      case "ChangePresence":
      case "ChangeAggregate":
      case "ChangeControl":
        return reject(intent, "kind not owned by Information");
      default: {
        const exhaustive: never = intent.kind;
        return exhaustive;
      }
    }
  }

  observe(issuer: EntityId): InformationObservation {
    const knowledgeOf = [...(this.knowledgeOf.get(issuer) ?? [])].sort();
    const heldIntelIds = [...(this.holds.get(issuer) ?? [])].sort();
    const occurrences = this.occurrences
      .filter((occurrence) => occurrence.subjects.actor === issuer)
      .map((occurrence) => ({
        ...occurrence,
        subjects: { ...occurrence.subjects },
      }));
    return {
      knowledgeOf,
      heldIntelIds,
      occurrences,
    };
  }

  hasKnowledgeOf(issuer: EntityId, subject: EntityId): boolean {
    return this.knowledgeOf.get(issuer)?.has(subject) === true;
  }

  private assimilate(intent: Intent): Result {
    const subject = intent.subjects.subject;
    if (subject === undefined) {
      return reject(intent, "missing subject");
    }
    if (!this.worldQuery.isSiteObservableTo(intent.issuer, subject)) {
      return reject(intent, "subject not observable to issuer");
    }
    const known = this.knowledgeOf.get(intent.issuer) ?? new Set();
    if (known.has(subject)) {
      return reject(intent, "already assimilated");
    }
    known.add(subject);
    this.knowledgeOf.set(intent.issuer, known);

    const intelId = `intel-${this.nextIntel}`;
    this.nextIntel += 1;
    this.intelAbout.set(intelId, subject);
    const held = this.holds.get(intent.issuer) ?? new Set();
    held.add(intelId);
    this.holds.set(intent.issuer, held);

    const occurrence: Occurrence = {
      id: `info-occ-${this.nextOccurrence}`,
      source: "Information",
      kind: "Discovered",
      subjects: {
        actor: intent.issuer,
        subject,
        intel: intelId,
      },
    };
    this.nextOccurrence += 1;
    this.occurrences.push(occurrence);

    return {
      status: "accepted",
      home: "Information",
      kind: "Assimilate",
      occurrenceIds: [occurrence.id],
    };
  }
}

function reject(intent: Intent, reason: string): Result {
  return {
    status: "rejected",
    home: intent.home,
    kind: intent.kind,
    reason,
  };
}
