package tutorial.iam.camunda.service;

import java.util.Optional;

public interface TempAuthenticationCache {
    void store(String username, byte[] password, boolean isAuthenticated);

    Optional<byte[]> load(String username);

}
