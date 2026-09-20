import type {
  CanonicalSnapshot,
  Capability,
  EntityId,
  GateState,
  Intent,
  Lot,
  Observation,
  Occurrence,
  Result,
  SiteAggregate,
} from "./kernel.js";

export type KnowledgeQuery = {
  knows(issuer: EntityId, subject: EntityId): boolean;
};

export type GateSeed = {
  siteId: EntityId;
  state: GateState;
  millSiteId?: EntityId;
};

export type WorksSeed = {
  siteId: EntityId;
  inputKind: EntityId;
  outputKind?: EntityId;
};

export type WorldSeed = {
  places: EntityId[];
  contains: Array<[EntityId, EntityId]>;
  connects: Array<[EntityId, EntityId]>;
  sites: Array<{
    id: EntityId;
    situatedAt: EntityId;
  }>;
  actors: EntityId[];
  presentAt: Record<EntityId, EntityId>;
  access: Record<EntityId, EntityId[]>;
  control: Record<EntityId, EntityId | null>;
  capabilities: Record<EntityId, Capability[]>;
  depositRemaining: Record<EntityId, number>;
  siteAggregate: Record<EntityId, SiteAggregate>;
  gate?: GateSeed;
  gates?: GateSeed[];
  works?: WorksSeed | WorksSeed[];
  seatTarget?: SeatTargetSeed;
};

export type SeatTargetSeed = {
  siteId: EntityId;
  requiresLotKind: EntityId;
  createsConnection?: [EntityId, EntityId];
};

type GateRecord = {
  siteId: EntityId;
  state: GateState;
  easeDestroyed: boolean;
  millSiteId: EntityId | null;
};

type WorksRecord = {
  siteId: EntityId;
  inputKind: EntityId;
  outputKind: EntityId;
};

export class WorldDomain {
  private readonly places: Set<EntityId>;
  private readonly contains: Array<[EntityId, EntityId]>;
  private readonly connects: Set<string>;
  private readonly siteAt: Map<EntityId, EntityId>;
  private readonly actors: Set<EntityId>;
  private readonly presentAt: Map<EntityId, EntityId>;
  private readonly access: Map<EntityId, Set<EntityId>>;
  private readonly control: Map<EntityId, EntityId | null>;
  private readonly capabilities: Map<EntityId, Set<Capability>>;
  private readonly depositRemaining: Map<EntityId, number>;
  private readonly siteAggregate: Map<EntityId, SiteAggregate>;
  private readonly gates: GateRecord[];
  private readonly works: WorksRecord[];
  private readonly seatTarget: SeatTargetSeed | null;
  private readonly lots: Lot[] = [];
  private readonly occurrences: Occurrence[] = [];
  private nextLot = 1;
  private nextOccurrence = 1;

  constructor(
    seed: WorldSeed,
    private readonly knowledge: KnowledgeQuery,
  ) {
    this.places = new Set(seed.places);
    this.contains = seed.contains.map(([parent, child]) => [parent, child]);
    this.connects = new Set(
      seed.connects.map(([left, right]) => edgeKey(left, right)),
    );
    this.siteAt = new Map(
      seed.sites.map((site) => [site.id, site.situatedAt]),
    );
    this.actors = new Set(seed.actors);
    this.presentAt = new Map(Object.entries(seed.presentAt));
    this.access = new Map(
      Object.entries(seed.access).map(([actor, sites]) => [
        actor,
        new Set(sites),
      ]),
    );
    this.control = new Map(Object.entries(seed.control));
    this.capabilities = new Map(
      Object.entries(seed.capabilities).map(([actor, caps]) => [
        actor,
        new Set(caps),
      ]),
    );
    this.depositRemaining = new Map(Object.entries(seed.depositRemaining));
    this.siteAggregate = new Map(Object.entries(seed.siteAggregate));
    const gateSeeds = seed.gates ?? (seed.gate === undefined ? [] : [seed.gate]);
    this.gates = gateSeeds.map((item) => ({
      siteId: item.siteId,
      state: item.state,
      easeDestroyed: false,
      millSiteId: item.millSiteId ?? null,
    }));
    const worksSeeds = seed.works === undefined
      ? []
      : Array.isArray(seed.works)
        ? seed.works
        : [seed.works];
    this.works = worksSeeds.map((item) => ({
      siteId: item.siteId,
      inputKind: item.inputKind,
      outputKind: item.outputKind ?? item.siteId,
    }));
    this.seatTarget = seed.seatTarget ?? null;
  }

