"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoData, dateKey } from "@/components/demo-data-provider";
import { Icon } from "@/components/icon";

export default function NewEncounterPage() {
  const router = useRouter();
  const { patients, appointments, addEncounter } = useDemoData();
  const [error, setError] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const eligibleAppointments = appointments.filter((appointment) => appointment.patientId === selectedPatientId && appointment.status !== "Cancelled");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const patientId = String(form.get("patientId") ?? "");
    const presentingConcern = String(form.get("concern") ?? "").trim();
    const assessment = String(form.get("assessment") ?? "").trim();
    const treatment = String(form.get("treatment") ?? "").trim();
    const plan = String(form.get("plan") ?? "").trim();
    if (!patients.some((patient) => patient.id === patientId) || !presentingConcern || !assessment || !treatment || !plan) { setError("Complete all required fields before saving the demo note."); return; }
    const appointmentId = String(form.get("appointmentId") ?? "") || undefined;
    const result = addEncounter({ patientId, appointmentId, date: dateKey(), presentingConcern, assessment, treatment, plan });
    if (!result.ok) { setError(result.message ?? "The demo encounter could not be saved."); return; }
    router.push("/clinic/encounters");
  }
  return <>
    <div className="page-heading"><div><span className="eyebrow">Clinical workspace</span><h1>New encounter note</h1><p>Record a demo visit for the clinic workflow preview.</p></div><Link href="/clinic/encounters" className="button secondary">Cancel</Link></div>
    <div className="notice-banner"><Icon name="shield" size={16} /><span><strong>Do not use real clinical details.</strong> This browser prototype is not connected to a secure clinical record system.</span></div>
    <div className="form-layout"><form className="form-card" onSubmit={submit}>
      <h2 className="form-section-title"><span className="form-section-icon"><Icon name="clipboard" size={16} /></span>Encounter</h2>
      <div className="form-grid">
        <div className="field"><label htmlFor="encounter-patient">Patient <span>*</span></label><select id="encounter-patient" name="patientId" required value={selectedPatientId} onChange={(event) => { setSelectedPatientId(event.target.value); setSelectedAppointmentId(""); }}><option value="" disabled>Select a demo patient</option>{patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
        <div className="field"><label htmlFor="encounter-appointment">Appointment (optional)</label><select id="encounter-appointment" name="appointmentId" value={selectedAppointmentId} onChange={(event) => setSelectedAppointmentId(event.target.value)} disabled={!selectedPatientId}><option value="">No appointment link</option>{eligibleAppointments.map((a) => <option key={a.id} value={a.id}>{a.date} · {a.time} · {a.service}</option>)}</select></div>
        <div className="field full"><label htmlFor="encounter-concern">Presenting concern <span>*</span></label><textarea id="encounter-concern" name="concern" required placeholder="Use fictional demo content only." /></div>
        <div className="field full"><label htmlFor="encounter-assessment">Assessment <span>*</span></label><textarea id="encounter-assessment" name="assessment" required placeholder="Demo assessment summary" /></div>
        <div className="field full"><label htmlFor="encounter-treatment">Treatment provided <span>*</span></label><textarea id="encounter-treatment" name="treatment" required placeholder="Demo treatment entry" /></div>
        <div className="field full"><label htmlFor="encounter-plan">Plan and follow-up <span>*</span></label><textarea id="encounter-plan" name="plan" required placeholder="Demo follow-up plan" /></div>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions"><Link href="/clinic/encounters" className="button secondary">Cancel</Link><button className="button" type="submit">Save demo note</button></div>
    </form><aside className="info-card"><h3>Documentation flow</h3><p>In the production workflow, clinical documentation should be signed and amendments should preserve attribution and history.</p><div className="info-list"><div className="info-list-row"><Icon name="check" size={15} />Link this demo note to a patient.</div><div className="info-list-row"><Icon name="check" size={15} />Optionally link the scheduled visit.</div><div className="info-list-row"><Icon name="shield" size={15} />Production access controls and audit history are not connected in this preview.</div></div></aside></div>
  </>;
}
