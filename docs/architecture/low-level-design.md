# PhysioNG Low-Level Design (LLD)

**Version:** 1.0  
**Status:** Initial MVP implementation proposal  
**Audience:** Application, database, and quality engineering

This document details proposed MVP modules, API behavior, persistence rules, and critical transactions. It complements the [High-Level Design](high-level-design.md). Names and payloads are a starting contract and should be confirmed during implementation before they become a public API.

## 1. Repository and application layout

```text
apps/web/                         # Next.js app; role-based layouts
services/api/src/
  modules/
    identity/                     # users, sessions, memberships, roles
    tenants/                      # tenant lifecycle and tenant context
    organizations/                # organizations, branches, settings
    practitioners/                # practitioner profile and assignments
    patients/                     # patient, contacts, consent, history
    scheduling/                   # availability and conflict checking
    appointments/                 # appointment lifecycle
    clinical-records/             # encounter, note, assessment, treatment
    exercises/                    # catalogue and prescriptions
    audit/                         # audit event creation and access history
  common/                          # errors, guards, pipes, request context
  database/                        # connection, transaction helpers
  config/                          # validated runtime configuration
```

Each module should expose a small application-facing service/interface, own its validation and persistence rules, and avoid direct repository access from unrelated modules. Controllers translate HTTP requests; application services coordinate use cases; repositories perform scoped persistence; domain objects enforce invariants where useful.

## 2. Request context and authorization

For each authenticated request, establish an immutable context:

```text
RequestContext {
  requestId: string
  actorUserId: UUID
  tenantId: UUID
  membershipId: UUID
  roles: string[]
  permissions: string[]
  branchIds: UUID[]
  locale: string
  timeZone: string
}
```

The API resolves `tenantId` by validating the requested tenant against active server-side membership data. Do not accept role, permission, membership, or branch authority from client JSON or unverified token claims. Guards check authentication and broad permission; use cases also check resource ownership and branch scope.

### Database transaction context

Every request path that reads or writes tenant-owned data runs within a transaction. At transaction start, set the authenticated context using transaction-local settings, for example `SET LOCAL app.tenant_id = ...` and `SET LOCAL app.actor_user_id = ...`. RLS policies read those settings. Never use connection-level `SET` with pooled connections. If the transaction is absent, tenant policies should fail closed.

Workers establish context from a signed/validated job envelope and re-check that the tenant and target record still exist. Administrative cross-tenant tasks use a separate audited path and least-privilege credentials; ordinary application code cannot bypass RLS.

## 3. Data model (logical)

Use UUID primary keys and UTC timestamps (`timestamptz`). Tenant-owned tables include `tenant_id NOT NULL`. Add `created_at`, `created_by`, `updated_at`, and `updated_by` where appropriate. Avoid duplicating clinical facts across tables.

| Entity | Important fields and rules |
| --- | --- |
| `tenants` | `id`, `name`, `status`, `default_locale`, `default_time_zone`, `default_currency`; tenant-level config |
| `organizations` | `id`, `tenant_id`, `name`, `status`; unique identity within tenant |
| `branches` | `id`, `tenant_id`, `organization_id`, `name`, `time_zone`, `address`, `status`; tenant-aware FK to organization |
| `users` | `id`, identity-provider subject, normalized email, status; global identity, no clinical data |
| `memberships` | `id`, `tenant_id`, `user_id`, `status`, `joined_at`; unique active user membership policy per tenant |
| `roles` / `permissions` | tenant/system role definitions and explicit permission mappings |
| `membership_roles` | membership-to-role mapping with tenant-aware FKs |
| `practitioners` | `id`, `tenant_id`, `user_id` (optional), display name, credentials, status |
| `branch_practitioners` | `tenant_id`, `branch_id`, `practitioner_id`, assignment state |
| `patients` | `id`, `tenant_id`, `patient_number`, name, birth date (optional), contact, status; minimal required PII |
| `patient_consents` | `id`, `tenant_id`, `patient_id`, consent type, state, source, captured by/at, withdrawn at |
| `medical_histories` | `id`, `tenant_id`, `patient_id`, relevant history fields, author and timestamps |
| `practitioner_availability` | `id`, `tenant_id`, `branch_id`, `practitioner_id`, local recurrence rule/validity |
| `appointments` | `id`, `tenant_id`, `branch_id`, `patient_id`, `practitioner_id`, start/end, status, reason |
| `encounters` | `id`, `tenant_id`, `patient_id`, optional `appointment_id`, branch, practitioner, status, occurred-at |
| `assessments` | `id`, `tenant_id`, `encounter_id`, structured fields/assessment template version, author/time |
| `diagnoses` | `id`, `tenant_id`, `encounter_id`, code/system (optional), description, primary flag |
| `clinical_notes` | `id`, `tenant_id`, `encounter_id`, note type, content, status, author/time, amendment link |
| `treatment_plans` | `id`, `tenant_id`, `patient_id`, goals, status, author/time, effective dates |
| `exercise_prescriptions` | `id`, `tenant_id`, `treatment_plan_id`, exercise reference, dosage/instructions |
| `audit_events` | `id`, `tenant_id`, actor, action, resource type/id, occurred-at, request id, safe metadata |

