package tutorial.camunda.consumer.loans.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tutorial.auth.jwt.core.dto.BaseAuthentication;
import tutorial.auth.jwt.core.service.*;
import tutorial.auth.jwt.core.service.JwtProviderServiceImpl;

@Service
@RequiredArgsConstructor
public class TokenAuthenticatorAdapter implements TokenAuthenticator {

    private final JwtProperties jwtProperties;
    private final DateProvider dateProvider;

    @Override
    public BaseAuthentication authenticate(String token) throws AuthenticationException {
        // TODO avoid creation of item
        final TokenAuthenticator tokenAuthenticator = new JwtProviderServiceImpl(
                dateProvider, jwtProperties
        );
        return tokenAuthenticator.authenticate(token);
    }
}
