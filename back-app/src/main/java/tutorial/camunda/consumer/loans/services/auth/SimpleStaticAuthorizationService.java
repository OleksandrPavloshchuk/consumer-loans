package tutorial.camunda.consumer.loans.services.auth;

import org.springframework.stereotype.Service;
import tutorial.auth.jwt.core.service.AuthorizationService;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class SimpleStaticAuthorizationService implements AuthorizationService {

    private final Map<String, Set<String>> roles = new HashMap<>();

    public SimpleStaticAuthorizationService() {
        roles.put("John", Set.of("USER", "ROLE_LOAN_CONSULTANT"));
        roles.put("Mary", Set.of("USER", "BACKOFFICE"));
    }


    @Override
    public Set<String> getRoles(String username) {
        return roles.get(username);
    }
}
