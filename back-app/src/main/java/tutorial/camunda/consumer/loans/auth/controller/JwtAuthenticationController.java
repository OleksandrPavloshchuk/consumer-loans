package tutorial.camunda.consumer.loans.auth.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tutorial.camunda.consumer.loans.auth.dto.LoginRequest;
import tutorial.camunda.consumer.loans.auth.dto.LoginResponse;
import tutorial.camunda.consumer.loans.auth.dto.RefreshRequest;
import tutorial.camunda.consumer.loans.auth.dto.RefreshResponse;
import tutorial.camunda.consumer.loans.auth.service.JwtAuthService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class JwtAuthenticationController {

    private final JwtAuthService jwtAuthService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {
        return jwtAuthService.login(loginRequest);
    }

    @PostMapping("/refresh")
    public RefreshResponse refresh(@RequestBody RefreshRequest refreshRequest) {
        return jwtAuthService.refresh(refreshRequest);
    }

}
