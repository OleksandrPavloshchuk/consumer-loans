#!/usr/bin/env bash

set -x

PROCESS_INSTANCE_ID=a0952161-e8c3-11f0-91d1-eeeeeeeeeeee

curl -v \
  -u demo:demopass \
  "http://localhost:9091/engine-rest/process-instance/${PROCESS_INSTANCE_ID}/variables"
