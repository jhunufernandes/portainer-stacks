---
name: docker-compose-builder
description: Standard for authoring or editing docker-compose.yaml files in this repository. Use when creating a new compose file, or when reading, writing, or reorganizing any docker-compose.yaml / docker-compose.yml. Enforce the canonical service key order, ENV parametrization for image tags, volumes, ports, and TZ, per-service bridge networks with optional external cloudflared_network, and matching .env / .env.example files.
---

# Docker Compose Builder

This is the canonical directive for every `docker-compose.yaml` in this repository.
Any time you read, write, create, or edit a compose file, follow this standard.

## Canonical top-level key order

Only include a section if it is actually used.

1. `services`
2. `networks`
3. `volumes`  (only if named volumes are declared)

## Canonical service-level key order

Every service must list its keys in exactly this order:

```yaml
services:
  <service>:
    container_name: <name>
    image: <image>:${IMAGE_TAG:?IMAGE_TAG is required}
    restart: unless-stopped
    command:
      - <arg>
    environment:
      - TZ=${TZ_LOCATION:?TZ_LOCATION is required}
    volumes:
      - <mapping>
    ports:
      - ${PORT:-<default>}:<container_port>
    networks:
      - <service>_network
    depends_on:
      - <service>
    security_opt:
      - no-new-privileges:true
    healthcheck:
      test: <command>
      interval: 60s
      timeout: 10s
      retries: 3
      start_period: 40s
    init: true
    user: <uid>:<gid>
    shm_size: 128mb
```

Insert only the keys the service actually needs, in this relative order.
`container_name` always comes before `image`. Any list-form key (`command`,
`environment`, `volumes`, `ports`, `networks`) uses flow style with leading
`- ` and two-space indentation under the key. Scalars map to inline forms only
where shown (e.g. `image`, `restart`, `init`, `shm_size`, `security_opt`).

## ENV parametrization rules

Variables are prefixed with the service name only when needed to disambiguate.
Single-service stacks use bare names (`IMAGE_TAG`, `DATA_LOCATION`, `TZ_LOCATION`,
`PORT`). Multi-component stacks (e.g. immich) keep a component prefix to avoid
collisions within the same env file:
`immich_redis -> REDIS_IMAGE_TAG`, `immich_postgres -> POSTGRES_IMAGE_TAG`.

| Usage | Pattern |
|-------|---------|
| Image tag (required) | `image: x/y:${IMAGE_TAG:?IMAGE_TAG is required}` |
| Volume/data (required) | `${DATA_LOCATION:?DATA_LOCATION is required}/...:` |
| TZ env (required) | `TZ=${TZ_LOCATION:?TZ_LOCATION is required}` |
| Port publish | `${PORT:-<default>}:<container_port>` |

- Required pattern: `${VAR:?VAR is required}`
- Optional-with-default: `${VAR:-<default>}` (used for ports)
- Ports must be parametrized, never hardcoded.
- Prefer `DATA_LOCATION` for data directories; `UPLOAD_LOCATION` is used when
  the existing convention already names it so (e.g. portainer, immich).

## Networks pattern

- Every service declares its own bridge network at top level:
  ```yaml
  networks:
    <service>_network:
      driver: bridge
  ```
  and the service lists it under `networks:`.
- If the service is exposed/tunneled through Cloudflare, also list the
  external `cloudflared_network` and declare it:
  ```yaml
  networks:
    <service>_network:
      driver: bridge
    cloudflared_network:
      external: true
  ```
- Networks are lowercase, `<service>_network` suffix, and never parametrized.

## .env / .env.example files

Each service directory ships both files:
- `.env.example` — every env var with an empty value (no defaults, no secrets).
- `.env` — the same keys with real values (git-ignored).

The keys must exactly match every variable referenced by the
compose file (image tags, data locations, ports, TZ, plus any service-specific
vars). When a compose file references a new variable, add it to both files.
`.gitignore` already excludes `.env`.

## Workflow when reading/writing a compose file

1. Read the existing `docker-compose.yaml` and its `.env` / `.env.example`.
2. Normalize every service to the canonical key order above.
3. Replace any hardcoded image tag, data path, TZ, and port with the
   parametrized form (bare name, or component-prefixed in multi-service stacks).
4. Add the param to `.env` and `.env.example` if it is referenced and missing.
5. Keep `.env` values real; keep `.env.example` values empty.
6. Preserve `external: true` for shared networks and keep bridge networks
   lowercase with `_network` suffix.
7. Do not add comments to the compose file.
