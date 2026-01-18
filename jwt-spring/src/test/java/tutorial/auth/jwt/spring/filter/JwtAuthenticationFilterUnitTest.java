package tutorial.auth.jwt.spring.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tutorial.auth.jwt.core.dto.BaseAuthentication;
import tutorial.auth.jwt.core.service.AuthenticationException;
import tutorial.auth.jwt.core.service.JwtProviderService;

import java.io.IOException;
import java.util.Set;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JwtAuthenticationFilterUnitTest {

    @Mock
    private JwtProviderService tokenAuthenticator;
    @Mock
    private HttpServletRequest httpServletRequest;

    @Mock
    private HttpServletResponse httpServletResponse;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    public void hasValidToken() throws ServletException, IOException, AuthenticationException {
        doReturn("Bearer the token").when(httpServletRequest).getHeader("Authorization");
        doReturn( new BaseAuthentication("1", Set.of(), true
        )).when(tokenAuthenticator).authenticate(any());
        jwtAuthenticationFilter.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);
        ArgumentCaptor<String> tokenCaptor = ArgumentCaptor.forClass(String.class);
        verify(tokenAuthenticator).authenticate(tokenCaptor.capture());
        Assertions.assertEquals("the token", tokenCaptor.getValue());
        verify(filterChain).doFilter(any(), any());
    }

    @Test
    public void noToken() throws ServletException, IOException, AuthenticationException {
        doReturn("something wrong").when(httpServletRequest).getHeader("Authorization");
        jwtAuthenticationFilter.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);
        verify(tokenAuthenticator, never()).authenticate(any());
        verify(filterChain).doFilter(any(), any());
    }

    @Test
    public void hasInvalidToken() throws ServletException, IOException, AuthenticationException {
        doReturn("Bearer be be be").when(httpServletRequest).getHeader("Authorization");
        doThrow( new AuthenticationException("?")).when(tokenAuthenticator).authenticate(any());
        jwtAuthenticationFilter.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);
        verify(filterChain, never()).doFilter(any(), any());
        ArgumentCaptor<Integer> statusCaptor = ArgumentCaptor.forClass(Integer.class);
        ArgumentCaptor<String> messageCaptor = ArgumentCaptor.forClass(String.class);
        verify(httpServletResponse).sendError(statusCaptor.capture(), messageCaptor.capture());
        Assertions.assertEquals(401, statusCaptor.getValue());
        Assertions.assertEquals("Token expired", messageCaptor.getValue());
    }

    @Test
    public void sendErrorException() throws ServletException, IOException, AuthenticationException {
        doReturn("Bearer be be be").when(httpServletRequest).getHeader("Authorization");
        doThrow( new AuthenticationException("?")).when(tokenAuthenticator).authenticate(any());
        doThrow(new IOException("can't send")).when(httpServletResponse).sendError(anyInt(), any());
        jwtAuthenticationFilter.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);
        verify(filterChain, never()).doFilter(any(), any());
    }
}