  submit(intent: Intent): Result {
    if (intent.home !== "World") {
      return reject(intent, "home is not World");
    }
    if (!this.actors.has(intent.issuer)) {
      return reject(intent, "unknown issuer");
    }
    switch (intent.kind) {
      case "ChangePresence":
        return this.changePresence(intent);
      case "ChangeAggregate":
        return this.changeAggregate(intent);
      case "ChangeControl":
        return this.changeControl(intent);
      case "Assimilate":
        return reject(intent, "kind not owned by World");
      default: {
        const exhaustive: never = intent.kind;
        return exhaustive;
      }
    }
  }

  observe(issuer: EntityId): Observation {
    const at = this.presentAt.get(issuer) ?? null;
    const presentHere = [...this.presentAt.entries()]
      .filter(([, place]) => place === at)
      .map(([actor]) => actor)
      .sort();
    const siteIdsHere = [...this.siteAt.entries()]
      .filter(([, place]) => place === at)
      .map(([site]) => site)
      .sort();
    const accessHere = [...(this.access.get(issuer) ?? [])]
      .filter((site) => siteIdsHere.includes(site))
      .sort();
    const controlHere: Record<EntityId, EntityId | null> = {};
    for (const site of siteIdsHere) {
      controlHere[site] = this.control.get(site) ?? null;
    }
    const depositRemainingHere: Record<EntityId, number> = {};
    const siteAggregateHere: Record<EntityId, SiteAggregate> = {};
    const gateStateHere: Record<EntityId, GateState> = {};
    for (const site of siteIdsHere) {
      depositRemainingHere[site] = this.depositRemaining.get(site) ?? 0;
      siteAggregateHere[site] = this.siteAggregate.get(site) ?? "deposit";
      const gateHere = this.gateAt(site);
      if (gateHere !== undefined) {
        gateStateHere[site] = gateHere.state;
      }
    }
    const capabilities = [...(this.capabilities.get(issuer) ?? [])].sort();
    const lotsHere = this.lots
      .filter((lot) => lot.at === at)
      .map((lot) => ({ ...lot }))
      .sort((left, right) => left.id.localeCompare(right.id));
    const occurrences = this.occurrences
      .filter((occurrence) => occurrence.subjects.actor === issuer)
      .map((occurrence) => ({
        ...occurrence,
        subjects: { ...occurrence.subjects },
      }));
    return freezeDeep({
      issuerId: issuer,
      at,
      presentHere,
      siteIdsHere,
      accessHere,
      controlHere,
      knowledgeOf: [] as EntityId[],
      heldIntelIds: [] as EntityId[],
      capabilities,
      depositRemainingHere,
      siteAggregateHere,
      gateStateHere,
      lotsHere,
      occurrences,
    });
  }

  snapshot(): CanonicalSnapshot {
    const control: Record<EntityId, EntityId | null> = {};
    for (const site of this.siteAt.keys()) {
      control[site] = this.control.get(site) ?? null;
    }
    const access: Record<EntityId, EntityId[]> = {};
    for (const actor of this.actors) {
      access[actor] = [...(this.access.get(actor) ?? [])].sort();
    }
    return structuredClone({
      placeIds: [...this.places].sort(),
      siteAt: Object.fromEntries(this.siteAt),
      actorIds: [...this.actors].sort(),
      presentAt: Object.fromEntries(this.presentAt),
      access,
      control,
      connects: [...this.connects].map(parseEdge).sort(),
      contains: this.contains.map(([parent, child]) => [parent, child]),
      occurrenceKinds: this.occurrences.map((item) => item.kind),
      occurrenceSources: this.occurrences.map((item) => item.source),
      depositRemaining: Object.fromEntries(this.depositRemaining),
      siteAggregate: Object.fromEntries(this.siteAggregate),
      gateState: Object.fromEntries(
        this.gates.map((item) => [item.siteId, item.state]),
      ),
      lots: this.lots.map((lot) => ({ ...lot })),
    });
  }

