package tutorial.camunda.consumer.loans.auth.service;

import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class NaturalDateProvider implements DateProvider {
    @Override
    public Date now() {
        return new Date();
    }
}