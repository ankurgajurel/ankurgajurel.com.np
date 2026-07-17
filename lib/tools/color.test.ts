import assert from "node:assert/strict";
import test from "node:test";
import { convertColor, convertCssColors } from "./color";

test("converts individual colors across supported formats", () => {
  assert.equal(convertColor("#ff0000", "rgb"), "rgb(255, 0, 0)");
  assert.equal(convertColor("rgba(255, 0, 0, 0.5)", "hex"), "#ff000080");
  assert.equal(convertColor("hsl(0, 100%, 50%)", "hex"), "#ff0000");
  assert.equal(convertColor("oklch(1 0 0)", "rgb"), "rgb(255, 255, 255)");
});

test("converts CSS values without changing comments", () => {
  const input = "/* #ffffff */\n.button { color: #ff0000; background: rgb(0, 0, 255); }";
  assert.equal(
    convertCssColors(input, "hsl"),
    "/* #ffffff */\n.button { color: hsl(0, 100%, 50%); background: hsl(240, 100%, 50%); }"
  );
});
