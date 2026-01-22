package tutorial.iam.camunda.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import tutorial.auth.jwt.core.dto.BaseAuthentication;
import tutorial.auth.jwt.core.service.AuthenticationException;
import tutorial.auth.jwt.core.service.JwtProviderService;
import tutorial.iam.camunda.service.TempAuthenticationCache;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class CamundaProxyController {

    private final TempAuthenticationCache tempAuthenticationCache;
    private final JwtProviderService jwtProviderService;

    @RequestMapping("/engine-rest-proxy/**")
    public ResponseEntity<?> proxy(HttpServletRequest request) throws IOException, AuthenticationException {
        String targetPath = request.getRequestURI()
                .replaceFirst("/engine-rest-proxy", "/engine-rest");

        String query = request.getQueryString();
        String url = "https://localhost:9091" + targetPath
                + (query != null ? "?" + query : "");

        HttpHeaders headers = getHttpHeadersWithoutAuthentication(request);

        final Optional<String> authTokenOpt = getAuthorizationToken(request);
        if (authTokenOpt.isPresent()) {
            final String token = authTokenOpt.get();
            final BaseAuthentication auth = jwtProviderService.authenticate(token);
            final String username = auth.username();
            final Optional<byte[]> passwordOpt = tempAuthenticationCache.load(username);
            if (passwordOpt.isPresent()) {
                final byte[] password = passwordOpt.get();
                final String passwordStr = new String(password, StandardCharsets.UTF_8);
                final String value = Base64.getEncoder()
                        .encodeToString((username + ":" + passwordStr).getBytes(StandardCharsets.UTF_8));
                headers.set(HttpHeaders.AUTHORIZATION, "Basic " + value);
                final HttpEntity<byte[]> entity =
                        new HttpEntity<>(request.getInputStream().readAllBytes(), headers);

                final ResponseEntity<byte[]> response =
                        new RestTemplate().exchange(
                                url,
                                HttpMethod.valueOf(request.getMethod()),
                                entity,
                                byte[].class
                        );

                return ResponseEntity
                        .status(response.getStatusCode())
                        .headers(response.getHeaders())
                        .body(response.getBody());
            } else {
                throw new AuthenticationException("Authentication failed");
            }
        } else {
            throw new AuthenticationException("Authentication failed");
        }
    }

    private static HttpHeaders getHttpHeadersWithoutAuthentication(HttpServletRequest request) {
        HttpHeaders headers = new HttpHeaders();
        Collections.list(request.getHeaderNames()).forEach(h -> {
            if (!h.equalsIgnoreCase(HttpHeaders.AUTHORIZATION)) {
                headers.add(h, request.getHeader(h));
            }
        });
        return headers;
    }

    private static Optional<String> getAuthorizationToken(HttpServletRequest request) {
        final String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return Optional.empty();
        } else {
            return Optional.of(authorizationHeader.substring(7));
        }
    }

}
