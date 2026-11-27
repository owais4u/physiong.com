import test from "node:test";
import assert from "node:assert/strict";
import { availableAppointmentSlots, isSlotAvailable } from "../src/lib/scheduling.mjs";

const existing = [
  { date: "2026-11-27", time: "10:00", status: "Scheduled", durationMinutes: 45 },
  { date: "2026-11-27", time: "11:00", status: "Cancelled", durationMinutes: 45 },
];

test("rejects overlapping appointment slots on the same date", () => {
  assert.equal(isSlotAvailable(existing, { date: "2026-11-27", time: "10:30" }), false);
});

test("allows adjacent appointments and the same time on another date", () => {
  assert.equal(isSlotAvailable(existing, { date: "2026-11-27", time: "10:45" }), true);
  assert.equal(isSlotAvailable(existing, { date: "2026-11-28", time: "10:00" }), true);
});

test("does not let cancelled appointments block a slot", () => {
  assert.equal(isSlotAvailable(existing, { date: "2026-11-27", time: "11:00" }), true);
});

test("returns only available options", () => {
  assert.deepEqual(availableAppointmentSlots(existing, "2026-11-27", ["09:00", "10:00", "10:45", "11:00"]), ["09:00", "10:45", "11:00"]);
});