  private changePresence(intent: Intent): Result {
    if (intent.subjects.lot !== undefined) {
      return this.haulLot(intent);
    }
    const destination = intent.subjects.destination;
    if (destination === undefined || !this.places.has(destination)) {
      return reject(intent, "unknown destination");
    }
    const origin = this.presentAt.get(intent.issuer);
    if (origin === undefined) {
      return reject(intent, "issuer not present-at a Place");
    }
    if (!this.connected(origin, destination)) {
      return reject(intent, "places are not connected");
    }
    if (this.gateHeldOn(origin, destination)) {
      return reject(intent, "gate is held");
    }
    this.presentAt.set(intent.issuer, destination);
    const occurrence: Occurrence = {
      id: `occ-${this.nextOccurrence}`,
      source: "World",
      kind: "PresenceChanged",
      subjects: {
        actor: intent.issuer,
        from: origin,
        to: destination,
      },
    };
    this.nextOccurrence += 1;
    this.occurrences.push(occurrence);
    return {
      status: "accepted",
      home: "World",
      kind: "ChangePresence",
      occurrenceIds: [occurrence.id],
    };
  }

  private haulLot(intent: Intent): Result {
    if (!(this.capabilities.get(intent.issuer) ?? new Set()).has("Haul")) {
      return reject(intent, "missing Haul capability");
    }
    const lotId = intent.subjects.lot;
    const destination = intent.subjects.destination;
    if (lotId === undefined) {
      return reject(intent, "unknown lot");
    }
    if (destination === undefined || !this.places.has(destination)) {
      return reject(intent, "unknown destination");
    }
    const lot = this.lots.find((item) => item.id === lotId);
    if (lot === undefined) {
      return reject(intent, "unknown lot");
    }
    const origin = this.presentAt.get(intent.issuer);
    if (origin === undefined) {
      return reject(intent, "issuer not present-at a Place");
    }
    if (lot.at !== origin) {
      return reject(intent, "issuer not present at lot");
    }
    if (!this.connected(origin, destination)) {
      return reject(intent, "places are not connected");
    }
    if (this.gateHeldOn(origin, destination)) {
      return reject(intent, "gate is held");
    }
    const from = lot.at;
    lot.at = destination;
    const occurrence: Occurrence = {
      id: `occ-${this.nextOccurrence}`,
      source: "World",
      kind: "LotMoved",
      subjects: {
        actor: intent.issuer,
        lot: lot.id,
        from,
        to: destination,
      },
    };
    this.nextOccurrence += 1;
    this.occurrences.push(occurrence);
    return {
      status: "accepted",
      home: "World",
      kind: "ChangePresence",
      occurrenceIds: [occurrence.id],
    };
  }

  private changeAggregate(intent: Intent): Result {
    const mode = intent.subjects.mode;
    if (mode === "hold" || mode === "ease" || mode === "release") {
      return this.configureGate(intent, mode);
    }
    if (mode === "process") {
      return this.processWorks(intent);
    }
    if (mode !== "extract" && mode !== "transform" && mode !== "seat") {
      return reject(intent, "unsupported aggregate mode");
    }
    const site = intent.subjects.site;
    if (site === undefined || !this.siteAt.has(site)) {
      return reject(intent, "unknown site");
    }
    const required = requiredCapability(mode);
    if (!(this.capabilities.get(intent.issuer) ?? new Set()).has(required)) {
      return reject(intent, `missing ${required} capability`);
    }
    const origin = this.presentAt.get(intent.issuer);
    const situated = this.siteAt.get(site);
    if (origin === undefined || origin !== situated) {
      return reject(intent, "issuer not present at site");
    }
    if (!this.knowledge.knows(intent.issuer, site)) {
      return reject(intent, "issuer lacks knowledge-of subject");
    }
    const joined = this.gates.find((item) => item.millSiteId === site);
    if (
      (mode === "extract" || mode === "transform") &&
      joined !== undefined
    ) {
      const millBlocked = millBlockedByThisGate(mode, joined.state);
      if (millBlocked) {
        return reject(intent, millBlocked);
      }
    }
    if (mode === "seat") {
      const millPlace = this.siteAt.get(site);
      if (millPlace === undefined) {
        return reject(intent, "unknown site");
      }
      if (this.seatTarget !== null && this.seatTarget.siteId === site) {
        return this.seatRequiredLot(intent, site, millPlace);
      }
      const aggregate = this.siteAggregate.get(site) ?? "deposit";
      if (aggregate === "transformed" || aggregate === "seated") {
        return reject(intent, "aggregate is not extracted");
      }
      const lot = this.findSeatLot(site, millPlace);
      if (lot === null) {
        return reject(intent, "required lot not present");
      }
      this.removeLot(lot);
      const occurrence = this.applyAggregateMode(mode, site, intent.issuer, 0);
      return {
        status: "accepted",
        home: "World",
        kind: "ChangeAggregate",
        occurrenceIds: [occurrence.id],
      };
    }
    const aggregate = this.siteAggregate.get(site) ?? "deposit";
    if (mode === "extract") {
      if (aggregate === "transformed" || aggregate === "seated") {
        return reject(intent, "aggregate no longer a deposit");
      }
    } else if (aggregate !== "deposit") {
      return reject(intent, "aggregate no longer a deposit");
    }
    const remaining = this.depositRemaining.get(site) ?? 0;
    if (remaining <= 0) {
      return reject(intent, "deposit exhausted");
    }
    const occurrence = this.applyAggregateMode(mode, site, intent.issuer, remaining);
    return {
      status: "accepted",
      home: "World",
      kind: "ChangeAggregate",
      occurrenceIds: [occurrence.id],
    };
  }

