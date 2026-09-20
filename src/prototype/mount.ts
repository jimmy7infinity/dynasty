import {
  createSession,
  twoBasinsPlaytestFixture,
} from "../session.js";
import type { EntityId, Observation, Result } from "../kernel.js";
import {
  ACTOR_ONE,
  ACTOR_TWO,
  actorName,
  contextActions,
  edgeKey,
  haulIntent,
  inspectLines,
  neighborsOf,
  parseEdge,
  resultCopy,
  siteName,
  titleCasePlace,
  travelIntent,
  type Selection,
} from "./presentation.js";

type Session = ReturnType<typeof createSession>;

const LAYOUT: Record<string, { x: number; y: number }> = {
  "place-a": { x: 140, y: 220 },
  "place-b": { x: 380, y: 200 },
  "place-c": { x: 640, y: 230 },
  "place-d": { x: 880, y: 210 },
};

export function mountPrototype(
  root: HTMLElement,
  session: Session = createSession(twoBasinsPlaytestFixture()),
) {
  let actor: EntityId = ACTOR_ONE;
  const visited: Record<string, Set<string>> = {
    [ACTOR_ONE]: new Set([session.observe(ACTOR_ONE).at ?? "place-a"]),
    [ACTOR_TWO]: new Set([session.observe(ACTOR_TWO).at ?? "place-b"]),
  };
  const seenRoutes: Record<string, Set<string>> = {
    [ACTOR_ONE]: new Set(),
    [ACTOR_TWO]: new Set(),
  };
  let selection: Selection | null = null;
  let carrying: EntityId | null = null;
  let lastCopy = "";
  let view = { x: 0, y: 40, w: 640, h: 360 };

  const remember = (issuer: EntityId) => {
    const observation = session.observe(issuer);
    const snapshot = session.inspectCanonicalForTests();
    const at = observation.at;
    if (at === null) {
      return;
    }
    visited[issuer]?.add(at);
    for (const next of neighborsOf(at, snapshot.connects)) {
      seenRoutes[issuer]?.add(edgeKey(at, next));
    }
  };

  const apply = (result: Result) => {
    lastCopy = resultCopy(result);
    if (result.status === "accepted") {
      carrying = null;
      remember(actor);
      const at = session.observe(actor).at;
      if (at !== null && LAYOUT[at] !== undefined) {
        view = {
          ...view,
          x: LAYOUT[at].x - view.w / 2,
          y: LAYOUT[at].y - view.h / 2,
        };
      }
    }
  };

  const render = () => {
    remember(actor);
    const observation = session.observe(actor);
    const snapshot = session.inspectCanonicalForTests();
    const at = observation.at;
    if (
      selection?.kind === "site" &&
      (at === null || !observation.siteIdsHere.includes(selection.id))
    ) {
      selection = null;
    }
    if (
      selection?.kind === "lot" &&
      !observation.lotsHere.some((lot) => lot.id === selection?.id)
    ) {
      selection = null;
      carrying = null;
    }

    root.replaceChildren();
    root.className = "world-shell";

    const header = el("header", "world-header");
    const who = el("p", "world-who");
    who.textContent = `You are ${actorName(actor)}`;
    header.append(who);
    const switcher = el("div", "world-switch");
    for (const id of [ACTOR_ONE, ACTOR_TWO]) {
      const button = el(
        "button",
        id === actor ? "hand is-you" : "hand",
      ) as HTMLButtonElement;
      button.type = "button";
      button.textContent = actorName(id);
      button.addEventListener("click", () => {
        actor = id;
        selection = null;
        carrying = null;
        lastCopy = "";
        const standing = session.observe(id).at;
        if (standing !== null && LAYOUT[standing] !== undefined) {
          view = {
            ...view,
            x: LAYOUT[standing].x - view.w / 2,
            y: LAYOUT[standing].y - view.h / 2,
          };
        }
        render();
      });
      switcher.append(button);
    }
    header.append(switcher);
    root.append(header);

    const stage = el("div", "world-stage");
    const svg = drawWorld({
      actor,
      at,
      observation,
      visited: visited[actor] ?? new Set(),
      routes: seenRoutes[actor] ?? new Set(),
      neighbors: at === null ? [] : neighborsOf(at, snapshot.connects),
      presentAt: snapshot.presentAt,
      view,
      carrying,
      commitView: (next) => {
        view = next;
        render();
      },
      onPlace: (place) => {
        if (at === place) {
          selection = { kind: "place", id: place };
          carrying = null;
          render();
          return;
        }
        if (at !== null && neighborsOf(at, snapshot.connects).includes(place)) {
          if (carrying !== null && observation.lotsHere.some((lot) => lot.id === carrying)) {
            apply(session.submit(haulIntent(actor, carrying, place)));
          } else {
            apply(session.submit(travelIntent(actor, place)));
          }
          selection = { kind: "place", id: session.observe(actor).at ?? place };
          render();
          return;
        }
        selection = { kind: "place", id: place };
        render();
      },
      onSite: (site) => {
        selection = { kind: "site", id: site };
        carrying = null;
        render();
      },
      onLot: (lot) => {
        selection = { kind: "lot", id: lot };
        carrying = lot;
        render();
      },
    });
    stage.append(svg);
    root.append(stage);

    if (lastCopy !== "") {
      const note = el("p", "world-after");
      note.textContent = lastCopy;
      root.append(note);
    }

    if (selection !== null) {
      const sheet = el("aside", "world-sheet");
      const heading = el("h2", "world-sheet-title");
      heading.textContent = sheetTitle(selection, observation);
      sheet.append(heading);
      for (const line of inspectLines(selection, actor, observation)) {
        sheet.append(p(line));
      }
      if (selection.kind === "lot") {
        sheet.append(p("Click a way out to take it with you."));
      }
      const acts = contextActions(selection, actor, observation);
      const row = el("div", "world-sheet-acts");
      for (const choice of acts) {
        const button = el("button", "touch") as HTMLButtonElement;
        button.type = "button";
        button.textContent = choice.label;
        button.addEventListener("click", () => {
          apply(session.submit(choice.intent));
          render();
        });
        row.append(button);
      }
      if (acts.length > 0) {
        sheet.append(row);
      }
      root.append(sheet);
    }
  };

  remember(actor);
  const start = session.observe(actor).at;
  if (start !== null && LAYOUT[start] !== undefined) {
    view = {
      ...view,
      x: LAYOUT[start].x - view.w / 2,
      y: LAYOUT[start].y - view.h / 2,
    };
  }
  render();
  return {
    session,
    getActor: () => actor,
    render,
  };
}

