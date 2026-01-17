package tutorial.camunda.consumer.loans.auth.service;

import org.springframework.stereotype.Service;
import tutorial.auth.jwt.core.service.DateProvider;
import tutorial.auth.jwt.core.service.NaturalDateProvider;

import java.util.Date;

@Service
public class DateProviderAdapter implements DateProvider {

    private DateProvider dateProvider = new NaturalDateProvider();

    void setDateProvider(DateProvider dateProvider) {
        this.dateProvider = dateProvider;
    }

    @Override
    public Date createdAt() {
        return dateProvider.createdAt();
    }

    @Override
    public Date checkedAt() {
        return dateProvider.checkedAt();
    }
}
