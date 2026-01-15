package tutorial.camunda.consumer.loans.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import tutorial.camunda.consumer.loans.auth.dto.LoginRequest;
import tutorial.camunda.consumer.loans.auth.dto.LoginResponse;
import tutorial.camunda.consumer.loans.auth.dto.RefreshRequest;
import tutorial.camunda.consumer.loans.auth.dto.RefreshResponse;

import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JwtAuthServiceImplUnitTest {

    @Mock
    private UserService userService;
    @Mock
    private JwtProviderService jwtProviderService;

    @InjectMocks
    private JwtAuthServiceImpl jwtAuthServiceImpl;

    @Test
    public void login_OK() {
        doReturn(
                Optional.of(new User("user-1", "password-2",
                        Set.of(new SimpleGrantedAuthority("user-3"))
                )))
                .when(userService)
                .getUserDetails(any());
        doReturn("AT-0").when(jwtProviderService).createAccessToken(any());
        doReturn("RT-1").when(jwtProviderService).createRefreshToken(any());
        final LoginResponse loginResponse = jwtAuthServiceImpl.login(
                new LoginRequest("user-1", "password-2")
        );
        Assertions.assertEquals("AT-0", loginResponse.accessToken());
        Assertions.assertEquals("RT-1", loginResponse.refreshToken());
        ArgumentCaptor<UserDetails> captor = ArgumentCaptor.forClass(UserDetails.class);
        verify(jwtProviderService).createAccessToken(captor.capture());
        verify(jwtProviderService).createRefreshToken(captor.capture());
        UserDetails userDetails = captor.getAllValues().get(0);
        Assertions.assertEquals("user-1", userDetails.getUsername());
        Assertions.assertEquals("password-2", userDetails.getPassword());
        Assertions.assertEquals(Set.of(new SimpleGrantedAuthority("user-3")), userDetails.getAuthorities());
        userDetails = captor.getAllValues().get(1);
        Assertions.assertEquals("user-1", userDetails.getUsername());
        Assertions.assertEquals("password-2", userDetails.getPassword());
        Assertions.assertEquals(Set.of(new SimpleGrantedAuthority("user-3")), userDetails.getAuthorities());
    }

    @Test
    public void login_BadPassword() {
        doReturn(
                Optional.of(new User("user-1", "password-2",
                        Set.of(new SimpleGrantedAuthority("user-3"))
                )))
                .when(userService)
                .getUserDetails(any());
        Assertions.assertThrows( BadCredentialsException.class,
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
                .getUserDetails(any());
        Assertions.assertThrows( BadCredentialsException.class,
                () -> jwtAuthServiceImpl.login(
                        new LoginRequest("user-5", "bububu")
                )
        );
        verify(jwtProviderService, never()).createAccessToken(any());
        verify(jwtProviderService, never()).createRefreshToken(any());
    }

    @Test
    public void refresh_OK() {
        final Claims claims = Jwts.claims().setSubject("user-1");
        doReturn(claims).when(jwtProviderService).parseRefreshToken(any());
        doReturn(
                Optional.of(new User("user-1", "password-2",
                        Set.of(new SimpleGrantedAuthority("user-3"))
                )))
                .when(userService)
                .getUserDetails(any());
        doReturn("AT-A").when(jwtProviderService).createAccessToken(any());
        final RefreshResponse refreshResponse = jwtAuthServiceImpl.refresh(
                new RefreshRequest("rt")
        );
        Assertions.assertEquals("AT-A", refreshResponse.accessToken());
        ArgumentCaptor<UserDetails> captor = ArgumentCaptor.forClass(UserDetails.class);
        verify(jwtProviderService).createAccessToken(captor.capture());
        verify(jwtProviderService, never()).createRefreshToken(captor.capture());
        UserDetails userDetails = captor.getAllValues().get(0);
        Assertions.assertEquals("user-1", userDetails.getUsername());
        Assertions.assertEquals("password-2", userDetails.getPassword());
        Assertions.assertEquals(Set.of(new SimpleGrantedAuthority("user-3")), userDetails.getAuthorities());
    }

    @Test
    public void refresh_NoUser() {
        final Claims claims = Jwts.claims().setSubject("user-1");
        doReturn(claims).when(jwtProviderService).parseRefreshToken(any());
        doReturn(Optional.empty())
                .when(userService)
                .getUserDetails(any());
        Assertions.assertThrows( BadCredentialsException.class,
                () -> jwtAuthServiceImpl.refresh(
                        new RefreshRequest("token")
                )
        );
        verify(jwtProviderService, never()).createAccessToken(any());
        verify(jwtProviderService, never()).createRefreshToken(any());
    }
}
