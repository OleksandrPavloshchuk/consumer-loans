package tutorial.iam.camunda;

import org.springframework.stereotype.Service;
import tutorial.auth.jwt.core.service.AuthorizationService;

import java.util.Set;

@Service
public class CamundaAuthorizationService implements AuthorizationService {
    @Override
    public Set<String> getRoles(String username) {
        return Set.of("CAMUNDA_USER");
    }
}
