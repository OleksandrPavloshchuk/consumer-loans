package tutorial.auth.jwt.core.service;

import tutorial.auth.jwt.core.dto.BaseAuthentication;

public interface TokenAuthenticator {
    BaseAuthentication authenticate(String token) throws AuthenticationException;
}
