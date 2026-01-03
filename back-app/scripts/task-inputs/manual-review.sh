#!/usr/bin/env bash

set -x

TASK_ID=e170ced4-e694-11f0-8413-eeeeeeeeeeee

curl -v \
  -X POST \
  -u demo:demopass \
  -H "Content-Type: application/json" \
  -d '{
    "variables": {
      "DECISION":   { "value": "REJECT", "type": "String" }
    }
  }' \
  "https://localhost:9091/engine-rest/task/${TASK_ID}/complete"
