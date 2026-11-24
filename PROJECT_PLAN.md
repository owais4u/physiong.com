# PhysioNG Project Plan

**Plan version:** 1.0  
**Status:** Foundation planning  
**Product:** PhysioNG — the complete digital operating system for physiotherapy and rehabilitation

## 1. Objective

Build a secure, multi-tenant SaaS platform for independent physiotherapists, clinics, rehabilitation centres, and hospitals. Support India and international markets through configurable currencies, languages, taxation, date formats, workflows, and deployment requirements.

## 2. Product principles

- Ship a responsive PWA experience first.
- Build a modular monolith and extract services only when justified.
- Treat tenant isolation, privacy, consent, and auditability as foundational requirements.
- Start with clinic workflows and the core physiotherapy patient journey.
- Deliver one role-based Next.js application before splitting portals.
- Treat regulatory obligations as jurisdiction-specific workstreams; do not imply certification.

## 3. Phases and exit criteria

### Phase 1 — Platform foundation (P0)

**Scope:** Monorepo conventions, local development environment, Docker, CI, PostgreSQL, Redis, NestJS API, Next.js web app, environment configuration, and baseline documentation.

**Exit criteria:** A contributor can follow documented setup steps; web and API applications start locally; database and Redis services are available; CI checks the foundation; secrets are not committed.

### Phase 2 — SaaS core (P0)

**Scope:** Tenant and organization lifecycle, authentication, membership, RBAC, subscription plans, branch setup, and server-established tenant context.

**Exit criteria:** Tenant onboarding can be completed end-to-end; access is scoped to tenant membership; privileged actions are auditable; isolation controls are covered by automated tests.

### Phase 3 — Clinic management (P0)

**Scope:** Patient registration, consent, practitioners, appointments, availability, rooms, and scheduling.

**Exit criteria:** Clinic staff can register and find patients, manage practitioner schedules, and book, reschedule, and cancel appointments within their tenant.

### Phase 4 — Clinical management (P0)

**Scope:** Encounters, assessments, diagnoses, clinical notes, treatment plans, exercise prescriptions, and outcome measures.

**Exit criteria:** A physiotherapy session can be documented end-to-end with appropriate access controls, audit history, and patient consent handling.

### Phase 5 — Commercial operations (P1)

**Scope:** Services/packages, invoices, payments, receipts, notifications, and operational reports.

**Exit criteria:** A clinic can record the revenue lifecycle and reconcile patient-facing receipts with tenant-scoped financial records.

### Later product tracks

- Patient self-service portal and adherence/recovery experience.
- Hospital OPD/IPD, admissions, wards, beds, and transfers.
- Country-specific integrations and regulatory configurations.
- Intelligence features for documentation assistance and analytics, with appropriate clinical review and data controls.
- Separate application deployments when product scale and team ownership justify them.

## 4. Cross-cutting work

- **Security:** RBAC and resource permissions, MFA for privileged users, encryption, secret management, audit history, secure file access, backups, restore, and incident response.
- **Tenant isolation:** PostgreSQL RLS, server-derived tenant context, tenant-aware references and indexes, storage policies, and cross-tenant tests.
- **Internationalization:** Translation resources, locale-aware dates and numbers, currencies, taxation, and configurable workflows.
- **Operations:** CI/CD, environment separation, observability with OpenTelemetry, backup/restore procedures, and data retention/export.
- **Quality:** Unit, integration, end-to-end, performance, and security checks added with the corresponding product workflows.

## 5. Initial scope boundaries

The first release focuses on tenant isolation, identity, patient management, scheduling, and the physiotherapy clinical workflow. AI features, complex hospital IPD operations, and a fleet of separate portals are later tracks. These boundaries keep the first deliverable cohesive while preserving the intended product direction.

## 6. Delivery management

Work is organized by the phases above. Each phase should have implementation issues with an owner, dependencies, observable acceptance criteria, and a reviewable pull request. Do not mark a phase complete until its exit criteria and applicable security checks are met.

## 7. Related documents

- [Product implementation blueprint](docs/product/implementation-blueprint.md)
- [Repository and system architecture](docs/architecture/repository-architecture.md)
- [Repository structure](REPOSITORY_STRUCTURE.md)
- [Repository map](docs/engineering/repository-map.md)
