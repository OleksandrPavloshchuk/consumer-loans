package tutorial.camunda.consumer.loans.services;

import tutorial.camunda.consumer.loans.domain.CheckResult;

import java.math.BigDecimal;

public interface CheckFinanceService {
    CheckResult check(String personName, BigDecimal amount)
            throws ExternalSystemUnavailableException;
}
