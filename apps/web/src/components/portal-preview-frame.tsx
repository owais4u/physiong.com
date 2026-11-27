import Image from "next/image";
import Link from "next/link";

const portals = [
  { href: "/clinic", label: "Clinic" },
  { href: "/hospital", label: "Hospital" },
  { href: "/patient", label: "Patient" },
  { href: "/admin", label: "Platform admin" },
];

export function PortalPreviewFrame({
  title,
  eyebrow,
  children,
}: Readonly<{ title: string; eyebrow: string; children: React.ReactNode }>) {
  return <main className="preview-portal">
    <header className="preview-portal-header">
      <Link href="/" className="brand">
        <Image className="preview-portal-logo" src="/images/physiong-logo.jpeg" alt="PhysioNG logo" width={192} height={192} priority />
        <span><span className="brand-name">PhysioNG</span><span className="brand-caption">{eyebrow}</span></span>
      </Link>
      <nav className="preview-portal-nav" aria-label="Portal previews">
        {portals.map((portal) => <Link key={portal.href} href={portal.href} aria-current={portal.label === title ? "page" : undefined}>{portal.label}</Link>)}
      </nav>
    </header>
    <div className="preview-portal-content">
      <div className="preview-warning"><strong>Demonstration only.</strong><span>Sample information only. No user accounts, real patient records, or hospital systems are connected.</span></div>
      {children}
    </div>
  </main>;
}
