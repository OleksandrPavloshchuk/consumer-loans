package tutorial.camunda.consumer.loans.services;

import tutorial.camunda.consumer.loans.domain.CheckResult;

import java.util.Map;

public interface AggregateScoringService {
    CheckResult aggregate(Map<String, CheckResult> src);
}
