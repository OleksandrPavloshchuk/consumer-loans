package tutorial.camunda.consumer.loans.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshResponse {
    private String accessToken;
}
