package tutorial.camunda.consumer.loans.auth.service;

import java.util.Date;
import java.time.Duration;

public interface DateProvider {
    Date createdAt();

    Date checkedAt();

    default Date createdAtPlus(Duration d) {
        return Date.from(createdAt().toInstant().plus(d));
    }
}
