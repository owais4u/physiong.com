# PhysioNG web MVP demo

This is the first runnable, clinic-first interface for PhysioNG. It is seeded for PhysioNG at CRIBS Hospital in Jasola, New Delhi, with Dr. Khushnoor Alam PT as the featured practitioner.

## Run locally

From the repository root:

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

For a production-mode local container, run `docker compose up --build -d` from the repository root, then open `http://localhost:3000`. Use `docker compose logs -f web` to inspect logs and `docker compose down` to stop it. The container packages the currently implemented web MVP; architecture components without code are not started as containers.

## Included journeys

- Public clinic page with English/Hindi practitioner biography, specialties, location, and local demo booking.
- Clinic workspace with daily schedule, patient directory, patient registration, appointment booking/status changes, and encounter notes.
- Patient portal preview showing sample visit details.
- Hospital operations and SaaS platform-admin previews.
- Appointment overlap checks, browser-local persistence, and reset-to-demo data control.

## Demo data and security status

This is a front-end prototype. Its sample records and new entries are stored in browser `localStorage`. There is no authentication, secure server API, PostgreSQL persistence, tenant RLS, audit service, or connection to CRIBS Hospital. Do not enter real names, contact details, health information, or clinical notes. A production clinic workflow must implement the identity, authorization, database, consent, audit, backup, and jurisdiction-specific security requirements in the project architecture first.

Booking requests are not transmitted to the clinic. The “patient portal” is a sample UI with a selector, not a protected patient account.

## Images

Local, optimized copies are in `public/images/`; source assets and photo credits are in [`../../assets/README.md`](../../assets/README.md). The people and rooms in stock imagery are illustrative and are not Dr. Khushnoor Alam or a claim that the pictured clinic is CRIBS Hospital.

## Quality checks

From the repository root, run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`. After building, `pnpm test:e2e` smoke-checks the generated routes and local images over HTTP.
