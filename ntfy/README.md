# ntfy

Self-hosted pub-sub notification server that lets you push messages to phones and desktops.

## Services

| Container | Image | Purpose |
|-----------|-------|---------|
| ntfy | binwiederhier/ntfy | Push notification server (tunnel-only) |

## Ports

No host ports published. Reachable only via Cloudflare tunnel (`cloudflared_network`).

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| IMAGE_TAG | yes | - | Container image tag |
| DATA_LOCATION | yes | - | Parent dir housing cache/ and config/ |
| TZ_LOCATION | yes | - | Container timezone |

## Networks

- `cloudflared_network` (external — reachable via Cloudflare tunnel)

## Volumes

| Host path env | Container path | Purpose |
|---------------|----------------|---------|
| DATA_LOCATION | /var/cache/ntfy | Message cache |
| DATA_LOCATION | /etc/ntfy | Config (server.yml) |
