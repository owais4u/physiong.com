"use client";

import Link from "next/link";
import { useDemoData } from "@/components/demo-data-provider";
import { Icon } from "@/components/icon";

export default function EncountersPage() {
  const { ready, encounters } = useDemoData();
  return <>
    <div className="page-heading"><div><span className="eyebrow">Clinical workspace</span><h1>Clinical notes</h1><p>Encounter documentation for the demo clinic.</p></div><div className="heading-actions"><Link className="button" href="/clinic/encounters/new"><Icon name="plus" size={16} />New note</Link></div></div>
    <div className="notice-banner"><Icon name="shield" size={16} /><span><strong>Demo notes only.</strong> This prototype does not meet clinical-record security requirements. Never enter real patient details or treatment notes.</span></div>
    <div className="encounter-list">{!ready ? <div className="panel empty-state">Loading demo notes…</div> : encounters.length ? encounters.map((item) => <article className="encounter-card" key={item.id}><div className="encounter-card-top"><div><h3>{item.patientName}</h3><p>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${item.date}T12:00:00`))} · Dr. Khushnoor Alam PT</p></div><span className="status-pill">Demo record</span></div><p><strong>Presenting concern:</strong> {item.presentingConcern}</p><p><strong>Assessment:</strong> {item.assessment}</p><p><strong>Treatment:</strong> {item.treatment}</p><p><strong>Plan:</strong> {item.plan}</p></article>) : <div className="panel empty-state">No demo notes yet. Start a new encounter note.</div>}</div>
  </>;
}
