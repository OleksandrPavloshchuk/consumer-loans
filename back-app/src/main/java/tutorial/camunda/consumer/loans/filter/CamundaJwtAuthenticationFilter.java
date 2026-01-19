package tutorial.camunda.consumer.loans.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.ProcessEngine;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@Slf4j
public class CamundaJwtAuthenticationFilter extends OncePerRequestFilter {

    private final ProcessEngine processEngine;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        final Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            final String userName = auth.getName();
            final List<String> groups = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .map( this::mapToCamundaGroup)
                    .filter(Objects::nonNull)
                    .toList();
            processEngine.getIdentityService().setAuthentication(userName, groups);
        }
        try {
            filterChain.doFilter(request, response);
        } finally {
            processEngine.getIdentityService().clearAuthentication();
        }
    }

    private String mapToCamundaGroup(String src) {
        return switch (src) {
            case "ROLE_LOAN_CONSULTANT" -> "loanConsultants";
            case "ROLE_BACKOFFICE" -> "backoffice";
            default -> null;
        };
    }
}
