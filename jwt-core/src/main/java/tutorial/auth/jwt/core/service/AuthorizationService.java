package tutorial.auth.jwt.core.service;

import java.util.Set;

public interface AuthorizationService {
    Set<String> getRoles(String username);
}
