# PhysioNG Repository Structure

```text
physiong.com/
├── apps/
│   ├── web/                    # Initial Next.js app with role-based layouts
│   ├── clinic-portal/          # Future extraction boundary
│   ├── hospital-portal/        # Future extraction boundary
│   ├── patient-portal/         # Future extraction boundary/PWA
│   └── admin-portal/           # Future extraction boundary
├── services/
│   ├── api/                    # NestJS modular monolith
│   │   └── src/
│   │       ├── modules/        # Business domains (patients, scheduling, billing...)
│   │       ├── common/
│   │       ├── database/
│   │       └── config/
│   ├── intelligence/           # Python/FastAPI services
│   ├── workers/                 # Celery workers
│   └── integrations/            # External system adapters
├── cms/
│   └── wordpress/               # WordPress configuration and custom plugins
├── packages/
│   ├── ui/                      # Shared design system
│   ├── contracts/               # API schemas and shared types
│   ├── auth/                    # Frontend authentication helpers
│   ├── config/                  # Shared configuration
│   └── i18n/                    # Translation resources
├── assets/
│   ├── logos/                   # Product and brand logos
│   ├── images/                  # Product imagery and illustrations
│   ├── banners/                 # Marketing and in-app banners
│   └── icons/                   # Custom icons and small graphics
├── database/
│   ├── migrations/
│   ├── seeds/
│   ├── schemas/
│   └── policies/                # PostgreSQL RLS policies
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   ├── terraform/
│   ├── monitoring/
│   └── environments/
├── docs/
│   ├── product/
│   ├── architecture/
│   ├── engineering/
│   ├── api/
│   ├── database/
│   ├── security/
│   └── operations/
├── tests/
│   ├── integration/
│   ├── e2e/
│   ├── performance/
│   └── security/
├── scripts/
├── .github/workflows/
├── docker-compose.yml
├── pnpm-workspace.yaml
├── turbo.json
├── pyproject.toml
├── .env.example
├── CONTRIBUTING.md
├── LICENSE
├── PROJECT_PLAN.md
├── README.md
└── REPOSITORY_STRUCTURE.md
```

The current checkout tracks the planned directories with `.gitkeep` files. Runtime configs and applications will be added as their implementation lands. The first release should use `apps/web` with role-based experiences and `services/api` as a modular monolith; the other portal folders are future extraction boundaries.

See [assets/README.md](assets/README.md) for asset naming, format, and provenance guidance.

For domain responsibilities and technology ownership, see the [architecture guide](docs/architecture/repository-architecture.md).
