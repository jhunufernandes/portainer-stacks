---
name: service-readme
description: Generate or update a compact README.md for a service stack directory in this repository derived from its docker-compose.yaml. Use when adding documentation for a service, when asked to document a stack, or when a service directory lacks a README. Summarizes services, ports, env vars, networks, and volumes.
---

# Service Readme

Produces a concise, consistent `README.md` for a service directory, generated
from the source of truth: the service's `docker-compose.yaml` (and its
`.env` / `.env.example`). Useful for discoverability and onboarding.

## Procedure

1. Read the stack's `docker-compose.yaml`.
2. Read its `.env` and `.env.example` to learn variable names and defaults.
3. Generate `README.md` in the stack directory with this structure:

```markdown
# <Service>

<one-line description of what the service provides>

## Services

| Container | Image | Purpose |
|-----------|-------|---------|
| <name>    | <image> | <role> |

## Ports

| Host binding | Container port | Notes |
|--------------|----------------|-------|
| <host:port>  | <port>         | <tunnel-only / direct> |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| VAR | yes/no | <value or -> | <what it configures> |

## Networks

- `<service>_network` (internal bridge)
- `cloudflared_network` (external — reachable via Cloudflare tunnel)

## Volumes

| Host path env | Container path | Purpose |
|---------------|----------------|---------|
| VAR           | /path          | <purpose> |
```

## Content rules

- Derive everything from the compose file; do not invent values.
- Mark an env var **Required** when it uses `${VAR:?VAR is required}`; otherwise
  show the `:-default`.
- Ports bound to `127.0.0.1` are local-only; a service with **no** `ports:`
  section is tunnel-only (reachable only via `cloudflared_network`).
- List networks exactly as declared, and note `external: true` networks.
- Keep it concise; do not add emojis unless the user asks.

## When to run

- When a service directory has no `README.md`.
- When asked to document a stack or explain ports/env/networks.
- When significant compose changes (new ports, volumes, env vars) make an
  existing README stale.
