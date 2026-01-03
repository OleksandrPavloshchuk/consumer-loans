package tutorial.camunda.consumer.loans.tasks;

import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;
import tutorial.camunda.consumer.loans.domain.Decision;
import tutorial.camunda.consumer.loans.domain.ScoringResult;
import tutorial.camunda.consumer.loans.domain.VariableNames;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class AggregateScoringDelegate implements JavaDelegate {

    // TODO (2025/12/27) use configuration data here
    private static final int AUTO_REJECT_BELOW = 30;
    private static final int AUTO_APPROVE_ABOVE = 70;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final Integer personScores =
                (Integer) execution.getVariable(VariableNames.personCheckScores.name());
        final List<String> personReasons =
                (List<String>) execution.getVariable(VariableNames.personCheckReasons.name());
        final Integer financeScores =
                (Integer) execution.getVariable(VariableNames.financeCheckScores.name());
        final List<String> financeReasons =
                (List<String>) execution.getVariable(VariableNames.financeCheckReasons.name());

        final Integer totalScores = financeScores + personScores;
        final List<String> totalReasons = new ArrayList<>(financeReasons);
        totalReasons.addAll(personReasons);

        execution.setVariable(VariableNames.totalScores.name(), totalScores);
        execution.setVariable(VariableNames.totalReasons.name(), totalReasons);

        log.info("total scores: {}",  totalScores);
        log.info("total reasons: {}",  totalReasons);
        ScoringResult scoringResult;
        Decision decision = null;
        if (totalScores < AUTO_REJECT_BELOW) {
            scoringResult = ScoringResult.AUTO_REJECT;
            decision = Decision.REJECT;
        } else if (totalScores > AUTO_APPROVE_ABOVE) {
            scoringResult = ScoringResult.AUTO_APPROVE;
            decision = Decision.APPROVE;
        } else {
            scoringResult = ScoringResult.MANUAL;
        }
        log.info("scoring result: {}",  scoringResult.name());
        execution.setVariable(VariableNames.scoringResult.name(),  scoringResult);
        if (decision != null) {
            log.info("decision: {}", decision.name());
            execution.setVariable(VariableNames.decision.name(), decision);
        }
    }
}
