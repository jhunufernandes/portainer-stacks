# Audiobookshelf

Self-hosted audiobook and podcast streaming server.

## Services

| Container | Image | Purpose |
|-----------|-------|---------|
| audiobookshelf | ghcr.io/advplyr/audiobookshelf | Audiobook/podcast library, streaming and metadata |

## Ports

| Host binding | Container port | Notes |
|--------------|----------------|-------|
| ${PORT:-13378} | 80 | Direct access (default 13378). Also reachable via Cloudflare tunnel. |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| IMAGE_TAG | yes | - | Container image tag |
| DATA_LOCATION | yes | - | Parent dir housing config/, metadata/, audiobooks/, podcasts/ |
| TZ_LOCATION | yes | - | Container timezone |
| PORT | no | 13378 | Host port bound to container port 80 |

## Networks

- `audiobookshelf_network` (internal bridge)
- `cloudflared_network` (external — reachable via Cloudflare tunnel)

## Volumes

| Host path env | Container path | Purpose |
|---------------|----------------|---------|
| DATA_LOCATION | /config | Audiobookshelf config |
| DATA_LOCATION | /metadata | Book/metadata cache |
| DATA_LOCATION | /audiobooks | Audiobook files |
| DATA_LOCATION | /podcasts | Podcast files |
