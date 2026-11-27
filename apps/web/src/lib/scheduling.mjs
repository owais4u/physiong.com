function toMinutes(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function isSlotAvailable(appointments, candidate, durationMinutes = 45) {
  const candidateStart = toMinutes(candidate.time);
  const candidateEnd = candidateStart + durationMinutes;

  return !appointments.some((appointment) => {
    if (appointment.date !== candidate.date || appointment.status === "Cancelled") {
      return false;
    }
    const existingStart = toMinutes(appointment.time);
    const existingEnd = existingStart + (appointment.durationMinutes ?? 45);
    return candidateStart < existingEnd && existingStart < candidateEnd;
  });
}

export function availableAppointmentSlots(appointments, date, slots) {
  return slots.filter((time) => isSlotAvailable(appointments, { date, time }));
}
