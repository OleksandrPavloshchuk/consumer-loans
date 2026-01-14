package tutorial.camunda.consumer.loans.auth.service;

import tutorial.camunda.consumer.loans.auth.dto.LoginRequest;

public interface JwtService {
    String createAccessToken(String user);
    String createRefreshToken(String user);
}
