import { isSlotAvailable } from "./scheduling.mjs";

function normalizePhone(phone) {
  return phone.replace(/[^\d+]/g, "");
}

export function registerDemoPatient(store, input, createdAt = new Date().toISOString(), createId = () => crypto.randomUUID()) {
  const existing = store.patients.find((patient) => normalizePhone(patient.phone) === normalizePhone(input.phone));
  if (existing) return { store, patient: existing, created: false };

  const patient = { ...input, id: createId(), createdAt, status: "Active" };
  return {
    store: { ...store, patients: [patient, ...store.patients] },
    patient,
    created: true,
  };
}

export function bookDemoAppointment(store, input, createdAt = new Date().toISOString(), createId = () => crypto.randomUUID()) {
  if (!isSlotAvailable(store.appointments, { date: input.date, time: input.time }, 45)) {
    return { ok: false, message: "That time overlaps another appointment. Please choose a different slot." };
  }

  const registration = registerDemoPatient(store, { name: input.patientName, phone: input.phone }, createdAt, createId);
  const appointment = {
    ...input,
    patientId: registration.patient.id,
    id: createId(),
    durationMinutes: 45,
    status: "Scheduled",
    createdAt,
  };
  return {
    ok: true,
    appointment,
    store: { ...registration.store, appointments: [...registration.store.appointments, appointment] },
  };
}

export function recordDemoEncounter(store, input, createdAt = new Date().toISOString(), createId = () => crypto.randomUUID()) {
  const patient = store.patients.find((record) => record.id === input.patientId);
  if (!patient) return { ok: false, message: "Choose a patient from this demo clinic." };

  const appointment = input.appointmentId ? store.appointments.find((record) => record.id === input.appointmentId) : undefined;
  if (input.appointmentId && (!appointment || appointment.patientId !== patient.id)) {
    return { ok: false, message: "The selected appointment does not belong to this patient." };
  }

  const encounter = { ...input, patientName: patient.name, id: createId(), createdAt };
  const nextStore = {
    ...store,
    encounters: [encounter, ...store.encounters],
    appointments: appointment
      ? store.appointments.map((record) => record.id === appointment.id ? { ...record, status: "Completed" } : record)
      : store.appointments,
  };
  return { ok: true, encounter, store: nextStore };
}
