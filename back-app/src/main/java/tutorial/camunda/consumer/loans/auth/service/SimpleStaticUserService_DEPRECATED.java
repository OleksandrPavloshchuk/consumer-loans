package tutorial.camunda.consumer.loans.auth.service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
public class SimpleStaticUserService_DEPRECATED implements UserService {
    private final Map<String, UserDetails> userDetails = new HashMap<>();

    public SimpleStaticUserService_DEPRECATED() {
        // init data:
        userDetails.put("John", new User(
                "John", "johnpass",
                Set.of(
                        new SimpleGrantedAuthority("USER"),
                        new SimpleGrantedAuthority("LOAN_OFFICER"))
        ));
        userDetails.put("Mary", new User(
            "Mary", "marynpass",
                Set.of(
                        new SimpleGrantedAuthority("USER"),
                        new SimpleGrantedAuthority("RISK_MANAGER"))
        ));
    }

    @Override
    public Optional<UserDetails> getUserDetails(String user) {
        return Optional.ofNullable(userDetails.get(user));
    }
}
