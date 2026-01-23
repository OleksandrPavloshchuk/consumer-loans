package tutorial.auth.jwt.spring.utils.utils;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Optional;

public class JwtUtils {

    private JwtUtils() {}

    public static Optional<String> getJwtToken(HttpServletRequest request) {
        final String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return Optional.empty();
        } else {
            return Optional.of(authorizationHeader.substring(7));
        }
    }
}
