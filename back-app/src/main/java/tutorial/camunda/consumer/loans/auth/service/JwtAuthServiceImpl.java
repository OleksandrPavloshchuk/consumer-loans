package tutorial.camunda.consumer.loans.auth.service;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import tutorial.camunda.consumer.loans.auth.dto.LoginRequest;
import tutorial.camunda.consumer.loans.auth.dto.LoginResponse;
import tutorial.camunda.consumer.loans.auth.dto.RefreshRequest;
import tutorial.camunda.consumer.loans.auth.dto.RefreshResponse;

import java.util.Optional;
import java.util.Set;

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
                final UserDetails userDetails = getUserDetails(user);
                final String accessToken = jwtService.createAccessToken(userDetails);
                final String refreshToken = jwtService.createRefreshToken(userDetails);
                return new LoginResponse(accessToken, refreshToken);
            } else {
                throw new BadCredentialsException("Invalid username or password");
            }
        } else {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    @Override
    public RefreshResponse refresh(RefreshRequest refreshRequest) {
        final Claims claims = jwtService.parseRefreshToken(refreshRequest.getRefreshToken());
        final String user = claims.getSubject();
        Optional<String> passwordOpt = userService.getUserPassword(user);
        if (passwordOpt.isPresent()) {
            final UserDetails userDetails = getUserDetails(user);
            final String newAccessToken = jwtService.createAccessToken(userDetails);
            return new RefreshResponse(newAccessToken);
        } else {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    private UserDetails getUserDetails(String user) {
        // TODO get authorities from the static source
        final SimpleGrantedAuthority userAuthority = new SimpleGrantedAuthority("USER");
        final Set<GrantedAuthority> authorities = Set.of(
            userAuthority
        );
        return new User(
                user,
                "some password",
                authorities
        );
    }
}
