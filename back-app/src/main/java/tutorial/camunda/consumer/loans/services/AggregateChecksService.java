package tutorial.camunda.consumer.loans.services;

import tutorial.camunda.consumer.loans.domain.CheckResult;

import java.util.Map;

public interface AggregateChecksService {
    CheckResult aggregate(Map<String, CheckResult> src);
}
