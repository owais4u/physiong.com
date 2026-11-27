import test from "node:test";
import assert from "node:assert/strict";
import { bookDemoAppointment, recordDemoEncounter, registerDemoPatient } from "../src/lib/demo-workflows.mjs";

const emptyStore = () => ({ patients: [], appointments: [], encounters: [] });
const ids = () => {
  let next = 0;
  return () => `id-${++next}`;
};

test("registers a patient and reuses a matching phone number", () => {
  const store = emptyStore();
  const createId = ids();
  const first = registerDemoPatient(store, { name: "Demo Patient", phone: "+91 98765 43210" }, "2026-01-01T00:00:00.000Z", createId);
  const duplicate = registerDemoPatient(first.store, { name: "Duplicate", phone: "+91-98765-43210" }, "2026-01-02T00:00:00.000Z", createId);

  assert.equal(first.created, true);
  assert.equal(first.store.patients.length, 1);
  assert.equal(duplicate.created, false);
  assert.equal(duplicate.patient.id, first.patient.id);
});

test("completes the clinic workflow from booking through linked encounter", () => {
  const createId = ids();
  const booking = bookDemoAppointment(emptyStore(), {
    patientName: "Demo Patient", phone: "+91 98765 43210", service: "Initial assessment",
    date: "2026-01-05", time: "10:00",
  }, "2026-01-01T00:00:00.000Z", createId);
  assert.equal(booking.ok, true);
  assert.equal(booking.store.patients.length, 1);

  const overlap = bookDemoAppointment(booking.store, {
    patientName: "Another Patient", phone: "+91 98765 43211", service: "Follow-up",
    date: "2026-01-05", time: "10:30",
  }, "2026-01-01T00:00:00.000Z", createId);
  assert.equal(overlap.ok, false);

  const encounter = recordDemoEncounter(booking.store, {
    patientId: booking.appointment.patientId,
    appointmentId: booking.appointment.id,
    date: "2026-01-05",
    presentingConcern: "Fictional shoulder stiffness",
    assessment: "Demo assessment",
    treatment: "Demo treatment",
    plan: "Demo follow-up",
  }, "2026-01-05T11:00:00.000Z", createId);
  assert.equal(encounter.ok, true);
  assert.equal(encounter.encounter.patientName, "Demo Patient");
  assert.equal(encounter.store.encounters.length, 1);
  assert.equal(encounter.store.appointments[0].status, "Completed");
});

test("rejects an encounter linked to another patient's appointment", () => {
  const store = {
    patients: [{ id: "patient-1", name: "Patient One" }, { id: "patient-2", name: "Patient Two" }],
    appointments: [{ id: "appointment-1", patientId: "patient-1", status: "Scheduled" }],
    encounters: [],
  };
  const result = recordDemoEncounter(store, {
    patientId: "patient-2", appointmentId: "appointment-1", date: "2026-01-05",
    presentingConcern: "Demo", assessment: "Demo", treatment: "Demo", plan: "Demo",
  }, "2026-01-05T11:00:00.000Z", ids());

  assert.equal(result.ok, false);
  assert.match(result.message, /does not belong/);
  assert.equal(store.encounters.length, 0);
  assert.equal(store.appointments[0].status, "Scheduled");
});
