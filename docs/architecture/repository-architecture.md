# Repository and system architecture

## Architectural direction

PhysioNG is API-first, domain-driven, and tenant-aware. Begin with a modular monolith; extract microservices only when scale, reliability, or team ownership gives a concrete reason to split them.

## Technology ownership

| Component | Technology | Responsibility |
| --- | --- | --- |
| Public web and initial portals | Next.js | Marketing, SaaS acquisition, and role-based product experiences |
| Core API | NestJS | Business logic and domain APIs |
| Intelligence | Python/FastAPI | AI and analytical services |
| Workers | Celery | Asynchronous processing |
| Database | PostgreSQL | Transactional system of record |
| Cache/broker | Redis | Cache and Celery broker |
| CMS | WordPress | Content and SEO |
| File storage | S3-compatible | Reports and clinical attachments |
| Observability | OpenTelemetry | Logs, metrics, and traces |

## Monorepo map

```text
apps/
  web/                    # Initial Next.js app with role-based layouts
  clinic-portal/          # Future extraction boundary
  hospital-portal/        # Future extraction boundary
  patient-portal/         # Future extraction boundary/PWA
  admin-portal/           # Future extraction boundary
services/
  api/                    # NestJS modular monolith
  intelligence/           # Python FastAPI services
  workers/                # Python Celery workers
  integrations/           # External integration adapters
cms/wordpress/            # WordPress configuration and custom plugins
packages/
  ui/ contracts/ auth/ config/ i18n/
database/
  migrations/ seeds/ schemas/ policies/
infrastructure/
  docker/ kubernetes/ terraform/ monitoring/ environments/
docs/
  product/ architecture/ engineering/ api/ database/ security/ operations/
tests/
  integration/ e2e/ performance/ security/
scripts/
.github/workflows/
docker-compose.yml
pnpm-workspace.yaml
turbo.json
pyproject.toml
.env.example
```

Separate portals and deployment targets are future boundaries, not a requirement to build each app in Sprint 1.

## NestJS domain modules

Organize `services/api/src/modules/` by business domain. Each domain owns its entities, services, controllers, validation, permissions, and tests.

```text
identity/ tenants/ organizations/ users/ roles-permissions/
subscriptions/ branches/ departments/ practitioners/ patients/
appointments/ scheduling/ clinical-records/ assessments/ diagnoses/
treatment-plans/ exercises/ outcome-measures/ billing/ payments/
insurance/ inventory/ notifications/ reports/ audit/ integrations/
```

Shared API code belongs in `common/`, database access in `database/`, runtime configuration in `config/`, and application composition in `main.ts` and `app.module.ts`.

## Root-level platform files

The target monorepo includes `docker-compose.yml`, `pnpm-workspace.yaml`, `turbo.json`, `pyproject.toml`, `.env.example`, `.gitignore`, `CONTRIBUTING.md`, `LICENSE`, and `README.md`. Add executable configurations with Sprint 1 services rather than shipping misleading placeholders.
