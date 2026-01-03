#!/usr/bin/env bash

set -x

TASK_ID=f186c44b-e692-11f0-8413-eeeeeeeeeeee

curl -v \
  -X POST \
  -u demo:demopass \
  -H "Content-Type: application/json" \
  -d '{
    "variables": {
      "name":   { "value": "Oleksandr", "type": "String" },
      "amount": { "value": 1200, "type": "Integer" }
    }
  }' \
  "https://localhost:9091/engine-rest/task/${TASK_ID}/complete"