function sheetTitle(selection: Selection, observation: Observation): string {
  switch (selection.kind) {
    case "place":
      return titleCasePlace(selection.id);
    case "site":
      return observation.knowledgeOf.includes(selection.id)
        ? siteName(selection.id)
        : "Unexamined";
    case "lot":
      return "Material";
    default: {
      const neverSel: never = selection;
      return neverSel;
    }
  }
}

function drawWorld(input: {
  actor: EntityId;
  at: EntityId | null;
  observation: Observation;
  visited: Set<string>;
  routes: Set<string>;
  neighbors: EntityId[];
  presentAt: Record<EntityId, EntityId>;
  view: { x: number; y: number; w: number; h: number };
  carrying: EntityId | null;
  commitView: (next: { x: number; y: number; w: number; h: number }) => void;
  onPlace: (place: EntityId) => void;
  onSite: (site: EntityId) => void;
  onLot: (lot: EntityId) => void;
}): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute(
    "viewBox",
    `${input.view.x} ${input.view.y} ${input.view.w} ${input.view.h}`,
  );
  svg.setAttribute("class", "atlas");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "The World");

  let vx = input.view.x;
  let vy = input.view.y;
  let vw = input.view.w;
  let vh = input.view.h;
  const setBox = () => {
    svg.setAttribute("viewBox", `${vx} ${vy} ${vw} ${vh}`);
  };
  let drag: { x: number; y: number; moved: boolean } | null = null;
  svg.addEventListener("pointerdown", (event) => {
    drag = { x: event.clientX, y: event.clientY, moved: false };
    svg.setPointerCapture(event.pointerId);
  });
  svg.addEventListener("pointermove", (event) => {
    if (drag === null) {
      return;
    }
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) {
      drag.moved = true;
    }
    if (drag.moved) {
      const scale = vw / Math.max(1, svg.clientWidth);
      vx -= dx * scale;
      vy -= dy * scale;
      setBox();
      drag = { x: event.clientX, y: event.clientY, moved: true };
    }
  });
  let suppressClick = false;
  svg.addEventListener("pointerup", () => {
    if (drag?.moved === true) {
      suppressClick = true;
      input.commitView({ x: vx, y: vy, w: vw, h: vh });
    }
    drag = null;
  });
  svg.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const factor = event.deltaY > 0 ? 1.12 : 0.9;
      const nextW = Math.min(1400, Math.max(280, vw * factor));
      const nextH = nextW * (vh / vw);
      const cx = event.offsetX;
      const cy = event.offsetY;
      const width = Math.max(1, svg.clientWidth);
      const height = Math.max(1, svg.clientHeight);
      const gx = vx + (cx / width) * vw;
      const gy = vy + (cy / height) * vh;
      vx = gx - (cx / width) * nextW;
      vy = gy - (cy / height) * nextH;
      vw = nextW;
      vh = nextH;
      setBox();
      input.commitView({ x: vx, y: vy, w: vw, h: vh });
    },
    { passive: false },
  );

  const visiblePlaces = new Set(input.visited);
  for (const next of input.neighbors) {
    visiblePlaces.add(next);
  }

  for (const key of input.routes) {
    const [left, right] = parseEdge(key);
    if (!visiblePlaces.has(left) || !visiblePlaces.has(right)) {
      continue;
    }
    const a = LAYOUT[left];
    const b = LAYOUT[right];
    if (a === undefined || b === undefined) {
      continue;
    }
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(a.x));
    line.setAttribute("y1", String(a.y));
    line.setAttribute("x2", String(b.x));
    line.setAttribute("y2", String(b.y));
    line.setAttribute("class", "atlas-way");
    svg.append(line);
  }

  for (const place of visiblePlaces) {
    const point = LAYOUT[place];
    if (point === undefined) {
      continue;
    }
    const named = input.visited.has(place);
    const here = place === input.at;
    const node = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    node.setAttribute("cx", String(point.x));
    node.setAttribute("cy", String(point.y));
    node.setAttribute("r", here ? "16" : named ? "12" : "9");
    node.setAttribute(
      "class",
      here ? "atlas-here" : named ? "atlas-node" : "atlas-unknown",
    );
    node.setAttribute("data-place", place);
    node.style.cursor = "pointer";
    node.addEventListener("click", (event) => {
      event.stopPropagation();
      if (suppressClick) {
        suppressClick = false;
        return;
      }
      input.onPlace(place);
    });
    svg.append(node);
    if (here) {
      const pin = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      pin.setAttribute("cx", String(point.x));
      pin.setAttribute("cy", String(point.y));
      pin.setAttribute("r", "4");
      pin.setAttribute("class", "atlas-pin");
      pin.setAttribute("pointer-events", "none");
      svg.append(pin);
    }
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", String(point.x));
    label.setAttribute("y", String(point.y + 36));
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("class", named ? "atlas-name" : "atlas-name is-dim");
    label.setAttribute("pointer-events", "none");
    label.textContent = named ? titleCasePlace(place) : "a way";
    svg.append(label);
    if (here) {
      const others = input.observation.presentHere.filter((id) => id !== input.actor);
      if (others.length > 0) {
        const other = document.createElementNS("http://www.w3.org/2000/svg", "text");
        other.setAttribute("x", String(point.x + 22));
        other.setAttribute("y", String(point.y - 18));
        other.setAttribute("class", "atlas-other");
        other.textContent = others.map((id) => actorName(id)).join(", ");
        svg.append(other);
      }
    }
  }

  if (input.at !== null) {
    const origin = LAYOUT[input.at];
    if (origin !== undefined) {
      input.observation.siteIdsHere.forEach((site, index) => {
        const known = input.observation.knowledgeOf.includes(site);
        const mark = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );
        const x = origin.x - 36 + index * 28;
        const y = origin.y - 58;
        mark.setAttribute("x", String(x));
        mark.setAttribute("y", String(y));
        mark.setAttribute("width", "18");
        mark.setAttribute("height", "18");
        mark.setAttribute("class", known ? "atlas-site" : "atlas-site is-new");
        mark.setAttribute("data-site", site);
        mark.style.cursor = "pointer";
        mark.addEventListener("click", (event) => {
          event.stopPropagation();
          input.onSite(site);
        });
        svg.append(mark);
      });
      input.observation.lotsHere.forEach((lot, index) => {
        const tick = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );
        tick.setAttribute("x", String(origin.x - 8 + index * 14));
        tick.setAttribute("y", String(origin.y + 22));
        tick.setAttribute("width", "10");
        tick.setAttribute("height", "10");
        tick.setAttribute("class", "atlas-lot");
        tick.setAttribute("data-lot", lot.id);
        tick.style.cursor = "pointer";
        tick.addEventListener("click", (event) => {
          event.stopPropagation();
          input.onLot(lot.id);
        });
        svg.append(tick);
      });
    }
  }

  return svg;
}

function el(tag: string, className: string): HTMLElement {
  const node = document.createElement(tag);
  node.className = className;
  return node;
}

function p(text: string): HTMLParagraphElement {
  const node = document.createElement("p");
  node.className = "world-line";
  node.textContent = text;
  return node;
}
