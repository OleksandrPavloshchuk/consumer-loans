package tutorial.camunda.consumer.loans.services;

import tutorial.camunda.consumer.loans.domain.CheckResponse;

public interface CheckPersonService {
    CheckResponse check(String personName);
}
