package tutorial.camunda.consumer.loans.auth.service;

import org.springframework.stereotype.Service;
import tutorial.auth.jwt.core.service.AuthenticationService;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class SimpleStaticAuthenticationService implements AuthenticationService {

    private final Map<String, String> passwords = new HashMap<>();

    public SimpleStaticAuthenticationService() {
        passwords.put("John", "johnpass");
        passwords.put("Mary", "marynpass");
    }

    @Override
    public boolean isAuthenticated(String username, byte[] password) {
        return new String(password, StandardCharsets.UTF_8).equals(passwords.get(username));
    }
}
