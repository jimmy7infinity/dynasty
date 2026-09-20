/** @vitest-environment happy-dom */
import { describe, expect, test } from "vitest";
import { createSession, twoBasinsPlaytestFixture } from "../session.js";
import {
  ACTOR_ONE,
  contextActions,
  neighborsOf,
  placeName,
  resultCopy,
  siteName,
  travelIntent,
} from "./presentation.js";
import { mountPrototype } from "./mount.js";

describe("prototype presentation", () => {
  test("player-facing names do not use fixture IDs", () => {
    expect(placeName("place-a")).toBe("the Cut");
    expect(siteName("site-vein")).toBe("Vein");
    expect(placeName("place-a")).not.toContain("place-");
    expect(siteName("site-vein")).not.toContain("site-");
  });

  test("travel intent is World ChangePresence", () => {
    const session = createSession(twoBasinsPlaytestFixture());
    const intent = travelIntent(ACTOR_ONE, "place-b");
    expect(intent.kind).toBe("ChangePresence");
    expect(session.submit(intent).status).toBe("accepted");
    expect(session.observe(ACTOR_ONE).at).toBe("place-b");
  });

  test("an unexamined site only offers looking closer", () => {
    const session = createSession(twoBasinsPlaytestFixture());
    const observation = session.observe(ACTOR_ONE);
    const actions = contextActions(
      { kind: "site", id: "site-vein" },
      ACTOR_ONE,
      observation,
    );
    expect(actions).toHaveLength(1);
    expect(actions[0]?.label).toBe("Look closer");
    expect(actions[0]?.intent.kind).toBe("Assimilate");
  });

  test("rejects are copied without World reason codes", () => {
    expect(
      resultCopy({
        status: "rejected",
        home: "World",
        kind: "ChangePresence",
        reason: "places are not connected",
      }),
    ).toBe("There is no way through from here.");
  });

  test("neighbors follow canonical connects", () => {
    const snapshot = createSession(
      twoBasinsPlaytestFixture(),
    ).inspectCanonicalForTests();
    expect(neighborsOf("place-a", snapshot.connects)).toEqual(["place-b"]);
    expect(neighborsOf("place-c", snapshot.connects)).toEqual(["place-d"]);
  });
});

describe("prototype mount", () => {
  test("renders a spatial World without an action menu and moves by clicking a way", () => {
    const root = document.createElement("div");
    document.body.append(root);
    const mounted = mountPrototype(root);
    expect(root.textContent).toContain("The Cut");
    expect(root.textContent).not.toContain("What you can try");
    expect(root.textContent).not.toContain("Travel to the Yard");
    expect(root.textContent).not.toContain("place-a");
    expect(root.textContent).not.toContain("site-vein");
    expect(root.textContent).not.toContain("ChangePresence");
    const way = root.querySelector('[data-place="place-b"]');
    expect(way).not.toBeNull();
    way?.dispatchEvent(new Event("click", { bubbles: true }));
    expect(mounted.session.observe(ACTOR_ONE).at).toBe("place-b");
    expect(root.textContent).toContain("The Yard");
    root.remove();
  });

  test("working a vein is not offered until it is examined", () => {
    const root = document.createElement("div");
    document.body.append(root);
    mountPrototype(root);
    const vein = root.querySelector('[data-site="site-vein"]');
    vein?.dispatchEvent(new Event("click", { bubbles: true }));
    expect(root.textContent).toContain("Look closer");
    expect(root.textContent).not.toContain("Work it");
    const look = [...root.querySelectorAll("button")].find(
      (button) => button.textContent === "Look closer",
    );
    look?.click();
    expect(root.textContent).toContain("Vein");
    expect(root.textContent).toContain("Work it");
    root.remove();
  });
});
