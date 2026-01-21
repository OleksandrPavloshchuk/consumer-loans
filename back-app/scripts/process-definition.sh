#!/usr/bin/env bash

set -x

curl -v \
  -X GET \
  -u john:johnpass \
  -H "Content-Type: application/json" \
  https://localhost:9091/engine-rest/process-definition?latestVersion=true

