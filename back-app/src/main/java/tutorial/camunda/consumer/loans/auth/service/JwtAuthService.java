package tutorial.camunda.consumer.loans.auth.service;

import org.springframework.web.bind.annotation.RequestBody;
import tutorial.camunda.consumer.loans.auth.dto.LoginRequest;
import tutorial.camunda.consumer.loans.auth.dto.LoginResponse;
import tutorial.camunda.consumer.loans.auth.dto.RefreshRequest;
import tutorial.camunda.consumer.loans.auth.dto.RefreshResponse;

public interface JwtAuthService {
    LoginResponse login(LoginRequest loginRequest);
    RefreshResponse refresh(RefreshRequest refreshRequest);
}
