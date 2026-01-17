package tutorial.auth.jwt.core.service;

public interface AuthenticationService {
    boolean isAuthenticated(String username, byte[] password);
}
