#!/usr/bin/env bash

set -x

TASK_ID=9863d384-e695-11f0-8413-eeeeeeeeeeee

curl -v \
  -X POST \
  -u demo:demopass \
  -H "Content-Type: application/json" \
  -d '{}' \
  "https://localhost:9091/engine-rest/task/${TASK_ID}/complete"
