package tutorial.camunda.consumer.loans.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.List;
import java.util.Date;
import java.util.function.Function;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;

@ExtendWith(MockitoExtension.class)
public class JwtProviderServiceImplUnitTest {

    @Mock
    private DateProvider dateProvider;

    @Test
    public void createAccessToken() {
        final JwtProviderServiceImpl service = createService();
        final String actual = createToken("user1", List.of("ROLE_USER"),
                "2026-01-15T15:00:00Z", "2026-01-15T20:00:00Z",
                service::createAccessToken);
        Assertions.assertEquals(
                "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3Njg0ODkyMDAsImV4cCI6MTc2ODUwNzIwMH0.W0K8MbGMPIRbSI_mc7WzlM4_53eVNGR1sbuYk6c5YSg",
                actual);
    }

    @Test
    public void createRefreshToken() {
        final JwtProviderServiceImpl service = createService();
        final String actual = createToken("user1", List.of("ROLE_HELLO"),
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
        final String token = createToken("user2", List.of("ROLE_USER"),
                "2026-01-16T00:00:00Z", "2026-01-16T01:01:00Z",
                service::createAccessToken);
        final Authentication authentication = service.authenticate(token);
        Assertions.assertTrue(authentication.isAuthenticated());
        Assertions.assertEquals( "user2", authentication.getPrincipal());
        Assertions.assertEquals( List.of(
                new SimpleGrantedAuthority("ROLE_USER")
        ), authentication.getAuthorities());
    }

    @Test
    public void authenticate_Expired() {
        doReturn(getDateFrom("2026-01-16T02:00:30Z")).when(dateProvider).checkedAt();
        final JwtProviderServiceImpl service = createService();
        final String token = createToken("user2", List.of("ROLE_USER"),
                "2026-01-16T00:00:00Z", "2026-01-16T01:01:00Z",
                service::createAccessToken);
        Assertions.assertThrows(ExpiredJwtException.class, () -> service.authenticate(token));
    }

    @Test
    public void parseRefreshToken_OK() {
        doReturn(getDateFrom("2026-01-16T01:00:30Z")).when(dateProvider).checkedAt();
        final JwtProviderServiceImpl service = createService();
        final String token = createToken("user3", List.of("ROLE_1", "ROLE_Q"),
                "2026-01-16T00:00:00Z", "2026-01-26T01:01:00Z",
                service::createRefreshToken);

        final Claims claims = service.parseRefreshToken(token);
        Assertions.assertEquals( "user3", claims.getSubject());
        Assertions.assertEquals(getDateFrom("2026-01-16T00:00:00Z"), claims.getIssuedAt());
        Assertions.assertEquals(getDateFrom("2026-01-26T01:01:00Z"), claims.getExpiration());
    }

    @Test
    public void parseRefreshToken_Expired() {
        doReturn(getDateFrom("2026-02-16T01:00:30Z")).when(dateProvider).checkedAt();
        final JwtProviderServiceImpl service = createService();
        final String token = createToken("user4", List.of("ROLE_1", "ROLE_Q"),
                "2026-01-16T00:00:00Z", "2026-01-26T01:01:00Z",
                service::createRefreshToken);

        Assertions.assertThrows(ExpiredJwtException.class, () -> service.parseRefreshToken(token));
    }

    private String createToken(
            String user, List<String> roles,
                               String issuedTsStr, String expiredTsStr,
                               Function<UserDetails, String> generator)
    {
        doReturn(getDateFrom(issuedTsStr)).when(dateProvider).createdAt();
        doReturn(getDateFrom(expiredTsStr)).when(dateProvider).createdAtPlus(any());
        final List<GrantedAuthority> authorities = List.copyOf(roles.stream()
                .map(SimpleGrantedAuthority::new)
                .toList());
        return generator.apply(createUser(user, authorities));
    }

    private static Date getDateFrom(String src) {
        return Date.from(Instant.parse(src));
    }

    private JwtProviderServiceImpl createService() {
        return new JwtProviderServiceImpl(
                dateProvider,
                "rH6fM4+J4v7QhJkQ2M1hA+PZpZC9xT2l8Y8kXJ6v1aE=",
                100,
                11
        );
    }

    private UserDetails createUser(String username, List<GrantedAuthority> authorities) {
        return new User(username, "-", authorities);
    }
}
