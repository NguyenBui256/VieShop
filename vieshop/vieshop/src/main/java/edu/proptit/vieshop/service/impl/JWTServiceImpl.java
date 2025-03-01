package edu.proptit.vieshop.service.impl;

import edu.proptit.vieshop.dao.UserRepository;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.model.users.User;
import edu.proptit.vieshop.service.JWTService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Component
@Slf4j
public class JWTServiceImpl implements JWTService {
    private final UserRepository userRepository;

    @Value("${jwt.signerKey}")
    private String signerKey;

    public JWTServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .claim("role", user.getRole())
                .claim("id", user.getId())
                .subject(user.getUsername())
                .id(UUID.randomUUID().toString())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 6))
                .signWith(getSignInKey())
                .compact();
    }

    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .claim("role", user.getRole())
                .claim("id", user.getId())
                .subject(user.getUsername())
                .id(UUID.randomUUID().toString())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(getSignInKey())
                .compact();
    }

    public User extractUser(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        String username = claims.getSubject();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Username: " + username + " not found"));
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);

    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    private SecretKey getSignInKey() {
        byte[] key = Decoders.BASE64.decode(signerKey);
        return Keys.hmacShaKeyFor(key);
    }

    public boolean validateToken(String token) {
        return !extractClaim(token, Claims::getExpiration).before(new Date());
    }
}