Define tenant-aware uniqueness and foreign keys (for example `(tenant_id, id)` as a referenced key) so a record in one tenant cannot reference another tenant's row even if application validation fails. Index common lookup paths with `tenant_id` first, such as `(tenant_id, patient_number)`, `(tenant_id, patient_id, created_at)`, and `(tenant_id, practitioner_id, start_at)`.

### Clinical history and amendments

Clinical notes have a controlled lifecycle such as `draft → signed → amended`. A signed note is not silently overwritten or hard-deleted. An amendment creates a new attributable record linked to the original and explains the correction. Define which fields are mutable while draft and require actor/time attribution for every change.

## 4. API conventions

- Base path: `/api/v1`.
- JSON request/response bodies; ISO 8601 timestamps with offset on input and UTC on storage/output.
- Tenant selected through authenticated membership and a request-scoped tenant selector (header or route); API verifies it on each request.
- Stable error shape: `{ "error": { "code": "...", "message": "...", "requestId": "...", "details": [] } }`.
- Paginated collections use cursor pagination for changing datasets; enforce page-size limits.
- Validate DTOs at the boundary; do not expose database entities directly.
- Mutating endpoints accept an idempotency key where retries could create duplicate bookings or records.
- Use optimistic concurrency (`version` or `updatedAt` precondition) for edits that can conflict.

### Initial endpoint proposal

| Method and path | Use case | Permission (illustrative) |
| --- | --- | --- |
| `POST /api/v1/tenants` | Create tenant and initial organization | `platform.tenants.create` |
| `POST /api/v1/tenants/{tenantId}/invitations` | Invite organization user | `memberships.invite` |
| `GET /api/v1/me/tenants` | List active memberships | Authenticated user |
| `POST /api/v1/branches` | Create a branch | `branches.manage` |
| `GET /api/v1/patients` | Search/list patients | `patients.read` |
| `POST /api/v1/patients` | Register patient and consent record | `patients.create` |
| `GET /api/v1/patients/{patientId}` | Read authorized patient profile | `patients.read` + resource check |
| `POST /api/v1/practitioners` | Create practitioner profile | `practitioners.manage` |
| `PUT /api/v1/practitioners/{id}/availability` | Set availability | `scheduling.manage` |
| `GET /api/v1/appointments` | Search schedule | `appointments.read` |
| `POST /api/v1/appointments` | Book appointment | `appointments.create` |
| `PATCH /api/v1/appointments/{id}` | Reschedule/update state | `appointments.update` |
| `POST /api/v1/appointments/{id}/check-in` | Check in patient | `appointments.check_in` |
| `POST /api/v1/encounters` | Start encounter | `clinical.encounters.create` |
| `POST /api/v1/encounters/{id}/assessments` | Record assessment | `clinical.records.write` |
| `POST /api/v1/encounters/{id}/notes` | Create/sign note | `clinical.notes.write` |
| `POST /api/v1/treatment-plans` | Create treatment plan | `clinical.plans.write` |
| `POST /api/v1/treatment-plans/{id}/prescriptions` | Prescribe exercise | `clinical.prescriptions.write` |

Endpoint names, role grants, and the tenant selector remain to be finalized alongside the identity provider and UI flows.

## 5. Critical use cases and transaction boundaries

### Tenant onboarding

1. Validate platform-admin authority or approved self-serve onboarding rules.
2. In one transaction, create tenant, organization, initial branch, initial membership, and administrator role assignment.
3. Persist invitation/outbox event for email delivery; do not make external email delivery part of the database transaction.
4. Emit audit event and return a safe summary.
5. Retry invitation delivery idempotently.

### Patient registration

1. Authorize `patients.create` and resolve permitted branch.
2. Validate minimum required fields and normalize searchable contact fields.
3. In a transaction, allocate tenant-local patient number, create patient, create consent event when provided, and write audit event.
4. Return patient identifier and safe summary; do not return medical history outside permission scope.

### Appointment booking and conflict prevention

1. Validate patient, branch, practitioner assignment, permissions, and tenant scope.
2. Convert the requested local clinic time using the branch/practitioner timezone and persist unambiguous instants in UTC.
3. Validate duration, availability, and appointment status.
4. Insert in a transaction with a database-backed conflict guard. A possible implementation is a PostgreSQL exclusion constraint over practitioner and `tstzrange(start_at, end_at, '[)')` for active appointments (using an appropriate GiST operator class), paired with application validation for a friendly error. Confirm extension privileges and cancellation behavior before choosing this design.
5. If a conflict is detected, return `409 APPOINTMENT_CONFLICT`; never rely on a pre-check alone to prevent simultaneous bookings.
6. Emit an audit event and optional notification outbox entry.

