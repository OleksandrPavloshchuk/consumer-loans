package tutorial.camunda.consumer.loans.auth.service;

import org.springframework.stereotype.Service;
import tutorial.camunda.consumer.loans.auth.dto.LoginRequest;
import tutorial.camunda.consumer.loans.auth.dto.LoginResponse;
import tutorial.camunda.consumer.loans.auth.dto.RefreshRequest;
import tutorial.camunda.consumer.loans.auth.dto.RefreshResponse;

@Service
public class JwtAuthServiceImpl implements JwtAuthService {
    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        return null;
    }

    @Override
    public RefreshResponse refresh(RefreshRequest refreshRequest) {
        return null;
    }
}
