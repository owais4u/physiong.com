import Link from "next/link";
import { PortalPreviewFrame } from "@/components/portal-preview-frame";

const departments = [
  { name: "Physiotherapy", detail: "CRIBS Hospital · Jasola", count: "12" },
  { name: "Rehabilitation", detail: "OPD and recovery services", count: "08" },
  { name: "Sports medicine", detail: "Assessment and return to activity", count: "05" },
];

export default function HospitalPortalPage() {
  return <PortalPreviewFrame title="Hospital" eyebrow="Hospital operations preview">
    <section className="portal-page-heading"><div><span className="eyebrow">Hospital operations</span><h1>CRIBS Hospital</h1><p>Rehabilitation services overview · Jasola, New Delhi</p></div><span className="preview-tag">SAMPLE DATA</span></section>
    <section className="portal-stats" aria-label="Hospital summary">
      <article><span>Departments</span><strong>03</strong><small>Sample configuration</small></article>
      <article><span>Today’s OPD visits</span><strong>18</strong><small>Fictional count</small></article>
      <article><span>Rehabilitation beds</span><strong>12</strong><small>Illustrative capacity</small></article>
      <article><span>Practitioners</span><strong>07</strong><small>Sample roster</small></article>
    </section>
    <section className="portal-panel"><div className="portal-panel-heading"><div><h2>Departments and units</h2><p>Illustrative hospital configuration for the MVP walkthrough.</p></div><span>CRIBS · DEMO</span></div>
      <div className="hospital-departments">{departments.map((department) => <article key={department.name}><span className="department-count">{department.count}</span><div><h3>{department.name}</h3><p>{department.detail}</p></div><span className="status-pill">Preview</span></article>)}</div>
    </section>
    <section className="portal-callout"><div><h2>Continue in the clinic workspace</h2><p>Review the appointment and patient demo flows connected to the PhysioNG clinic preview.</p></div><Link href="/clinic" className="button">Open clinic portal →</Link></section>
  </PortalPreviewFrame>;
}
