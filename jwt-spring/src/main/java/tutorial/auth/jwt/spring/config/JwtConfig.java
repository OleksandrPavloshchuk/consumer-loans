package tutorial.auth.jwt.spring.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tutorial.auth.jwt.core.service.*;

@Configuration
@Slf4j
public class JwtConfig {
    @Bean
    public JwtProviderService jwtProviderService(
            DateProvider dateProvider,
            JwtProperties jwtProperties
    ) {
        final JwtProviderService result = new JwtProviderServiceImpl(dateProvider, jwtProperties);
        log.info("JWT Provider Service is initialized");
        return result;
    }

    @Bean
    public JwtAuthService jwtAuthService(
            AuthenticationService authenticationService,
            AuthorizationService authorizationService,
            JwtProviderService jwtProviderService
    ) {
        final JwtAuthService result = new JwtAuthServiceImpl(
                authenticationService,
                authorizationService,
                jwtProviderService);
        log.info("JWT Authentication Service is initialized");
        return result;
    }

    @PostConstruct
    public void init() {
        log.info("JWT Authentication Filter is created");
    }
}
