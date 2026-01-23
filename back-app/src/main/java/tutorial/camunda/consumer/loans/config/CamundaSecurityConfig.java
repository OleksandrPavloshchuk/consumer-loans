package tutorial.camunda.consumer.loans.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import tutorial.auth.jwt.spring.filter.JwtAuthenticationFilter;
import tutorial.camunda.consumer.loans.filter.CamundaJwtAuthenticationFilter;

@Configuration
@Slf4j
public class CamundaSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CamundaJwtAuthenticationFilter camundaFilter
    ) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/camunda/**").permitAll()
                        .requestMatchers("/engine-rest/**").permitAll()
                        .requestMatchers("/engine-rest-proxy/**").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(camundaFilter, JwtAuthenticationFilter.class);

        final SecurityFilterChain result = http.build();
        log.info("Camunda Security Filter is created");
        return result;
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
