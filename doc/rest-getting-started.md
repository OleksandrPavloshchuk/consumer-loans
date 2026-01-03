### Getting started REST API to Camunda

#### Start process
```shell

curl -v \
  -X POST \
  -u demo:demopass \
  -H "Content-Type: application/json" \
  -d "{}" \
  http://localhost:9091/engine-rest/process-definition/key/consumer-loan/start
```
(**WARNING**: Do not use basic authentication in production system!)

Response:
```json
{
  "links": [
    {
      "method": "GET",
      "href": "http://localhost:9091/engine-rest/process-instance/f18368e8-e692-11f0-8413-eeeeeeeeeeee",
      "rel": "self"
    }
  ],
  "id": "f18368e8-e692-11f0-8413-eeeeeeeeeeee",
  "definitionId": "consumer-loan:1:e045303c-e653-11f0-8ff2-eeeeeeeeeeee",
  "businessKey": null,
  "caseInstanceId": null,
  "ended": false,
  "suspended": false,
  "tenantId": null,
  "definitionKey": "consumer-loan"
}
```
Field `id` is the PROCESS_INSTANCE_ID value, necessary for next step.

#### Find the current task

```shell

curl -v \
  -u demo:demopass \
  "http://localhost:9091/engine-rest/task?processInstanceId=${PROCESS_INSTANCE_ID}&sortBy=created&sortOrder=asc"
```

Response:
```json
[
  {
    "id": "f186c44b-e692-11f0-8413-eeeeeeeeeeee",
    "name": "Enter loan application",
    "assignee": null,
    "created": "2025-12-31T23:52:04.024+0200",
    "due": null,
    "followUp": null,
    "lastUpdated": null,
    "delegationState": null,
    "description": null,
    "executionId": "f18368e8-e692-11f0-8413-eeeeeeeeeeee",
    "owner": null,
    "parentTaskId": null,
    "priority": 50,
    "processDefinitionId": "consumer-loan:1:e045303c-e653-11f0-8ff2-eeeeeeeeeeee",
    "processInstanceId": "f18368e8-e692-11f0-8413-eeeeeeeeeeee",
    "taskDefinitionKey": "enterApplication",
    "caseExecutionId": null,
    "caseInstanceId": null,
    "caseDefinitionId": null,
    "suspended": false,
    "formKey": null,
    "camundaFormRef": null,
    "tenantId": null,
    "taskState": "Created"
  }
]
```

Field `id` is the TASK_ID value, necessary for next steps.

#### Call the current user task with the input data

```shell

curl -v \
  -X POST \
  -u demo:demopass \
  -H "Content-Type: application/json" \
  -d '{
    "variables": {
      "name":   { "value": "Oleksandr", "type": "String" },
      "amount": { "value": 15000, "type": "Integer" }
    }
  }' \
  "http://localhost:9091/engine-rest/task/${TASK_ID}/complete"
```
Variable names coincide with ones in Camunda engine.

#### Print variables values

```shell

curl -v \
  -u demo:demopass \
  "http://localhost:9091/engine-rest/process-instance/${PROCESS_INSTANCE_ID}/variables"
```

```json
{
  "amount": {
    "type": "Integer",
    "value": 1200,
    "valueInfo": {}
  },
  "PERSON_CHECK_SCORES": {
    "type": "Integer",
    "value": 37,
    "valueInfo": {}
  },
  "FINANCE_CHECK_REASONS": {
    "type": "Object",
    "value": [],
    "valueInfo": {
      "objectTypeName": "java.util.ArrayList",
      "serializationDataFormat": "application/x-java-serialized-object"
    }
  },
  "PERSON_CHECK_REASONS": {
    "type": "Object",
    "value": [
      "Awful"
    ],
    "valueInfo": {
      "objectTypeName": "java.util.ArrayList",
      "serializationDataFormat": "application/x-java-serialized-object"
    }
  },
  "name": {
    "type": "String",
    "value": "Oleksandr",
    "valueInfo": {}
  },
  "SCORING_RESULT": {
    "type": "Object",
    "value": "MANUAL",
    "valueInfo": {
      "objectTypeName": "tutorial.camunda.consumer.loans.domain.ScoringResult",
      "serializationDataFormat": "application/x-java-serialized-object"
    }
  },
  "FINANCE_CHECK_SCORES": {
    "type": "Integer",
    "value": 9,
    "valueInfo": {}
  },
  "TOTAL_SCORES": {
    "type": "Integer",
    "value": 46,
    "valueInfo": {}
  },
  "TOTAL_REASONS": {
    "type": "Object",
    "value": [
      "Awful"
    ],
    "valueInfo": {
      "objectTypeName": "java.util.ArrayList",
      "serializationDataFormat": "application/x-java-serialized-object"
    }
  }
}
```

##### Remarks
* Use parameter `businessKey` with unique string value in every POST request. It simplifies tracing 
of any particular process.