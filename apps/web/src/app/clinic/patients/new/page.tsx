"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useDemoData } from "@/components/demo-data-provider";
import { Icon } from "@/components/icon";

export default function NewPatientPage() {
  const router = useRouter();
  const { addPatient } = useDemoData();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const consent = form.get("consent") === "on";
    if (!name || !phone || !consent) { setError("Name, phone, and recorded consent are required."); return; }
    addPatient({ name, phone, email: email || undefined });
    setError(""); setSaved(true);
  }

  if (saved) return <div className="success-card"><span className="success-mark"><Icon name="check" /></span><h2>Patient added to this demo</h2><p>The record is saved in this browser only. It is not sent to a clinic server.</p><div className="form-actions" style={{ justifyContent: "center", border: 0 }}><Link className="button secondary" href="/clinic/patients">View patients</Link><button className="button" onClick={() => router.push("/clinic/appointments/new")}>Book appointment</button></div></div>;

  return <>
    <div className="page-heading"><div><span className="eyebrow">Patient directory</span><h1>Register a patient</h1><p>Create a basic profile and capture consent status.</p></div></div>
    <div className="notice-banner"><Icon name="shield" size={16} /><span><strong>Demo mode.</strong> Please use fictional details only. This prototype stores information in browser storage and has no login, encryption, or clinic-server controls.</span></div>
    <div className="form-layout"><form className="form-card" onSubmit={submit}>
      <h2 className="form-section-title"><span className="form-section-icon"><Icon name="users" size={16} /></span>Basic information</h2>
      <div className="form-grid">
        <div className="field full"><label htmlFor="patient-name">Patient name <span>*</span></label><input id="patient-name" name="name" placeholder="Enter full name" autoComplete="name" required /></div>
        <div className="field"><label htmlFor="patient-phone">Phone number <span>*</span></label><input id="patient-phone" name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" required /></div>
        <div className="field"><label htmlFor="patient-email">Email address</label><input id="patient-email" name="email" type="email" placeholder="name@example.com" autoComplete="email" /></div>
        <div className="field full"><label>Clinic</label><input value="PhysioNG · CRIBS Hospital, Jasola" readOnly /></div>
        <div className="field full"><label className="checkbox-row"><input type="checkbox" name="consent" required /><span>I confirm that consent has been discussed and recorded for this demo registration. <span>*</span></span></label><span className="field-help">This records a demo confirmation only; a production consent workflow is not yet connected.</span></div>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions"><Link href="/clinic/patients" className="button secondary">Cancel</Link><button type="submit" className="button">Save demo patient</button></div>
    </form>
    <aside className="info-card"><h3>Before you begin</h3><p>Patient data deserves careful handling. This demo is designed to test the interface with fictional sample details.</p><div className="info-list"><div className="info-list-row"><Icon name="shield" size={15} />No authentication or secure API is connected yet.</div><div className="info-list-row"><Icon name="activity" size={15} />Records persist only in this browser’s local storage.</div><div className="info-list-row"><Icon name="check" size={15} />Duplicate mobile numbers reuse the existing demo record.</div></div></aside></div>
  </>;
}
