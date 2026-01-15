package tutorial.camunda.consumer.loans.auth.dto;

public record LoginResponse(String accessToken, String refreshToken) {
}
