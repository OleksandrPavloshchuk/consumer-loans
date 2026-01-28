package tutorial.iam.camunda.controller;

import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import tutorial.auth.jwt.core.dto.BaseAuthentication;
import tutorial.auth.jwt.core.service.AuthenticationException;
import tutorial.auth.jwt.core.service.JwtProviderService;
import tutorial.iam.camunda.service.TempAuthenticationCache;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Enumeration;
import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;

@ExtendWith(MockitoExtension.class)
public class CamundaProxyControllerUnitTest {

    @Mock
    private TempAuthenticationCache tempAuthenticationCache;

    @Mock
    private JwtProviderService jwtProviderService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpHeaders httpHeaders;

    @Mock
    private ServletInputStream servletInputStream;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private ResponseEntity<byte[]> responseEntity;

    @InjectMocks
    private CamundaProxyController camundaProxyController;

    @Test
    public void noJwtToken() {
        Assertions.assertThrows(AuthenticationException.class, () -> camundaProxyController.proxy(request));
    }

    @Test
    public void invalidPassword() {
        doReturn( "Bearer JWT token").when(request).getHeader("Authorization");
        doReturn(new BaseAuthentication("someone", Set.of(), false))
                .when(jwtProviderService).authenticate("JWT token");
        Assertions.assertThrows(AuthenticationException.class, () -> camundaProxyController.proxy(request));

    }

    @Test
    public void proxy() throws IOException {
        doReturn( "Bearer JWT token").when(request).getHeader("Authorization");
        doReturn(new BaseAuthentication("someone", Set.of(), false))
                .when(jwtProviderService).authenticate("JWT token");
        doReturn(Optional.of("passwd".getBytes(StandardCharsets.UTF_8)))
                .when(tempAuthenticationCache).load("someone");
        doReturn(Collections.enumeration(Set.of("Authorization", "X-Bebe"))).when(request).getHeaderNames();
        doReturn("GET").when(request).getMethod();
        doReturn("/engine-rest-proxy/one/two")
                .when(request).getRequestURI();
        doReturn(servletInputStream).when(request).getInputStream();
        doReturn(HttpStatusCode.valueOf(200)).when(responseEntity).getStatusCode();
        doReturn(responseEntity).when(restTemplate)
                        .exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), any(Class.class));
        doReturn(httpHeaders).when(responseEntity).getHeaders();

        camundaProxyController.proxy(request);

    }
}
