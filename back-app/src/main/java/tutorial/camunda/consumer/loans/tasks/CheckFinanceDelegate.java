package tutorial.camunda.consumer.loans.tasks;

import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;
import tutorial.camunda.consumer.loans.domain.VariableNames;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@Slf4j
public class CheckFinanceDelegate implements JavaDelegate {

    private static final String[] REASONS = {
            "No money",
            "No idea",
            "No reason"
    };

    private final Random random = new Random(System.currentTimeMillis());

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        // TODO (2026/12/27) random implementation. In production should be substituted by external service

        final int value = random.nextInt(50);
        execution.setVariable(VariableNames.financeCheckScores.name(), value);

        List<String> reasons = new ArrayList<>();
        if (value > 30) {
            final int idx = random.nextInt(REASONS.length);
            reasons.add(REASONS[idx]);
        }
        execution.setVariable(VariableNames.financeCheckReasons.name(), reasons);

        log.info("Finance check scores: {}",  value);
        log.info("Finance check reasons: {}",  reasons);
    }
}
