package tutorial.camunda.consumer.loans.auth.service;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import tutorial.auth.jwt.core.dto.LoginRequest;
import tutorial.auth.jwt.core.dto.LoginResponse;
import tutorial.auth.jwt.core.dto.RefreshRequest;
import tutorial.auth.jwt.core.dto.RefreshResponse;
import tutorial.auth.jwt.core.service.AuthenticationException;
import tutorial.auth.jwt.core.service.JwtAuthService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JwtAuthServiceImpl implements JwtAuthService {

    private final UserService userService;
    private final JwtProviderService jwtProviderService;

    @Override
    public LoginResponse login(LoginRequest loginRequest) throws AuthenticationException {
        final String user = loginRequest.user();
        final Optional<UserDetails> userDetailsOpt = userService.getUserDetails(user);
        if (userDetailsOpt.isPresent()) {
            final UserDetails userDetails = userDetailsOpt.get();
            if (userDetails.getPassword().equals(loginRequest.password())) {
                final String accessToken = jwtProviderService.createAccessToken(userDetails);
                final String refreshToken = jwtProviderService.createRefreshToken(userDetails);
                return new LoginResponse(accessToken, refreshToken);
            }
        }
        throw new BadCredentialsException("Invalid username or password");
    }

    @Override
    public RefreshResponse refresh(RefreshRequest refreshRequest) throws AuthenticationException {
        final Claims claims = jwtProviderService.parseRefreshToken(refreshRequest.refreshToken());
        final String user = claims.getSubject();
        Optional<UserDetails> userDetailsOpt = userService.getUserDetails(user);
        if (userDetailsOpt.isPresent()) {
            final UserDetails userDetails = userDetailsOpt.get();
            final String newAccessToken = jwtProviderService.createAccessToken(userDetails);
            return new RefreshResponse(newAccessToken);
        } else {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

}
