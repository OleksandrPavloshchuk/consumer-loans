package tutorial.camunda.consumer.loans.auth.service;

import org.springframework.stereotype.Service;
import tutorial.auth.jwt.core.dto.BaseUserInfo;
import tutorial.auth.jwt.core.service.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
public class SimpleStaticUserService implements UserService {
    private final Map<String, BaseUserInfo> users = new HashMap<>();

    public SimpleStaticUserService() {
        // init data:
        users.put("John", new BaseUserInfo( "John", "johnpass",
                Set.of("USER", "LOAN_OFFICER")));
        users.put("Mary", new BaseUserInfo( "Mary", "marynpass",
                Set.of("USER", "RISK_MANAGER")));
    }

    @Override
    public Optional<BaseUserInfo> getUser(String name) {
        return Optional.ofNullable(users.get(name));
    }
}
