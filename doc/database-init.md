## Init database and prepare datasource (PostgreSQL)

1. Login to existing server as admin:
```
URL: jdbc:postgresql://localhost:5432/
Database:
Login: postgres
Password: mypassword
```
2. Create database
```sql
create database camunda_loans;
```
3. Create user
```sql
create user camunda_user with password 'campass';
```
4. Grant full access to database for newly created user
```sql
alter database camunda_loans owner to camunda_user;
```
5. Set user, password, URL and database in `application.yaml`:
```yaml
spring:
  datasource:
    driver-class-name: org.postgresql.Driver
    url: jdbc:postgresql://localhost:5432/camunda_loans
    username: camunda_user
    password: campass
```
6. Create new database profile in Idea for PostgreSQL:
```
URL: jdbc:postgresql://localhost:5432/camunda_loans
Database: camunda_loans
Login: camunda_user
Password: campass
```
7. Change ownership of schema to camunda_user
```sql
revoke all on schema public from public;
grant all on schema public to camunda_user;
```