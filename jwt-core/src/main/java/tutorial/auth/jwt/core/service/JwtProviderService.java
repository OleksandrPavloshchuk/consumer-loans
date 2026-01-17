package tutorial.auth.jwt.core.service;

import io.jsonwebtoken.Claims;
import tutorial.auth.jwt.core.dto.BaseAuthentication;
import tutorial.auth.jwt.core.dto.BaseUserInfo;

public interface JwtProviderService {

    String createAccessToken(BaseUserInfo user);

    String createRefreshToken(BaseUserInfo user);

    Claims parseRefreshToken(String token);

    BaseAuthentication authenticate(String token) throws AuthenticationException;
}
