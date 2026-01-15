package tutorial.camunda.consumer.loans.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
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
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JwtProviderServiceImpl implements JwtProviderService {

    @Value("${security.jwt.secret}")
    private String secret;
    @Value("${security.jwt.access-ttl-minutes}")
    private long accessMinutes;
    @Value("${security.jwt.refresh-ttl-days}")
    private long refreshDays;

    @Override
    public String createAccessToken(UserDetails user) {
        return buildToken(user, getAccessTtlMs());
    }

    @Override
    public String createRefreshToken(UserDetails user) {
        return buildToken(user, getRefreshTtlMs());
    }

    @Override
    public Authentication authenticate(String token) {
        final Claims claims = extractClaims(token);
        return new UsernamePasswordAuthenticationToken(
                claims.getSubject(),
                null,
                extractAuthorities(claims)
        );
    }

    @Override
    public Claims parseRefreshToken(String token) {
        return extractClaims(token);
    }

    private List<SimpleGrantedAuthority> extractAuthorities(Claims claims) {
        final Collection<?> roles = claims.get("roles", Collection.class);
        return roles.stream()
                .map(Object::toString)
                .map(SimpleGrantedAuthority::new)
                .toList();
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private SecretKey getSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private long getAccessTtlMs() {
        return Duration.ofMinutes(accessMinutes).toMillis();
    }

    private long getRefreshTtlMs() {
        return Duration.ofDays(refreshDays).toMillis();
    }

    private String buildToken(UserDetails user, long ttlMs) {
        var now = new Date();
        var expiry = new Date(now.getTime() + ttlMs);

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("roles", getRoles(user))
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSecretKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private static Set<String> getRoles(UserDetails user) {
        return user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());
    }
}