  private configureGate(
    intent: Intent,
    mode: "hold" | "ease" | "release",
  ): Result {
    const site = intent.subjects.site;
    const gate = this.gateAt(site);
    if (site === undefined || gate === undefined) {
      return reject(intent, "unknown gate");
    }
    if (!(this.capabilities.get(intent.issuer) ?? new Set()).has("Direct")) {
      return reject(intent, "missing Direct capability");
    }
    const origin = this.presentAt.get(intent.issuer);
    const situated = this.siteAt.get(site);
    if (origin === undefined || origin !== situated) {
      return reject(intent, "issuer not present at site");
    }
    if (!this.knowledge.knows(intent.issuer, site)) {
      return reject(intent, "issuer lacks knowledge-of subject");
    }
    const controller = this.control.get(site) ?? null;
    if (controller !== null && controller !== intent.issuer) {
      return reject(intent, "issuer does not control site");
    }
    const next = nextGateState(mode, gate.state, gate.easeDestroyed);
    if (next === null) {
      return reject(intent, "illegal gate stance");
    }
    gate.state = next;
    if (next === "scarred") {
      gate.easeDestroyed = true;
    }
    const occurrence = this.recordWorldOccurrence("GateChanged", {
      actor: intent.issuer,
      site,
      mode,
    });
    return {
      status: "accepted",
      home: "World",
      kind: "ChangeAggregate",
      occurrenceIds: [occurrence.id],
    };
  }

  private processWorks(intent: Intent): Result {
    const site = intent.subjects.site;
    const works = this.worksAt(site);
    if (site === undefined || works === undefined) {
      return reject(intent, "unknown works");
    }
    if (!(this.capabilities.get(intent.issuer) ?? new Set()).has("Transform")) {
      return reject(intent, "missing Transform capability");
    }
    const origin = this.presentAt.get(intent.issuer);
    const situated = this.siteAt.get(site);
    if (origin === undefined || origin !== situated) {
      return reject(intent, "issuer not present at site");
    }
    if (!this.knowledge.knows(intent.issuer, site)) {
      return reject(intent, "issuer lacks knowledge-of subject");
    }
    const controller = this.control.get(site) ?? null;
    if (controller !== null && controller !== intent.issuer) {
      return reject(intent, "issuer does not control site");
    }
    if (situated === undefined) {
      return reject(intent, "unknown site");
    }
    const input = this.findProcessLot(works.inputKind, situated);
    if (input === null) {
      return reject(intent, "required lot not present");
    }
    this.removeLot(input);
    const created: Lot = {
      id: `lot-${this.nextLot}`,
      kind: works.outputKind,
      quantity: 1,
      at: situated,
    };
    this.nextLot += 1;
    this.lots.push(created);
    const occurrence = this.recordWorldOccurrence("LotProcessed", {
      actor: intent.issuer,
      site,
      consumed: input.id,
      created: created.id,
    });
    return {
      status: "accepted",
      home: "World",
      kind: "ChangeAggregate",
      occurrenceIds: [occurrence.id],
    };
  }

