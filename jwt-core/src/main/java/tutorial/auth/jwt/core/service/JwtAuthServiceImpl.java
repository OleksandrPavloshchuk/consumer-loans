package tutorial.auth.jwt.core.service;

import io.jsonwebtoken.Claims;
import tutorial.auth.jwt.core.dto.*;

import java.util.Optional;

public class JwtAuthServiceImpl implements JwtAuthService {

    private final UserService userService;
    private final JwtProviderService jwtProviderService;

    public JwtAuthServiceImpl(
            UserService userService,
            JwtProviderService jwtProviderService
    ) {
        this.userService = userService;
        this.jwtProviderService = jwtProviderService;
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) throws AuthenticationException {
        final String userName = loginRequest.user();
        final Optional<BaseUserInfo> userOpt = userService.getUser(userName);
        if (userOpt.isPresent()) {
            final BaseUserInfo user = userOpt.get();
            if (user.password().equals(loginRequest.password())) {
                final String accessToken = jwtProviderService.createAccessToken(user);
                final String refreshToken = jwtProviderService.createRefreshToken(user);
                return new LoginResponse(accessToken, refreshToken);
            }
        }
        throw new AuthenticationException("Invalid username or password");
    }

    @Override
    public RefreshResponse refresh(RefreshRequest refreshRequest) throws AuthenticationException {
        final Claims claims = jwtProviderService.parseRefreshToken(refreshRequest.refreshToken());
        final String userName = claims.getSubject();
        Optional<BaseUserInfo> userOpt = userService.getUser(userName);
        if (userOpt.isPresent()) {
            final String newAccessToken = jwtProviderService.createAccessToken(userOpt.get());
            return new RefreshResponse(newAccessToken);
        } else {
            throw new AuthenticationException("Invalid username or password");
        }
    }

}
