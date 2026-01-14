package tutorial.camunda.consumer.loans.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
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
    private final JwtService jwtService;

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        final String user = loginRequest.getUser();
        final Optional<String> passwordOpt = userService.getUserPassword(user);
        if (passwordOpt.isPresent()) {
            final String password = passwordOpt.get();
            if (password.equals(loginRequest.getPassword())) {
                final String accessToken = jwtService.createAccessToken(user);
            } else {
                throw new BadCredentialsException("Invalid username or password");
            }
        } else {
            throw new BadCredentialsException("Invalid username or password");
        }

        return null;
    }

    @Override
    public RefreshResponse refresh(RefreshRequest refreshRequest) {
        return null;
    }
}
