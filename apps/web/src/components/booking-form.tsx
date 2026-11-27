"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useDemoData, dateKey } from "@/components/demo-data-provider";
import { Icon } from "@/components/icon";
import { availableAppointmentSlots } from "@/lib/scheduling.mjs";

const slots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
const services = ["Initial assessment", "Manual therapy", "Spine & joint care", "Sports injury rehabilitation", "Post-operative rehabilitation", "Neurological rehabilitation", "Follow-up session"];

function todayLabel(date: string) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${date}T12:00:00`));
}

export function BookingForm({ publicMode = false }: { publicMode?: boolean }) {
  const { appointments, bookAppointment } = useDemoData();
  const [date, setDate] = useState(dateKey());
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const availableSlots = useMemo(() => availableAppointmentSlots(appointments, date, slots), [appointments, date]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const patientName = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const service = String(form.get("service") ?? "");
    if (!patientName || !phone || !service || !date || !time) { setError("Please complete the required fields and choose an available time."); return; }
    const result = bookAppointment({ patientName, phone, service, date, time });
    if (!result.ok) { setError(result.message ?? "That time is no longer available."); return; }
    setError(""); setConfirmation(result.appointment?.id.slice(0, 8).toUpperCase() ?? "PN-VISIT");
    event.currentTarget.reset();
  }

  if (confirmation) return <div className="success-card"><span className="success-mark"><Icon name="check" /></span><span className="eyebrow">Request received</span><h2>Your visit is on the demo schedule</h2><p>Reference <strong>{confirmation}</strong> · {todayLabel(date)} at {new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date(2000,0,1,...time.split(":").map(Number)))}.</p><p>This is a browser-only demonstration, not a live clinic booking. Please contact the clinic directly to confirm a real appointment.</p><div className="form-actions" style={{ justifyContent: "center", border: 0 }}><Link className="button secondary" href={publicMode ? "/" : "/clinic/appointments"}>{publicMode ? "Back to PhysioNG" : "View schedule"}</Link><button className="button" onClick={() => { setConfirmation(""); setTime(""); }}>Book another visit</button></div></div>;

  return <form className="form-card" onSubmit={submit}>
    <h2 className="form-section-title"><span className="form-section-icon"><Icon name="calendar" size={16} /></span>Appointment details</h2>
    <div className="form-grid">
      <div className="field full"><label htmlFor="booking-name">Patient name <span>*</span></label><input id="booking-name" name="name" placeholder="Enter full name" autoComplete="name" required /></div>
      <div className="field"><label htmlFor="booking-phone">Phone number <span>*</span></label><input id="booking-phone" name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" required /></div>
      <div className="field"><label htmlFor="booking-service">Visit type <span>*</span></label><select id="booking-service" name="service" required defaultValue=""><option value="" disabled>Select a service</option>{services.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div className="field full"><label htmlFor="booking-date">Preferred date <span>*</span></label><input id="booking-date" type="date" value={date} min={dateKey()} onChange={(event) => { setDate(event.target.value); setTime(""); }} required /><span className="field-help">Times are shown in the clinic’s local timezone (Asia/Kolkata).</span></div>
      <div className="field full"><label>Available time · {date ? todayLabel(date) : "choose a date"} <span>*</span></label><div className="slot-grid">{slots.map((slot) => { const free = availableSlots.includes(slot); const label = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date(2000,0,1,...slot.split(":").map(Number))); return <button className={`slot-button ${time === slot ? "selected" : ""}`} type="button" key={slot} disabled={!free} aria-pressed={time === slot} onClick={() => setTime(slot)}>{label}</button>; })}</div><span className="field-help">45-minute sessions. Times already booked are unavailable in this demo.</span></div>
      <div className="field full"><label htmlFor="booking-note">Note for the clinic (optional)</label><textarea id="booking-note" placeholder="Please avoid adding medical or sensitive details in this demo." disabled /><span className="field-help">Notes are disabled in this demo to avoid collecting sensitive health details.</span></div>
      <div className="field full"><label className="checkbox-row"><input type="checkbox" name="demo-ack" required /><span>I understand this creates a demo booking in this browser only. It does not contact CRIBS Hospital.</span></label></div>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-actions"><button className="button" type="submit">{publicMode ? "Request a demo visit" : "Add to demo schedule"}<Icon name="arrow" size={15} /></button></div>
  </form>;
}
