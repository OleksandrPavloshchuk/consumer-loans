package tutorial.camunda.consumer.loans.auth.service;

import org.springframework.stereotype.Service;
import tutorial.auth.jwt.core.service.DateProvider;

import java.util.Date;

@Service
public class NaturalDateProvider implements DateProvider {
    @Override
    public Date createdAt() {
        return new Date();
    }

    @Override
    public Date checkedAt() { return new Date(); }
}