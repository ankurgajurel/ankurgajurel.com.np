import assert from "node:assert/strict";
import test from "node:test";
import { generateDiff } from "./diff";

test("generates numbered additions and removals", () => {
  const lines = generateDiff("one\ntwo", "one\nthree");
  assert.ok(lines.some((line) => line.type === "removed" && line.value === "two" && line.oldLineNumber === 2));
  assert.ok(lines.some((line) => line.type === "added" && line.value === "three" && line.newLineNumber === 2));
});

test("normalizes missing terminal newlines", () => {
  assert.deepEqual(generateDiff("same", "same").filter((line) => line.type !== "hunk"), []);
});
