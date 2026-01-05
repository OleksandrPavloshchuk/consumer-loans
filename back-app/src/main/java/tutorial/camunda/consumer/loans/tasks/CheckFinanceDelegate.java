package tutorial.camunda.consumer.loans.tasks;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;
import tutorial.camunda.consumer.loans.domain.CheckResult;
import tutorial.camunda.consumer.loans.domain.VariableNames;
import tutorial.camunda.consumer.loans.services.CheckFinanceService;
import tutorial.camunda.consumer.loans.services.ExternalSystemUnavailableException;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class CheckFinanceDelegate implements JavaDelegate {

    public static final String FINANCE_CHECK_UNAVAILABLE = "FINANCE_CHECK_UNAVAILABLE";

    private final CheckFinanceService checkFinanceService;

    @Override
    public void execute(DelegateExecution execution) {
        final String personName = (String) execution.getVariable(VariableNames.personName.name());
        final Number amount = (Number) execution.getVariable(VariableNames.amount.name());
        try {
            final CheckResult checkResult = checkFinanceService.check(
                    personName, BigDecimal.valueOf(amount.doubleValue()));
            execution.setVariable(VariableNames.financeCheckScores.name(), checkResult.scores());
            execution.setVariable(VariableNames.financeCheckReasons.name(), checkResult.reasons());
        } catch( ExternalSystemUnavailableException ex ) {
            log.error(ex.getMessage(), ex);
            throw new BpmnError(FINANCE_CHECK_UNAVAILABLE);
        }
    }
}
