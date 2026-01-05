package tutorial.camunda.consumer.loans.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tutorial.camunda.consumer.loans.domain.CheckResponse;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Random;

@Service
@Slf4j
public class RandomCheckPersonService implements CheckPersonService {

    private final Random random = new Random(System.currentTimeMillis());

    @Override
    public CheckResponse check(String personName) {

        log.info("Checking person {}", personName);

        final int scores = random.nextInt(50);
        final int count = random.nextInt(4) + 1;
        final List<String> reasons = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            final byte[] b = new byte[16];
            random.nextBytes(b);
            reasons.add(new String(Base64.getEncoder().encode(b), Charset.defaultCharset()));
        }
        log.info("Person check scores: {}", scores);
        log.info("Person check reasons: {}", reasons);
        return new CheckResponse(scores, reasons);
    }
}
