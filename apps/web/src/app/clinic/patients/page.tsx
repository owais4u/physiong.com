"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useDemoData } from "@/components/demo-data-provider";
import { Icon } from "@/components/icon";

function initials(name: string) { return name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase(); }

export default function PatientsPage() {
  const { ready, patients, appointments } = useDemoData();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => patients.filter((p) => `${p.name} ${p.phone}`.toLowerCase().includes(query.toLowerCase())), [patients, query]);

  return <>
    <div className="page-heading"><div><span className="eyebrow">Clinic records</span><h1>Patients</h1><p>Patient records for PhysioNG · CRIBS Hospital.</p></div><div className="heading-actions"><Link className="button" href="/clinic/patients/new"><Icon name="plus" size={16} />Register patient</Link></div></div>
    <div className="notice-banner"><Icon name="shield" size={16} /><span><strong>Demo records only.</strong> This browser prototype is not connected to secure clinical storage. Do not enter real patient information.</span></div>
    <section className="panel">
      <div className="panel-header"><div><h2>Patient directory <span className="count-badge">{ready ? filtered.length : "—"}</span></h2><p>Search the local demo records by name or contact.</p></div><div className="table-tools"><label className="search-wrap"><Icon name="search" size={14} /><input className="search-input" aria-label="Search patients" placeholder="Search patients…" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div></div>
      {!ready ? <div className="empty-state">Loading patient records…</div> : filtered.length ? <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Contact</th><th>Appointments</th><th>Status</th><th>Added</th></tr></thead><tbody>{filtered.map((patient) => <tr key={patient.id}><td><div className="patient-cell"><span className="patient-mini-avatar">{initials(patient.name)}</span><strong>{patient.name}</strong></div></td><td>{patient.phone}</td><td>{appointments.filter((a) => a.patientId === patient.id || a.patientName === patient.name).length} visits</td><td><span className="status-pill">{patient.status}</span></td><td>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(patient.createdAt))}</td></tr>)}</tbody></table></div> : <div className="empty-state">No matching patients. Try another search or register a new patient.</div>}
    </section>
  </>;
}
