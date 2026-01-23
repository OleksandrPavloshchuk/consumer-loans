package tutorial.auth.jwt.spring.filter;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
import tutorial.auth.jwt.spring.utils.utils.JwtUtils;

import java.io.IOException;
import java.util.List;
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
            JwtUtils.getJwtToken(request).ifPresent(token -> {
                final Authentication auth = toCommonAuth(jwtProviderService.authenticate(token));
                SecurityContextHolder.getContext().setAuthentication(auth);
            });
        } catch (ExpiredJwtException exJwtException) {
            LOGGER.log(Level.WARNING, exJwtException.getMessage(), exJwtException);
            request.setAttribute("JWT_EXPIRED", true);
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
        return new UsernamePasswordAuthenticationToken( src.username(), "not needed", authorities);
    }

    private static void clearAuthentication(HttpServletResponse response) {
        try {
            SecurityContextHolder.clearContext();
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Token expired");
        } catch (IOException e) {
            LOGGER.log( Level.WARNING, "JWT authentication failed: {}", e.getMessage());
        }
    }
}