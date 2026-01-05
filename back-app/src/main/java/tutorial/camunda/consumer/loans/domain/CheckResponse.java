package tutorial.camunda.consumer.loans.domain;

import java.util.List;

public record CheckResponse(int scores, List<String> reasons) {
}
