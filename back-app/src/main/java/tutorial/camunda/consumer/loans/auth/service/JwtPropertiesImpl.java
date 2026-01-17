package tutorial.camunda.consumer.loans.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tutorial.auth.jwt.core.service.JwtProperties;

@Service
public class JwtPropertiesImpl implements JwtProperties {

    private final String secret;
    private final long accessMinutes;
    private final long refreshDays;

    @Autowired
    public JwtPropertiesImpl(
            @Value("${security.jwt.secret}")
            String secret,
            @Value("${security.jwt.access-ttl-minutes}")
            long accessMinutes,
            @Value("${security.jwt.refresh-ttl-days}")
            long refreshDays
    ) {
        this.secret = secret;
        this.accessMinutes = accessMinutes;
        this.refreshDays = refreshDays;
    }

    @Override
    public String getSecret() {
        return this.secret;
    }

    @Override
    public long getAccessMinutes() {
        return this.accessMinutes;
    }

    @Override
    public long getRefreshDays() {
        return this.refreshDays;
    }
}
