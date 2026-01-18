## Design Decisions

This project follows a set of explicit architectural decisions aimed at simplicity, extensibility, and long-term maintainability.

### Separation of authentication and authorization

Authentication (verifying user identity) and authorization (determining user permissions) are treated as two distinct concerns.

* Authentication is delegated to the `AuthenticationService`, which validates user credentials.
* Authorization is delegated to the `AuthorizationService`, which determines the set of roles assigned to an authenticated user.

A user is considered **authorized** only if at least one role is assigned.
An empty role set indicates a successfully authenticated but unauthorized user and results in access denial.

This separation allows authentication and authorization mechanisms to evolve independently and enables custom implementations for different security models.

---

### Framework-agnostic core

The `jwt-core` module is completely independent of any web framework or runtime environment.

* It does not depend on Spring, Servlet API, or HTTP abstractions.
* It exposes only domain-level contracts for authentication, authorization, token generation, and time handling.

This allows the core library to be reused with different adapters (Spring, Netty, or custom application servers) without modification.

---

### Adapter-based integration

Framework-specific functionality is implemented via adapters.

* The `jwt-spring` module adapts the core library to the Spring ecosystem.
* It provides REST endpoints, servlet filters, and configuration required for integration.
* The adapter does not contain business logic and delegates all security decisions to the core module.

This approach keeps framework concerns isolated and prevents leakage of infrastructure code into the core logic.

---

### Explicit invariants over defensive null checks

The library enforces a small number of strong invariants instead of defensive programming.

* Authorization services must return a non-null role set.
* An empty role set is treated as a valid but unauthorized state.
* Tokens are issued only if both authentication and authorization invariants are satisfied.

By defining and enforcing these invariants at the API level, the implementation remains simpler and more predictable.

---

### Minimal and explicit public API

The public API is intentionally small and explicit.

* Only essential interfaces are exposed.
* Internal helpers and implementation details are kept private.
* No framework-specific abstractions leak into the core API.

This reduces coupling, improves testability, and lowers the cost of future refactoring.

---

### Stateless security model

The library is designed for stateless authentication using JWT.

* No server-side sessions are used.
* All required authentication information is embedded in tokens.
* This design is suitable for distributed systems and microservice architectures.

State management, if required, is expected to be handled outside the core library.

---

### Security-focused handling of credentials

User credentials are handled with explicit security considerations.

* Passwords are passed as byte arrays to avoid unnecessary string persistence.
* Credential validation is performed in a single, well-defined location.
* Credentials are never stored or propagated beyond authentication.

This minimizes the risk of accidental credential exposure.

---

## Closing note

These design decisions favor clarity and correctness over convenience.
They are intended to provide a solid foundation that can be extended safely as application requirements evolve.
