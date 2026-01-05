package tutorial.camunda.consumer.loans.tasks;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;
import tutorial.camunda.consumer.loans.domain.CheckResult;
import tutorial.camunda.consumer.loans.domain.Decision;
import tutorial.camunda.consumer.loans.domain.ScoringResult;
import tutorial.camunda.consumer.loans.domain.VariableNames;
import tutorial.camunda.consumer.loans.services.AggregateScoringService;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class AggregateScoringDelegate implements JavaDelegate {

    // TODO (2025/12/27) use configuration data here
    private static final int AUTO_REJECT_BELOW = 30;
    private static final int AUTO_APPROVE_ABOVE = 70;

    private final AggregateScoringService aggregateScoringService;

    @Override
    public void execute(DelegateExecution execution) {
        final Integer personScores =
                (Integer) execution.getVariable(VariableNames.personCheckScores.name());
        final List<String> personReasons =
                (List<String>) execution.getVariable(VariableNames.personCheckReasons.name());
        final Integer financeScores =
                (Integer) execution.getVariable(VariableNames.financeCheckScores.name());
        final List<String> financeReasons =
                (List<String>) execution.getVariable(VariableNames.financeCheckReasons.name());

        final Map<String, CheckResult> checkResults = Map.of(
                "personCheck", new CheckResult(personScores, personReasons),
                "financeCheck", new CheckResult(financeScores, financeReasons)
        );
        final CheckResult totalCheckResult = aggregateScoringService.aggregate(checkResults);

        final int totalScores = totalCheckResult.scores();
        final List<String> totalReasons = totalCheckResult.reasons();

        execution.setVariable(VariableNames.totalScores.name(), totalScores);
        execution.setVariable(VariableNames.totalReasons.name(), totalReasons);

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
        log.info("scoring result: {}", scoringResult.name());
        execution.setVariable(VariableNames.scoringResult.name(), scoringResult);
        if (decision != null) {
            log.info("decision: {}", decision.name());
            execution.setVariable(VariableNames.decision.name(), decision);
        }
    }
}
