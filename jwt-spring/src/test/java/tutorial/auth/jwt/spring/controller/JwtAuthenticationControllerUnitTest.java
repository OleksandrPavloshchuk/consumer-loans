package tutorial.auth.jwt.spring.controller;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tutorial.auth.jwt.core.dto.LoginRequest;
import tutorial.auth.jwt.core.dto.LoginResponse;
import tutorial.auth.jwt.core.dto.RefreshRequest;
import tutorial.auth.jwt.core.dto.RefreshResponse;
import tutorial.auth.jwt.core.service.AuthenticationException;
import tutorial.auth.jwt.core.service.JwtAuthService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class JwtAuthenticationControllerUnitTest {

    @Mock
    private JwtAuthService jwtAuthService;

    @InjectMocks
    private JwtAuthenticationController jwtAuthenticationController;

    @Test
    public void login() throws AuthenticationException {
        doReturn(new LoginResponse("AT-2", "RT-3"))
                .when(jwtAuthService)
                .login(any());
        final LoginResponse actual = jwtAuthenticationController.login(
          new LoginRequest("user-4", "password-5")
        );
        Assertions.assertEquals("AT-2", actual.accessToken());
        Assertions.assertEquals("RT-3", actual.refreshToken());
        ArgumentCaptor<LoginRequest> captor = ArgumentCaptor.forClass(LoginRequest.class);
        verify(jwtAuthService).login(captor.capture());
        final LoginRequest serverRequest = captor.getValue();
        Assertions.assertEquals("user-4", serverRequest.user());
        Assertions.assertEquals("password-5", serverRequest.password());
    }

    @Test
    public void refresh() throws AuthenticationException {
        doReturn(new RefreshResponse("AT-FF"))
                .when(jwtAuthService)
                .refresh(any());
        final RefreshResponse actual = jwtAuthenticationController.refresh(
                new RefreshRequest("RT-00")
        );
        Assertions.assertEquals("AT-FF", actual.accessToken());
        ArgumentCaptor<RefreshRequest> captor = ArgumentCaptor.forClass(RefreshRequest.class);
        verify(jwtAuthService).refresh(captor.capture());
        final RefreshRequest serverRequest = captor.getValue();
        Assertions.assertEquals("RT-00", serverRequest.refreshToken());
    }

}
