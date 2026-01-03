#!/usr/bin/env bash

set -x

curl -v \
  -X GET \
  -u demo:demopass \
  -H "Content-Type: application/json" \
  http://localhost:9091/engine-rest/task?includeProcessVariables=true
