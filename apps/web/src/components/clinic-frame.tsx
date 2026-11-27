"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useDemoData } from "@/components/demo-data-provider";
import { Icon } from "@/components/icon";

const navItems = [
  { href: "/clinic", label: "Overview", icon: "dashboard" as const },
  { href: "/clinic/patients", label: "Patients", icon: "users" as const },
  { href: "/clinic/appointments", label: "Appointments", icon: "calendar" as const },
  { href: "/clinic/encounters", label: "Clinical notes", icon: "clipboard" as const },
  { href: "/hospital", label: "Hospital portal", icon: "activity" as const },
  { href: "/patient", label: "Patient portal", icon: "heart" as const },
  { href: "/admin", label: "Platform admin", icon: "shield" as const },
];

function getTitle(pathname: string) {
  if (pathname.includes("patients/new")) return "Register patient";
  if (pathname.includes("patients")) return "Patients";
  if (pathname.includes("appointments/new")) return "Book appointment";
  if (pathname.includes("appointments")) return "Appointments";
  if (pathname.includes("encounters/new")) return "New clinical note";
  if (pathname.includes("encounters")) return "Clinical notes";
  if (pathname === "/patient") return "Patient portal";
  return "Clinic overview";
}

export function ClinicFrame({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { resetDemo } = useDemoData();

  function handleReset() {
    if (window.confirm("Reset this browser's PhysioNG demo data to the original sample?")) resetDemo();
  }

  return (
    <div className="portal">
      <div className="portal-shell">
        <div className={`sidebar-backdrop ${menuOpen ? "visible" : ""}`} onClick={() => setMenuOpen(false)} />
        <aside className={`portal-sidebar ${menuOpen ? "open" : ""}`}>
          <Link href="/" className="brand" onClick={() => setMenuOpen(false)}>
            <Image className="brand-mark" src="/images/physiong-logo.jpeg" alt="PhysioNG logo" width={43} height={43} />
            <span><span className="brand-name">PhysioNG</span><span className="brand-caption">Clinic workspace</span></span>
          </Link>
          <div className="sidebar-clinic">
            <div className="clinic-avatar">PN</div>
            <div><strong>PhysioNG · CRIBS</strong><span>Jasola, New Delhi</span></div>
          </div>
          <p className="sidebar-section-label">Workspace</p>
          <nav className="sidebar-nav" aria-label="Clinic navigation">
            {navItems.map((item) => {
              const active = item.href === "/clinic" ? pathname === item.href : pathname.startsWith(item.href);
              return <Link key={item.href} className={`sidebar-link ${active ? "active" : ""}`} href={item.href} onClick={() => setMenuOpen(false)}><Icon name={item.icon} size={17} />{item.label}</Link>;
            })}
          </nav>
          <p className="sidebar-section-label" style={{ marginTop: 25 }}>Shortcuts</p>
          <nav className="sidebar-nav" aria-label="Shortcuts">
            <Link className={`sidebar-link ${pathname.includes("appointments/new") ? "active" : ""}`} href="/clinic/appointments/new" onClick={() => setMenuOpen(false)}><Icon name="plus" size={17} />Book a visit</Link>
            <Link className={`sidebar-link ${pathname.includes("patients/new") ? "active" : ""}`} href="/clinic/patients/new" onClick={() => setMenuOpen(false)}><Icon name="plus" size={17} />Add a patient</Link>
          </nav>
          <div className="sidebar-spacer" />
          <div className="demo-mode-card"><b>DEMO WORKSPACE</b>Sample records stay in this browser. Don’t enter real patient details.</div>
          <button className="sidebar-reset" type="button" onClick={handleReset}><Icon name="refresh" size={14} />Reset demo data</button>
        </aside>
        <main className="portal-main">
          <header className="portal-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button type="button" className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Icon name="menu" /></button>
              <div className="breadcrumbs">PhysioNG <span style={{ padding: "0 6px", color: "#aab7b7" }}>/</span> <b>{getTitle(pathname)}</b></div>
            </div>
            <div className="topbar-right">
              <span className="hospital-label"><Icon name="pin" size={13} /> CRIBS Hospital</span>
              <button type="button" className="icon-button notification-button" aria-label="Notifications"><Icon name="bell" size={17} /><i /></button>
              <div className="user-menu"><div className="user-avatar">KA</div><div className="user-copy"><span className="user-name">Dr. Khushnoor Alam</span><span className="user-role">Clinic administrator</span></div></div>
            </div>
          </header>
          <div className="portal-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
