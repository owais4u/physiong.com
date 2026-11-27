"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useDemoData } from "@/components/demo-data-provider";
import { Icon } from "@/components/icon";
import { dateKey } from "@/components/demo-data-provider";

function timeLabel(time: string) { const [h,m] = time.split(":").map(Number); return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date(2000,0,1,h,m)); }
function dateLabel(date: string) { return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`)); }

export default function AppointmentsPage() {
  const { ready, appointments, updateAppointmentStatus } = useDemoData();
  const [filter, setFilter] = useState("all");
  const rows = useMemo(() => appointments.filter((a) => filter === "all" || (filter === "upcoming" ? a.status === "Scheduled" || a.status === "Checked in" : a.date === dateKey())).sort((a,b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)), [appointments, filter]);

  return <>
    <div className="page-heading"><div><span className="eyebrow">Clinic schedule</span><h1>Appointments</h1><p>Manage appointments for Dr. Khushnoor Alam.</p></div><div className="heading-actions"><Link className="button" href="/clinic/appointments/new"><Icon name="plus" size={16} />Book appointment</Link></div></div>
    <div className="notice-banner"><Icon name="shield" size={16} /><span><strong>Demo schedule.</strong> Appointments are stored locally in this browser only.</span></div>
    <section className="panel"><div className="panel-header"><div><h2>Appointment list</h2><p>{ready ? rows.length : "—"} appointments in this view</p></div><div className="table-tools"><select className="filter-select" aria-label="Filter appointments" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All appointments</option><option value="upcoming">Scheduled / checked in</option><option value="today">Today</option></select></div></div>
      {!ready ? <div className="empty-state">Loading appointments…</div> : rows.length ? <div className="table-wrap"><table><thead><tr><th>Date & time</th><th>Patient</th><th>Service</th><th>Status</th><th>Update status</th></tr></thead><tbody>{rows.map((a) => <tr key={a.id}><td><strong>{dateLabel(a.date)}</strong><span className="patient-sub">{timeLabel(a.time)} · {a.durationMinutes} min</span></td><td><strong>{a.patientName}</strong><span className="patient-sub">{a.phone}</span></td><td>{a.service}</td><td><span className={`status-pill ${a.status === "Scheduled" ? "pending" : a.status === "Cancelled" ? "cancelled" : ""}`}>{a.status}</span></td><td><select className="status-select" aria-label={`Update ${a.patientName} appointment status`} value={a.status} onChange={(event) => updateAppointmentStatus(a.id, event.target.value as typeof a.status)}><option>Scheduled</option><option>Checked in</option><option>Completed</option><option>Cancelled</option><option>No-show</option></select></td></tr>)}</tbody></table></div> : <div className="empty-state">No appointments in this view.</div>}
    </section>
  </>;
}
