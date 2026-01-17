package tutorial.auth.jwt.core.service;

public interface JwtProperties {
    String getSecret();
    long getAccessMinutes();
    long getRefreshDays();
}
