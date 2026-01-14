package tutorial.camunda.consumer.loans.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    private String user;
    private String password;
}
