package tutorial.auth.jwt.core.dto;

import java.util.Set;

public record BaseAuthentication(
        String username,
        Set<String> roles,
        boolean isAuthenticated
) {
}
