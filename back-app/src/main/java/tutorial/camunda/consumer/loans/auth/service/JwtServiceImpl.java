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
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService{

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
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        String username = claims.getSubject();

        final List<?> roles = claims.get("roles", List.class);

        List<SimpleGrantedAuthority> authorities = roles.stream()
                        .map(Object::toString)
                        .map(SimpleGrantedAuthority::new)
                        .toList();

        return new UsernamePasswordAuthenticationToken(
                username,
                null,
                authorities
        );
    }

    @Override
    public Claims parseRefreshToken(String token) {
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
                .claim("roles",
                        user.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .toList()
                )
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSecretKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}

