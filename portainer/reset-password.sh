#!/usr/bin/env bash
set -euo pipefail
docker compose stop
docker run --rm -v /Volumes/512GB/portainer:/data portainer/helper-reset-password
docker compose up -d