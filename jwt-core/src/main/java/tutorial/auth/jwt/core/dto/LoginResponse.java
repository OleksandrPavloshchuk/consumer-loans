package tutorial.auth.jwt.core.dto;

public record LoginResponse(String accessToken, String refreshToken) {
}
