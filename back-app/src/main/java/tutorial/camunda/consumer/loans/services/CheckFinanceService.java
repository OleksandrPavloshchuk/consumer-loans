package tutorial.camunda.consumer.loans.services;

import tutorial.camunda.consumer.loans.domain.CheckResponse;

import java.math.BigDecimal;

public interface CheckFinanceService {
    CheckResponse check(String personName, BigDecimal amount);
}
