# PhysioNG MVP

**Purpose:** Define the smallest useful, secure release of PhysioNG for a physiotherapy clinic.  
**Product direction:** India and global markets; clinic-first, responsive PWA; multi-tenant SaaS.  
**Status:** MVP scope proposal based on [the project plan](PROJECT_PLAN.md) and [product blueprint](docs/product/implementation-blueprint.md).

**Working demo:** The first Next.js interface is in [apps/web](apps/web/README.md). It demonstrates the clinic and patient journeys with browser-local sample data; it is not ready for live patient records or production clinical operations.

## MVP outcome

A clinic administrator can set up an organization and branch, invite staff, and manage patients, appointments, and physiotherapy encounters in one tenant-aware web application. Staff can document consent, assessment, diagnosis, treatment, and clinical notes, then schedule a follow-up. Tenant boundaries and clinical access history are enforced by the server and database.

## Target users

- **Platform administrator:** supports tenant onboarding and platform operations.
- **Clinic administrator:** configures an organization and branch, invites team members, and manages clinic operations.
- **Practitioner:** manages their schedule and patient care, subject to assigned permissions.
- **Front-desk staff:** registers patients and manages appointments, with access limited to their responsibilities.

Patient self-service is a later release; the MVP is staff-facing and responsive on mobile.

## MVP scope

### 1. Foundation and tenant onboarding

- Single Next.js application with role-based layouts and a NestJS modular API.
- PostgreSQL as the source of truth; Redis available for background work where needed.
- Create a tenant, organization, and initial branch; invite the first administrator.
- Authenticated users can access only tenants where they have an active membership.
- Server-established tenant context, PostgreSQL row-level security, tenant-aware constraints, and audit events for privileged changes.

### 2. Identity and clinic access

- Sign-in, sign-out, password reset, and invitation acceptance.
- Organization membership and role-based permissions for platform admin, clinic admin, practitioner, and front desk.
- Enforce access checks on the API; the UI is not a security boundary.
- MFA for privileged roles before production use.

### 3. Patient and practitioner records

- Register, view, update, search, and deactivate patient records within a tenant.
- Capture contact details, emergency contact, relevant medical history, and explicit consent state and timestamp.
- Create practitioner profiles and associate them with a branch and availability.
- Avoid collecting data that is not needed for the clinical workflow.

### 4. Appointments and scheduling

- Configure practitioner availability and appointment duration.
- Create, view, reschedule, and cancel appointments; prevent conflicting bookings for the same practitioner.
- Appointment states: scheduled, checked in, completed, cancelled, and no-show.
- Filter schedules by branch, practitioner, and date.

### 5. Physiotherapy encounters

- Start an encounter from an appointment or patient record.
- Record assessment findings, diagnosis, treatment provided, clinical notes, and follow-up plan.
- Create a basic treatment plan and prescribe exercises from a curated catalogue.
- Keep an attributable, time-stamped history of clinical record creation and updates; corrections must preserve traceability.

### 6. Basic operational view

- Today's appointment list and basic patient/practitioner counts.
- Search and filter patients and appointments within the user's authorized tenant and branch scope.
- No financial ledger, payment processing, or advanced analytics in the MVP.

## Core MVP journey

1. Platform administrator creates a tenant and invites a clinic administrator.
2. Clinic administrator configures the organization and first branch, then invites practitioners and front-desk staff.
3. Staff registers a patient, records consent, and books an appointment with an available practitioner.
4. The practitioner checks in the patient and documents an assessment, diagnosis, treatment, and clinical note.
5. The practitioner records a treatment plan/exercise prescription and schedules a follow-up.
6. Authorized staff can review the patient's history and appointment status; all access remains tenant-scoped and auditable.

## Explicitly out of scope for MVP

- Hospital IPD, admissions, wards, beds, transfers, and enterprise hospital workflows.
- Separate ClinicNG, HospitalNG, PatientNG, or AdminNG applications; these remain modules/roles in the initial app.
- Patient accounts, home exercise adherence tracking, telehealth, and patient recovery portal.
- Insurance claims, inventory, complex billing, payment gateways, subscriptions automation, and accounting integrations.
- AI-generated clinical documentation or treatment recommendations.
- Country-specific tax engines, broad third-party integrations, and claims of GDPR/HIPAA/DPDP certification.
- Microservices; keep the API a modular monolith until there is a demonstrated need to split it.

## Minimum release requirements

### Security and privacy

- Every tenant-owned record is scoped to a tenant and protected by server-side authorization and database policies.
- Automated tests prove that users cannot read or modify another tenant's data through APIs or direct record identifiers.
- Role and resource permissions are checked on sensitive operations.
- Clinical records and privileged access produce attributable audit events.
- Secrets are managed outside source control; transport and stored sensitive data are protected in deployed environments.
- Consent, retention, export, backup, and recovery behaviors are documented before production use.

### Reliability and usability

- Common clinic tasks work on desktop and mobile-sized screens.
- Forms validate required data and present clear recovery from errors.
- Date, time, and locale presentation can be configured per tenant; store timestamps consistently and avoid assuming one country.
- Production deployment has monitored errors, documented backups, and a tested restore procedure.

## Acceptance checklist

- [ ] A clinic can be onboarded and staff invited without manual database edits.
- [ ] Users can switch only among tenants for which they have active membership.
- [ ] Patient registration, consent, search, and updates work within the tenant boundary.
- [ ] Appointment booking prevents practitioner schedule conflicts and supports rescheduling/cancellation.
- [ ] A practitioner can complete an encounter and create a follow-up plan.
- [ ] Authorized staff can view a patient's longitudinal clinic history.
- [ ] Cross-tenant access tests pass for patients, appointments, and clinical records.
- [ ] Key clinical changes and privileged actions have attributable audit history.
- [ ] Core journeys are usable on mobile and desktop.
- [ ] Setup, deployment, backup, restore, and operational instructions are documented.

## Suggested implementation order

1. Local development foundation and application shells.
2. Authentication, tenant model, server-side tenant context, RLS, and cross-tenant tests.
3. Organization, branches, memberships, invitations, and roles.
4. Patient registration, consent, and practitioner records.
5. Availability, appointment lifecycle, and conflict prevention.
6. Encounters, assessments, notes, treatment plans, and exercises.
7. Operational overview, observability, deployment hardening, and release acceptance.

## MVP success measures

Track a small set of product measures after pilots begin:

- Time from tenant creation to first booked appointment.
- Percentage of scheduled appointments with a completed encounter record.
- Weekly active practitioners and front-desk users per clinic.
- Appointment booking and rescheduling completion rate.
- Tenant isolation/security test coverage and production incidents involving access control.

Set numeric targets with pilot clinics; this plan does not invent adoption baselines.
