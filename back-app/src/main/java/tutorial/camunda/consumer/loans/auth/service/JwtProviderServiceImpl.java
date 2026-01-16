package tutorial.camunda.consumer.loans.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JwtProviderServiceImpl implements JwtProviderService {

    private final String secret;
    private final long accessMinutes;
    private final long refreshDays;

    private final DateProvider dateProvider;

    @Autowired
    public JwtProviderServiceImpl(
            DateProvider dateProvider,
            @Value("${security.jwt.secret}")
            String secret,
            @Value("${security.jwt.access-ttl-minutes}")
            long accessMinutes,
            @Value("${security.jwt.refresh-ttl-days}")
            long refreshDays
    ) {
        this.dateProvider = dateProvider;
        this.secret = secret;
        this.accessMinutes = accessMinutes;
        this.refreshDays = refreshDays;
    }

    @Override
    public String createAccessToken(UserDetails user) {
        return buildToken(user, getAccessTtl());
    }

    @Override
    public String createRefreshToken(UserDetails user) {
        return buildToken(user, getRefreshTtl());
    }

    @Override
    public Authentication authenticate(String token) {
        final Claims claims = extractClaimsAndCheckExpiration(token);

        return new UsernamePasswordAuthenticationToken(
                claims.getSubject(),
                null,
                extractAuthorities(claims)
        );
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

    private List<SimpleGrantedAuthority> extractAuthorities(Claims claims) {
        final Collection<?> roles = claims.get("roles", Collection.class);
        return roles.stream()
                .map(Object::toString)
                .map(SimpleGrantedAuthority::new)
                .toList();
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

    private String buildToken(UserDetails user, Duration timeToLive) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("roles", getRoles(user))
                .setIssuedAt(dateProvider.createdAt())
                .setExpiration(dateProvider.createdAtPlus(timeToLive))
                .signWith(getSecretKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private static Set<String> getRoles(UserDetails user) {
        return user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());
    }
}

