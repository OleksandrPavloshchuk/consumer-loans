package tutorial.iam.camunda;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.IdentityService;
import org.springframework.stereotype.Service;
import tutorial.auth.jwt.core.service.AuthenticationService;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class CamundaAuthenticationService implements AuthenticationService {

    private final IdentityService identityService;

    @Override
    public boolean isAuthenticated(String username, byte[] password) {
        return identityService
                .createUserQuery()
                .userId(username)
                .singleResult() != null
                && identityService.checkPassword(
                username,
                new String(password, StandardCharsets.UTF_8)
        );
    }
}
