package com.poc.capcovoit.service;

import com.poc.capcovoit.dao.UserRepository;
import com.poc.capcovoit.entity.User;
import com.poc.capcovoit.security.CustomUserDetails;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/*
 * Nom de classe : CustomUserDetailsService
 *
 * Description   : Cette classe implémente l'interface UserDetailsService pour fournir une implémentation personnalisée de la méthode loadUserByUsername, qui est utilisée par Spring Security pour charger les détails de l'utilisateur à partir de la base de données.
 *
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository repo;

    public CustomUserDetailsService(UserRepository repo) {
        this.repo = repo;
    }

    // Méthode pour charger les détails de l'utilisateur à partir de la base de données en utilisant l'email comme identifiant
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return new CustomUserDetails(user);
    }

}