### Encounter documentation

1. Confirm practitioner authorization and patient/appointment tenant ownership.
2. Create an encounter in `in_progress` state.
3. Save assessment, diagnosis, notes, treatment plan, and prescriptions as separate validated resources, linked to the encounter/patient.
4. On signing, re-check permission and required fields, set signed author/time, and make the note immutable except through amendment.
5. Record audit metadata in the same transaction where practical. Do not place full note text in generic audit metadata.

## 6. Row-level security and database practices

- Enable RLS on every tenant-owned table; use both `USING` and `WITH CHECK` rules for reads/updates/inserts.
- Use `FORCE ROW LEVEL SECURITY` where compatible with migration and support roles.
- Runtime role must not own protected tables or have `BYPASSRLS`.
- Policies fail closed if tenant context is absent or malformed.
- Apply context through `SET LOCAL` only inside an explicit transaction; test with a connection pool to catch context leakage.
- Do not expose unrestricted raw SQL to API modules; use scoped repositories and parameterized queries.
- Use dedicated migration/admin credentials and audit cross-tenant support access.
- Revoke by default, grant minimum table/function permissions, and review policy changes as security-sensitive migrations.

## 7. Audit, consent, and privacy implementation

Audit records capture actor, tenant, action, resource type/id, timestamp, request id, and minimal safe metadata. Record authentication failures and privileged membership/permission changes without secrets. Patient consent is represented as versioned events or a state plus immutable history; withdrawal must not erase the historical fact that consent was previously granted. Define export, correction, retention, and deletion behavior with jurisdiction-specific review before production launch.

## 8. Validation and error handling

| Condition | HTTP status | Example code |
| --- | --- | --- |
| Invalid input | 400 | `VALIDATION_ERROR` |
| Missing/invalid credentials | 401 | `UNAUTHENTICATED` |
| Authenticated but unauthorized | 403 | `FORBIDDEN` |
| Resource absent or concealed by tenant policy | 404 | `NOT_FOUND` |
| Duplicate/incompatible state | 409 | `APPOINTMENT_CONFLICT`, `INVALID_STATE` |
| Rate limit exceeded | 429 | `RATE_LIMITED` |
| Unexpected failure | 500 | `INTERNAL_ERROR` |

Do not reveal whether a resource exists in another tenant. Include request id in response and logs; redact passwords, tokens, and unnecessary clinical details from logs.

## 9. Background work and notifications

Use an outbox table for events that must be delivered after a successful commit (for example invitations). A worker claims pending outbox messages, processes them idempotently, and records attempts/backoff/dead-letter state. Each message includes tenant id, event id, and schema version. Delivery failure must not roll back a committed clinical or appointment transaction. Redis may broker jobs, but durable event state stays in PostgreSQL.

## 10. Testing design

- **Unit:** domain state transitions, permissions, validation, timezone conversion, clinical note lifecycle.
- **Integration:** migrations, constraints, repositories, RLS behavior with the actual non-owner runtime role.
- **Tenant isolation:** two-tenant fixtures; attempt direct ID access, joins, updates, deletes, search, exports, background jobs, and pooled-connection reuse.
- **Concurrency:** simultaneous booking attempts for overlapping practitioner slots; exactly one succeeds.
- **API:** authentication, authorization, pagination, error envelope, idempotency, optimistic concurrency.
- **End-to-end:** onboard tenant → invite staff → register patient → book appointment → complete encounter → schedule follow-up.
- **Security:** secret scanning, dependency review, authorization regression checks, and deployment configuration review.

## 11. Operational configuration and migrations

Validate required settings at startup. Use separate credentials for API runtime, worker, migrations, and audited support operations. Keep secrets in the deployment secret manager, never `.env` committed to source. Schema changes use versioned forward migrations; destructive changes follow expand/migrate/contract and require a restore-ready backup. Emit structured logs with request, actor, and tenant identifiers only where safe; monitor latency, error rate, database pool pressure, job retries, and authorization denials without logging sensitive payloads.

## 12. Open implementation decisions

- Identity provider and session/token strategy.
- Tenant selector transport and membership switching UX.
- Patient identifier format and duplicate matching rules.
- Branch/practitioner timezone precedence and daylight-saving behavior.
- Availability recurrence representation and slot duration policy.
- Assessment templates and diagnosis coding system for first pilots.
- Clinical note signing/amendment requirements for target jurisdictions.
- Database migration/ORM choices and operational RLS role bootstrap.
- Email provider, outbox delivery service, and notification consent rules.
- Production hosting region, backup retention, and recovery objectives.

