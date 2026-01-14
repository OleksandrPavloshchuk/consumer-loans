package tutorial.camunda.consumer.loans.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RefreshRequest {
    private String refreshToken;
}
