#!/bin/bash

for dir in */; do
  env_file="${dir}.env"
  if [ -f "$env_file" ]; then
    cat "$env_file"
  fi
done
