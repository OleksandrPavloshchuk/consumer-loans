package tutorial.iam.camunda.service;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.IdentityService;
import org.springframework.stereotype.Service;
import tutorial.auth.jwt.core.service.AuthenticationService;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class CamundaAuthenticationService implements AuthenticationService {

    private final IdentityService identityService;
    private final TempAuthenticationCache tempAuthenticationCache;

    @Override
    public boolean isAuthenticated(String username, byte[] password) {
        final boolean result = identityService
                .createUserQuery()
                .userId(username)
                .singleResult() != null
                && identityService.checkPassword(
                username,
                new String(password, StandardCharsets.UTF_8)
        );
        tempAuthenticationCache.store(username, password, result);
        return result;
    }
}
