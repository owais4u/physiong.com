"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icon";

const services = [
  { icon: "activity" as const, title: "Musculoskeletal care", text: "Movement-focused care for spine, joint and everyday musculoskeletal concerns." },
  { icon: "heart" as const, title: "Manual therapy", text: "Hands-on approaches tailored to each person’s assessment and goals." },
  { icon: "activity" as const, title: "Sports injury rehabilitation", text: "A guided path back to activity, with strength and movement in focus." },
  { icon: "clipboard" as const, title: "Post-operative rehabilitation", text: "Structured support to help rebuild function after surgery." },
  { icon: "stethoscope" as const, title: "Neurological rehabilitation", text: "Individualized movement and function support across recovery journeys." },
  { icon: "activity" as const, title: "Specialist techniques", text: "Chiropractic adjustment, dry needling, cupping and IASTM where appropriate." },
];

const englishBio = "Dr. Khushnoor Alam PT is a Senior Physiotherapist, Manual Therapist and Chiropractor with over 20 years of experience in physiotherapy and rehabilitation. He currently serves as HOD – Physiotherapy at CRIBS Hospital, Jasola, New Delhi, and as Associate Professor at CRIBS Institute of Paramedical Sciences. His areas of practice include Musculoskeletal Physiotherapy, Chiropractic Adjustment, Manual Therapy, Sports Injury Rehabilitation, Spine & Joint Pain Management, Post-Operative Rehabilitation, Neurological Rehabilitation, Dry Needling, Cupping and IASTM. He is committed to evidence-based, patient-centred care focused on pain relief and better movement.";

const hindiBio = "डॉ. खुश्नूर आलम PT एक वरिष्ठ फिजियोथेरेपिस्ट, मैनुअल थेरेपिस्ट और काइरोप्रैक्टर हैं। उन्हें फिजियोथेरेपी और पुनर्वास के क्षेत्र में 20 वर्षों से अधिक का अनुभव है। वे वर्तमान में नई दिल्ली के जसोला स्थित CRIBS Hospital में फिजियोथेरेपी विभागाध्यक्ष (HOD) और CRIBS Institute of Paramedical Sciences में एसोसिएट प्रोफेसर के रूप में कार्यरत हैं। उनकी विशेषज्ञताओं में मस्क्युलोस्केलेटल फिजियोथेरेपी, काइरोप्रैक्टिक एडजस्टमेंट, मैनुअल थेरेपी, खेल चोट पुनर्वास, रीढ़ और जोड़ के दर्द का प्रबंधन, ऑपरेशन के बाद पुनर्वास, न्यूरोलॉजिकल पुनर्वास, ड्राई नीडलिंग, कपिंग और IASTM शामिल हैं। वे दर्द से राहत और बेहतर गतिशीलता पर केंद्रित, साक्ष्य-आधारित और रोगी-केंद्रित देखभाल के लिए प्रतिबद्ध हैं।";

