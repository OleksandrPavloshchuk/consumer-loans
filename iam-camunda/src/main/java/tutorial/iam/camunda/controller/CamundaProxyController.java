package tutorial.iam.camunda.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;

@RestController
@Slf4j
public class CamundaProxyController {

    @RequestMapping("/engine-rest-proxy/**")
    public ResponseEntity<?> proxy(HttpServletRequest request) throws IOException {
        String targetPath = request.getRequestURI()
                .replaceFirst("/engine-rest-proxy", "/engine-rest");

        String query = request.getQueryString();
        String url = "https://localhost:9091" + targetPath
                + (query != null ? "?" + query : "");

        HttpHeaders headers = new HttpHeaders();
        Collections.list(request.getHeaderNames()).forEach(h -> {
            if (!h.equalsIgnoreCase(HttpHeaders.AUTHORIZATION)) {
                headers.add(h, request.getHeader(h));
            }
        });

        // TODO use password cache
        String value = Base64.getEncoder()
                .encodeToString("John:johnpass".getBytes(StandardCharsets.UTF_8));

        headers.set(HttpHeaders.AUTHORIZATION, "Basic " + value);

        HttpEntity<byte[]> entity =
                new HttpEntity<>(request.getInputStream().readAllBytes(), headers);

        final RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<byte[]> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.valueOf(request.getMethod()),
                        entity,
                        byte[].class
                );

        return ResponseEntity
                .status(response.getStatusCode())
                .headers(response.getHeaders())
                .body(response.getBody());
    }
}
