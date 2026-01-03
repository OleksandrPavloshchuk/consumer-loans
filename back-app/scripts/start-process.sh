#!/usr/bin/env bash

set -x

# Start new process with no data. Read the processId from output for further using.
# (Warning! Switch basic authentication on production off.)
curl -v \
  -X POST \
  -u demo:demopass \
  -H "Content-Type: application/json" \
  -d "{}" \
  https://localhost:9091/engine-rest/process-definition/key/consumer-loan/start
