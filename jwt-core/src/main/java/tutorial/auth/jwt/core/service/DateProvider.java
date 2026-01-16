package tutorial.auth.jwt.core.service;

import java.time.Duration;
import java.util.Date;

public interface DateProvider {
    Date createdAt();

    Date checkedAt();

    default Date createdAtPlus(Duration d) {
        return Date.from(createdAt().toInstant().plus(d));
    }
}
