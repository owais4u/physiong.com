"use client";

import Image from "next/image";
import Link from "next/link";
import { useDemoData } from "@/components/demo-data-provider";
import { Icon } from "@/components/icon";
import { dateKey } from "@/components/demo-data-provider";

function formatToday() {
  return new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date(2000, 0, 1, hours, minutes));
}

export default function ClinicDashboard() {
  const { ready, patients, appointments, encounters } = useDemoData();
  const todayAppointments = appointments.filter((item) => item.date === dateKey() && item.status !== "Cancelled").sort((a,b) => a.time.localeCompare(b.time));

  if (!ready) return <div className="loading-card">Opening the demo workspace…</div>;

  return (
    <>
      <div className="page-heading">
        <div><span className="eyebrow">{formatToday()}</span><h1>Good morning, Dr. Khushnoor</h1><p>Here’s what’s happening at PhysioNG today.</p></div>
        <div className="heading-actions"><Link className="button secondary" href="/clinic/patients/new"><Icon name="plus" size={16} />Add patient</Link><Link className="button" href="/clinic/appointments/new"><Icon name="calendar" size={15} />Book appointment</Link></div>
      </div>
      <div className="notice-banner"><Icon name="shield" size={16} /><span><strong>Prototype demo data.</strong> Records are stored only in this browser. Do not enter real patient information; authentication and secure server storage are not yet connected.</span></div>
      <div className="stats-grid">
        <StatCard label="Appointments today" value={String(todayAppointments.length)} foot="Across today's schedule" icon="calendar" />
        <StatCard label="Active patients" value={String(patients.length)} foot="Demo workspace records" icon="users" />
        <StatCard label="Clinical notes" value={String(encounters.length)} foot="Saved in this browser" icon="clipboard" />
        <StatCard label="New bookings" value={String(appointments.filter((item) => item.createdAt.slice(0,10) === dateKey()).length)} foot="Today" icon="activity" />
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header"><div><h2>Today’s appointments</h2><p>Your clinic schedule at a glance</p></div><Link href="/clinic/appointments" className="text-link">View schedule →</Link></div>
          <div className="appointment-list">
            {todayAppointments.length ? todayAppointments.map((appointment) => <div className="appointment-row" key={appointment.id}>
              <div className="time-pill">{formatTime(appointment.time)}</div>
              <div><span className="patient-name">{appointment.patientName}</span><span className="patient-sub">{appointment.service} · {appointment.durationMinutes} min</span></div>
              <span className={`status-pill ${appointment.status === "Scheduled" ? "pending" : ""}`}>{appointment.status}</span>
            </div>) : <div className="empty-state">No appointments booked for today yet.</div>}
          </div>
        </section>
        <section className="panel profile-panel">
          <div className="profile-cover"><Image src="/images/clinic-treatment-room.jpg" alt="Physiotherapy treatment room" fill sizes="(max-width: 1050px) 200px, 300px" /></div>
          <div className="profile-avatar">KA</div>
          <div className="profile-content"><h3>Dr. Khushnoor Alam PT</h3><p className="profile-title">Senior Physiotherapist · Manual Therapist</p><p>Evidence-based, patient-centred care focused on pain relief and better movement.</p>
            <div className="profile-meta"><span><Icon name="pin" size={14} />CRIBS Hospital, Jasola, New Delhi</span><span><Icon name="clock" size={14} />20+ years of experience</span></div>
          </div>
        </section>
      </div>
      <div className="quick-actions">
        <QuickAction href="/clinic/patients/new" icon="users" title="Register a patient" detail="Add a patient to your clinic" />
        <QuickAction href="/clinic/appointments/new" icon="calendar" title="Book a visit" detail="Select a service and time" />
        <QuickAction href="/clinic/encounters/new" icon="clipboard" title="Write clinical note" detail="Document a demo encounter" />
      </div>
    </>
  );
}

function StatCard({ label, value, foot, icon }: { label: string; value: string; foot: string; icon: "calendar" | "users" | "clipboard" | "activity" }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className="stat-icon"><Icon name={icon} size={16} /></span></div><div className="stat-number">{value}</div><div className="stat-foot">{foot}</div></div>;
}

function QuickAction({ href, icon, title, detail }: { href: string; icon: "users" | "calendar" | "clipboard"; title: string; detail: string }) {
  return <Link className="quick-action" href={href}><span className="quick-icon"><Icon name={icon} size={17} /></span><span><b>{title}</b><span>{detail}</span></span><Icon name="chevron" size={15} style={{ marginLeft: "auto", color: "#99a9a9" }} /></Link>;
}
