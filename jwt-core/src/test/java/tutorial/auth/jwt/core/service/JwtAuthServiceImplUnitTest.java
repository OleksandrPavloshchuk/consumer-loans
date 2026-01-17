package tutorial.auth.jwt.core.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import tutorial.auth.jwt.core.dto.*;

import java.util.Optional;
import java.util.Set;

import static org.mockito.Mockito.*;

public class JwtAuthServiceImplUnitTest {

    @Mock
    private UserService userService;
    @Mock
    private JwtProviderService jwtProviderService;

    @InjectMocks
    private JwtAuthServiceImpl jwtAuthServiceImpl;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void login_OK() throws AuthenticationException {
        doReturn(
                Optional.of(new BaseUserInfo("user-1", "password-2",
                        Set.of("user-3")
                )))
                .when(userService)
                .getUser(any());
        doReturn("AT-0").when(jwtProviderService).createAccessToken(any());
        doReturn("RT-1").when(jwtProviderService).createRefreshToken(any());
        final LoginResponse loginResponse = jwtAuthServiceImpl.login(
                new LoginRequest("user-1", "password-2")
        );
        Assertions.assertEquals("AT-0", loginResponse.accessToken());
        Assertions.assertEquals("RT-1", loginResponse.refreshToken());
        ArgumentCaptor<BaseUserInfo> captor = ArgumentCaptor.forClass(BaseUserInfo.class);
        verify(jwtProviderService).createAccessToken(captor.capture());
        verify(jwtProviderService).createRefreshToken(captor.capture());
        BaseUserInfo userDetails = captor.getAllValues().getFirst();
        Assertions.assertEquals("user-1", userDetails.name());
        Assertions.assertEquals("password-2", userDetails.password());
        Assertions.assertEquals(Set.of("user-3"), userDetails.roles());
        userDetails = captor.getAllValues().get(1);
        Assertions.assertEquals("user-1", userDetails.name());
        Assertions.assertEquals("password-2", userDetails.password());
        Assertions.assertEquals(Set.of("user-3"), userDetails.roles());
    }

    @Test
    public void login_BadPassword() {
        doReturn(
                Optional.of(new BaseUserInfo("user-1", "password-2",
                        Set.of("user-3")
                )))
                .when(userService)
                .getUser(any());
        Assertions.assertThrows( AuthenticationException.class,
                () -> jwtAuthServiceImpl.login(
                        new LoginRequest("user-1", "bebebe")
                )
        );
        verify(jwtProviderService, never()).createAccessToken(any());
        verify(jwtProviderService, never()).createRefreshToken(any());
    }

    @Test
    public void login_NoUser() {
        doReturn(Optional.empty())
                .when(userService)
                .getUser(any());
        Assertions.assertThrows( AuthenticationException.class,
                () -> jwtAuthServiceImpl.login(
                        new LoginRequest("user-5", "bububu")
                )
        );
        verify(jwtProviderService, never()).createAccessToken(any());
        verify(jwtProviderService, never()).createRefreshToken(any());
    }

    @Test
    public void refresh_OK() throws AuthenticationException {
        final Claims claims = Jwts.claims().setSubject("user-1");
        doReturn(claims).when(jwtProviderService).parseRefreshToken(any());
        doReturn(
                Optional.of(new BaseUserInfo("user-1", "password-2",
                        Set.of("user-3")
                )))
                .when(userService)
                .getUser(any());
        doReturn("AT-A").when(jwtProviderService).createAccessToken(any());
        final RefreshResponse refreshResponse = jwtAuthServiceImpl.refresh(
                new RefreshRequest("rt")
        );
        Assertions.assertEquals("AT-A", refreshResponse.accessToken());
        ArgumentCaptor<BaseUserInfo> captor = ArgumentCaptor.forClass(BaseUserInfo.class);
        verify(jwtProviderService).createAccessToken(captor.capture());
        verify(jwtProviderService, never()).createRefreshToken(captor.capture());
        BaseUserInfo userDetails = captor.getAllValues().getFirst();
        Assertions.assertEquals("user-1", userDetails.name());
        Assertions.assertEquals("password-2", userDetails.password());
        Assertions.assertEquals(Set.of("user-3"), userDetails.roles());
    }

    @Test
    public void refresh_NoUser() {
        final Claims claims = Jwts.claims().setSubject("user-1");
        doReturn(claims).when(jwtProviderService).parseRefreshToken(any());
        doReturn(Optional.empty())
                .when(userService)
                .getUser(any());
        Assertions.assertThrows( AuthenticationException.class,
                () -> jwtAuthServiceImpl.refresh(
                        new RefreshRequest("token")
                )
        );
        verify(jwtProviderService, never()).createAccessToken(any());
        verify(jwtProviderService, never()).createRefreshToken(any());
    }
}
