import Link from "next/link";
import { BookingForm } from "@/components/booking-form";
import { Icon } from "@/components/icon";

export default function NewAppointmentPage() {
  return <>
    <div className="page-heading"><div><span className="eyebrow">Clinic schedule</span><h1>Book an appointment</h1><p>Add a 45-minute visit with Dr. Khushnoor Alam PT.</p></div><Link href="/clinic/appointments" className="button secondary">View schedule</Link></div>
    <div className="notice-banner"><Icon name="shield" size={16} /><span><strong>Demo mode.</strong> Use fictional details. Booking data stays in this browser and does not contact the hospital.</span></div>
    <div className="form-layout"><BookingForm /><aside className="info-card"><h3>PhysioNG · CRIBS Hospital</h3><p>Outpatient physiotherapy and rehabilitation in Jasola, New Delhi.</p><div className="info-list"><div className="info-list-row"><Icon name="pin" size={15} />Jasola, New Delhi</div><div className="info-list-row"><Icon name="clock" size={15} />45-minute appointments</div><div className="info-list-row"><Icon name="stethoscope" size={15} />Dr. Khushnoor Alam PT</div></div><div style={{ marginTop: 18 }}><Link href="/book" className="text-link">Open public booking page →</Link></div></aside></div>
  </>;
}
