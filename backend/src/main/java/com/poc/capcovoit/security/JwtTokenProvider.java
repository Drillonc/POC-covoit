package com.poc.capcovoit.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/*
 * Nom de classe : JwtTokenProvider
 *
 * Description   : Cette classe est responsable de la génération, de l'extraction et de la validation des tokens JWT utilisés pour l'authentification des utilisateurs dans le système.
 *
 */
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret:SuperSecretKeyForJWTTokenGenerationMakeItLongEnough123456789}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpirationMs;

    // Méthode pour générer un token JWT à partir de l'email de l'utilisateur
    public String generateToken(String email) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key)
                .compact();
    }

    // Méthode pour extraire l'email de l'utilisateur à partir du token JWT
    public String getEmailFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    // Méthode pour valider le token JWT en vérifiant sa signature et sa date d'expiration
    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
