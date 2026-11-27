"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useDemoData } from "@/components/demo-data-provider";
import { Icon } from "@/components/icon";

export default function PatientPortalPage() {
  const { ready, patients, appointments } = useDemoData();
  const [patientId, setPatientId] = useState("");
  const selectedId = patientId || patients[0]?.id || "";
  const patient = patients.find((p) => p.id === selectedId);
  const visits = useMemo(() => appointments.filter((item) => item.patientId === selectedId && item.status !== "Cancelled").sort((a,b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)), [appointments, selectedId]);
  return <>
    <div className="page-heading"><div><span className="eyebrow">PatientNG · Preview</span><h1>Your care, made easier.</h1><p>A sample patient view for PhysioNG at CRIBS Hospital.</p></div></div>
    <div className="notice-banner"><Icon name="shield" size={16} /><span><strong>Preview only.</strong> There is no patient login or private account security yet. These are sample records from this browser; don’t use real data here.</span></div>
    <section className="patient-portal-hero"><div><span className="eyebrow">PhysioNG · CRIBS Hospital</span><h2>Hello{patient ? `, ${patient.name.split(" ")[0]}` : " there"}.</h2><p>Use this sample portal to see how appointment details and clinic information could appear for a patient.</p>{patients.length > 0 && <div className="field" style={{ maxWidth: 280, marginTop: 15 }}><label htmlFor="demo-patient">Preview as demo patient</label><select id="demo-patient" value={selectedId} onChange={(event) => setPatientId(event.target.value)}>{patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>}</div><Image src="/images/physiotherapy-assessment.jpg" alt="Physiotherapist supporting a patient during an assessment" width={700} height={460} /></section>
    <div className="dashboard-grid">
      <section className="panel"><div className="panel-header"><div><h2>Your appointments</h2><p>Visit information from the demo clinic schedule</p></div><span className="status-pill">{visits.length} visits</span></div><div className="appointment-list">{!ready ? <div className="empty-state">Loading…</div> : visits.length ? visits.map((visit) => <div className="appointment-row" key={visit.id}><div className="time-pill">{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(`${visit.date}T12:00:00`))}</div><div><span className="patient-name">{visit.service}</span><span className="patient-sub">{visit.date} · {new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date(2000,0,1,...visit.time.split(":").map(Number)))}</span></div><span className={`status-pill ${visit.status === "Scheduled" ? "pending" : ""}`}>{visit.status}</span></div>) : <div className="empty-state">No appointments in this demo patient view.</div>}</div></section>
      <section className="panel patient-care-card"><div className="panel-header"><div><h2>Your clinic</h2><p>Care team and location</p></div></div><div className="clinic-details"><div className="care-provider-avatar">KA</div><h3>Dr. Khushnoor Alam PT</h3><p>Senior Physiotherapist · CRIBS Hospital</p><div className="profile-meta"><span><Icon name="pin" size={14} />Jasola, New Delhi</span><span><Icon name="phone" size={14} />Contact the hospital to confirm a real visit.</span></div></div></section>
    </div>
  </>;
}
