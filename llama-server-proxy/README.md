# Llama Server Proxy

Reverse proxy (nginx) that gives Docker containers access to the llama.cpp
server running on the host, while keeping them isolated from host networking.

## Services

| Container        | Image          | Purpose                                      |
|------------------|----------------|----------------------------------------------|
| llama-server-proxy | nginx        | Proxies the host llama-server into Docker networks |

## Ports

| Host binding | Container port | Notes                                      |
|--------------|----------------|--------------------------------------------|
| 8081 (PORT)  | 80             | Exposes the llama API on the host          |

## Environment Variables

| Variable    | Required | Default  | Description                          |
|-------------|----------|----------|--------------------------------------|
| IMAGE_TAG   | yes      | -        | nginx image tag (e.g. alpine)        |
| TZ_LOCATION | yes      | -        | Container timezone (e.g. America/Sao_Paulo) |
| PORT        | no       | 8081     | Host port published for the proxy     |

## Networks

- `llama_proxy_network` (internal bridge) — shared with hermes-agent so it can
  reach the llama API without host access; declared `external: true` there.
- `cloudflared_network` (external) — reachable via the Cloudflare tunnel.

## Volumes

| Host path | Container path              | Purpose            |
|-----------|-----------------------------|--------------------|
| nginx.conf | /etc/nginx/conf.d/default.conf | Proxy to host llama-server (host.docker.internal:8080) |