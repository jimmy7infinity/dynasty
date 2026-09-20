import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { appendFileSync } from "node:fs";
import { createSession, twoBasinsPlaytestFixture } from "./session.js";
import type { Intent, Result } from "./kernel.js";

const BRIEFING = `
You are entering a persistent World.

There is no specified objective and no score.

You may observe the World and attempt any legal actions available to you.

Other players are acting in the same World.

Explore and do whatever you think is useful.
`.trim();

const RULES = `
Rules (not strategy):

- Places in this World are named place-a, place-b, place-c, and place-d.
- You observe only the Place you occupy: Sites, Lots, who is present, and your capabilities.
- Travel (go) is accepted only if a connection exists and a held gate does not block that movement.
- Haul moves a Lot, not you. You must be at the Lot.
- Assimilate records knowledge-of a Site at your Place. Many operations require that knowledge.
- Aggregate modes: extract, transform, seat, process, hold, ease, release.
- Control modes: establish, relinquish.
- Rejected attempts do not change the World.
`.trim();

const COMMANDS = `
Commands:
  observe
  go <place>
  haul <lot-id> <place>
  assimilate <site>
  extract <site>
  transform <site>
  seat <site>
  process <site>
  hold <site>
  ease <site>
  release <site>
  establish <site>
  relinquish <site>
  rules
  note <text>     (record something you just said, in your own words)
  done            (end this actor's turn; next actor observes)
  quit
`.trim();

function parseIntent(issuer: string, line: string): Intent | { error: string } | "meta" {
  const parts = line.trim().split(/\s+/);
  const verb = parts[0]?.toLowerCase();
  if (verb === undefined || verb === "") {
    return { error: "empty" };
  }
  switch (verb) {
    case "observe":
    case "rules":
    case "note":
    case "done":
    case "quit":
      return "meta";
    case "go":
      if (parts[1] === undefined) {
        return { error: "go <place>" };
      }
      return {
        issuer,
        home: "World",
        kind: "ChangePresence",
        subjects: { destination: parts[1] },
      };
    case "haul":
      if (parts[1] === undefined || parts[2] === undefined) {
        return { error: "haul <lot-id> <place>" };
      }
      return {
        issuer,
        home: "World",
        kind: "ChangePresence",
        subjects: { lot: parts[1], destination: parts[2] },
      };
    case "assimilate":
      if (parts[1] === undefined) {
        return { error: "assimilate <site>" };
      }
      return {
        issuer,
        home: "Information",
        kind: "Assimilate",
        subjects: { subject: parts[1] },
      };
    case "extract":
    case "transform":
    case "seat":
    case "process":
    case "hold":
    case "ease":
    case "release":
      if (parts[1] === undefined) {
        return { error: `${verb} <site>` };
      }
      return {
        issuer,
        home: "World",
        kind: "ChangeAggregate",
        subjects: { site: parts[1], mode: verb },
      };
    case "establish":
    case "relinquish":
      if (parts[1] === undefined) {
        return { error: `${verb} <site>` };
      }
      return {
        issuer,
        home: "World",
        kind: "ChangeControl",
        subjects: { site: parts[1], mode: verb },
      };
    default:
      return { error: "unknown command" };
  }
}

function logLine(path: string, record: Record<string, unknown>) {
  appendFileSync(path, `${JSON.stringify(record)}\n`);
}

async function main() {
  const logPath = `playtest-${Date.now()}.jsonl`;
  const session = createSession(twoBasinsPlaytestFixture());
  const actors = ["actor-1", "actor-2"] as const;
  let actorIndex = 0;
  const rl = readline.createInterface({ input, output });

  console.log(BRIEFING);
  console.log("");
  console.log(COMMANDS);
  console.log("");
  console.log(`Facilitator log: ${logPath}`);
  console.log("Do not show this log to players during the session.");
  console.log("");

  logLine(logPath, { type: "start", fixture: "twoBasinsPlaytestFixture" });

  const printObserve = (issuer: string) => {
    const view = session.observe(issuer);
    console.log(`--- observe ${issuer} ---`);
    console.log(JSON.stringify(view, null, 2));
  };

  printObserve(actors[actorIndex]);

  while (true) {
    const issuer = actors[actorIndex];
    const line = await rl.question(`${issuer}> `);
    const trimmed = line.trim();
    const verb = trimmed.split(/\s+/)[0]?.toLowerCase();

    if (verb === "quit") {
      logLine(logPath, { type: "quit", issuer });
      break;
    }
    if (verb === "rules") {
      console.log(RULES);
      logLine(logPath, { type: "rules", issuer });
      continue;
    }
    if (verb === "observe") {
      printObserve(issuer);
      logLine(logPath, { type: "observe", issuer });
      continue;
    }
    if (verb === "note") {
      const text = trimmed.slice("note".length).trim();
      logLine(logPath, { type: "note", issuer, text });
      console.log("(recorded)");
      continue;
    }
    if (verb === "done") {
      actorIndex = (actorIndex + 1) % actors.length;
      logLine(logPath, { type: "done", issuer, next: actors[actorIndex] });
      console.log("");
      printObserve(actors[actorIndex]);
      continue;
    }

    const parsed = parseIntent(issuer, trimmed);
    if (parsed === "meta") {
      continue;
    }
    if ("error" in parsed) {
      console.log(parsed.error);
      continue;
    }

    const result: Result = session.submit(parsed);
    logLine(logPath, { type: "intent", issuer, intent: parsed, result });
    console.log(JSON.stringify(result));
    if (result.status === "accepted") {
      printObserve(issuer);
    }
  }

  rl.close();
}

void main();
