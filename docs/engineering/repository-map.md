# Repository map

This repository is being established as a monorepo. Read the [product blueprint](../product/implementation-blueprint.md) and [architecture guide](../architecture/repository-architecture.md) for the product decisions and target structure.

The first runnable release should use `apps/web` for public pages and role-based clinic, hospital, patient, and administrator experiences, plus `services/api` as a NestJS modular monolith. Add independent portals and Python services when their workflows are ready to operate separately.

## Planned areas

- `apps/` — user-facing Next.js applications.
- `services/` — API, intelligence, background workers, and integrations.
- `cms/` — WordPress configuration and extensions.
- `packages/` — shared UI, contracts, auth, configuration, and translations.
- `assets/` — shared product logos, images, banners, and icons; see [asset guidance](../../assets/README.md).
- `database/` — migrations, seeds, schemas, and PostgreSQL policies.
- `infrastructure/` — local containers, deployment, monitoring, and environments.
- `docs/` — product, architecture, engineering, API, data, security, and operations.
- `tests/` — integration, end-to-end, performance, and security checks.
- `scripts/` — repeatable development and maintenance tasks.

Directories are tracked with `.gitkeep` until implementation files are added.
