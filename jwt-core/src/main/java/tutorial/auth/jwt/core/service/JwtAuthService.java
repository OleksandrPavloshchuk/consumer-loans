package tutorial.auth.jwt.core.service;

import tutorial.auth.jwt.core.dto.LoginRequest;
import tutorial.auth.jwt.core.dto.LoginResponse;
import tutorial.auth.jwt.core.dto.RefreshRequest;
import tutorial.auth.jwt.core.dto.RefreshResponse;

public interface JwtAuthService {
    LoginResponse login(LoginRequest loginRequest);
    RefreshResponse refresh(RefreshRequest refreshRequest);
}
