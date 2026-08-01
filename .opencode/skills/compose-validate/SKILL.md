---
name: compose-validate
description: Validate every docker-compose.yaml in this repository before and after changes. Use when creating or editing any compose file, or when asked to check, lint, dry-run, verify, or validate the stacks. Runs YAML syntax checks, docker compose config resolution, and cross-file network reference validation.
---

# Compose Validate

Safety gate for all stacks in the repository. Run before committing, and after
any compose file change, to catch YAML syntax errors, unresolved env vars, and
broken network references before they reach production.

## Checks performed

1. **YAML syntax** — each compose file must parse as valid YAML.
2. **Compose resolution** — `docker compose config` must fully resolve (catches
   bad `service`/`network`/`volume` references and required-env errors).
3. **Env sync** — every referenced var exists in both `.env` and
   `.env.example` (delegate to the `env-sync` skill for the fix).
4. **Network references** — each network listed under a service's `networks:`
   must be declared at top-level (internal bridge) or defined as `external: true`.

## Procedure

Run the YAML syntax check for every stack first:

```bash
cd <repo-root>
for f in */*/docker-compose.yaml */*/docker-compose.yml; do
  [ -f "$f" ] || continue
  ruby -ryaml -e "YAML.load_file('$f'); puts 'OK: $f'" || echo "SYNTAX ERROR: $f"
done
```

Then attempt compose resolution if the `docker compose` plugin is available:

```bash
cd <stack-dir>
docker compose config   # resolves env + references; nonzero on invalid
```

Fall back to Ruby YAML if the compose plugin is not installed (note: this only
checks syntax, not cross-file references).

## Cross-file network reference check

For each service network listed in a compose file, verify it is either declared
at top-level `networks:` in the same file (bridge) or marked `external: true`.

```bash
cd <stack-dir>
grep -nE '^\s+-?\s*[a-z0-9_]+_network' docker-compose.yaml
```

If the external network (e.g. `cloudflared_network`, `portainer_network`) is
referenced but not declared `external: true` in this file, flag it.

## When to run

- After creating or editing any compose file.
- Before committing a stack change.
- After any change to `.env` files.
- As a verification step delegated from the `docker-compose-builder` skill.
