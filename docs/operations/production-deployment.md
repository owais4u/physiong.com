# PhysioNG deployment guide

This repository has one web application today. Clinic, hospital, patient, and platform-admin portals are role-oriented previews inside that application. Docker/Kubernetes and Vercel are alternative hosting targets for the same web build; the Kubernetes manifests are not attached to the live domain while Vercel serves it.

## Current release boundary

The current app is a public marketing site and an interactive demonstration. New clinic data is stored in each visitor's browser `localStorage`; the app has no authentication, backend API, PostgreSQL, tenant isolation, real booking delivery, or protected clinical records. Do not use real patient details or treat this version as a production clinical system. A public web release can expose the demo and sample values only.

## Environment configuration

Copy `.env.example` to `.env` for local Docker use. Keep secrets out of `NEXT_PUBLIC_*` variables; those are embedded in client-side JavaScript.

- `NEXT_PUBLIC_SITE_URL`: canonical public URL. Use `https://physiong.com` for hosted builds.
- `PHYSIONG_PORT`: local host port, default `3000`.

The Next.js application adds basic response headers and exposes `/api/health` for container and cluster probes.

## Local container

```sh
cp .env.example .env
docker compose up --build -d
docker compose ps
docker compose logs -f web
docker compose down
```

Open `http://localhost:3000`. To use another host port, set `PHYSIONG_PORT=3001` in `.env`.

## Browser end-to-end tests

```sh
pnpm install --frozen-lockfile
pnpm --filter @physiong/web exec playwright install chromium
pnpm test:e2e
```

`pnpm test:all` runs lint, typecheck, unit tests, production build, Playwright journeys, and the HTTP/image smoke checks. The CI workflow also verifies the Docker image and renders the production Kustomize overlay.

## Vercel production web release

The Vercel project should be linked to `owais4u/physiong.com`, use `apps/web` as its Root Directory, and track `main`. Vercel detects Next.js and pnpm from the workspace. Set `NEXT_PUBLIC_SITE_URL=https://physiong.com` for Production and Preview separately if preview metadata should use a preview URL.

After the project is linked, verify which project currently owns `physiong.com` before assigning the apex domain. Set `physiong.com` as the canonical domain and redirect `www.physiong.com` to it. Apply only the DNS records Vercel returns for this project; preserve existing mail and verification records. Check domain verification, HTTPS certificate, and the `/api/health` and portal routes after deployment.

The app's production deployment must pass CI. Do not connect a Vercel project to a production domain until account authorization, domain ownership, existing DNS records, and current domain assignment have been checked.

## Kubernetes production alternative

The manifests are under `infrastructure/kubernetes/`. They expect an existing Kubernetes cluster with an NGINX Ingress controller, cert-manager `letsencrypt-prod` ClusterIssuer, metrics-server for autoscaling, and cluster DNS pointed to the ingress load balancer. These cluster components and DNS records are not created by this repository.

Build and publish an immutable image tag to GHCR (replace `<git-sha>` with the source revision):

```sh
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://physiong.com \
  -t ghcr.io/owais4u/physiong.com:<git-sha> .
docker push ghcr.io/owais4u/physiong.com:<git-sha>
```

Set the image tag and review the rendered resources before applying:

```sh
cd infrastructure/kubernetes/overlays/production
kustomize edit set image ghcr.io/owais4u/physiong.com=ghcr.io/owais4u/physiong.com:<git-sha>
kustomize build .
kubectl apply -k .
kubectl -n physiong rollout status deployment/physiong-web
kubectl -n physiong get ingress,hpa,pdb
```

For a private GHCR package, create an `imagePullSecret` in namespace `physiong` and add it to the pod spec before applying. Keep registry credentials and cluster access outside Git. Point apex and `www` DNS at the cluster ingress only if Kubernetes is selected as the active host instead of Vercel.

## Production platform prerequisites

Before using the portals for real clinical work, implement server-side identity and authorization, tenant-scoped APIs, PostgreSQL with verified tenant isolation, consent and audit records, secure file storage, backup/restore, monitoring, data-retention workflows, and jurisdiction-specific privacy/security review. Add separate acceptance checks for these services before enabling real-data workflows.
