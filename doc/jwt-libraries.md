# Libraries for JWT
## Purpose
These libraries provide JWT-based authentication and authorization
for web applications. They encapsulate the login and refresh workflow
based on JWT. Client-side implementation as well as authentication
and authorization providers are expected to be supplied by the user
of the library.
## jwt-core
### Purpose
This library encapsulates the generation of the JWT using exposed APIs. 
This core module interacts with adapters to the various application servers.
### API
#### Interaction with application services
Authenticate the user identified by password
_(The library never stores or propagates user credentials beyond authentication)_:
```java
public interface AuthenticationService {
    boolean isAuthenticated(String username, byte[] password);
}
```
Authorize authenticated user and return his roles
_(The method must never return null. An empty set indicates
that the authenticated user has no assigned roles and therefore
is not authorized to access the application.)_:
```java
public interface AuthorizationService {
    Set<String> getRoles(String username);
}
```
#### Interaction with adapters
Properties, which are necessary for library:
```java
public interface JwtProperties {
    String getSecret();                 // application secret
    long getAccessMinutes();            // access token TTL in minutes
    long getRefreshDays();              // refresh token TTL in days
}
```
Dates for JWT generation:
```java
public interface DateProvider {
    Date createdAt();       // timestamp when token is created
    Date checkedAt();       // timestamp when token is validated
    Date createdAtPlus(Duration d); // calculated expiration timestamp
} 
```
Basic JWT operations for service:
```java
public interface JwtProviderService {
    // Create access token for user and roles
    String createAccessToken(String userName, Set<String> roles);
    // Create refresh token for user and roles
    String createRefreshToken(String userName, Set<String> roles);
    // Extract user's name and roles from token 
    Claims parseRefreshToken(String token);
    /* 
    This method performs token validation and extracts authentication information 
    but does not perform authorization. 
    */
    BaseAuthentication authenticate(String token) throws AuthenticationException;
}
```
JWT service:
```java
public interface JwtAuthService {
    // Try to log in using user's name and password.
    // Returns access and refresh token.
    LoginResponse login(LoginRequest loginRequest) throws AuthenticationException;
    // Generate new access token using stored refresh token.
    RefreshResponse refresh(RefreshRequest refreshRequest) throws AuthenticationException;
}
```
## jwt-spring
### Purpose
Spring-based adapter for the jwt-core library.
Provides REST endpoints, servlet filter and configuration
required to integrate JWT authentication into Spring applications.
### JWT Spring Modules
Ensure the following packages are included in component scan / library search:
- tutorial.auth.jwt.spring.config
- tutorial.auth.jwt.spring.filter
- tutorial.auth.jwt.spring.model
- tutorial.auth.jwt.spring.dto
### Application parameters
#### Environment variable
* **JWT_SECRET** predefined application secret for JWT generation as Base64 string
#### Spring properties
```yaml
security:
  jwt:
    secret: ${JWT_SECRET}
    access-ttl-minutes: 15  # time to live of access token in minutes
    refresh-ttl-days: 7     # time to live of refresh token in days
```
### REST API
#### Login with credentials
* POST /auth/login
* Header: `Content-type: application/json`
* Request content: 
```json 
{"user": "<user name>", "password": "<password>"}
```
* Response content:
```json 
{"accessToken": "<access token>", "refreshToken": "<refresh_token>"}
```
All error cases return HTTP 401 Unauthorized.
#### Request new  access token using refresh token
* POST /auth/refresh
* Header: `Content-type: application/json`
* Request content:
```json 
{"refreshToken": "<refresh token>"}
```
* Response content:
```json 
{"accessToken": "<access token>"}
```
All error cases return HTTP 401 Unauthorized.
### Include library to Spring application
Add filter in HTTP security configuration:
```java
...                
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/auth/**").permitAll()
    ...
.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
```

## aim-camunda
Provides the Camunda based implementation of authentication and returns static role
CAMUNDA_USER for authorization. Camunda is completely responsible for their authorization. 



