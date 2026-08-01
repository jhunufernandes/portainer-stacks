# Portainer

Docker management UI for managing containers, stacks, and Docker environments.

## Services

| Container | Image | Purpose |
|-----------|-------|---------|
| portainer | portainer/portainer-ce | Container/stack management web UI |

## Ports

| Host binding | Container port | Notes |
|--------------|----------------|-------|
| 127.0.0.1:${PORT:-9443} | 9443 | Local-only web UI (bound to localhost) |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| IMAGE_TAG | yes | - | Container image tag |
| UPLOAD_LOCATION | yes | - | Persistent data dir mounted at /data |
| PORT | no | 9443 | Localhost host port for the web UI |

## Networks

- `portainer_network` (internal bridge)

## Volumes

| Host path env | Container path | Purpose |
|---------------|----------------|---------|
| (Docker socket) | /var/run/docker.sock | Docker daemon access |
| UPLOAD_LOCATION | /data | Portainer database and config |
