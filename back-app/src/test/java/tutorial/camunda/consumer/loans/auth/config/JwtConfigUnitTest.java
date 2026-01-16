package tutorial.camunda.consumer.loans.auth.config;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;

@ExtendWith(MockitoExtension.class)
public class JwtConfigUnitTest {

    @Mock
    private HttpSecurity httpSecurity;

    @Mock
    private SecurityFilterChain securityFilterChain;

    @InjectMocks
    private JwtConfig jwtConfig;

    @Test
    public void config() throws Exception {
        doReturn(httpSecurity).when(httpSecurity).csrf(any());
        doReturn(httpSecurity).when(httpSecurity).sessionManagement(any());
        doReturn(httpSecurity).when(httpSecurity).authorizeHttpRequests(any());
        doReturn(httpSecurity).when(httpSecurity).addFilterBefore(any(), any());
        doReturn(securityFilterChain).when(httpSecurity).build();

        final SecurityFilterChain actual = jwtConfig.filterChain(httpSecurity);
        Assertions.assertNotNull(actual);
    }

}
