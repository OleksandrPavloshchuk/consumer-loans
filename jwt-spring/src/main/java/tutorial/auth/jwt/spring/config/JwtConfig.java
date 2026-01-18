package tutorial.auth.jwt.spring.config;

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
public class JwtConfig {

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(
                        sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public JwtProviderService jwtProviderService(
            DateProvider dateProvider,
            JwtProperties jwtProperties
    ) {
        return new JwtProviderServiceImpl(dateProvider, jwtProperties);
    }

    @Bean
    public JwtAuthService jwtAuthService(
            AuthenticationService authenticationService,
            AuthorizationService authorizationService,
            JwtProviderService jwtProviderService
    ) {
        return new JwtAuthServiceImpl(
                authenticationService,
                authorizationService,
                jwtProviderService);
    }
}
