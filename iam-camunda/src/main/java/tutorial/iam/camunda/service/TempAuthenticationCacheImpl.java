package tutorial.iam.camunda.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * The external storage for passwords is necessary for interaction with Camunda,
 * because Camunda does not return passwords for its users.
 * This password is necessary for basic authentication.
 * We use the simplest implementation here.
 */
@Service
public class TempAuthenticationCacheImpl implements TempAuthenticationCache {

    private final Map<String, byte[]> cache = new HashMap<>();

    @Override
    public void store(String username, byte[] password, boolean isAuthenticated) {
        if (isAuthenticated) {
            cache.put(username, password);
        }
    }

    @Override
    public Optional<byte[]> load(String username) {
        return Optional.ofNullable(cache.get(username));
    }
}
