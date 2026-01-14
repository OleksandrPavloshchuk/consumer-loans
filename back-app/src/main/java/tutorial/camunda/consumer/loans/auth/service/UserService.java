package tutorial.camunda.consumer.loans.auth.service;

import java.util.Optional;

public interface UserService {
    Optional<String> getUserPassword(String user);
}
