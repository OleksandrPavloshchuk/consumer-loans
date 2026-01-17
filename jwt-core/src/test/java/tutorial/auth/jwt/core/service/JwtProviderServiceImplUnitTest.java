package tutorial.auth.jwt.core.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import tutorial.auth.jwt.core.dto.BaseAuthentication;

import java.time.Instant;
import java.util.Date;
import java.util.Set;
import java.util.function.BiFunction;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;

public class JwtProviderServiceImplUnitTest {

    @Mock
    private DateProvider dateProvider;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void createAccessToken() {
        final JwtProviderServiceImpl service = createService();
        final String actual = createToken("user1", Set.of("ROLE_USER"),
                "2026-01-15T15:00:00Z", "2026-01-15T20:00:00Z",
                service::createAccessToken);
        Assertions.assertEquals(
                "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3Njg0ODkyMDAsImV4cCI6MTc2ODUwNzIwMH0.W0K8MbGMPIRbSI_mc7WzlM4_53eVNGR1sbuYk6c5YSg",
                actual);
    }

    @Test
    public void createRefreshToken() {
        final JwtProviderServiceImpl service = createService();
        final String actual = createToken("user1", Set.of("ROLE_HELLO"),
                "2026-01-15T16:00:00Z", "2026-01-15T22:00:00Z",
                service::createRefreshToken);
        Assertions.assertEquals(
                "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsInJvbGVzIjpbIlJPTEVfSEVMTE8iXSwiaWF0IjoxNzY4NDkyODAwLCJleHAiOjE3Njg1MTQ0MDB9.3UFI4XLi9ICFbFKjnK-7GqsTPW7iNCvXr6cRNEwbaVU",
                actual);
    }

    @Test
    public void authenticate_OK() {
        doReturn(getDateFrom("2026-01-16T01:00:30Z")).when(dateProvider).checkedAt();
        final JwtProviderServiceImpl service = createService();
        final String token = createToken("user2", Set.of("ROLE_USER"),
                "2026-01-16T00:00:00Z", "2026-01-16T01:01:00Z",
                service::createAccessToken);
        final BaseAuthentication authentication = service.authenticate(token);
        Assertions.assertTrue(authentication.isAuthenticated());
        Assertions.assertEquals("user2", authentication.username());
        Assertions.assertEquals(Set.of("ROLE_USER"), authentication.roles());
    }

    @Test
    public void authenticate_Expired() {
        doReturn(getDateFrom("2026-01-16T02:00:30Z")).when(dateProvider).checkedAt();
        final JwtProviderServiceImpl service = createService();
        final String token = createToken("user2", Set.of("ROLE_USER"),
                "2026-01-16T00:00:00Z", "2026-01-16T01:01:00Z",
                service::createAccessToken);
        Assertions.assertThrows(ExpiredJwtException.class, () -> service.authenticate(token));
    }

    @Test
    public void parseRefreshToken_OK() {
        doReturn(getDateFrom("2026-01-16T01:00:30Z")).when(dateProvider).checkedAt();
        final JwtProviderServiceImpl service = createService();
        final String token = createToken("user3", Set.of("ROLE_1", "ROLE_Q"),
                "2026-01-16T00:00:00Z", "2026-01-26T01:01:00Z",
                service::createRefreshToken);

        final Claims claims = service.parseRefreshToken(token);
        Assertions.assertEquals("user3", claims.getSubject());
        Assertions.assertEquals(getDateFrom("2026-01-16T00:00:00Z"), claims.getIssuedAt());
        Assertions.assertEquals(getDateFrom("2026-01-26T01:01:00Z"), claims.getExpiration());
    }

    @Test
    public void parseRefreshToken_Expired() {
        doReturn(getDateFrom("2026-02-16T01:00:30Z")).when(dateProvider).checkedAt();
        final JwtProviderServiceImpl service = createService();
        final String token = createToken("user4", Set.of("ROLE_1", "ROLE_Q"),
                "2026-01-16T00:00:00Z", "2026-01-26T01:01:00Z",
                service::createRefreshToken);

        Assertions.assertThrows(ExpiredJwtException.class, () -> service.parseRefreshToken(token));
    }

    private String createToken(
            String userName, Set<String> roles,
            String issuedTsStr, String expiredTsStr,
            BiFunction<String, Set<String>, String> generator) {
        doReturn(getDateFrom(issuedTsStr)).when(dateProvider).createdAt();
        doReturn(getDateFrom(expiredTsStr)).when(dateProvider).createdAtPlus(any());
        return generator.apply(userName, roles);
    }

    private static Date getDateFrom(String src) {
        return Date.from(Instant.parse(src));
    }

    private JwtProviderServiceImpl createService() {
        return new JwtProviderServiceImpl(
                dateProvider,
                new JwtProperties() {
                    @Override
                    public String getSecret() {
                        return "rH6fM4+J4v7QhJkQ2M1hA+PZpZC9xT2l8Y8kXJ6v1aE=";
                    }

                    @Override
                    public long getAccessMinutes() {
                        return 100;
                    }

                    @Override
                    public long getRefreshDays() {
                        return 11;
                    }
                }
        );
    }

}
