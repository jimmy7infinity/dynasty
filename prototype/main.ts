import { mountPrototype } from "../src/prototype/mount.ts";

const root = document.getElementById("root");
if (root === null) {
  throw new Error("missing root");
}
mountPrototype(root);
