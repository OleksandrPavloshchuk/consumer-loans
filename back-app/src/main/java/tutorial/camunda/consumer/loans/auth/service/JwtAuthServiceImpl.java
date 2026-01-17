package tutorial.camunda.consumer.loans.auth.service;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import tutorial.auth.jwt.core.dto.*;
import tutorial.auth.jwt.core.service.*;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JwtAuthServiceImpl implements JwtAuthService {

    private final JwtProperties jwtProperties;
    private final DateProvider dateProvider;
    private final UserService userService;

    @Override
    public LoginResponse login(LoginRequest loginRequest) throws AuthenticationException {
        final String name = loginRequest.user();
        final Optional<BaseUserInfo> userDetailsOpt = userService.getUser(name);
        if (userDetailsOpt.isPresent()) {
            final BaseUserInfo userDetails = userDetailsOpt.get();
            if (userDetails.password().equals(loginRequest.password())) {
                final String accessToken = getJwtProviderService().createAccessToken(userDetails);
                final String refreshToken = getJwtProviderService().createRefreshToken(userDetails);
                return new LoginResponse(accessToken, refreshToken);
            }
        }
        throw new BadCredentialsException("Invalid username or password");
    }

    @Override
    public RefreshResponse refresh(RefreshRequest refreshRequest) throws AuthenticationException {
        final Claims claims = getJwtProviderService().parseRefreshToken(refreshRequest.refreshToken());
        final String name = claims.getSubject();
        final Optional<BaseUserInfo> userDetailsOpt = userService.getUser(name);
        if (userDetailsOpt.isPresent()) {
            final BaseUserInfo userDetails = userDetailsOpt.get();
            final String newAccessToken = getJwtProviderService().createAccessToken(userDetails);
            return new RefreshResponse(newAccessToken);
        } else {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    private JwtProviderService getJwtProviderService() {
        // TODO cache this
        return new JwtProviderServiceImpl(dateProvider, jwtProperties);
    }

}
