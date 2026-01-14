package tutorial.camunda.consumer.loans.auth.service;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {
    String createAccessToken(UserDetails user);
    String createRefreshToken(UserDetails user);
    Authentication authenticate(String token);
    Claims parseRefreshToken(String token);
}
