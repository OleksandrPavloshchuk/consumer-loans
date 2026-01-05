package tutorial.camunda.consumer.loans.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tutorial.camunda.consumer.loans.domain.CheckResult;

import java.math.BigDecimal;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Random;

@Service
@Slf4j
public class RandomCheckFinanceService implements CheckFinanceService {

    private final Random random = new Random(System.currentTimeMillis());

    @Override
    public CheckResult check(String personName, BigDecimal amount) {
        log.info("Checking finance: person {}, amount {}", personName, amount);
        final int scores = random.nextInt(50);
        final int count = random.nextInt(8) + 1;
        final List<String> reasons = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            final byte[] b = new byte[24];
            random.nextBytes(b);
            reasons.add(new String(Base64.getEncoder().encode(b), Charset.defaultCharset()));
        }
        log.info("Finance check scores: {}", scores);
        log.info("Finance check reasons: {}", reasons);
        return new CheckResult(scores, reasons);
    }
}
