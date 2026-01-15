package tutorial.camunda.consumer.loans.auth.service;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public interface UserService {
    Optional<UserDetails> getUserDetails(String user);
}
