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
import tutorial.auth.jwt.core.dto.LoginRequest;
import tutorial.auth.jwt.core.dto.LoginResponse;
import tutorial.auth.jwt.core.dto.RefreshRequest;
import tutorial.auth.jwt.core.dto.RefreshResponse;

import java.util.Set;

import static org.mockito.Mockito.*;

public class JwtAuthServiceImplUnitTest {

    @Mock
    private AuthorizationService authorizationService;

    @Mock
    private AuthenticationService authenticationService;

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
        doReturn(true).when(authenticationService).isAuthenticated(any(), any());
        doReturn(Set.of("user-3")).when(authorizationService).getRoles(any());
        doReturn("AT-0").when(jwtProviderService).createAccessToken(any(), anySet());
        doReturn("RT-1").when(jwtProviderService).createRefreshToken(any(), anySet());
        final LoginResponse loginResponse = jwtAuthServiceImpl.login(
                new LoginRequest("user-1", "password-2")
        );
        Assertions.assertEquals("AT-0", loginResponse.accessToken());
        Assertions.assertEquals("RT-1", loginResponse.refreshToken());
        ArgumentCaptor<String> nameCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<Set<String>> rolesCaptor = ArgumentCaptor.forClass(Set.class);
        verify(jwtProviderService).createAccessToken(nameCaptor.capture(), rolesCaptor.capture());
        verify(jwtProviderService).createRefreshToken(nameCaptor.capture(), rolesCaptor.capture());
        String userName = nameCaptor.getAllValues().getFirst();
        Set<String> userRoles = rolesCaptor.getAllValues().getFirst();
        Assertions.assertEquals("user-1", userName);
        Assertions.assertEquals(Set.of("user-3"), userRoles);
        userName = nameCaptor.getAllValues().get(1);
        userRoles = rolesCaptor.getAllValues().get(1);
        Assertions.assertEquals("user-1", userName);
        Assertions.assertEquals(Set.of("user-3"), userRoles);
    }

    @Test
    public void login_BadPasswordOrNoUser() {
        doReturn(false).when(authenticationService).isAuthenticated(any(), any());
        Assertions.assertThrows( AuthenticationException.class,
                () -> jwtAuthServiceImpl.login(
                        new LoginRequest("user-1", "bebebe")
                )
        );
        verify(jwtProviderService, never()).createAccessToken(any(), anySet());
        verify(jwtProviderService, never()).createRefreshToken(any(), anySet());
    }

    @Test
    public void login_NoRoles() {
        doReturn(true).when(authenticationService).isAuthenticated(any(), any());
        doReturn(Set.of()).when(authorizationService).getRoles(any());
        Assertions.assertThrows( AuthenticationException.class,
                () -> jwtAuthServiceImpl.login(
                        new LoginRequest("user-2", "password-3")
                )
        );
        verify(jwtProviderService, never()).createAccessToken(any(), anySet());
        verify(jwtProviderService, never()).createRefreshToken(any(), anySet());
    }


    @Test
    public void refresh_OK() throws AuthenticationException {
        final Claims claims = Jwts.claims().setSubject("user-1");
        doReturn(claims).when(jwtProviderService).parseRefreshToken(any());
        doReturn(Set.of("role-1", "other")).when(authorizationService).getRoles(any());
        doReturn("AT-A").when(jwtProviderService).createAccessToken(any(), anySet());
        final RefreshResponse refreshResponse = jwtAuthServiceImpl.refresh(
                new RefreshRequest("rt")
        );
        Assertions.assertEquals("AT-A", refreshResponse.accessToken());
        ArgumentCaptor<String> nameCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<Set<String>> rolesCaptor = ArgumentCaptor.forClass(Set.class);
        verify(jwtProviderService).createAccessToken(nameCaptor.capture(), rolesCaptor.capture());
        verify(jwtProviderService, never()).createRefreshToken(nameCaptor.capture(), rolesCaptor.capture());
        Assertions.assertEquals("user-1", nameCaptor.getValue());
        Assertions.assertEquals(Set.of("role-1", "other"), rolesCaptor.getValue());
    }

    @Test
    public void refresh_NoRoles() {
        final Claims claims = Jwts.claims().setSubject("user-1");
        doReturn(Set.of()).when(authorizationService).getRoles(any());
        doReturn(claims).when(jwtProviderService).parseRefreshToken(any());
        Assertions.assertThrows( AuthenticationException.class,
                () -> jwtAuthServiceImpl.refresh(
                        new RefreshRequest("token")
                )
        );
        verify(jwtProviderService, never()).createAccessToken(any(), anySet());
        verify(jwtProviderService, never()).createRefreshToken(any(), anySet());
    }
}
