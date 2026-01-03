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
public class CheckPersonDelegate implements JavaDelegate {

    private static final String[] REASONS = {
            "Bad",
            "Awful",
            "Ugly"
    };

    private final Random random = new Random(System.currentTimeMillis());

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        // TODO (2026/12/27) random implementation. In production should be substituted by external service

        final int value = random.nextInt(50);
        execution.setVariable(VariableNames.personCheckScores.name(), value);

        List<String> reasons = new ArrayList<>();
        if (value > 30) {
            final int idx = random.nextInt(REASONS.length);
            reasons.add(REASONS[idx]);
        }
        execution.setVariable(VariableNames.personCheckReasons.name(), reasons);

        log.info("Person check scores: {}",  value);
        log.info("Person check reasons: {}",  reasons);
    }
}
