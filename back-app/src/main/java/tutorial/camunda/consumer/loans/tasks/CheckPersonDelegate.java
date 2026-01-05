package tutorial.camunda.consumer.loans.tasks;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;
import tutorial.camunda.consumer.loans.domain.CheckResponse;
import tutorial.camunda.consumer.loans.domain.VariableNames;
import tutorial.camunda.consumer.loans.services.CheckPersonService;

@Component
@RequiredArgsConstructor
public class CheckPersonDelegate implements JavaDelegate {

    private final CheckPersonService checkPersonService;

    @Override
    public void execute(DelegateExecution execution) {
        final String personName = (String) execution.getVariable(VariableNames.personName.name());
        final CheckResponse checkResponse = checkPersonService.check(personName);
        execution.setVariable(VariableNames.personCheckScores.name(), checkResponse.scores());
        execution.setVariable(VariableNames.personCheckReasons.name(), checkResponse.reasons());
    }
}
