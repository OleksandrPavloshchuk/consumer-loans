package tutorial.auth.jwt.core.service;

import java.util.Date;

public class NaturalDateProvider implements DateProvider {
    @Override
    public Date createdAt() {
        return new Date();
    }

    @Override
    public Date checkedAt() { return new Date(); }
}