package tutorial.auth.jwt.spring.config;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tutorial.auth.jwt.core.service.AuthenticationService;
import tutorial.auth.jwt.core.service.AuthorizationService;
import tutorial.auth.jwt.core.service.DateProvider;
import tutorial.auth.jwt.core.service.JwtProperties;

@ExtendWith(MockitoExtension.class)
public class JwtConfigUnitTest {

    @Mock
    private JwtProperties jwtProperties;

    @Mock
    private DateProvider dateProvider;

    @Mock
    private AuthorizationService authorizationService;

    @Mock
    private AuthenticationService authenticationService;

    @InjectMocks
    private JwtConfig jwtConfig;

    @Test
    public void jwtProviderService() {
        Assertions.assertNotNull(new JwtConfig().jwtProviderService(dateProvider, jwtProperties));
    }

    @Test
    public void jwtAuthenticationFilter() {
        Assertions.assertNotNull(new JwtConfig().jwtAuthService(
                authenticationService, authorizationService,
                new JwtConfig().jwtProviderService(dateProvider, jwtProperties)
        ));
    }

}
