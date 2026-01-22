package tutorial.auth.jwt.core.service;

import io.jsonwebtoken.Claims;
import tutorial.auth.jwt.core.dto.BaseAuthentication;

import java.util.Set;

public interface JwtProviderService {

    String createAccessToken(String userName, Set<String> roles, Set<String> groups);

    String createRefreshToken(String userName, Set<String> roles, Set<String> groups);

    Claims parseRefreshToken(String token);

    BaseAuthentication authenticate(String token) throws AuthenticationException;
}
