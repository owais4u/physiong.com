# PhysioNG implementation blueprint v1.0

**Status:** Product strategy finalized; implementation baseline  
**Category:** Global physiotherapy, rehabilitation, and hospital management SaaS

## Product strategy

| Dimension | Decision |
| --- | --- |
| Markets | India and global |
| Customers | Clinics and hospitals |
| Commercial model | SaaS and enterprise |
| Mobile | Responsive PWA first |
| Architecture | Modular monolith first; microservices later |
| Backend | Node.js/NestJS and Python/FastAPI |
| Background jobs | Celery with Redis |
| Primary database | PostgreSQL |
| CMS | WordPress |
| Frontend | Next.js, React, and TypeScript |

## Positioning and customers

**PhysioNG — The complete digital operating system for physiotherapy and rehabilitation.**

Serve independent physiotherapists and solo practitioners; small, medium, and multi-location clinics; and hospitals, rehabilitation centres, and enterprise healthcare groups. The platform is multi-tenant from day one, with configurable currencies, languages, taxation, date formats, clinical workflows, and regulatory requirements by country.

## Product ecosystem

| Module | Scope |
| --- | --- |
| ClinicNG | Clinic, appointments, staff, patients, billing, and clinical operations |
| HospitalNG | Departments, OPD/IPD, rehabilitation units, and enterprise operations |
| PatientNG | Patient portal/PWA, exercises, recovery tracking, and appointments |
| AdminNG | SaaS administration, tenants, subscriptions, compliance, and support |
| PhysioNG Intelligence | AI-assisted documentation, clinical analytics, operational intelligence, and recovery insights |

These are product modules, not separate applications that must all be built immediately. The initial release can use one Next.js application with role-based layouts.

## Critical workflows

1. **Tenant onboarding:** create organization → select plan → configure branch → invite administrator → activate tenant.
2. **Patient lifecycle:** registration → consent → medical history → assessment → diagnosis → treatment plan.
3. **Physiotherapy session:** appointment → check-in → assessment → treatment → clinical notes → next appointment.
4. **Recovery management:** exercise prescription → patient adherence → outcome measurement → progress review.
5. **Revenue lifecycle:** service/package → invoice → payment → receipt → financial reporting.

## Data and tenancy principles

PostgreSQL is the transactional source of truth. Start with a shared database and `tenant_id` on tenant-owned records. Establish tenant context from authenticated server-side identity and enforce it with PostgreSQL row-level security (RLS); frontend filtering is not a security boundary. Use tenant-aware foreign keys, indexes, and composite unique constraints. Apply separate access policies to clinical documents in object storage. Add automated tests proving cross-tenant access is prevented.

Core domains and tables include SaaS (`tenants`, `subscriptions`, `plans`); organization (`organizations`, `branches`, `departments`); identity (`users`, `memberships`, `roles`, `permissions`); patients (`patients`, `contacts`, `consents`, `medical_histories`); clinical (`encounters`, `assessments`, `diagnoses`, `clinical_notes`); rehabilitation (`treatment_plans`, `exercises`, `prescriptions`, `outcomes`); scheduling (`appointments`, `availability`, `rooms`); finance (`invoices`, `invoice_items`, `payments`); hospital (`admissions`, `wards`, `beds`, `transfers`); operations (`inventory_items`, `stock_movements`); and platform (`audit_events`, `notifications`, `integration_events`).

## Security and international readiness

Plan for RBAC plus resource-level permissions, MFA for privileged users, encryption in transit and at rest, immutable clinical audit history, explicit consent and access history, backup/restore and disaster recovery, retention and export policies, and regional hosting/data residency.

Assess obligations per deployment. India deployments should assess the DPDP Act and applicable rules. International deployments should assess relevant regimes such as GDPR and HIPAA. These are separate compliance workstreams, not automatic certifications.

## Implementation sequence

| Sprint | Priority | Scope |
| --- | --- | --- |
| 1 — Foundation | P0 | Monorepo, Docker, CI/CD, PostgreSQL, Redis, NestJS, Next.js, environment configuration |
| 2 — SaaS core | P0 | Multi-tenancy, authentication, RBAC, organizations, subscriptions, branch management |
| 3 — Clinic management | P0 | Patients, practitioners, appointments, scheduling |
| 4 — Clinical management | P0 | EMR, assessments, SOAP notes, treatment plans, exercise prescriptions |
| 5 — Commercial operations | P1 | Billing, payments, notifications, reports |

Establish tenant isolation, identity, patient management, and the physiotherapy clinical workflow before prioritizing AI features or complex hospital IPD functionality.
