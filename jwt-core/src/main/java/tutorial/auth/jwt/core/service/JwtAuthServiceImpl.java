package tutorial.auth.jwt.core.service;

import io.jsonwebtoken.Claims;
import tutorial.auth.jwt.core.dto.LoginRequest;
import tutorial.auth.jwt.core.dto.LoginResponse;
import tutorial.auth.jwt.core.dto.RefreshRequest;
import tutorial.auth.jwt.core.dto.RefreshResponse;

import java.nio.charset.StandardCharsets;
import java.util.Set;

public class JwtAuthServiceImpl implements JwtAuthService {

    private final AuthenticationService authenticationService;
    private final AuthorizationService authorizationService;
    private final JwtProviderService jwtProviderService;

    public JwtAuthServiceImpl(
            AuthenticationService authenticationService,
            AuthorizationService authorizationService,
            JwtProviderService jwtProviderService
    ) {
        this.authenticationService = authenticationService;
        this.authorizationService = authorizationService;
        this.jwtProviderService = jwtProviderService;
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) throws AuthenticationException {
        final String userName = loginRequest.user();
        // TODO clear this after using
        final byte[] password = loginRequest.password().getBytes(StandardCharsets.UTF_8);
        if (authenticationService.isAuthenticated(userName, password)) {
            final Set<String> roles = authorizationService.getRoles(userName);
            if (!roles.isEmpty()) {
                final String accessToken = jwtProviderService.createAccessToken(userName, roles);
                final String refreshToken = jwtProviderService.createRefreshToken(userName, roles);
                return new LoginResponse(accessToken, refreshToken);
            }
        }
        throw new AuthenticationException("Invalid username or password");
    }

    @Override
    public RefreshResponse refresh(RefreshRequest refreshRequest) throws AuthenticationException {
        final Claims claims = jwtProviderService.parseRefreshToken(refreshRequest.refreshToken());
        final String userName = claims.getSubject();
        final Set<String> roles = authorizationService.getRoles(userName);
        if (!roles.isEmpty()) {
            final String newAccessToken = jwtProviderService.createAccessToken(userName, roles);
            return new RefreshResponse(newAccessToken);
        }
        throw new AuthenticationException("Invalid username or password");
    }

}
