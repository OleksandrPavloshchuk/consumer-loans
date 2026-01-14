package tutorial.camunda.consumer.loans.auth.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class SimpleStaticUserService implements UserService {
    private final Map<String, String> userPasswords = new HashMap<>();

    public SimpleStaticUserService() {
        // init data:
        userPasswords.put("John", "johnpass");
        userPasswords.put("Mary", "marynpass");
    }

    @Override
    public Optional<String> getUserPassword(String user) {
        return Optional.ofNullable(user);
    }
}
