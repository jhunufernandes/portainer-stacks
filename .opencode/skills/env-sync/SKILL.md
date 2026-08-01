---
name: env-sync
description: Keep .env and .env.example in sync with the env vars referenced by a docker-compose.yaml in this repository. Use when creating or editing .env / .env.example files, or when verifying that every ${VAR} referenced in a compose file exists in both env files. Detects missing, extra, or mismatched variables across the two files.
---

# Env Sync

Ensures that every environment variable referenced by a service's
`docker-compose.yaml` is present, correctly named, and consistent across the
service's `.env` and `.env.example` files.

## Rules

- `.env.example` — every variable with an **empty** value (no defaults, no secrets).
- `.env` — the same keys with **real** values (git-ignored; never commit secrets).
- Every variable referenced in the compose file must appear in BOTH files.
- No variable that is not referenced by the compose file should be added.
- Keep the key names identical across `.env` and `.env.example`.
- Single-service stacks use bare names (`IMAGE_TAG`, `DATA_LOCATION`, `PORT`,
  `TZ_LOCATION`); multi-component stacks (e.g. immich) use component prefixes
  (`REDIS_IMAGE_TAG`, `POSTGRES_IMAGE_TAG`).

## Procedure

1. Read the service's `docker-compose.yaml`.
2. Extract all referenced env vars:
   - `${VAR:?...}` (required / optional-with-default forms).
   ```bash
   grep -oE '\$\{[A-Z_]+' docker-compose.yaml | sed 's/\${//' | sort -u
   ```
3. Read the existing `.env` and `.env.example`.
4. Diff the compose references against both files (keys only).
5. Fix discrepancies:
   - Missing in `.env.example`: append `VAR=` (empty).
   - Missing in `.env`: append `VAR=<value>` (`<value>` is a best-effort
     sensible default matching the compose `:-default`, or ask the user for real
     values).
   - Extra keys present in env files but not referenced in compose: flag them to
     the user and remove if confirmed.
6. Re-verify with the extraction command until there are no differences.

## Reference extraction helper

```bash
cd <service-dir>
refs=$(grep -oE '\$\{[A-Z_]+' docker-compose.yaml | sed 's/\${//' | sort -u)
for v in $refs; do
  grep -q "^$v=" .env        || echo "missing in .env:        $v"
  grep -q "^$v=" .env.example || echo "missing in .env.example: $v"
done
```

## When to run

- After any edit to a compose file that adds/removes a variable.
- After creating a new service directory.
- As a verification step delegated from the `docker-compose-builder` skill.
