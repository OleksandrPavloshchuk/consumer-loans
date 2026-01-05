package tutorial.camunda.consumer.loans.domain;

import java.util.List;

public record CheckResult(int scores, List<String> reasons) {
}
