package tutorial.auth.jwt.spring.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import tutorial.auth.jwt.core.service.*;
import tutorial.auth.jwt.spring.filter.JwtAuthenticationFilter;

@Configuration
@Slf4j
public class JwtConfig {

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .sessionManagement(
                        sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        final SecurityFilterChain result = http.build();
        log.info("JWT Authentication Filter is initialized");
        return result;
    }

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
