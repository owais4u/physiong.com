import Image from "next/image";
import Link from "next/link";
import { BookingForm } from "@/components/booking-form";
import { Icon } from "@/components/icon";

export default function PublicBookingPage() {
  return <div className="booking-page">
    <header className="site-header"><div className="container site-header-inner"><Link className="brand" href="/"><Image className="brand-mark" src="/images/physiong-logo.jpeg" alt="PhysioNG logo" width={43} height={43} /><span><span className="brand-name">PhysioNG</span><span className="brand-caption">Physiotherapy, next generation</span></span></Link><Link href="/" className="text-link">← Back to home</Link></div></header>
    <main className="container booking-main"><div className="page-heading"><div><span className="eyebrow">PhysioNG · CRIBS Hospital</span><h1>Request a visit</h1><p>Choose a service and a preferred available time with Dr. Khushnoor Alam PT.</p></div></div>
      <div className="notice-banner"><Icon name="shield" size={16} /><span><strong>Demo booking page.</strong> Requests are saved in this browser only; they are not sent to the clinic. Don’t enter real patient information.</span></div>
      <div className="form-layout"><BookingForm publicMode /><aside className="booking-side"><Image src="/images/physiotherapy-assessment.jpg" alt="A physiotherapist supporting a patient during a balance assessment" width={800} height={1200} /><div className="booking-side-copy"><span className="eyebrow">Patient-centred care</span><h2>Move with confidence.</h2><p>Musculoskeletal care, manual therapy and rehabilitation led by an experienced physiotherapy team.</p></div></aside></div>
    </main>
  </div>;
}
