# front-app

## Architecture

Browser (HTTPS)

↓

React / Vite dev server (HTTPS, mkcert)

↓

Spring Boot / Camunda (HTTPS, PKCS12)


---
## TLS setup

This project uses mkcert for local TLS.

Required files:
- mkcert root CA: ~/.local/share/mkcert/rootCA.pem
- frontend certs: ./certs/localhost.pem, localhost-key.pem
- backend keystore: classpath:localhost.p12

---
## Environment variables

### Frontend
- NODE_OPTIONS=--openssl-legacy-provider
- NODE_EXTRA_CA_CERTS=$HOME/.local/share/mkcert/rootCA.pem
- MKCERT_CA  
  Path to mkcert root CA  
  Example: ~/.local/share/mkcert/rootCA.pem

### Backend
- SERVER_SSL_KEY_STORE_PASSWORD
- SERVER_SSL_KEY_STORE

---
## Local development

### Backend
```bash

./mvnw spring-boot:run
```
### Frontend
```shell

npm run dev
```

### Open front application

`http://localhost:5174/

---
## Known pitfalls

- Vite proxy requires custom https.Agent with mkcert CA
- Node.js does NOT use system trust store by default

