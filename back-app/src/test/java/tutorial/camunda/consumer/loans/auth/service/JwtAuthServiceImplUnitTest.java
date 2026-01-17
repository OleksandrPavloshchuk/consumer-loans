package tutorial.camunda.consumer.loans.auth.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import tutorial.auth.jwt.core.dto.*;
import tutorial.auth.jwt.core.service.AuthenticationException;
import tutorial.auth.jwt.core.service.DateProvider;
import tutorial.auth.jwt.core.service.JwtProperties;
import tutorial.auth.jwt.core.service.UserService;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;

@ExtendWith(MockitoExtension.class)
public class JwtAuthServiceImplUnitTest {

    @Mock
    private UserService userService;

    @Mock
    private JwtProperties jwtProperties;

    @Mock
    private DateProvider dateProvider;

    @InjectMocks
    private JwtAuthServiceImpl jwtAuthServiceImpl;

    @Test
    public void login_OK() throws AuthenticationException {

        doReturn("rH6fM4+J4v7QhJkQ2M1hA+PZpZC9xT2l8Y8kXJ6v1aE=")
                .when(jwtProperties).getSecret();
        doReturn(100L)
                .when(jwtProperties).getAccessMinutes();
        doReturn(11L)
                .when(jwtProperties).getRefreshDays();

        doReturn(getDateFrom("2026-01-26T00:00:00Z"))
                .when(dateProvider).createdAt();

        doReturn(
                Optional.of(new BaseUserInfo("user-1", "password-2",
                        Set.of("user-3")
                )))
                .when(userService)
                .getUser(any());
        final LoginResponse loginResponse = jwtAuthServiceImpl.login(
                new LoginRequest("user-1", "password-2")
        );
        Assertions.assertEquals(
                "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyLTEiLCJyb2xlcyI6WyJ1c2VyLTMiXSwiaWF0IjoxNzY5Mzg1NjAwfQ.U7JRR7y4iuNOwLEj3hBrEp0rao5TtQhqObcdPw90r1s",
                loginResponse.accessToken());
        Assertions.assertEquals(
                "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyLTEiLCJyb2xlcyI6WyJ1c2VyLTMiXSwiaWF0IjoxNzY5Mzg1NjAwfQ.U7JRR7y4iuNOwLEj3hBrEp0rao5TtQhqObcdPw90r1s",
                loginResponse.refreshToken());
    }

    @Test
    public void login_BadPassword() {
        doReturn(
                Optional.of(new BaseUserInfo("user-1", "password-2",
                        Set.of("user-3")
                )))
                .when(userService)
                .getUser(any());
        Assertions.assertThrows( BadCredentialsException.class,
                () -> jwtAuthServiceImpl.login(
                        new LoginRequest("user-1", "bebebe")
                )
        );
    }

    @Test
    public void login_NoUser() {
        doReturn(Optional.empty())
                .when(userService)
                .getUser(any());
        Assertions.assertThrows( BadCredentialsException.class,
                () -> jwtAuthServiceImpl.login(
                        new LoginRequest("user-5", "bububu")
                )
        );
    }

    @Test
    public void refresh_OK() throws AuthenticationException {
        doReturn("rH6fM4+J4v7QhJkQ2M1hA+PZpZC9xT2l8Y8kXJ6v1aE=")
                .when(jwtProperties).getSecret();
        doReturn(100L)
                .when(jwtProperties).getAccessMinutes();

        doReturn(getDateFrom("2026-01-26T00:00:00Z"))
                .when(dateProvider).createdAt();
        doReturn(getDateFrom("2026-01-26T01:00:00Z"))
                .when(dateProvider).checkedAt();

        doReturn(
                Optional.of(new BaseUserInfo("user-1", "password-2",
                        Set.of("user-3")
                )))
                .when(userService)
                .getUser(any());
        final RefreshResponse refreshResponse = jwtAuthServiceImpl.refresh(
                new RefreshRequest(
                        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyLTEiLCJyb2xlcyI6WyJ1c2VyLTMiXSwiaWF0IjoxNzY5Mzg1NjAwfQ.U7JRR7y4iuNOwLEj3hBrEp0rao5TtQhqObcdPw90r1s"
                )
        );
        Assertions.assertEquals(
                "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyLTEiLCJyb2xlcyI6WyJ1c2VyLTMiXSwiaWF0IjoxNzY5Mzg1NjAwfQ.U7JRR7y4iuNOwLEj3hBrEp0rao5TtQhqObcdPw90r1s",
                refreshResponse.accessToken());
    }

    private static Date getDateFrom(String src) {
        return Date.from(Instant.parse(src));
    }
}
