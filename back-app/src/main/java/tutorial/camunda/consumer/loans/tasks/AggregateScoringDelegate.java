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
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class AggregateScoringDelegate implements JavaDelegate {

    // TODO (2025/12/27) use configuration data from service here
    private static final int AUTO_REJECT_BELOW = 30;
    private static final int AUTO_APPROVE_ABOVE = 70;

    private final AggregateScoringService aggregateScoringService;

    @Override
    public void execute(DelegateExecution execution) {
        final Map<String, CheckResult> checkResults = Map.of(
                "personCheck", getPersonCheckResult(execution),
                "financeCheck", getFinanceCheckResult(execution)
        );
        final CheckResult totalCheckResult = aggregateScoringService.aggregate(checkResults);
        final int totalScores = totalCheckResult.scores();
        execution.setVariable(VariableNames.totalScores.name(), totalScores);
        execution.setVariable(VariableNames.totalReasons.name(), totalCheckResult.reasons());

        final ScoringResult scoringResult = getScoringResult(totalScores);
        log.info("scoring result: {}", scoringResult.name());
        execution.setVariable(VariableNames.scoringResult.name(), scoringResult);
        getDecision(totalScores).ifPresent( decision -> {
            log.info("decision: {}", decision.name());
            execution.setVariable(VariableNames.decision.name(), decision);
        });
    }

    private static ScoringResult getScoringResult(int scores) {
        if (scores < AUTO_REJECT_BELOW) {
            return ScoringResult.AUTO_REJECT;
        } else if (scores > AUTO_APPROVE_ABOVE) {
            return ScoringResult.AUTO_APPROVE;
        } else {
            return ScoringResult.MANUAL;
        }
    }

    private static Optional<Decision> getDecision(int scores) {
        if (scores < AUTO_REJECT_BELOW) {
            return Optional.of(Decision.REJECT);
        } else if (scores > AUTO_APPROVE_ABOVE) {
            return Optional.of(Decision.APPROVE);
        } else {
            return Optional.empty();
        }
    }

    private static CheckResult getPersonCheckResult(DelegateExecution execution) {
        return getCheckResult(execution,
                VariableNames.personCheckScores,
                VariableNames.personCheckReasons);
    }

    private static CheckResult getFinanceCheckResult(DelegateExecution execution) {
        return getCheckResult(execution,
                VariableNames.financeCheckScores,
                VariableNames.financeCheckReasons);
    }

    private static CheckResult getCheckResult(
            DelegateExecution execution,
            VariableNames scoresVar,
            VariableNames reasonsVar
    ) {
        final Integer scores = (Integer) execution.getVariable(scoresVar.name());
        final List<String> reasons = (List<String>) execution.getVariable(reasonsVar.name());
        return new CheckResult(scores, reasons);
    }
}
