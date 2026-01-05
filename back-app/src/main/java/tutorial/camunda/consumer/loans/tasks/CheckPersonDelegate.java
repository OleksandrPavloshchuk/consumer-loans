package tutorial.camunda.consumer.loans.tasks;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;
import tutorial.camunda.consumer.loans.domain.CheckResult;
import tutorial.camunda.consumer.loans.domain.VariableNames;
import tutorial.camunda.consumer.loans.services.CheckPersonService;
import tutorial.camunda.consumer.loans.services.ExternalSystemUnavailableException;

@Component
@Slf4j
@RequiredArgsConstructor
public class CheckPersonDelegate implements JavaDelegate {

    public static final String PERSON_CHECK_UNAVAILABLE = "PERSON_CHECK_UNAVAILABLE";

    private final CheckPersonService checkPersonService;

    @Override
    public void execute(DelegateExecution execution) {
        final String personName = (String) execution.getVariable(VariableNames.personName.name());
        try {
            final CheckResult checkResult = checkPersonService.check(personName);
            execution.setVariable(VariableNames.personCheckScores.name(), checkResult.scores());
            execution.setVariable(VariableNames.personCheckReasons.name(), checkResult.reasons());
        } catch( ExternalSystemUnavailableException ex) {
            log.error(ex.getMessage(), ex);
            throw new BpmnError(PERSON_CHECK_UNAVAILABLE);
        }
    }
}
