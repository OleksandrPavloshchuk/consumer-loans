package tutorial.camunda.consumer.loans.auth.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tutorial.camunda.consumer.loans.auth.service.JwtProviderService;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProviderService jwtProviderService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response, FilterChain filterChain
    ) throws ServletException, IOException {
        getAuthorizationToken(request)
                .ifPresent(token -> {
                    final Authentication auth = jwtProviderService.authenticate(token);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                });
        filterChain.doFilter(request, response);
    }

    static Optional<String> getAuthorizationToken(HttpServletRequest request) {
        final String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return Optional.empty();
        } else {
            return Optional.of(authorizationHeader.substring(7));
        }
    }

}