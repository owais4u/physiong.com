import Image from "next/image";
import Link from "next/link";

export default function PatientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="patient-preview-shell">
    <header className="patient-header"><div className="patient-header-inner"><Link className="brand" href="/"><Image className="brand-mark" src="/images/physiong-logo.jpeg" alt="PhysioNG logo" width={42} height={42} /><span><span className="brand-name">PhysioNG</span><span className="brand-caption">Patient portal preview</span></span></Link><div className="patient-header-links"><span className="preview-label">DEMO PREVIEW</span><Link href="/">PhysioNG home</Link><Link href="/clinic">Clinic workspace</Link></div></div></header>
    <main className="patient-content">{children}</main>
    <footer className="patient-footer">PhysioNG · CRIBS Hospital, Jasola, New Delhi <span>Sample portal only · Not for real patient data</span></footer>
  </div>;
}