  private seatRequiredLot(
    intent: Intent,
    site: EntityId,
    place: EntityId,
  ): Result {
    const aggregate = this.siteAggregate.get(site) ?? "deposit";
    if (aggregate === "seated") {
      return reject(intent, "aggregate is not extracted");
    }
    const requiredKind = this.seatTarget?.requiresLotKind;
    if (requiredKind === undefined) {
      return reject(intent, "required lot not present");
    }
    const matching = this.lots
      .filter((lot) => lot.at === place && lot.kind === requiredKind)
      .sort((left, right) => left.id.localeCompare(right.id));
    const lot = matching[0];
    if (lot === undefined) {
      return reject(intent, "required lot not present");
    }
    this.removeLot(lot);
    const occurrence = this.applyAggregateMode("seat", site, intent.issuer, 0);
    const link = this.seatTarget?.createsConnection;
    if (link !== undefined) {
      this.connects.add(edgeKey(link[0], link[1]));
    }
    return {
      status: "accepted",
      home: "World",
      kind: "ChangeAggregate",
      occurrenceIds: [occurrence.id],
    };
  }

  private changeControl(intent: Intent): Result {
    const mode = intent.subjects.mode;
    if (mode !== "establish" && mode !== "relinquish") {
      return reject(intent, "unsupported control mode");
    }
    const site = intent.subjects.site;
    if (site === undefined || !this.isControllableSite(site)) {
      return reject(intent, "site is not controllable");
    }
    const controller = this.control.get(site) ?? null;
    switch (mode) {
      case "establish":
        return this.establishControl(intent, site, controller);
      case "relinquish":
        return this.relinquishControl(intent, site, controller);
      default: {
        const exhaustive: never = mode;
        return exhaustive;
      }
    }
  }

  private isControllableSite(site: EntityId): boolean {
    if (this.gateAt(site) !== undefined) {
      return true;
    }
    return this.worksAt(site) !== undefined;
  }

  private worksAt(site: EntityId | undefined): WorksRecord | undefined {
    if (site === undefined) {
      return undefined;
    }
    return this.works.find((item) => item.siteId === site);
  }

  private establishControl(
    intent: Intent,
    site: EntityId,
    controller: EntityId | null,
  ): Result {
    if (controller !== null) {
      return reject(intent, "control is occupied");
    }
    const origin = this.presentAt.get(intent.issuer);
    const situated = this.siteAt.get(site);
    if (origin === undefined || origin !== situated) {
      return reject(intent, "issuer not present at site");
    }
    if (!this.knowledge.knows(intent.issuer, site)) {
      return reject(intent, "issuer lacks knowledge-of subject");
    }
    this.control.set(site, intent.issuer);
    const occurrence = this.recordWorldOccurrence("ControlChanged", {
      actor: intent.issuer,
      site,
      mode: "establish",
    });
    return {
      status: "accepted",
      home: "World",
      kind: "ChangeControl",
      occurrenceIds: [occurrence.id],
    };
  }

  private relinquishControl(
    intent: Intent,
    site: EntityId,
    controller: EntityId | null,
  ): Result {
    if (controller === null) {
      return reject(intent, "control is vacant");
    }
    if (controller !== intent.issuer) {
      return reject(intent, "issuer does not control site");
    }
    this.control.set(site, null);
    const occurrence = this.recordWorldOccurrence("ControlChanged", {
      actor: intent.issuer,
      site,
      mode: "relinquish",
    });
    return {
      status: "accepted",
      home: "World",
      kind: "ChangeControl",
      occurrenceIds: [occurrence.id],
    };
  }

  private gateHeldOn(origin: EntityId, destination: EntityId): boolean {
    return this.gates.some((item) => {
      if (item.state !== "held") {
        return false;
      }
      const gatePlace = this.siteAt.get(item.siteId);
      if (gatePlace === undefined) {
        return false;
      }
      return origin === gatePlace || destination === gatePlace;
    });
  }

  private gateAt(site: EntityId | undefined): GateRecord | undefined {
    if (site === undefined) {
      return undefined;
    }
    return this.gates.find((item) => item.siteId === site);
  }

  private findProcessLot(inputKind: EntityId, place: EntityId): Lot | null {
    const matching = this.lots
      .filter((lot) => lot.at === place && lot.kind === inputKind)
      .sort((left, right) => left.id.localeCompare(right.id));
    return matching[0] ?? null;
  }

