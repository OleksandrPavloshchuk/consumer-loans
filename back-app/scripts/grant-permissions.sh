#!/usr/bin/env bash

set -x

curl -v -u admin:admin -H "Content-Type: application/json" -d '{
  "type": "GRANT",
  "permissions": ["READ", "CREATE_INSTANCE"],
  "resourceType": "PROCESS_DEFINITION",
  "resourceId": "*",
  "userId": "John",
  "groupId": null
}' https://localhost:9091/engine-rest/authorization/create



