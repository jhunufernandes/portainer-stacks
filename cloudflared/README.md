# Cloudflared

Cloudflare Tunnel client that routes traffic into your Docker network without exposing ports.

## Services

| Container | Image | Purpose |
|-----------|-------|---------|
| cloudflared | cloudflare/cloudflared | Runs a Cloudflare Tunnel via a tunnel token |

## Ports

No host ports published. Traffic is tunneled in to services on `cloudflared_network`.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| IMAGE_TAG | yes | - | Container image tag |
| TUNNEL_TOKEN | yes | - | Cloudflare tunnel token |

## Networks

- `cloudflared_network` (internal bridge)
- `portainer_network` (external — shares the Portainer network)

## Volumes

No volumes mounted.
