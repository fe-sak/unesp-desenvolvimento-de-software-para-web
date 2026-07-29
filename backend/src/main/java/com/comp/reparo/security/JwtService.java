package com.comp.reparo.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expirationMillis;

    public JwtService(JwtProperties jwtProperties) {
        this.secretKey = Keys.hmacShaKeyFor(jwtProperties.secret().getBytes(StandardCharsets.UTF_8));
        this.expirationMillis = jwtProperties.expirationMs();
    }

    public String generateToken(UserDetails userDetails) {
        Instant now = Instant.now();

        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .orElse("ROLE_USER");

        var builder = Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("role", role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(expirationMillis)));

        if (userDetails instanceof com.comp.reparo.model.User u) {
            if (u.getTecnico() != null) builder.claim("tid", u.getTecnico().getId());
            if (u.getCliente() != null) builder.claim("cid", u.getCliente().getId());
        }

        return builder.signWith(secretKey).compact();
    }

    public Optional<String> extractUsername(String token) {
        try {
            return Optional.ofNullable(Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject());
        } catch (JwtException | IllegalArgumentException exception) {
            return Optional.empty();
        }
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        return extractUsername(token)
                .map(userDetails.getUsername()::equals)
                .orElse(false);
    }
}
