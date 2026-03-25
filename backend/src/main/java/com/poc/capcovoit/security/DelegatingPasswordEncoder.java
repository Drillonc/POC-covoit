package com.poc.capcovoit.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/*
 * Nom de classe : DelegatingPasswordEncoder
 *
 * Description   : Cette classe implémente l'interface PasswordEncoder pour fournir une implémentation de hachage de mot de passe utilisant BCrypt.
 *
 */
@Component
public class DelegatingPasswordEncoder implements PasswordEncoder {

    private final BCryptPasswordEncoder bcryptEncoder = new BCryptPasswordEncoder();

    @Override
    public String encode(CharSequence rawPassword) {
        return "{bcrypt}" +bcryptEncoder.encode(rawPassword);
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return bcryptEncoder.matches(rawPassword, encodedPassword);
    }
}