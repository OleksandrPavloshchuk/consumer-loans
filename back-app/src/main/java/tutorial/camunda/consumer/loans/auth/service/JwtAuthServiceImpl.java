package tutorial.camunda.consumer.loans.auth.service;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import tutorial.camunda.consumer.loans.auth.dto.LoginRequest;
import tutorial.camunda.consumer.loans.auth.dto.LoginResponse;
import tutorial.camunda.consumer.loans.auth.dto.RefreshRequest;
import tutorial.camunda.consumer.loans.auth.dto.RefreshResponse;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JwtAuthServiceImpl implements JwtAuthService {

    private final UserService userService;
    private final JwtProviderService jwtProviderService;

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
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
    public RefreshResponse refresh(RefreshRequest refreshRequest) {
        final Claims claims = jwtProviderService.parseRefreshToken(refreshRequest.refreshToke());
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
