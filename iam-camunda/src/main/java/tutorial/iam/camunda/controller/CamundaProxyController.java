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
import tutorial.auth.jwt.core.service.AuthenticationException;
import tutorial.auth.jwt.core.service.JwtProviderService;
import tutorial.auth.jwt.spring.utils.utils.JwtUtils;
import tutorial.iam.camunda.service.TempAuthenticationCache;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;
import java.util.Optional;

/**
 * This proxy substitutes JWT token from frontend by basic authorization data
 * necessary for Camunda
 */
@RestController
@RequiredArgsConstructor
public class CamundaProxyController {

    private final TempAuthenticationCache tempAuthenticationCache;
    private final JwtProviderService jwtProviderService;

    @RequestMapping("/engine-rest-proxy/**")
    public ResponseEntity<?> proxy(HttpServletRequest request) throws IOException, AuthenticationException {
        final Optional<String> authTokenOpt = JwtUtils.getJwtToken(request);
        if (authTokenOpt.isPresent()) {
            final String username = getUserNameFromToken(authTokenOpt.get());
            final Optional<byte[]> passwordOpt = tempAuthenticationCache.load(username);
            if (passwordOpt.isPresent()) {
                final HttpHeaders headers = getHttpHeadersWithoutAuthorization(request);
                headers.set(HttpHeaders.AUTHORIZATION, "Basic " + createBasicAuth(username, passwordOpt.get()));
                final ResponseEntity<byte[]> response = exchangeWithEndpoint(request, headers);
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

    private String getUserNameFromToken(String token) {
        return jwtProviderService.authenticate(token).username();
    }

    private static ResponseEntity<byte[]> exchangeWithEndpoint(HttpServletRequest request, HttpHeaders headers) throws IOException {
        return new RestTemplate().exchange(
                updateUrl(request),
                HttpMethod.valueOf(request.getMethod()),
                createHttpEntity(request, headers),
                byte[].class
        );
    }

    private static HttpEntity<byte[]> createHttpEntity(HttpServletRequest request, HttpHeaders headers) throws IOException {
        return new HttpEntity<>(request.getInputStream().readAllBytes(), headers);
    }

    private static String createBasicAuth(String username, byte[] password) {
        final String passwordStr = new String(password, StandardCharsets.UTF_8);
        return Base64.getEncoder()
                .encodeToString((username + ":" + passwordStr).getBytes(StandardCharsets.UTF_8));
    }

    private static String updateUrl(HttpServletRequest request) {
        final String targetPath = request.getRequestURI()
                .replaceFirst("/engine-rest-proxy", "/engine-rest");
        final String query = request.getQueryString();
        return "https://localhost:9091" + targetPath + (query != null ? "?" + query : "");
    }

    private static HttpHeaders getHttpHeadersWithoutAuthorization(HttpServletRequest request) {
        final HttpHeaders result = new HttpHeaders();
        Collections.list(request.getHeaderNames())
                .stream()
                .filter(name -> !name.equalsIgnoreCase(HttpHeaders.AUTHORIZATION))
                .forEach(name -> result.add(name, request.getHeader(name)));
        return result;
    }

}
