export type EntityId = string;

export type DomainId = "World" | "Information";

export type IntentKind =
  | "ChangePresence"
  | "Assimilate"
  | "ChangeAggregate"
  | "ChangeControl";

export type Capability = "Extract" | "Transform" | "Erect" | "Direct" | "Haul";

export type SiteAggregate = "deposit" | "extracted" | "transformed" | "seated";

export type Lot = {
  id: EntityId;
  kind: EntityId;
  quantity: number;
  at: EntityId;
};

export type GateState = "open" | "eased" | "held" | "scarred";

export type Intent = {
  issuer: EntityId;
  home: DomainId;
  kind: IntentKind;
  subjects: Record<string, EntityId>;
};

export type Occurrence = {
  id: EntityId;
  source: DomainId;
  kind: string;
  subjects: Record<string, EntityId>;
};

export type AcceptedResult = {
  status: "accepted";
  home: DomainId;
  kind: IntentKind;
  occurrenceIds: EntityId[];
};

export type RejectedResult = {
  status: "rejected";
  home: DomainId;
  kind: IntentKind;
  reason: string;
};

export type Result = AcceptedResult | RejectedResult;

export type Observation = {
  issuerId: EntityId;
  at: EntityId | null;
  presentHere: EntityId[];
  siteIdsHere: EntityId[];
  accessHere: EntityId[];
  controlHere: Record<EntityId, EntityId | null>;
  knowledgeOf: EntityId[];
  heldIntelIds: EntityId[];
  capabilities: Capability[];
  depositRemainingHere: Record<EntityId, number>;
  siteAggregateHere: Record<EntityId, SiteAggregate>;
  gateStateHere: Record<EntityId, GateState>;
  lotsHere: ReadonlyArray<Lot>;
  occurrences: ReadonlyArray<Occurrence>;
};

export type CanonicalSnapshot = {
  placeIds: EntityId[];
  siteAt: Record<EntityId, EntityId>;
  actorIds: EntityId[];
  presentAt: Record<EntityId, EntityId>;
  access: Record<EntityId, EntityId[]>;
  control: Record<EntityId, EntityId | null>;
  connects: Array<[EntityId, EntityId]>;
  contains: Array<[EntityId, EntityId]>;
  occurrenceKinds: string[];
  occurrenceSources: DomainId[];
  depositRemaining: Record<EntityId, number>;
  siteAggregate: Record<EntityId, SiteAggregate>;
  gateState: Record<EntityId, GateState>;
  lots: Lot[];
};
