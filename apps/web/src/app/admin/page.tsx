import Link from "next/link";
import { PortalPreviewFrame } from "@/components/portal-preview-frame";

export default function AdminPortalPage() {
  return <PortalPreviewFrame title="Platform admin" eyebrow="Platform administration preview">
    <section className="portal-page-heading"><div><span className="eyebrow">Platform administration</span><h1>PhysioNG control centre</h1><p>Tenant and subscription overview · Sample values only</p></div><span className="preview-tag">SAMPLE DATA</span></section>
    <section className="portal-stats" aria-label="Platform summary">
      <article><span>Organizations</span><strong>01</strong><small>PhysioNG · CRIBS Hospital</small></article>
      <article><span>Active plan</span><strong>Demo</strong><small>No billing connection</small></article>
      <article><span>Platform users</span><strong>04</strong><small>Fictional preview count</small></article>
      <article><span>Open support</span><strong>00</strong><small>Support queue not connected</small></article>
    </section>
    <section className="portal-panel"><div className="portal-panel-heading"><div><h2>Organizations</h2><p>Sample tenant directory for the admin portal preview.</p></div><span>1 DEMO TENANT</span></div>
      <div className="tenant-row"><div className="tenant-avatar">PN</div><div className="tenant-details"><h3>PhysioNG · CRIBS Hospital</h3><p>India · Jasola, New Delhi · Physiotherapy</p></div><span className="status-pill">Demo active</span><span className="tenant-plan">No paid plan</span></div>
    </section>
    <section className="admin-boundary"><strong>Production controls are not connected.</strong><span>Authentication, tenant provisioning, subscription billing, compliance management, audit history, and support tooling need secure backend services before this preview can administer real accounts.</span></section>
    <section className="portal-callout"><div><h2>See the patient-facing experience</h2><p>Open the patient portal sample to review its demo recovery view.</p></div><Link href="/patient" className="button">Open patient portal →</Link></section>
  </PortalPreviewFrame>;
}
