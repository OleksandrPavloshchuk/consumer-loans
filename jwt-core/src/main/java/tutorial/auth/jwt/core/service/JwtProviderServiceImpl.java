package tutorial.auth.jwt.core.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import tutorial.auth.jwt.core.dto.BaseAuthentication;
import tutorial.auth.jwt.core.dto.BaseUserInfo;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

public class JwtProviderServiceImpl implements JwtProviderService, TokenAuthenticator {

    private final String secret;
    private final long accessMinutes;
    private final long refreshDays;

    private final DateProvider dateProvider;

    public JwtProviderServiceImpl(
            DateProvider dateProvider,
            String secret,
            long accessMinutes,
            long refreshDays
    ) {
        this.dateProvider = dateProvider;
        this.secret = secret;
        this.accessMinutes = accessMinutes;
        this.refreshDays = refreshDays;
    }

    @Override
    public String createAccessToken(BaseUserInfo user) {
        return buildToken(user, getAccessTtl());
    }

    @Override
    public String createRefreshToken(BaseUserInfo user) {
        return buildToken(user, getRefreshTtl());
    }

    @Override
    public BaseAuthentication authenticate(String token) {
        final Claims claims = extractClaimsAndCheckExpiration(token);
        final BaseUserInfo user =
                new BaseUserInfo(claims.getSubject(), null, extractAuthorities(claims));
        return new BaseAuthentication(user, true);
    }

    @Override
    public Claims parseRefreshToken(String token) {
        return extractClaimsAndCheckExpiration(token);
    }

    private Claims extractClaimsAndCheckExpiration(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSecretKey())
                .setClock(dateProvider::checkedAt)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Set<String> extractAuthorities(Claims claims) {
        final Collection<?> roles = claims.get("roles", Collection.class);
        return roles.stream()
                .map(Object::toString)
                .collect(Collectors.toSet());
    }

    private SecretKey getSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Duration getAccessTtl() {
        return Duration.ofMinutes(accessMinutes);
    }

    private Duration getRefreshTtl() {
        return Duration.ofDays(refreshDays);
    }

    private String buildToken(BaseUserInfo user, Duration timeToLive) {
        return Jwts.builder()
                .setSubject(user.name())
                .claim("roles", user.roles())
                .setIssuedAt(dateProvider.createdAt())
                .setExpiration(dateProvider.createdAtPlus(timeToLive))
                .signWith(getSecretKey(), SignatureAlgorithm.HS256)
                .compact();
    }

}

