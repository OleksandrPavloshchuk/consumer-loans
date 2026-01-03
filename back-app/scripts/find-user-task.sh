#!/usr/bin/env bash

set -x

PROCESS_INSTANCE_ID=f18368e8-e692-11f0-8413-eeeeeeeeeeee

curl -v \
  -u demo:demopass \
  "https://localhost:9091/engine-rest/task?processInstanceId=${PROCESS_INSTANCE_ID}"
