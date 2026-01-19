#!/bin/bash
# grant-camunda.sh
# Використання: ./grant-camunda.sh
# Потрібно мати admin/demo або admin/admin для авторизації

CAMUNDA_USER="admin"
CAMUNDA_PASSWORD="admin"
BASE_URL="https://localhost:9091/engine-rest"

# ------------------------------
# 1️⃣ Створити користувача John
# ------------------------------
curl -s -o /dev/null -w "%{http_code}\n" -u $CAMUNDA_USER:$CAMUNDA_PASSWORD \
  -H "Content-Type: application/json" \
  -d '{"id":"John","firstName":"John","lastName":"Doe","password":"password"}' \
  $BASE_URL/user/create

# ------------------------------
# 2️⃣ Створити групу loanConsultants
# ------------------------------
curl -s -o /dev/null -w "%{http_code}\n" -u $CAMUNDA_USER:$CAMUNDA_PASSWORD \
  -H "Content-Type: application/json" \
  -d '{"id":"loanConsultants","name":"Loan Consultants","type":"WORKFLOW"}' \
  $BASE_URL/group/create

# ------------------------------
# 3️⃣ Додати John до групи
# ------------------------------
curl -s -o /dev/null -w "%{http_code}\n" -u $CAMUNDA_USER:$CAMUNDA_PASSWORD \
  -X PUT \
  $BASE_URL/group/loanConsultants/members/John

# ------------------------------
# 4️⃣ Дати права TASK користувачу John
# ------------------------------
curl -s -o /dev/null -w "%{http_code}\n" -u $CAMUNDA_USER:$CAMUNDA_PASSWORD \
  -H "Content-Type: application/json" \
  -d '{
    "type":"GLOBAL",
    "permissions":["READ","UPDATE"],
    "resourceType":"TASK",
    "resourceId":"*",
    "userId":"John",
    "groupId":null
  }' \
  $BASE_URL/authorization/create

# ------------------------------
# 5️⃣ Дати права PROCESS_DEFINITION користувачу John
# ------------------------------
curl -s -o /dev/null -w "%{http_code}\n" -u $CAMUNDA_USER:$CAMUNDA_PASSWORD \
  -H "Content-Type: application/json" \
  -d '{
    "type":"GRANT",
    "permissions":["READ","CREATE_INSTANCE"],
    "resourceType":"PROCESS_DEFINITION",
    "resourceId":"*",
    "userId":"John",
    "groupId":null
  }' \
  $BASE_URL/authorization/create

echo "✅ John і група loanConsultants створені, права встановлені"
