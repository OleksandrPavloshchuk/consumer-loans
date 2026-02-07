package tutorial.iam.camunda.controller;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import tutorial.auth.jwt.core.service.AuthenticationException;
import tutorial.auth.jwt.core.service.JwtProviderService;
import tutorial.auth.jwt.spring.utils.JwtUtils;
import tutorial.iam.camunda.service.TempAuthenticationCache;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;


/**
 * This proxy substitutes JWT token from frontend by basic authorization data
 * necessary for Camunda
 */
@RestController
@RequiredArgsConstructor
@Slf4j
public class CamundaProxyController {

    private final TempAuthenticationCache tempAuthenticationCache;
    private final JwtProviderService jwtProviderService;
    private final RestTemplate restTemplate;

    @RequestMapping("/engine-rest-proxy/**")
    public ResponseEntity<?> proxy(HttpServletRequest request) throws IOException, AuthenticationException {
        try {
            final Optional<String> authTokenOpt = JwtUtils.getJwtToken(request);
            if (authTokenOpt.isPresent()) {
                return getResponseForAuthToken(request, authTokenOpt.get());
            } else {
                throw new AuthenticationException("Authentication failed");
            }
        } catch (ExpiredJwtException ex) {
            return getResponseForJwtExpired(ex);
        }
    }

    private static ResponseEntity<Map<String, String>> getResponseForJwtExpired(ExpiredJwtException ex) {
        log.warn(ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "access_token_expired"));
    }

    private ResponseEntity<byte[]> getResponseForAuthToken(HttpServletRequest request, String authToken) throws IOException {
        final String username = getUserNameFromToken(authToken);
        final Optional<byte[]> passwordOpt = tempAuthenticationCache.load(username);
        if (passwordOpt.isPresent()) {
            final HttpHeaders headers = getHttpHeadersWithoutAuthorization(request);
            headers.set(HttpHeaders.AUTHORIZATION, "Basic " + createBasicAuth(username, passwordOpt.get()));
            return createResponseEntity(exchangeWithEndpoint(request, headers));
        } else {
            throw new AuthenticationException("Authentication failed");
        }
    }

    private static ResponseEntity<byte[]> createResponseEntity(ResponseEntity<byte[]> response) {
        return ResponseEntity
                .status(response.getStatusCode())
                .contentType(getMediaType(response))
                .body(response.getBody());
    }

    private static MediaType getMediaType(ResponseEntity<byte[]> response) {
        return getOrDefault(response.getHeaders().getContentType(), MediaType.APPLICATION_OCTET_STREAM);
    }

    private String getUserNameFromToken(String token) {
        return jwtProviderService.authenticate(token).username();
    }

    private ResponseEntity<byte[]> exchangeWithEndpoint(HttpServletRequest request, HttpHeaders headers) throws IOException {
        return restTemplate.exchange(
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
        return Base64.getEncoder()
                .encodeToString(
                        (username + ":" + new String(password, StandardCharsets.UTF_8))
                                .getBytes(StandardCharsets.UTF_8));
    }

    private static String updateUrl(HttpServletRequest request) {
        final String targetPath = request.getRequestURI()
                .replaceFirst("/engine-rest-proxy", "/engine-rest");
        final String query = request.getQueryString();
        return "https://localhost:" + getServerPort() + targetPath + (query != null ? "?" + query : "");
    }

    private static String getServerPort() {
        return getOrDefault(System.getenv("SERVER_PORT"), "9091");
    }

    private static HttpHeaders getHttpHeadersWithoutAuthorization(HttpServletRequest request) {
        final HttpHeaders result = new HttpHeaders();
        Collections.list(request.getHeaderNames())
                .stream()
                .filter(name -> !name.equalsIgnoreCase(HttpHeaders.AUTHORIZATION))
                .forEach(name -> result.add(name, request.getHeader(name)));
        return result;
    }

    private static <T> T getOrDefault(T value, T defaultValue) {
        return value == null ? defaultValue : value;
    }

}
