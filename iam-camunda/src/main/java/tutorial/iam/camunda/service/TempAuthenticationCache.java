package tutorial.iam.camunda.service;

public interface TempAuthenticationCache {
    void store(String username, byte[] password, boolean isAuthenticated);
    byte[] load(String username);

}
