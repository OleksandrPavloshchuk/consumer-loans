package tutorial.camunda.consumer.loans.services;

import lombok.extern.slf4j.Slf4j;
import org.jvnet.hk2.annotations.Service;
import tutorial.camunda.consumer.loans.domain.CheckResult;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class UniformAggregateChecksService implements AggregateChecksService {
    @Override
    public CheckResult aggregate(Map<String, CheckResult> src) {
        final Collection<CheckResult> values = src.values();
        final int scores = values.stream()
                .map(CheckResult::scores)
                .reduce(0, Integer::sum);
        final List<String> reasons = values.stream()
                .flatMap(v -> v.reasons().stream())
                .toList();
        return new CheckResult(scores, reasons);
    }
}
