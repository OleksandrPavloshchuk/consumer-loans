package tutorial.camunda.consumer.loans.services;

import tutorial.camunda.consumer.loans.domain.CheckResult;

public interface CheckPersonService {
    CheckResult check(String personName) throws ExternalSystemUnavailableException;
}
