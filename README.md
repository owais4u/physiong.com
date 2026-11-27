# PhysioNG

**The complete digital operating system for physiotherapy and rehabilitation.**

PhysioNG is a multi-tenant SaaS platform for independent physiotherapists, clinics, rehabilitation centres, and hospitals. It targets India and international markets with configurable country settings and a responsive PWA-first experience.

## Product modules

- **ClinicNG:** clinic operations, appointments, staff, patients, and billing.
- **HospitalNG:** departments, OPD/IPD, rehabilitation units, and enterprise operations.
- **PatientNG:** patient portal, exercises, recovery tracking, and appointments.
- **AdminNG:** tenant, subscription, compliance, and support administration.
- **PhysioNG Intelligence:** AI-assisted documentation, analytics, and recovery insights.

These are product modules, not a requirement to launch separate apps. Start with one Next.js application and role-based layouts; split portals when product and team needs justify it.

## Technology direction

- Next.js, React, and TypeScript for the responsive web/PWA experience.
- NestJS for the domain-oriented core API; Python/FastAPI for intelligence services.
- Celery and Redis for background jobs; PostgreSQL as the source of truth.
- WordPress for content and SEO; S3-compatible object storage for files.
- OpenTelemetry for logs, metrics, and traces.
- Modular monolith first; extract independently deployable services when justified.

## Run the MVP demo

Requirements: Node.js 20.9+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The public PhysioNG page, clinic workspace (`/clinic`), demo booking (`/book`), and patient portal (`/patient`) are included. Demo records are stored in the current browser only. Do not enter real patient details; authentication, server persistence, database RLS, and production security are not connected yet.

See the [project plan](PROJECT_PLAN.md), [MVP scope](MVP_README.md), [repository structure](REPOSITORY_STRUCTURE.md), [asset library](assets/README.md), [implementation blueprint](docs/product/implementation-blueprint.md), [C4 architecture diagrams](docs/architecture/physiong-c4-architecture.drawio), [system design diagram](docs/architecture/physiong-system-design.drawio), [High-Level Design](docs/architecture/high-level-design.md), and [Low-Level Design](docs/architecture/low-level-design.md).

## Delivery sequence

1. Foundation: monorepo, Docker, CI, PostgreSQL, Redis, NestJS, Next.js, and environment configuration.
2. SaaS core: tenant isolation, identity, roles and permissions, organizations, subscriptions, and branches.
3. Clinic management: patients, practitioners, appointments, and scheduling.
4. Clinical management: records, assessments, SOAP notes, treatment plans, and exercise prescriptions.
5. Commercial operations: billing, payments, notifications, and reports.

Build tenant isolation, identity, patient management, and the physiotherapy workflow before prioritizing AI features or complex hospital IPD functionality.

## Security and compliance

Tenant isolation, privacy, auditability, consent, secure file access, and data portability are architectural requirements. Assess applicable legal and regulatory obligations for each deployment and jurisdiction; this project does not claim regulatory certification.

## License

See [LICENSE](LICENSE).