  private findSeatLot(site: EntityId, millPlace: EntityId): Lot | null {
    const lotsHere = this.lots
      .filter((lot) => lot.at === millPlace)
      .sort((left, right) => left.id.localeCompare(right.id));
    const aggregate = this.siteAggregate.get(site) ?? "deposit";
    const remaining = this.depositRemaining.get(site) ?? 0;
    switch (aggregate) {
      case "extracted":
        return lotsHere.find((lot) => lot.kind === site) ?? null;
      case "deposit":
        if (remaining !== 0) {
          return null;
        }
        return lotsHere[0] ?? null;
      case "transformed":
      case "seated":
        return null;
      default: {
        const exhaustive: never = aggregate;
        return exhaustive;
      }
    }
  }

  private removeLot(lot: Lot): void {
    const index = this.lots.findIndex((item) => item.id === lot.id);
    if (index >= 0) {
      this.lots.splice(index, 1);
    }
  }

  private applyAggregateMode(
    mode: "extract" | "transform" | "seat",
    site: EntityId,
    issuer: EntityId,
    remaining: number,
  ): Occurrence {
    switch (mode) {
      case "extract": {
        this.depositRemaining.set(site, remaining - 1);
        this.siteAggregate.set(site, "extracted");
        const situated = this.siteAt.get(site);
        if (situated !== undefined) {
          this.lots.push({
            id: `lot-${this.nextLot}`,
            kind: site,
            quantity: 1,
            at: situated,
          });
          this.nextLot += 1;
        }
        return this.recordWorldOccurrence("DepositChanged", {
          actor: issuer,
          site,
        });
      }
      case "transform":
        this.depositRemaining.set(site, 0);
        this.siteAggregate.set(site, "transformed");
        return this.recordWorldOccurrence("AggregateChanged", {
          actor: issuer,
          site,
        });
      case "seat":
        this.siteAggregate.set(site, "seated");
        return this.recordWorldOccurrence("SiteSeated", {
          actor: issuer,
          site,
        });
      default: {
        const exhaustive: never = mode;
        return exhaustive;
      }
    }
  }

  private recordWorldOccurrence(
    kind: string,
    subjects: Record<string, EntityId>,
  ): Occurrence {
    const occurrence: Occurrence = {
      id: `occ-${this.nextOccurrence}`,
      source: "World",
      kind,
      subjects,
    };
    this.nextOccurrence += 1;
    this.occurrences.push(occurrence);
    return occurrence;
  }

  isSiteObservableTo(issuer: EntityId, subject: EntityId): boolean {
    const at = this.presentAt.get(issuer);
    const situated = this.siteAt.get(subject);
    return at !== undefined && situated !== undefined && at === situated;
  }

  private connected(left: EntityId, right: EntityId): boolean {
    return this.connects.has(edgeKey(left, right));
  }
}

function millBlockedByThisGate(
  mode: "extract" | "transform",
  state: GateState,
): string | null {
  switch (mode) {
    case "extract":
      if (state === "eased" || state === "scarred") {
        return null;
      }
      return "mill extract not legal in this gate stance";
    case "transform":
      if (state === "held") {
        return null;
      }
      return "mill transform not legal in this gate stance";
    default: {
      const exhaustive: never = mode;
      return exhaustive;
    }
  }
}

function nextGateState(
  mode: "hold" | "ease" | "release",
  state: GateState,
  easeDestroyed: boolean,
): GateState | null {
  switch (mode) {
    case "hold":
      switch (state) {
        case "open":
          return "held";
        case "eased":
        case "held":
          return "scarred";
        case "scarred":
          return "held";
        default: {
          const exhaustive: never = state;
          return exhaustive;
        }
      }
    case "ease":
      if (easeDestroyed || state !== "open") {
        return null;
      }
      return "eased";
    case "release":
      switch (state) {
        case "held":
        case "eased":
          return "open";
        case "scarred":
          return "scarred";
        case "open":
          return null;
        default: {
          const exhaustive: never = state;
          return exhaustive;
        }
      }
    default: {
      const exhaustive: never = mode;
      return exhaustive;
    }
  }
}

function requiredCapability(mode: "extract" | "transform" | "seat"): Capability {
  switch (mode) {
    case "extract":
      return "Extract";
    case "transform":
      return "Transform";
    case "seat":
      return "Erect";
    default: {
      const exhaustive: never = mode;
      return exhaustive;
    }
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

function edgeKey(left: EntityId, right: EntityId): string {
  return [left, right].sort().join("::");
}

function parseEdge(key: string): [EntityId, EntityId] {
  const [left, right] = key.split("::") as [EntityId, EntityId];
  return [left, right];
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

