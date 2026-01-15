package tutorial.camunda.consumer.loans.auth.filter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tutorial.camunda.consumer.loans.auth.service.JwtProviderService;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProviderService jwtProviderService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response, FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            getAuthorizationToken(request)
                    .ifPresent(token -> {
                        final Authentication auth = jwtProviderService.authenticate(token);
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    });
        } catch (JwtException | IllegalArgumentException e) {
            clearAuthentication(response);
            return;
        }
        filterChain.doFilter(request, response);
    }

    private static void clearAuthentication(HttpServletResponse response) {
        try {
            SecurityContextHolder.clearContext();
            response.sendError(401, "Token expired");
        } catch (IOException e) {
            log.debug("JWT authentication failed: {}", e.getMessage());
        }
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