export default function Home() {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  return <>
    <header className="site-header"><div className="container site-header-inner">
      <Link className="brand" href="/"><Image className="brand-mark" src="/images/physiong-logo.jpeg" alt="PhysioNG logo" width={43} height={43} priority /><span><span className="brand-name">PhysioNG</span><span className="brand-caption">Physiotherapy, next generation</span></span></Link>
      <nav className="site-nav" aria-label="Main navigation"><a href="#care">Our care</a><a href="#doctor">Meet the doctor</a><a href="#visit">Find us</a></nav>
      <div className="site-header-actions"><Link href="/clinic" className="button secondary small">Clinic workspace</Link><Link href="/book" className="button small">Book a visit <Icon name="arrow" size={14} /></Link></div>
    </div></header>

    <main>
      <section className="hero"><div className="container hero-grid">
        <div className="hero-copy"><span className="eyebrow">Physiotherapy · Rehabilitation · Better movement</span><h1>Care that helps you <em>move forward.</em></h1><p>Thank you for contacting PhysioNG. We bring experienced physiotherapy and rehabilitation care together with a thoughtful, patient-centred approach.</p>
          <div className="hero-actions"><Link className="button" href="/book">Request an appointment <Icon name="arrow" size={16} /></Link><a className="button secondary" href="#doctor">Meet Dr. Khushnoor</a></div>
          <div className="hero-note"><span className="status-dot" /><span><strong>PhysioNG at CRIBS Hospital</strong> · Jasola, New Delhi</span></div>
        </div>
        <div className="hero-image-wrap"><Image className="hero-image" src="/images/physiotherapy-assessment.jpg" alt="A physiotherapist guiding a patient during a balance assessment" fill priority sizes="(max-width: 760px) 100vw, 48vw" /><div className="image-caption"><span className="caption-icon"><Icon name="heart" size={16} /></span><span><b>Patient-centred care</b>Focused on pain relief and better movement</span></div></div>
      </div></section>

      <section className="trust-row"><div className="container trust-grid"><div className="trust-item"><strong>20+ years</strong><span>Physiotherapy & rehabilitation experience</span></div><div className="trust-item"><strong>Experienced leadership</strong><span>HOD – Physiotherapy at CRIBS Hospital</span></div><div className="trust-item"><strong>Individualized care</strong><span>Care shaped around the person and their goals</span></div><div className="trust-item"><strong>Jasola, New Delhi</strong><span>Based at CRIBS Hospital</span></div></div></section>

      <section className="section" id="care"><div className="container"><div className="section-heading"><span className="eyebrow">Areas of care</span><h2>Support for every step of recovery.</h2><p>Care is planned around a person’s needs, assessment and goals. Book a consultation to discuss which approach may be appropriate.</p></div><div className="services-grid">{services.map((service) => <article className="service-card" key={service.title}><span className="service-icon"><Icon name={service.icon} size={19} /></span><h3>{service.title}</h3><p>{service.text}</p></article>)}</div></div></section>

      <section className="section about-section" id="doctor"><div className="container about-grid"><div className="about-photo"><Image src="/images/clinic-treatment-room.jpg" alt="A welcoming physiotherapy treatment room" fill sizes="(max-width: 760px) 100vw, 45vw" /><div className="experience-badge"><b>20+</b><span>years dedicated to care</span></div></div><div className="doctor-copy"><span className="eyebrow">Meet your physiotherapist</span><h2>Dr. Khushnoor Alam PT</h2><p className="doctor-title">Senior Physiotherapist · Manual Therapist · Chiropractor</p><p>{language === "en" ? englishBio : hindiBio}</p><div className="specialty-chips">{["Musculoskeletal", "Manual therapy", "Sports injury", "Spine & joint", "Post-operative", "Neurological rehab", "Dry needling", "Cupping · IASTM"].map((item) => <span className="specialty-chip" key={item}>{item}</span>)}</div><div className="bio-language" aria-label="Biography language"><button type="button" className={`language-toggle ${language === "en" ? "active" : ""}`} onClick={() => setLanguage("en")}>English</button><button type="button" className={`language-toggle ${language === "hi" ? "active" : ""}`} onClick={() => setLanguage("hi")}>हिन्दी</button></div></div></div><div className="container"><blockquote className="quote-card">“Evidence-based, patient-centred care focused on pain relief and better movement.”</blockquote></div></section>

      <section className="section location-section" id="visit"><div className="container"><div className="location-card"><div className="location-image"><Image src="/images/clinic-treatment-room.jpg" alt="Physiotherapy treatment room at a clinic" fill sizes="(max-width:760px) 100vw, 50vw" /></div><div className="location-info"><span className="eyebrow">Visit PhysioNG</span><h3>CRIBS Hospital</h3><p>Physiotherapy Department<br />Jasola, New Delhi</p><p>Dr. Khushnoor Alam PT serves as HOD – Physiotherapy at CRIBS Hospital and Associate Professor at CRIBS Institute of Paramedical Sciences.</p><div className="hero-actions"><Link href="/book" className="button">Request a visit <Icon name="arrow" size={15} /></Link><Link href="/clinic" className="text-link">Open clinic workspace →</Link></div></div></div></div></section>
    </main>

    <footer className="site-footer"><div className="container footer-row"><div className="brand"><Image className="brand-mark" src="/images/physiong-logo.jpeg" alt="" width={40} height={40} /><span><span className="brand-name" style={{ color: "white" }}>PhysioNG</span><span className="brand-caption">Physiotherapy, next generation</span></span></div><p>Care and content provided by the clinic. Demo only; not a live booking or medical record system. Photos are illustrative stock imagery.</p><Link className="footer-link" href="/clinic">Clinic workspace <Icon name="arrow" size={13} /></Link></div></footer>
  </>;
}
