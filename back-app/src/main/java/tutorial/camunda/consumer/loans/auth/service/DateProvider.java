package tutorial.camunda.consumer.loans.auth.service;

import java.util.Date;
import java.time.Duration;

public interface DateProvider {
    Date now();

    default Date nowPlus(Duration d) {
        return Date.from(now().toInstant().plus(d));
    }
}
