package tutorial.auth.jwt.core.dto;

public record BaseAuthentication(
        BaseUserInfo userInfo,
        boolean isAuthenticated
) {
}
