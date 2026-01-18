package tutorial.auth.jwt.spring.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tutorial.auth.jwt.core.dto.BaseAuthentication;
import tutorial.auth.jwt.core.service.AuthenticationException;
import tutorial.auth.jwt.core.service.JwtProviderService;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger LOGGER = Logger.getLogger(JwtAuthenticationFilter.class.getName());

    private final JwtProviderService jwtProviderService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response, FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            final Optional<String> authTokenOpt = getAuthorizationToken(request);
            if (authTokenOpt.isPresent()) {
                final String token = authTokenOpt.get();
                final Authentication auth = toCommonAuth(jwtProviderService.authenticate(token));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (AuthenticationException | IllegalArgumentException e) {
            clearAuthentication(response);
            return;
        }
        filterChain.doFilter(request, response);
    }

    private Authentication toCommonAuth(BaseAuthentication src) {

        final List<GrantedAuthority> authorities = List.copyOf(src.roles().stream()
                .map(SimpleGrantedAuthority::new)
                .toList());

        return new UsernamePasswordAuthenticationToken(
                src.username(),
                "-",
                authorities

        );
    }

    private static void clearAuthentication(HttpServletResponse response) {
        try {
            SecurityContextHolder.clearContext();
            response.sendError(401, "Token expired");
        } catch (IOException e) {
            LOGGER.log( Level.WARNING, "JWT authentication failed: {}", e.getMessage());
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