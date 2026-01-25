#!/usr/bin/env bash

set -x

curl -v \
  -X GET \
  -u demo:demopass \
  -H "Content-Type: application/json" \
  https://localhost:9091/engine-rest/history/variable-instance?processInstanceId=fa353f36-f6f1-11f0-ae28-a2c89251b026
