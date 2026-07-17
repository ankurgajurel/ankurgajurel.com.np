import assert from "node:assert/strict";
import test from "node:test";
import { convertTime, getCityFromTimezone, isSupportedTimezone, normalizeTimezone } from "./timezones";

test("validates and normalizes IANA time zones", () => {
  assert.equal(normalizeTimezone("UTC"), "UTC");
  assert.equal(isSupportedTimezone("not/a-zone"), false);
  assert.equal(getCityFromTimezone("America/Argentina/Buenos_Aires"), "Buenos Aires");
});

test("converts time between UTC and Kathmandu", () => {
  assert.equal(convertTime("12:00", "UTC", "Asia/Kathmandu"), "17:45");
  assert.equal(convertTime("24:00", "UTC", "Asia/Kathmandu"), "24:00");
});
