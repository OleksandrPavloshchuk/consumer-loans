package tutorial.camunda.consumer.loans.tasks;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;
import tutorial.camunda.consumer.loans.domain.CheckResponse;
import tutorial.camunda.consumer.loans.domain.VariableNames;
import tutorial.camunda.consumer.loans.services.CheckFinanceService;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class CheckFinanceDelegate implements JavaDelegate {

    private final CheckFinanceService checkFinanceService;

    @Override
    public void execute(DelegateExecution execution) {
        final String personName = (String) execution.getVariable(VariableNames.personName.name());
        final Number amount = (Number) execution.getVariable(VariableNames.amount.name());
        final CheckResponse checkResponse = checkFinanceService.check(
                personName, BigDecimal.valueOf(amount.doubleValue()));
        execution.setVariable(VariableNames.financeCheckScores.name(), checkResponse.scores());
        execution.setVariable(VariableNames.financeCheckReasons.name(), checkResponse.reasons());
    }
}
