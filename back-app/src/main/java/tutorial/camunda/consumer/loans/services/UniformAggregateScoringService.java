package tutorial.camunda.consumer.loans.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tutorial.camunda.consumer.loans.domain.CheckResult;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class UniformAggregateScoringService implements AggregateScoringService {
    @Override
    public CheckResult aggregate(Map<String, CheckResult> src) {
        final Collection<CheckResult> values = src.values();
        final int scores = values.stream()
                .map(CheckResult::scores)
                .reduce(0, Integer::sum);
        final List<String> reasons = values.stream()
                .flatMap(v -> v.reasons().stream())
                .toList();

        log.info("total scores: {}", scores);
        log.info("total reasons: {}", reasons);

        return new CheckResult(scores, reasons);
    }
}
