package tutorial.iam.camunda.service;

import org.springframework.stereotype.Service;

@Service
public class TempAuthenticationCacheImpl implements TempAuthenticationCache {
    @Override
    public void store(String username, byte[] password, boolean isAuthenticated) {

    }

    @Override
    public byte[] load(String username) {
        return new byte[0];
    }
}
