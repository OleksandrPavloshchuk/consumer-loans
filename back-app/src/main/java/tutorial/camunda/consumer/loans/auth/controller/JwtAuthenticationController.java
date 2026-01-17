package tutorial.camunda.consumer.loans.auth.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tutorial.auth.jwt.core.dto.LoginRequest;
import tutorial.auth.jwt.core.dto.LoginResponse;
import tutorial.auth.jwt.core.dto.RefreshRequest;
import tutorial.auth.jwt.core.dto.RefreshResponse;
import tutorial.auth.jwt.core.service.AuthenticationException;
import tutorial.auth.jwt.core.service.JwtAuthService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class JwtAuthenticationController {

    private final JwtAuthService jwtAuthService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) throws AuthenticationException {
        return jwtAuthService.login(loginRequest);
    }

    @PostMapping("/refresh")
    public RefreshResponse refresh(@RequestBody RefreshRequest refreshRequest) throws AuthenticationException {
        return jwtAuthService.refresh(refreshRequest);
    }

}
